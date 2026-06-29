import { TriangleAlert } from "lucide-react";
import { airportAlerts } from "../data/enterprise";
import type { AirportConfig } from "../types";

export function AlertsCenter({ airport }: { airport: AirportConfig }) {
  const alerts = airportAlerts.filter((alert) => alert.airportId === airport.id);

  return (
    <section className="enterprise-panel" aria-labelledby="alerts-title">
      <div className="panel-heading">
        <TriangleAlert aria-hidden="true" />
        <div>
          <p className="eyebrow">Alerts</p>
          <h2 id="alerts-title">Airport alerts</h2>
        </div>
      </div>
      <div className="alert-list">
        {alerts.map((alert) => (
          <article className={`alert ${alert.severity}`} key={alert.id}>
            <strong>{alert.title}</strong>
            <p>{alert.message}</p>
            <small>
              {alert.category} · {alert.severity}
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}
