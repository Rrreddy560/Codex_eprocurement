import type { Request, Response, NextFunction } from "express";
import { requirePermission } from "../core/rbac.js";
import type { Role } from "../core/types.js";

export interface AuthRequest extends Request {
  userRole?: Role;
  userName?: string;
}

export const withRole = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const role = req.header("x-user-role") as Role | undefined;
  const userName = req.header("x-user-name") ?? "anonymous";

  if (role && ["mess_manager", "management", "supplier"].includes(role)) {
    req.userRole = role;
  }
  req.userName = userName;
  next();
};

export const authorize = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const role = req.userRole;

    if (!role) {
      res.status(401).json({ message: "Missing role. Send x-user-role header." });
      return;
    }

    try {
      requirePermission(role, permission);
      next();
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  };
};
