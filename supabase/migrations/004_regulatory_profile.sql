-- Jurisdiction-aware compliance copy (US OSHA HazCom vs Canada WHMIS)

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS regulatory_profile text
  NOT NULL DEFAULT 'ca'
  CHECK (regulatory_profile IN ('us', 'ca', 'both'));
