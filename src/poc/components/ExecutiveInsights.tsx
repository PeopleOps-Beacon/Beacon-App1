import type { SimulatedExecutiveInsights } from "../types";

type ExecutiveInsightsProps = {
  insights: SimulatedExecutiveInsights;
  onBack: () => void;
};

export function ExecutiveInsights({ insights, onBack }: ExecutiveInsightsProps) {
  const { metrics } = insights;
  const metricItems = [
    { label: "Simulated journeys", value: metrics.simulatedJourneys.toLocaleString() },
    { label: "Average journey time", value: `${metrics.averageJourneyTimeMinutes} min` },
    { label: "Accessibility route percentage", value: `${metrics.accessibilityRoutePercentage}%` },
    { label: "Most requested destination", value: metrics.mostRequestedDestination },
    { label: "Most requested traveler service", value: metrics.mostRequestedTravelerService },
    {
      label: "Passenger satisfaction",
      value: metrics.passengerSatisfaction,
      note: "Simulated passenger satisfaction; no real passenger feedback."
    },
    { label: "Assistance requests", value: metrics.assistanceRequests.toLocaleString() },
    {
      label: "Potential Staff Interactions Reduced",
      value: metrics.potentialStaffInteractionsReduced.toLocaleString(),
      note: "Illustrative estimate based on simulated wayfinding and assistance scenarios."
    }
  ];

  return (
    <main className="executive-insights-screen" aria-labelledby="executive-insights-title">
      <header className="executive-insights-header">
        <div>
          <p className="eyebrow">Beacon Operations</p>
          <h1 id="executive-insights-title">Executive Insights</h1>
        </div>
        <button className="secondary-action" onClick={onBack} type="button">
          Back to Admin
        </button>
      </header>

      <section className="executive-simulation-disclosure" aria-labelledby="simulation-disclosure-title">
        <strong id="simulation-disclosure-title">Simulated Demonstration Data</strong>
        <p>These metrics demonstrate the type of operational insight Beacon could provide in a live airport deployment.</p>
      </section>

      <div className="executive-insights-metadata" aria-label="Simulation metadata">
        <span>
          <small>Reporting period</small>
          <strong>{insights.reportingPeriod}</strong>
        </span>
        <span>
          <small>Simulation source</small>
          <strong>{insights.simulationSource}</strong>
        </span>
      </div>

      <section className="executive-metric-grid" aria-label="Simulated executive metrics">
        {metricItems.map((metric) => (
          <article key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note ?? "Simulated demonstration value"}</small>
          </article>
        ))}
      </section>

      <details className="executive-insights-assumptions">
        <summary>Metric assumptions</summary>
        <ul>
          {insights.metricAssumptions.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>
      </details>
    </main>
  );
}
