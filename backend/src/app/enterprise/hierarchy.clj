;; This Source Code Form is subject to the terms of the Mozilla Public
;; License, v. 2.0. If a copy of the MPL was not distributed with this
;; file, You can obtain one at http://mozilla.org/MPL/2.0/.
;;
;; Enterprise Multi-Organization Hierarchy Service

(ns app.enterprise.hierarchy
  (:require
   [app.common.data :as d]
   [app.common.exceptions :as ex]
   [app.common.logging :as l]
   [app.db :as db]
   [clojure.spec.alpha :as s]))

(s/def ::id ::d/uuid)
(s/def ::name string?)
(s/def ::slug string?)
(s/def ::tier #{"starter" "business" "enterprise" "custom"})
(s/def ::subscription_status #{"trialing" "active" "past_due" "suspended" "cancelled"})

(def ^:private sql:get-org-by-id
  "SELECT * FROM enterprise_organization WHERE id = ? AND deleted_at IS NULL")

(def ^:private sql:get-org-by-slug
  "SELECT * FROM enterprise_organization WHERE slug = ? AND deleted_at IS NULL")

(def ^:private sql:get-org-teams
  "SELECT t.*, eot.department, eot.cost_center, eot.is_default
     FROM team t
     JOIN enterprise_organization_team eot ON t.id = eot.team_id
    WHERE eot.org_id = ? AND t.deleted_at IS NULL")

(def ^:private sql:get-user-orgs
  "SELECT eo.*, eom.role, eom.status as membership_status
     FROM enterprise_organization eo
     JOIN enterprise_organization_member eom ON eo.id = eom.org_id
    WHERE eom.profile_id = ? AND eo.deleted_at IS NULL AND eom.status = 'active'")

(defn get-organization
  "Retrieve root enterprise organization by ID."
  [pool org-id]
  (db/exec-one! pool [sql:get-org-by-id org-id]))

(defn get-organization-by-slug
  "Retrieve root enterprise organization by domain slug."
  [pool slug]
  (db/exec-one! pool [sql:get-org-by-slug slug]))

(defn get-organization-teams
  "Retrieve all teams/sub-departments assigned to an enterprise organization."
  [pool org-id]
  (db/exec! pool [sql:get-org-teams org-id]))

(defn get-user-organizations
  "Retrieve all organizations where a profile holds active membership."
  [pool profile-id]
  (db/exec! pool [sql:get-user-orgs profile-id]))
