import { memo } from "react";
import { BarChart3 } from "lucide-react";
import type { ChartDatum, DemoAnalytics } from "../services/DemoDataGenerator";

const chartOrder: Array<{ key: keyof DemoAnalytics; label: string }> = [
  { key: "dailyTravelers", label: "Daily Travelers" },
  { key: "popularDestinations", label: "Popular Destinations" },
  { key: "mostRequestedServices", label: "Most Requested Services" },
  { key: "accessibilityRequests", label: "Accessibility Requests" },
  { key: "averageWalkingTime", label: "Average Walking Time" },
  { key: "navigationSuccessRate", label: "Navigation Success Rate" },
  { key: "notificationEngagement", label: "Notification Engagement" },
  { key: "favoriteLocations", label: "Favorite Locations" }
];

function maxValue(values: ChartDatum[]): number {
  return Math.max(1, ...values.map((item) => item.value));
}

function AnalyticsDashboardComponent({ analytics }: { analytics: DemoAnalytics }) {
  return (
    <section className="operations-card analytics-dashboard" aria-labelledby="analytics-dashboard-title">
      <div className="panel-heading compact">
        <BarChart3 aria-hidden="true" />
        <div>
          <p className="eyebrow">Analytics</p>
          <h3 id="analytics-dashboard-title">Airport analytics</h3>
        </div>
      </div>
      <div className="chart-grid">
        {chartOrder.map((chart) => {
          const values = analytics[chart.key];
          const max = maxValue(values);

          return (
            <article className="mini-chart" key={chart.key}>
              <strong>{chart.label}</strong>
              <div className="bar-list">
                {values.slice(0, 5).map((item) => (
                  <span key={item.label}>
                    <small>{item.label}</small>
                    <i style={{ width: Math.max(8, Math.round((item.value / max) * 100)) + "%" }} />
                    <b>{item.value}</b>
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export const AnalyticsDashboard = memo(AnalyticsDashboardComponent);
