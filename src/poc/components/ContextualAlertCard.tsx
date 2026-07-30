import { AlertTriangle, BadgeInfo, LifeBuoy } from "lucide-react";
import type { ContextualAlert } from "../types";

type ContextualAlertCardProps = {
  alert: Pick<ContextualAlert, "title" | "message" | "severity">;
  relevance: string;
};

export function ContextualAlertCard({ alert, relevance }: ContextualAlertCardProps) {
  const Icon = alert.severity === "assistance" ? LifeBuoy : alert.severity === "caution" ? AlertTriangle : BadgeInfo;

  return (
    <article className={`contextual-alert-card ${alert.severity}`}>
      <Icon aria-hidden="true" />
      <div>
        <strong>{alert.title}</strong>
        <p>{alert.message}</p>
        <span>{relevance}</span>
      </div>
    </article>
  );
}
