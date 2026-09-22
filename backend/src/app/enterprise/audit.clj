;; This Source Code Form is subject to the terms of the Mozilla Public
;; License, v. 2.0. If a copy of the MPL was not distributed with this
;; file, You can obtain one at http://mozilla.org/MPL/2.0/.
;;
;; Enterprise Audit Logging Service

(ns app.enterprise.audit
  (:require
   [app.common.data :as d]
   [app.common.exceptions :as ex]
   [app.common.logging :as l]
   [app.db :as db]
   [app.util.json :as json]))

(def ^:private sql:insert-audit-event
  "INSERT INTO enterprise_audit_log
     (org_id, actor_type, actor_id, actor_email, action, category,
      target_type, target_id, target_name, ip_address, user_agent,
      session_id, payload, occurred_at)
   VALUES
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb, clock_timestamp())")

(def ^:private sql:query-audit-events
  "SELECT * FROM enterprise_audit_log
    WHERE org_id = ?
    ORDER BY occurred_at DESC
    LIMIT ? OFFSET ?")

(defn record-audit-event!
  "Record an immutable enterprise administrative or security audit event."
  [pool {:keys [org-id actor-type actor-id actor-email action category
                target-type target-id target-name ip-address user-agent
                session-id payload]}]
  (try
    (db/exec-one! pool
      [sql:insert-audit-event
       org-id (name (or actor-type :user)) actor-id actor-email
       action (name (or category :compliance))
       target-type target-id target-name
       ip-address user-agent session-id
       (json/write-str (or payload {}))])
    (catch Exception e
      (l/error :hint "failed to write enterprise audit log"
               :cause (.getMessage e)
               :org-id org-id
               :action action))))

(defn get-audit-events
  "Retrieve paginated enterprise audit trail for compliance review."
  [pool org-id limit offset]
  (db/exec! pool [sql:query-audit-events org-id (or limit 100) (or offset 0)]))
