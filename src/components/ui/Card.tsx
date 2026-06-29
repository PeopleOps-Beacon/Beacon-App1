import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  labelledBy
}: {
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section aria-labelledby={labelledBy} className={`ui-card ${className}`.trim()}>
      {children}
    </section>
  );
}
