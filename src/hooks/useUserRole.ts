import { useContext } from "react";
import { UserRoleContext } from "../context/userRoleContextValue";
import type { UserRoleContextValue } from "../context/userRoleContextValue";

export function useUserRole(): UserRoleContextValue {
  const value = useContext(UserRoleContext);

  if (!value) {
    throw new Error("useUserRole must be used inside UserRoleProvider");
  }

  return value;
}
