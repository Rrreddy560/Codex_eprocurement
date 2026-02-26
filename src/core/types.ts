export type Role = "mess_manager" | "management" | "supplier";

export type RequirementStatus = "draft" | "submitted" | "approved" | "rejected";

export interface Requirement {
  id: string;
  title: string;
  quantity: number;
  messName: string;
  createdBy: string;
  status: RequirementStatus;
  createdAt: string;
  notes?: string;
}

export interface SupplierBid {
  id: string;
  requirementId: string;
  supplierName: string;
  amount: number;
  deliveryDays: number;
  qualityScore: number;
  submittedAt: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  role: Role;
  action: string;
  at: string;
}
