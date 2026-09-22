;; This Source Code Form is subject to the terms of the Mozilla Public
;; License, v. 2.0. If a copy of the MPL was not distributed with this
;; file, You can obtain one at http://mozilla.org/MPL/2.0/.
;;
;; Enterprise Feature Flag Engine

(ns app.enterprise.feature-flags
  (:require
   [app.common.data :as d]
   [app.common.exceptions :as ex]
   [app.common.logging :as l]
   [app.db :as db]))

(def ^:private sql:get-flag
  "SELECT * FROM enterprise_feature_flag WHERE key = ?")

(def ^:private sql:get-override
  "SELECT is_enabled FROM enterprise_feature_flag_override
    WHERE flag_id = ? AND target_type = ? AND target_id = ?")

(defn is-feature-enabled?
  "Determine if an enterprise feature flag is enabled for an organization, team, or profile."
  [pool flag-key {:keys [org-id team-id profile-id]}]
  (if-let [flag (db/exec-one! pool [sql:get-flag flag-key])]
    (let [flag-id (:id flag)
          ;; Check profile override first
          profile-ov (when profile-id (db/exec-one! pool [sql:get-override flag-id "profile" (str profile-id)]))
          ;; Then team override
          team-ov (when team-id (db/exec-one! pool [sql:get-override flag-id "team" (str team-id)]))
          ;; Then org override
          org-ov (when org-id (db/exec-one! pool [sql:get-override flag-id "organization" (str org-id)]))]
      (cond
        (some? profile-ov) (:is_enabled profile-ov)
        (some? team-ov)    (:is_enabled team-ov)
        (some? org-ov)     (:is_enabled org-ov)
        :else              (:is_enabled_globally flag)))
    false))
