import type { ReactNode } from "react";

export function Badge({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return <span className={active ? "ui-badge active" : "ui-badge"}>{children}</span>;
}
