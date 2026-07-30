import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  isDemoRole,
  isEnterpriseRole,
  type UserRole,
  userRoleDescriptions,
  userRoleLabels,
  userRoles
} from "../types/UserRole";
import { UserRoleContext, type UserRoleContextValue } from "./userRoleContextValue";

const storageKey = "beacon-enterprise-role";

function readInitialRole(): UserRole {
  if (typeof window === "undefined") {
    return "demo-mode";
  }

  const storedRole = window.localStorage.getItem(storageKey) as UserRole | null;
  return storedRole && userRoles.includes(storedRole) ? storedRole : "demo-mode";
}

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(() => readInitialRole());

  useEffect(() => {
    window.localStorage.setItem(storageKey, role);
  }, [role]);

  const value = useMemo<UserRoleContextValue>(
    () => ({
      role,
      roleLabel: userRoleLabels[role],
      roleDescription: userRoleDescriptions[role],
      isDemoMode: isDemoRole(role),
      isEnterpriseExperience: isEnterpriseRole(role),
      setRole
    }),
    [role]
  );

  return <UserRoleContext.Provider value={value}>{children}</UserRoleContext.Provider>;
}
