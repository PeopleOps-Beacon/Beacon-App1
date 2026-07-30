import { memo } from "react";
import { Accessibility } from "lucide-react";
import type { AccessibilityMetrics } from "../services/DemoDataGenerator";

const metricLabels: Array<{ key: keyof AccessibilityMetrics; label: string }> = [
  { key: "elevatorsAvailable", label: "Elevators Available" },
  { key: "accessibleRestrooms", label: "Accessible Restrooms" },
  { key: "wheelchairAssistanceRequests", label: "Wheelchair Assistance Requests" },
  { key: "accessibleRoutes", label: "Accessible Routes" },
  { key: "temporaryClosures", label: "Temporary Closures" }
];

function AccessibilityDashboardComponent({ metrics }: { metrics: AccessibilityMetrics }) {
  return (
    <section className="operations-card accessibility-dashboard" aria-labelledby="accessibility-dashboard-title">
      <div className="panel-heading compact">
        <Accessibility aria-hidden="true" />
        <div>
          <p className="eyebrow">Accessibility</p>
          <h3 id="accessibility-dashboard-title">Accessibility monitoring</h3>
        </div>
      </div>
      <div className="metric-tile-grid">
        {metricLabels.map((metric) => (
          <span key={metric.key}>
            <strong>{metrics[metric.key]}</strong>
            {metric.label}
          </span>
        ))}
      </div>
    </section>
  );
}

export const AccessibilityDashboard = memo(AccessibilityDashboardComponent);
