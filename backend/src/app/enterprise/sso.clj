;; This Source Code Form is subject to the terms of the Mozilla Public
;; License, v. 2.0. If a copy of the MPL was not distributed with this
;; file, You can obtain one at http://mozilla.org/MPL/2.0/.
;;
;; Enterprise SSO & Identity (SAML 2.0, OIDC, SCIM) Service

(ns app.enterprise.sso
  (:require
   [app.common.data :as d]
   [app.common.exceptions :as ex]
   [app.common.logging :as l]
   [app.db :as db]))

(def ^:private sql:get-sso-config-by-domain
  "SELECT * FROM enterprise_sso_config
    WHERE domain = ? AND is_enabled = true")

(def ^:private sql:get-sso-config-by-org
  "SELECT * FROM enterprise_sso_config
    WHERE org_id = ? AND is_enabled = true")

(def ^:private sql:verify-scim-token
  "SELECT org_id FROM enterprise_scim_token
    WHERE token_hash = ? AND is_active = true
      AND (expires_at IS NULL OR expires_at > clock_timestamp())")

(defn get-sso-config
  "Fetch SSO configuration for a domain or organization."
  ([pool domain]
   (db/exec-one! pool [sql:get-sso-config-by-domain domain]))
  ([pool org-id domain]
   (db/exec-one! pool [sql:get-sso-config-by-org org-id])))

(defn authenticate-scim-request
  "Validate SCIM bearer token hash and return authorized organization."
  [pool token-hash]
  (db/exec-one! pool [sql:verify-scim-token token-hash]))
