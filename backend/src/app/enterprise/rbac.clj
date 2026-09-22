;; This Source Code Form is subject to the terms of the Mozilla Public
;; License, v. 2.0. If a copy of the MPL was not distributed with this
;; file, You can obtain one at http://mozilla.org/MPL/2.0/.
;;
;; Enterprise Advanced RBAC & Governance Service

(ns app.enterprise.rbac
  (:require
   [app.common.data :as d]
   [app.common.exceptions :as ex]
   [app.common.logging :as l]
   [app.db :as db]
   [clojure.string :as str]))

(def roles
  #{:super-admin
    :org-admin
    :team-lead
    :member
    :restricted-editor
    :guest-viewer})

(def ^:private sql:get-user-org-role
  "SELECT role, status
     FROM enterprise_organization_member
    WHERE org_id = ? AND profile_id = ?")

(def ^:private sql:get-role-permissions
  "SELECT permissions
     FROM enterprise_role_definition
    WHERE code = ? AND (org_id = ? OR org_id IS NULL)
    ORDER BY org_id NULLS LAST
    LIMIT 1")

(defn user-org-role
  "Fetch user's role and status within an enterprise organization."
  [pool org-id profile-id]
  (db/exec-one! pool [sql:get-user-org-role org-id profile-id]))

(defn check-permission
  "Verify whether a role grants a specific capability."
  [granted-permissions required-permission]
  (boolean
   (or (contains? granted-permissions "*")
       (contains? granted-permissions required-permission)
       (let [[req-ns req-act] (str/split required-permission #":")
             wildcard-ns (str req-ns ":*")]
         (contains? granted-permissions wildcard-ns)))))

(defn authorize!
  "Assert that profile has permission within org, throwing forbidden if not."
  [pool org-id profile-id required-permission]
  (let [membership (user-org-role pool org-id profile-id)]
    (when-not (= "active" (:status membership))
      (throw (ex-info "Enterprise membership inactive or suspended"
                      {:type :forbidden :org-id org-id :profile-id profile-id})))
    (let [role-def (db/exec-one! pool [sql:get-role-permissions (:role membership) org-id])
          permissions (set (:permissions role-def))]
      (when-not (check-permission permissions required-permission)
        (throw (ex-info "Insufficient enterprise permissions"
                        {:type :forbidden
                         :required-permission required-permission
                         :role (:role membership)}))))))
