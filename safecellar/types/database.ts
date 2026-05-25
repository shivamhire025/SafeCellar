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

export interface Organization {
  id: string;
  name: string;
  facility_type: FacilityType;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
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
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export interface SessionUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization_id: string;
  organization_name: string;
}
