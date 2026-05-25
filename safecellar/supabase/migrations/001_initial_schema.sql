-- SafeCellar initial schema (see PRD.md section 8)

CREATE TABLE organizations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  facility_type TEXT CHECK (facility_type IN ('brewery', 'winery', 'both')) NOT NULL,
  address       TEXT,
  city          TEXT,
  state         TEXT,
  zip           TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  role            TEXT CHECK (role IN ('admin', 'worker')) NOT NULL DEFAULT 'worker',
  phone           TEXT,
  language        TEXT DEFAULT 'en',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chemicals (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  trade_name        TEXT,
  manufacturer      TEXT,
  supplier          TEXT,
  barcode           TEXT,
  cas_number        TEXT,
  chemical_type     TEXT NOT NULL DEFAULT 'standard'
                    CHECK (chemical_type IN ('standard', 'cip', 'gas_hazard', 'refrigerant')),
  storage_location  TEXT,
  sds_file_path     TEXT,
  sds_version       TEXT,
  sds_uploaded_at   TIMESTAMPTZ,
  sds_last_verified TIMESTAMPTZ,
  sds_review_due_at TIMESTAMPTZ,
  sds_status        TEXT NOT NULL DEFAULT 'missing'
                    CHECK (sds_status IN ('compliant', 'review_due', 'missing', 'outdated')),
  ppe_required      TEXT[],
  hazard_class      TEXT[],
  first_aid_notes   TEXT,
  emergency_contact TEXT,
  notes             TEXT,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chemicals_org ON chemicals(organization_id);
CREATE INDEX idx_chemicals_sds_status ON chemicals(sds_status);
CREATE INDEX idx_chemicals_barcode ON chemicals(barcode);

CREATE TABLE deliveries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  order_number    TEXT,
  supplier        TEXT NOT NULL,
  order_date      DATE,
  expected_date   DATE,
  delivered_date  DATE,
  status          TEXT NOT NULL DEFAULT 'ordered'
                  CHECK (status IN ('ordered', 'in_transit', 'delivered', 'inventory_pending', 'complete')),
  notes           TEXT,
  created_by      UUID REFERENCES profiles(id),
  received_by     UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deliveries_org ON deliveries(organization_id);

CREATE TABLE delivery_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id   UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  chemical_id   UUID REFERENCES chemicals(id),
  product_name  TEXT NOT NULL,
  barcode       TEXT,
  quantity      INTEGER DEFAULT 1,
  unit          TEXT DEFAULT 'each',
  is_scanned    BOOLEAN DEFAULT FALSE,
  scanned_at    TIMESTAMPTZ,
  scanned_by    UUID REFERENCES profiles(id),
  is_new_chemical   BOOLEAN DEFAULT FALSE,
  sds_review_needed BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_delivery_items_delivery ON delivery_items(delivery_id);

CREATE TABLE sds_review_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  chemical_id     UUID NOT NULL REFERENCES chemicals(id) ON DELETE CASCADE,
  reason          TEXT NOT NULL
                  CHECK (reason IN ('new_chemical', 'annual_review', 'supplier_change', 'formula_update')),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'in_progress', 'resolved')),
  flagged_at      TIMESTAMPTZ DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ,
  resolved_by     UUID REFERENCES profiles(id),
  notes           TEXT
);

CREATE INDEX idx_sds_review_org ON sds_review_queue(organization_id);
CREATE INDEX idx_sds_review_status ON sds_review_queue(status);

CREATE TABLE workers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id      UUID REFERENCES profiles(id),
  full_name       TEXT NOT NULL,
  role_title      TEXT,
  phone           TEXT,
  email           TEXT,
  language        TEXT DEFAULT 'en',
  start_date      DATE,
  is_active       BOOLEAN DEFAULT TRUE,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workers_org ON workers(organization_id);

CREATE TABLE activity_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_id        UUID REFERENCES profiles(id),
  action          TEXT NOT NULL,
  entity_type     TEXT,
  entity_id       UUID,
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_log_org ON activity_log(organization_id);

ALTER TABLE organizations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE chemicals        ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries       ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sds_review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log     ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE POLICY "org_isolation" ON chemicals
  USING (organization_id = get_org_id());

CREATE POLICY "org_isolation" ON deliveries
  USING (organization_id = get_org_id());

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chemicals_updated_at
  BEFORE UPDATE ON chemicals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
