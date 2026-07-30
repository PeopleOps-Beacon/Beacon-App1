import { createContext } from "react";
import type { UserRole } from "../types/UserRole";

export type UserRoleContextValue = {
  role: UserRole;
  roleLabel: string;
  roleDescription: string;
  isDemoMode: boolean;
  isEnterpriseExperience: boolean;
  setRole: (role: UserRole) => void;
};

export const UserRoleContext = createContext<UserRoleContextValue | null>(null);
