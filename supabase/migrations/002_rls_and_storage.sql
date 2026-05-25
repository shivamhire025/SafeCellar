-- RLS policies and SDS storage (complements 001_initial_schema.sql)

-- Organizations: members can read their org
CREATE POLICY "org_select" ON organizations
  FOR SELECT USING (id = get_org_id());

-- Profiles: read org members; update own row
CREATE POLICY "profile_select" ON profiles
  FOR SELECT USING (organization_id = get_org_id() OR id = auth.uid());

CREATE POLICY "profile_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Chemicals: full org-scoped CRUD (SELECT already exists in 001)
CREATE POLICY "chemicals_insert" ON chemicals
  FOR INSERT WITH CHECK (organization_id = get_org_id());

CREATE POLICY "chemicals_update" ON chemicals
  FOR UPDATE USING (organization_id = get_org_id());

CREATE POLICY "chemicals_delete" ON chemicals
  FOR DELETE USING (organization_id = get_org_id());

-- Deliveries
CREATE POLICY "deliveries_insert" ON deliveries
  FOR INSERT WITH CHECK (organization_id = get_org_id());

CREATE POLICY "deliveries_update" ON deliveries
  FOR UPDATE USING (organization_id = get_org_id());

CREATE POLICY "deliveries_delete" ON deliveries
  FOR DELETE USING (organization_id = get_org_id());

-- Delivery items (scoped via parent delivery)
CREATE POLICY "delivery_items_select" ON delivery_items
  FOR SELECT USING (
    delivery_id IN (
      SELECT id FROM deliveries WHERE organization_id = get_org_id()
    )
  );

CREATE POLICY "delivery_items_insert" ON delivery_items
  FOR INSERT WITH CHECK (
    delivery_id IN (
      SELECT id FROM deliveries WHERE organization_id = get_org_id()
    )
  );

CREATE POLICY "delivery_items_update" ON delivery_items
  FOR UPDATE USING (
    delivery_id IN (
      SELECT id FROM deliveries WHERE organization_id = get_org_id()
    )
  );

CREATE POLICY "delivery_items_delete" ON delivery_items
  FOR DELETE USING (
    delivery_id IN (
      SELECT id FROM deliveries WHERE organization_id = get_org_id()
    )
  );

-- SDS review queue
CREATE POLICY "sds_review_select" ON sds_review_queue
  FOR SELECT USING (organization_id = get_org_id());

CREATE POLICY "sds_review_insert" ON sds_review_queue
  FOR INSERT WITH CHECK (organization_id = get_org_id());

CREATE POLICY "sds_review_update" ON sds_review_queue
  FOR UPDATE USING (organization_id = get_org_id());

CREATE POLICY "sds_review_delete" ON sds_review_queue
  FOR DELETE USING (organization_id = get_org_id());

-- Workers
CREATE POLICY "workers_select" ON workers
  FOR SELECT USING (organization_id = get_org_id());

CREATE POLICY "workers_insert" ON workers
  FOR INSERT WITH CHECK (organization_id = get_org_id());

CREATE POLICY "workers_update" ON workers
  FOR UPDATE USING (organization_id = get_org_id());

CREATE POLICY "workers_delete" ON workers
  FOR DELETE USING (organization_id = get_org_id());

-- Activity log (read + append for org)
CREATE POLICY "activity_log_select" ON activity_log
  FOR SELECT USING (organization_id = get_org_id());

CREATE POLICY "activity_log_insert" ON activity_log
  FOR INSERT WITH CHECK (organization_id = get_org_id());

-- SDS PDF storage: private bucket, paths like {org_id}/{chemical_id}/file.pdf
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sds-files',
  'sds-files',
  false,
  20971520,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "sds_files_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'sds-files'
    AND (storage.foldername(name))[1] = get_org_id()::text
  );

CREATE POLICY "sds_files_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'sds-files'
    AND (storage.foldername(name))[1] = get_org_id()::text
  );

CREATE POLICY "sds_files_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'sds-files'
    AND (storage.foldername(name))[1] = get_org_id()::text
  );

CREATE POLICY "sds_files_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'sds-files'
    AND (storage.foldername(name))[1] = get_org_id()::text
  );
