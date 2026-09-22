-- ==============================================================================
-- PENPOT ENTERPRISE PLATFORM SCHEMA MIGRATION
-- Step 1: Enterprise Administration Layer Foundation
-- Version: 0153
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. MULTI-ORGANIZATION HIERARCHY
-- Root tenant entities isolating resources, billing, compliance, and policies.
-- ------------------------------------------------------------------------------

CREATE TABLE enterprise_organization (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  modified_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  deleted_at timestamptz NULL,

  name text NOT NULL,
  slug text NOT NULL,
  logo_url text NULL,

  -- Subscription / Enterprise Tier
  tier text NOT NULL DEFAULT 'enterprise' CHECK (tier IN ('starter', 'business', 'enterprise', 'custom')),
  subscription_status text NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'suspended', 'cancelled')),

  -- Quotas and resource limits
  seat_limit integer NOT NULL DEFAULT 500,
  storage_quota_bytes bigint NOT NULL DEFAULT 1099511627776, -- 1 TB default
  allow_public_sharing boolean NOT NULL DEFAULT false,
  enforce_sso boolean NOT NULL DEFAULT false,
  allowed_email_domains text[] NOT NULL DEFAULT '{}',

  -- Metadata
  billing_email text NULL,
  contact_name text NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX enterprise_org__slug__idx
    ON enterprise_organization (slug)
 WHERE deleted_at IS NULL;

CREATE TRIGGER enterprise_organization__modified_at__tgr
BEFORE UPDATE ON enterprise_organization
   FOR EACH ROW EXECUTE PROCEDURE update_modified_at();

-- Map existing Penpot `team` to parent enterprise organizations (Sub-teams / Departments)
CREATE TABLE enterprise_organization_team (
  org_id uuid NOT NULL REFERENCES enterprise_organization(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES team(id) ON DELETE CASCADE,

  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  department text NULL,
  cost_center text NULL,
  is_default boolean NOT NULL DEFAULT false,

  PRIMARY KEY (org_id, team_id)
);

CREATE INDEX enterprise_org_team__team_id__idx
    ON enterprise_organization_team (team_id);

-- Organization-level User Membership & Global Enterprise Roles
CREATE TABLE enterprise_organization_member (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES enterprise_organization(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profile(id) ON DELETE CASCADE,

  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  modified_at timestamptz NOT NULL DEFAULT clock_timestamp(),

  -- Global organization role
  role text NOT NULL CHECK (role IN (
    'super_admin',
    'org_admin',
    'team_lead',
    'member',
    'restricted_editor',
    'guest_viewer'
  )),

  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'invited', 'deactivated')),
  idp_user_id text NULL, -- External identity provider ID (from SCIM or SSO)

  PRIMARY KEY (org_id, profile_id)
);

CREATE INDEX enterprise_org_member__profile_id__idx
    ON enterprise_organization_member (profile_id);

CREATE INDEX enterprise_org_member__role__idx
    ON enterprise_organization_member (org_id, role);

CREATE TRIGGER enterprise_organization_member__modified_at__tgr
BEFORE UPDATE ON enterprise_organization_member
   FOR EACH ROW EXECUTE PROCEDURE update_modified_at();


-- ------------------------------------------------------------------------------
-- 2. ADVANCED RBAC & GOVERNANCE
-- Fine-grained capability definitions and resource-level access policies.
-- ------------------------------------------------------------------------------

CREATE TABLE enterprise_role_definition (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NULL REFERENCES enterprise_organization(id) ON DELETE CASCADE, -- NULL indicates system-wide default role

  name text NOT NULL,
  code text NOT NULL,
  description text NULL,
  is_system boolean NOT NULL DEFAULT false,

  -- Permissions matrix stored as array of granular action keys
  -- e.g. ["workspace:read", "workspace:write", "team:manage", "billing:view", "audit:export", "ai:invoke"]
  permissions text[] NOT NULL DEFAULT '{}',

  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  modified_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE UNIQUE INDEX enterprise_role__code_org__idx
    ON enterprise_role_definition (code, COALESCE(org_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- Populate base enterprise roles
INSERT INTO enterprise_role_definition (code, name, description, is_system, permissions) VALUES
  ('super_admin', 'Super Administrator', 'Full unconstrained platform & infrastructure governance', true,
   ARRAY['*']),
  ('org_admin', 'Organization Administrator', 'Full administration over tenant settings, billing, users, and teams', true,
   ARRAY['org:*', 'team:*', 'user:*', 'sso:*', 'audit:*', 'flags:*', 'ai:*', 'policy:*']),
  ('team_lead', 'Team Lead', 'Manage projects, design libraries, and user memberships within assigned teams', true,
   ARRAY['team:manage', 'project:*', 'file:*', 'library:*', 'comment:*', 'ai:invoke']),
  ('member', 'Enterprise Member / Designer', 'Create and edit design files, utilize approved team libraries and tools', true,
   ARRAY['project:create', 'project:read', 'file:*', 'library:read', 'comment:*', 'ai:invoke']),
  ('restricted_editor', 'Restricted Editor', 'Edit design canvas only within explicitly shared projects without library modification', true,
   ARRAY['file:read', 'file:edit_canvas', 'comment:*']),
  ('guest_viewer', 'Guest Viewer', 'Read-only access with inspect mode and prototype presentation view', true,
   ARRAY['file:read', 'file:inspect', 'file:export_preview', 'comment:create']);

-- Granular resource-level policy overrides
CREATE TABLE enterprise_resource_policy (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES enterprise_organization(id) ON DELETE CASCADE,

  resource_type text NOT NULL CHECK (resource_type IN ('organization', 'team', 'project', 'file', 'library', 'ai_tool')),
  resource_id text NOT NULL, -- UUID of targeted resource

  subject_type text NOT NULL CHECK (subject_type IN ('profile', 'role', 'team', 'domain')),
  subject_id text NOT NULL,

  action text NOT NULL,
  effect text NOT NULL CHECK (effect IN ('allow', 'deny')),

  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  created_by uuid REFERENCES profile(id) ON DELETE SET NULL
);

CREATE INDEX enterprise_resource_policy__target__idx
    ON enterprise_resource_policy (org_id, resource_type, resource_id);


-- ------------------------------------------------------------------------------
-- 3. ENTERPRISE SSO & IDENTITY (SAML 2.0, OIDC, SCIM)
-- ------------------------------------------------------------------------------

CREATE TABLE enterprise_sso_config (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES enterprise_organization(id) ON DELETE CASCADE,

  is_enabled boolean NOT NULL DEFAULT true,
  protocol text NOT NULL CHECK (protocol IN ('saml2', 'oidc')),
  provider_name text NOT NULL, -- 'Okta', 'Azure AD', 'Keycloak', 'Google Workspace', 'Custom'

  -- Common config
  domain text NOT NULL,
  enforce_for_domain boolean NOT NULL DEFAULT true,
  auto_provision_users boolean NOT NULL DEFAULT true,
  default_role text NOT NULL DEFAULT 'member',

  -- SAML 2.0 specific fields
  saml_entity_id text NULL,
  saml_idp_sso_url text NULL,
  saml_idp_certificate text NULL,
  saml_sp_entity_id text NULL,
  saml_sp_acs_url text NULL,
  saml_name_id_format text NOT NULL DEFAULT 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',

  -- OIDC specific fields
  oidc_issuer_url text NULL,
  oidc_client_id text NULL,
  oidc_client_secret text NULL,
  oidc_scopes text[] NOT NULL DEFAULT '{"openid", "email", "profile"}',

  -- Attribute mapping rules
  attribute_mapping jsonb NOT NULL DEFAULT '{
    "email": "email",
    "name": "name",
    "groups": "groups"
  }'::jsonb,

  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  modified_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE UNIQUE INDEX enterprise_sso__org_domain__idx
    ON enterprise_sso_config (org_id, domain);

CREATE TRIGGER enterprise_sso_config__modified_at__tgr
BEFORE UPDATE ON enterprise_sso_config
   FOR EACH ROW EXECUTE PROCEDURE update_modified_at();

-- SCIM 2.0 Bearer Tokens and User Mapping
CREATE TABLE enterprise_scim_token (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES enterprise_organization(id) ON DELETE CASCADE,

  token_hash text NOT NULL, -- SHA-256 hash of bearer secret
  description text NOT NULL DEFAULT 'SCIM Provisioning Client',
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  expires_at timestamptz NULL,
  last_used_at timestamptz NULL,
  is_active boolean NOT NULL DEFAULT true
);

CREATE INDEX enterprise_scim_token__hash__idx
    ON enterprise_scim_token (token_hash)
 WHERE is_active IS TRUE;

CREATE TABLE enterprise_scim_user_mapping (
  org_id uuid NOT NULL REFERENCES enterprise_organization(id) ON DELETE CASCADE,
  external_id text NOT NULL, -- SCIM IdP ID
  profile_id uuid NOT NULL REFERENCES profile(id) ON DELETE CASCADE,

  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  synced_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,

  PRIMARY KEY (org_id, external_id)
);

CREATE UNIQUE INDEX enterprise_scim_mapping__profile__idx
    ON enterprise_scim_user_mapping (org_id, profile_id);


-- ------------------------------------------------------------------------------
-- 4. ENTERPRISE AUDIT LOGGING SYSTEM
-- High-throughput, immutable compliance log for administrative & security actions.
-- ------------------------------------------------------------------------------

CREATE TABLE enterprise_audit_log (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES enterprise_organization(id) ON DELETE CASCADE,

  -- Actor details
  actor_type text NOT NULL CHECK (actor_type IN ('user', 'system', 'agent', 'api_token')),
  actor_id text NOT NULL,
  actor_email text NULL,

  -- Action taxonomy (e.g., 'user.created', 'file.exported', 'role.changed', 'sso.login')
  action text NOT NULL,
  category text NOT NULL CHECK (category IN (
    'authentication',
    'authorization',
    'organization',
    'team',
    'file_access',
    'ai_execution',
    'billing',
    'compliance'
  )),

  -- Target details
  target_type text NULL,
  target_id text NULL,
  target_name text NULL,

  -- Network and execution context
  ip_address text NULL,
  user_agent text NULL,
  session_id uuid NULL,

  -- Structured payload (diffs, parameters, tool inputs)
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,

  occurred_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

-- Performance and compliance query indices
CREATE INDEX enterprise_audit_log__org_time__idx
    ON enterprise_audit_log (org_id, occurred_at DESC);

CREATE INDEX enterprise_audit_log__action__idx
    ON enterprise_audit_log (org_id, action, occurred_at DESC);

CREATE INDEX enterprise_audit_log__actor__idx
    ON enterprise_audit_log (org_id, actor_id, occurred_at DESC);

CREATE INDEX enterprise_audit_log__category__idx
    ON enterprise_audit_log (org_id, category, occurred_at DESC);


-- ------------------------------------------------------------------------------
-- 5. PLUGIN & AGENTIC AI GOVERNANCE
-- Policy allowlist engine to govern MCP servers, LLMs, and third-party plugins.
-- ------------------------------------------------------------------------------

CREATE TABLE enterprise_ai_governance_policy (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES enterprise_organization(id) ON DELETE CASCADE,

  name text NOT NULL,
  description text NULL,
  is_active boolean NOT NULL DEFAULT true,

  -- Execution boundaries
  allow_canvas_read boolean NOT NULL DEFAULT true,
  allow_canvas_write boolean NOT NULL DEFAULT false,
  allow_asset_export boolean NOT NULL DEFAULT false,
  enforce_airgap boolean NOT NULL DEFAULT false, -- If true, no outbound external LLM network calls permitted

  -- Approved MCP servers and tool IDs
  mcp_server_allowlist text[] NOT NULL DEFAULT '{"penpot-builtin-mcp"}',
  tool_allowlist text[] NOT NULL DEFAULT '{"read_file", "list_layers", "inspect_styles"}',
  tool_blocklist text[] NOT NULL DEFAULT '{}',

  -- Approved model vendors and deployment endpoints
  approved_models text[] NOT NULL DEFAULT '{"claude-3-7-sonnet", "gpt-4o", "gemini-1.5-pro"}',
  allowed_model_endpoints text[] NOT NULL DEFAULT '{}', -- e.g. private AWS Bedrock VPC / Azure OpenAI

  -- Data residency and zero-retention compliance flags
  forbid_training_on_enterprise_ip boolean NOT NULL DEFAULT true,
  require_audit_logging boolean NOT NULL DEFAULT true,

  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  modified_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE UNIQUE INDEX enterprise_ai_policy__org__idx
    ON enterprise_ai_governance_policy (org_id);

CREATE TRIGGER enterprise_ai_policy__modified_at__tgr
BEFORE UPDATE ON enterprise_ai_governance_policy
   FOR EACH ROW EXECUTE PROCEDURE update_modified_at();


-- ------------------------------------------------------------------------------
-- 6. FEATURE FLAG ENGINE (EARLY ACCESS)
-- Tenant-level feature toggle system for controlled rollout of enterprise capabilities.
-- ------------------------------------------------------------------------------

CREATE TABLE enterprise_feature_flag (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NULL,

  is_enabled_globally boolean NOT NULL DEFAULT false,
  rollout_percentage integer NOT NULL DEFAULT 0 CHECK (rollout_percentage BETWEEN 0 AND 100),

  tags text[] NOT NULL DEFAULT '{}',

  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  modified_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

-- Seed core enterprise feature toggles
INSERT INTO enterprise_feature_flag (key, name, description, is_enabled_globally, rollout_percentage, tags) VALUES
  ('enterprise.multi_org', 'Multi-Organization Tenancy', 'Enable root organization selector and multi-tier department hierarchy', true, 100, ARRAY['core', 'enterprise']),
  ('enterprise.sso_saml', 'SAML 2.0 Identity Provider Integration', 'Support enterprise IdP authentication via SAML 2.0', true, 100, ARRAY['auth', 'sso']),
  ('enterprise.scim_provisioning', 'SCIM 2.0 Automated User Provisioning', 'Automatic user provisioning and group sync from Okta / Azure AD', true, 100, ARRAY['auth', 'scim']),
  ('enterprise.audit_export', 'Audit Log SIEM Streaming', 'Export compliance audit events to Splunk, Datadog, or cloud storage', true, 50, ARRAY['compliance', 'audit']),
  ('enterprise.agentic_ai_canvas', 'Agentic AI Canvas Editing', 'Permit verified MCP agentic flows to execute write operations on canvas', false, 10, ARRAY['ai', 'beta']),
  ('enterprise.custom_roles', 'Custom Granular RBAC Builder', 'Permit organization admins to construct custom capability roles', true, 100, ARRAY['rbac', 'governance']);

-- Tenant and Cohort Overrides
CREATE TABLE enterprise_feature_flag_override (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  flag_id uuid NOT NULL REFERENCES enterprise_feature_flag(id) ON DELETE CASCADE,

  target_type text NOT NULL CHECK (target_type IN ('organization', 'team', 'profile', 'cohort')),
  target_id text NOT NULL, -- UUID of organization, team, profile, or cohort identifier

  is_enabled boolean NOT NULL,

  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  modified_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX enterprise_flag_override__lookup__idx
    ON enterprise_feature_flag_override (flag_id, target_type, target_id);
