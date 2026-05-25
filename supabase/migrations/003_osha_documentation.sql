-- OSHA documentation readiness: HazCom program fields, training, incidents, Phase 2 equipment/permits

-- Organization HazCom program (29 CFR 1910.1200 written program elements)
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS hazcom_responsible_person TEXT,
  ADD COLUMN IF NOT EXISTS hazcom_labeling_policy TEXT,
  ADD COLUMN IF NOT EXISTS hazcom_non_routine_tasks TEXT,
  ADD COLUMN IF NOT EXISTS hazcom_multi_employer TEXT,
  ADD COLUMN IF NOT EXISTS hazcom_training_approach TEXT,
  ADD COLUMN IF NOT EXISTS sds_access_method TEXT DEFAULT 'digital'
    CHECK (sds_access_method IN ('digital', 'binder', 'both'));

-- Public emergency QR access (token-only, no login)
ALTER TABLE chemicals
  ADD COLUMN IF NOT EXISTS emergency_public_token UUID DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS idx_chemicals_emergency_token
  ON chemicals(emergency_public_token);

-- HazCom training records (1910.1200(h))
CREATE TABLE training_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  worker_id       UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  training_type   TEXT NOT NULL
                  CHECK (training_type IN (
                    'hazcom_initial', 'hazcom_refresher', 'chemical_specific', 'confined_space'
                  )),
  completed_at    DATE NOT NULL,
  trainer         TEXT,
  notes           TEXT,
  chemical_id     UUID REFERENCES chemicals(id) ON DELETE SET NULL,
  created_by      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_training_records_org ON training_records(organization_id);
CREATE INDEX idx_training_records_worker ON training_records(worker_id);

-- Incidents (near-miss / injury documentation)
CREATE TABLE incidents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  incident_type     TEXT NOT NULL
                    CHECK (incident_type IN ('near_miss', 'injury', 'illness', 'property_damage')),
  status            TEXT NOT NULL DEFAULT 'incomplete'
                    CHECK (status IN ('complete', 'incomplete')),
  occurred_at       TIMESTAMPTZ NOT NULL,
  location          TEXT NOT NULL,
  description       TEXT NOT NULL,
  notes             TEXT,
  chemical_exposure BOOLEAN DEFAULT FALSE,
  chemical_ids      UUID[],
  exposure_details  TEXT,
  conditions        TEXT,
  osha_recordable   BOOLEAN DEFAULT FALSE,
  reported_by_id    UUID REFERENCES profiles(id),
  reported_by_name  TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_incidents_org ON incidents(organization_id);

CREATE TABLE incident_photos (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id         UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  file_name           TEXT NOT NULL,
  original_data_url   TEXT,
  annotation_strokes  JSONB,
  annotated_data_url  TEXT,
  caption             TEXT,
  uploaded_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_incident_photos_incident ON incident_photos(incident_id);

-- Phase 2: equipment registry
CREATE TABLE equipment (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  equipment_type  TEXT NOT NULL DEFAULT 'tank'
                  CHECK (equipment_type IN ('tank', 'fermenter', 'bright_tank', 'crusher', 'other')),
  location        TEXT,
  is_confined_space BOOLEAN DEFAULT FALSE,
  linked_chemical_ids UUID[],
  notes           TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_equipment_org ON equipment(organization_id);

-- Phase 2: confined space entry permits (1910.146)
CREATE TABLE confined_space_permits (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  equipment_id      UUID REFERENCES equipment(id) ON DELETE SET NULL,
  permit_number     TEXT,
  entry_date        TIMESTAMPTZ NOT NULL,
  entrant_names     TEXT[],
  attendant_name    TEXT,
  supervisor_name   TEXT,
  atmospheric_results JSONB,
  hazards_identified TEXT[],
  rescue_plan       TEXT,
  status            TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'closed', 'cancelled')),
  notes             TEXT,
  created_by        UUID REFERENCES profiles(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_permits_org ON confined_space_permits(organization_id);

ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE confined_space_permits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "training_records_select" ON training_records
  FOR SELECT USING (organization_id = get_org_id());
CREATE POLICY "training_records_insert" ON training_records
  FOR INSERT WITH CHECK (organization_id = get_org_id());
CREATE POLICY "training_records_update" ON training_records
  FOR UPDATE USING (organization_id = get_org_id());
CREATE POLICY "training_records_delete" ON training_records
  FOR DELETE USING (organization_id = get_org_id());

CREATE POLICY "incidents_select" ON incidents
  FOR SELECT USING (organization_id = get_org_id());
CREATE POLICY "incidents_insert" ON incidents
  FOR INSERT WITH CHECK (organization_id = get_org_id());
CREATE POLICY "incidents_update" ON incidents
  FOR UPDATE USING (organization_id = get_org_id());
CREATE POLICY "incidents_delete" ON incidents
  FOR DELETE USING (organization_id = get_org_id());

CREATE POLICY "incident_photos_select" ON incident_photos
  FOR SELECT USING (
    incident_id IN (SELECT id FROM incidents WHERE organization_id = get_org_id())
  );
CREATE POLICY "incident_photos_insert" ON incident_photos
  FOR INSERT WITH CHECK (
    incident_id IN (SELECT id FROM incidents WHERE organization_id = get_org_id())
  );
CREATE POLICY "incident_photos_update" ON incident_photos
  FOR UPDATE USING (
    incident_id IN (SELECT id FROM incidents WHERE organization_id = get_org_id())
  );
CREATE POLICY "incident_photos_delete" ON incident_photos
  FOR DELETE USING (
    incident_id IN (SELECT id FROM incidents WHERE organization_id = get_org_id())
  );

CREATE POLICY "equipment_select" ON equipment
  FOR SELECT USING (organization_id = get_org_id());
CREATE POLICY "equipment_insert" ON equipment
  FOR INSERT WITH CHECK (organization_id = get_org_id());
CREATE POLICY "equipment_update" ON equipment
  FOR UPDATE USING (organization_id = get_org_id());
CREATE POLICY "equipment_delete" ON equipment
  FOR DELETE USING (organization_id = get_org_id());

CREATE POLICY "permits_select" ON confined_space_permits
  FOR SELECT USING (organization_id = get_org_id());
CREATE POLICY "permits_insert" ON confined_space_permits
  FOR INSERT WITH CHECK (organization_id = get_org_id());
CREATE POLICY "permits_update" ON confined_space_permits
  FOR UPDATE USING (organization_id = get_org_id());
CREATE POLICY "permits_delete" ON confined_space_permits
  FOR DELETE USING (organization_id = get_org_id());

CREATE TRIGGER incidents_updated_at
  BEFORE UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER permits_updated_at
  BEFORE UPDATE ON confined_space_permits
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Organizations: admins can update their org HazCom fields
CREATE POLICY "org_update" ON organizations
  FOR UPDATE USING (id = get_org_id());
