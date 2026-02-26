import { randomUUID } from "node:crypto";
import type { AuditEvent, Requirement, RequirementStatus, Role, SupplierBid } from "./types.js";

interface CreateRequirementInput {
  title: string;
  quantity: number;
  messName: string;
  createdBy: string;
  notes?: string;
}

const requirements: Requirement[] = [];
const bids: SupplierBid[] = [];
const auditLog: AuditEvent[] = [];

const log = (actor: string, role: Role, action: string): void => {
  auditLog.unshift({ id: randomUUID(), actor, role, action, at: new Date().toISOString() });
};

export const createRequirement = (input: CreateRequirementInput, actor: string): Requirement => {
  const requirement: Requirement = {
    id: randomUUID(),
    title: input.title,
    quantity: input.quantity,
    messName: input.messName,
    createdBy: input.createdBy,
    notes: input.notes,
    status: "submitted",
    createdAt: new Date().toISOString(),
  };

  requirements.unshift(requirement);
  log(actor, "mess_manager", `Created requirement ${requirement.id}`);
  return requirement;
};

export const listRequirements = (): Requirement[] => requirements;

export const setRequirementStatus = (
  requirementId: string,
  status: Extract<RequirementStatus, "approved" | "rejected">,
  actor: string,
): Requirement => {
  const requirement = requirements.find((item) => item.id === requirementId);
  if (!requirement) {
    throw new Error("Requirement not found");
  }
  requirement.status = status;
  log(actor, "management", `${status} requirement ${requirement.id}`);
  return requirement;
};

export const createBid = (
  payload: Omit<SupplierBid, "id" | "submittedAt">,
  actor: string,
): SupplierBid => {
  const bid: SupplierBid = { ...payload, id: randomUUID(), submittedAt: new Date().toISOString() };
  bids.unshift(bid);
  log(actor, "supplier", `Submitted bid ${bid.id}`);
  return bid;
};

export const listBids = (requirementId?: string): SupplierBid[] => {
  if (!requirementId) {
    return bids;
  }
  return bids.filter((item) => item.requirementId === requirementId);
};

export const getAuditLog = (): AuditEvent[] => auditLog;

export const getDashboard = () => ({
  totals: {
    requirements: requirements.length,
    bids: bids.length,
    pendingApprovals: requirements.filter((r) => r.status === "submitted").length,
  },
  recentRequirements: requirements.slice(0, 5),
});
