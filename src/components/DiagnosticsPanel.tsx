import { BarChart3 } from "lucide-react";
import { featureFlags } from "../data/enterprise";
import { analytics } from "../services/analytics";

export function DiagnosticsPanel() {
  const events = analytics.list().slice(-4).reverse();
  const summary = analytics.summarize();
  const topFeatures = Object.entries(summary.featureUsage)
    .sort((first, second) => second[1] - first[1])
    .slice(0, 4);

  return (
    <section className="enterprise-panel analytics-panel" aria-labelledby="diagnostics-title">
      <div className="panel-heading">
        <BarChart3 aria-hidden="true" />
        <div>
          <p className="eyebrow">Analytics</p>
          <h2 id="diagnostics-title">Pilot dashboard</h2>
        </div>
      </div>
      <div className="analytics-grid">
        <span>
          <strong>{summary.activeUsers}</strong>
          Active users
        </span>
        <span>
          <strong>{summary.airportsViewed}</strong>
          Airports viewed
        </span>
        <span>
          <strong>{summary.routesGenerated}</strong>
          Routes generated
        </span>
        <span>
          <strong>{summary.accessibilityPreferences}</strong>
          Accessibility updates
        </span>
        <span>
          <strong>{summary.errors}</strong>
          Errors
        </span>
        <span>
          <strong>{summary.sessionDurationMinutes}m</strong>
          Session duration
        </span>
      </div>
      <div className="flag-list">
        {Object.entries(featureFlags).map(([key, value]) => (
          <span key={key}>
            {key}: {value ? "on" : "off"}
          </span>
        ))}
      </div>
      <div className="analytics-feed">
        {topFeatures.map(([name, count]) => (
          <span key={name}>
            {name}: {count}
          </span>
        ))}
      </div>
      <div className="analytics-feed">
        {events.map((event) => (
          <span key={event.timestamp + event.name}>{event.name}</span>
        ))}
      </div>
    </section>
  );
}
