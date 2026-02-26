import { Router } from "express";
import { z } from "zod";
import { authorize, type AuthRequest } from "./middleware.js";
import {
  createBid,
  createRequirement,
  getAuditLog,
  getDashboard,
  listBids,
  listRequirements,
  setRequirementStatus,
} from "../core/store.js";

const requirementSchema = z.object({
  title: z.string().min(3),
  quantity: z.number().positive(),
  messName: z.string().min(2),
  notes: z.string().optional(),
});

const bidSchema = z.object({
  requirementId: z.string().min(1),
  supplierName: z.string().min(2),
  amount: z.number().positive(),
  deliveryDays: z.number().int().positive(),
  qualityScore: z.number().min(0).max(100),
});

const decisionSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

export const apiRouter = Router();

apiRouter.get("/dashboard", (req, res) => {
  res.json({ role: (req as AuthRequest).userRole ?? null, ...getDashboard() });
});

apiRouter.get("/requirements", authorize("requirement:view"), (_req, res) => {
  res.json(listRequirements());
});

apiRouter.post("/requirements", authorize("requirement:create"), (req, res) => {
  const parsed = requirementSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.flatten());
    return;
  }

  const authReq = req as AuthRequest;
  const requirement = createRequirement(
    {
      ...parsed.data,
      createdBy: authReq.userName ?? "mess-manager",
    },
    authReq.userName ?? "mess-manager",
  );

  res.status(201).json(requirement);
});

apiRouter.post("/requirements/:requirementId/decision", authorize("requirement:approve"), (req, res) => {
  const parsed = decisionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.flatten());
    return;
  }

  try {
    const updated = setRequirementStatus(
      req.params.requirementId,
      parsed.data.status,
      (req as AuthRequest).userName ?? "manager",
    );
    res.json(updated);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
});

apiRouter.get("/bids", authorize("bid:view"), (req, res) => {
  const requirementId = typeof req.query.requirementId === "string" ? req.query.requirementId : undefined;
  res.json(listBids(requirementId));
});

apiRouter.post("/bids", authorize("bid:create"), (req, res) => {
  const parsed = bidSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.flatten());
    return;
  }

  const bid = createBid(parsed.data, (req as AuthRequest).userName ?? "supplier");
  res.status(201).json(bid);
});

apiRouter.get("/admin/audit-log", authorize("admin:view"), (_req, res) => {
  res.json(getAuditLog());
});
