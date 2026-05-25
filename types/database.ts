export type ChemicalType = "standard" | "cip" | "gas_hazard" | "refrigerant";
export type SdsStatus = "compliant" | "review_due" | "missing" | "outdated";
export type DeliveryStatus =
  | "ordered"
  | "in_transit"
  | "delivered"
  | "inventory_pending"
  | "complete";
export type SdsReviewReason =
  | "new_chemical"
  | "annual_review"
  | "supplier_change"
  | "formula_update";
export type SdsReviewStatus = "pending" | "in_progress" | "resolved";
export type UserRole = "admin" | "worker";
export type FacilityType = "brewery" | "winery" | "both";

export type IncidentType =
  | "near_miss"
  | "injury"
  | "illness"
  | "property_damage";

export type IncidentStatus = "complete" | "incomplete";

export type AnnotationTool = "pen" | "arrow" | "circle" | "text";

export interface AnnotationStroke {
  tool: AnnotationTool;
  color: string;
  lineWidth: number;
  /** Flat [x1,y1,x2,y2,...] in canvas pixel coordinates */
  points: number[];
  text?: string;
}

export interface IncidentPhoto {
  id: string;
  file_name: string;
  original_data_url: string;
  annotation_strokes?: AnnotationStroke[] | null;
  annotated_data_url?: string | null;
  caption?: string | null;
  uploaded_at: string;
}

export interface Incident {
  id: string;
  organization_id: string;
  incident_type: IncidentType;
  status: IncidentStatus;
  occurred_at: string;
  location: string;
  description: string;
  notes?: string | null;
  chemical_exposure: boolean;
  chemical_ids?: string[] | null;
  exposure_details?: string | null;
  conditions?: string | null;
  osha_recordable?: boolean;
  photos: IncidentPhoto[];
  reported_by_id?: string | null;
  reported_by_name?: string | null;
  created_at: string;
  updated_at: string;
}

export type BugReportStatus = "open" | "resolved";

export interface BugReportTicket {
  id: string;
  organization_id: string;
  description: string;
  page_url: string;
  screenshot_file_name?: string | null;
  screenshot_original_url?: string | null;
  screenshot_annotated_url?: string | null;
  annotation_strokes?: AnnotationStroke[] | null;
  status: BugReportStatus;
  reported_by_id?: string | null;
  reported_by_name?: string | null;
  created_at: string;
  updated_at: string;
}

export type SdsAccessMethod = "digital" | "binder" | "both";

export type TrainingType =
  | "hazcom_initial"
  | "hazcom_refresher"
  | "chemical_specific"
  | "confined_space";

export type EquipmentType =
  | "tank"
  | "fermenter"
  | "bright_tank"
  | "crusher"
  | "other";

export type PermitStatus = "active" | "closed" | "cancelled";

export interface Organization {
  id: string;
  name: string;
  facility_type: FacilityType;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  hazcom_responsible_person?: string | null;
  hazcom_labeling_policy?: string | null;
  hazcom_non_routine_tasks?: string | null;
  hazcom_multi_employer?: string | null;
  hazcom_training_approach?: string | null;
  sds_access_method?: SdsAccessMethod | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  organization_id: string;
  full_name: string;
  role: UserRole;
  phone?: string | null;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Chemical {
  id: string;
  organization_id: string;
  name: string;
  trade_name?: string | null;
  manufacturer?: string | null;
  supplier?: string | null;
  barcode?: string | null;
  cas_number?: string | null;
  molecular_formula?: string | null;
  chemical_type: ChemicalType;
  storage_location?: string | null;
  sds_file_path?: string | null;
  sds_version?: string | null;
  sds_uploaded_at?: string | null;
  sds_last_verified?: string | null;
  sds_review_due_at?: string | null;
  sds_status: SdsStatus;
  ppe_required?: string[] | null;
  hazard_class?: string[] | null;
  first_aid_notes?: string | null;
  emergency_contact?: string | null;
  notes?: string | null;
  emergency_public_token?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrainingRecord {
  id: string;
  organization_id: string;
  worker_id: string;
  training_type: TrainingType;
  completed_at: string;
  trainer?: string | null;
  notes?: string | null;
  chemical_id?: string | null;
  created_by?: string | null;
  created_at: string;
  worker_name?: string;
  chemical_name?: string;
}

export interface Equipment {
  id: string;
  organization_id: string;
  name: string;
  equipment_type: EquipmentType;
  location?: string | null;
  is_confined_space: boolean;
  linked_chemical_ids?: string[] | null;
  notes?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConfinedSpacePermit {
  id: string;
  organization_id: string;
  equipment_id?: string | null;
  permit_number?: string | null;
  entry_date: string;
  entrant_names?: string[] | null;
  attendant_name?: string | null;
  supervisor_name?: string | null;
  atmospheric_results?: Record<string, unknown> | null;
  hazards_identified?: string[] | null;
  rescue_plan?: string | null;
  status: PermitStatus;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  equipment_name?: string;
}

export interface Delivery {
  id: string;
  organization_id: string;
  order_number?: string | null;
  supplier: string;
  order_date?: string | null;
  expected_date?: string | null;
  delivered_date?: string | null;
  status: DeliveryStatus;
  notes?: string | null;
  created_by?: string | null;
  received_by?: string | null;
  created_at: string;
  updated_at: string;
  items?: DeliveryItem[];
}

export interface DeliveryItem {
  id: string;
  delivery_id: string;
  chemical_id?: string | null;
  product_name: string;
  barcode?: string | null;
  quantity: number;
  unit: string;
  is_scanned: boolean;
  scanned_at?: string | null;
  scanned_by?: string | null;
  is_new_chemical: boolean;
  sds_review_needed: boolean;
  created_at: string;
  chemical?: Chemical | null;
}

export interface SdsReviewItem {
  id: string;
  organization_id: string;
  chemical_id: string;
  reason: SdsReviewReason;
  status: SdsReviewStatus;
  flagged_at: string;
  resolved_at?: string | null;
  resolved_by?: string | null;
  notes?: string | null;
  chemical?: Chemical;
}

export interface Worker {
  id: string;
  organization_id: string;
  profile_id?: string | null;
  full_name: string;
  role_title?: string | null;
  phone?: string | null;
  email?: string | null;
  language: string;
  start_date?: string | null;
  is_active: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogEntry {
  id: string;
  organization_id: string;
  actor_id?: string | null;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  actor_name?: string;
}

export interface ComplianceStats {
  score: number;
  totalChemicals: number;
  compliantCount: number;
  missingCount: number;
  reviewDueCount: number;
  pendingDeliveries: number;
  reviewQueueCount: number;
  needsAttention: number;
}

export type HighRiskNotificationPriority = "critical" | "high" | "medium";

export type HighRiskNotificationBadge =
  | "missing"
  | "review_due"
  | "gas_hazard"
  | "sds_queue"
  | "delivery"
  | "incident_incomplete";

export interface HighRiskNotification {
  id: string;
  priority: HighRiskNotificationPriority;
  title: string;
  subtitle: string;
  href: string;
  badge: HighRiskNotificationBadge;
}

export interface SessionUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization_id: string;
  organization_name: string;
}
