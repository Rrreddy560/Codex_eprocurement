import type { Role } from "./types.js";

const rolePermissions: Record<Role, string[]> = {
  mess_manager: ["requirement:create", "requirement:view"],
  management: [
    "requirement:view",
    "requirement:edit",
    "requirement:approve",
    "admin:view",
    "bid:view",
  ],
  supplier: ["bid:create", "bid:view", "requirement:view"],
};

export const hasPermission = (role: Role, permission: string): boolean => {
  return rolePermissions[role]?.includes(permission) ?? false;
};

export const requirePermission = (role: Role, permission: string): void => {
  if (!hasPermission(role, permission)) {
    throw new Error(`Role '${role}' cannot perform '${permission}'`);
  }
};
