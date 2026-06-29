import { Bug } from "lucide-react";
import { featureFlags } from "../data/enterprise";
import { analytics } from "../services/analytics";

export function DiagnosticsPanel() {
  const events = analytics.list().slice(0, 4);

  return (
    <section className="enterprise-panel" aria-labelledby="diagnostics-title">
      <div className="panel-heading">
        <Bug aria-hidden="true" />
        <div>
          <p className="eyebrow">Diagnostics</p>
          <h2 id="diagnostics-title">Feature flags</h2>
        </div>
      </div>
      <div className="flag-list">
        {Object.entries(featureFlags).map(([key, value]) => (
          <span key={key}>
            {key}: {value ? "on" : "off"}
          </span>
        ))}
      </div>
      <p>{events.length} analytics events captured locally.</p>
    </section>
  );
}
