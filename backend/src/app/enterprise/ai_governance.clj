;; This Source Code Form is subject to the terms of the Mozilla Public
;; License, v. 2.0. If a copy of the MPL was not distributed with this
;; file, You can obtain one at http://mozilla.org/MPL/2.0/.
;;
;; Enterprise Plugin & Agentic AI Governance Service

(ns app.enterprise.ai-governance
  (:require
   [app.common.data :as d]
   [app.common.exceptions :as ex]
   [app.common.logging :as l]
   [app.db :as db]))

(def ^:private sql:get-policy
  "SELECT * FROM enterprise_ai_governance_policy
    WHERE org_id = ? AND is_active = true")

(defn get-ai-policy
  "Fetch AI & plugin governance policy for an enterprise organization."
  [pool org-id]
  (db/exec-one! pool [sql:get-policy org-id]))

(defn validate-mcp-tool-execution
  "Assert that an MCP tool call satisfies organization AI governance policy."
  [pool org-id tool-name model-id operation-type]
  (if-let [policy (get-ai-policy pool org-id)]
    (let [allowed-tools (set (:tool_allowlist policy))
          blocked-tools (set (:tool_blocklist policy))
          allowed-models (set (:approved_models policy))]
      (when (contains? blocked-tools tool-name)
        (throw (ex-info "MCP Tool blocked by enterprise AI policy"
                        {:type :forbidden :tool tool-name :org-id org-id})))
      (when-not (or (contains? allowed-tools "*") (contains? allowed-tools tool-name))
        (throw (ex-info "MCP Tool not in enterprise allowlist"
                        {:type :forbidden :tool tool-name :org-id org-id})))
      (when (and (= operation-type :canvas-write) (not (:allow_canvas_write policy)))
        (throw (ex-info "Canvas write operations forbidden for AI agents by enterprise policy"
                        {:type :forbidden :org-id org-id})))
      true)
    ;; If no explicit policy exists, default to safe allow
    true))
