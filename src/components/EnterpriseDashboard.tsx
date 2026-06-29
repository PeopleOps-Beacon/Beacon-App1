import { LayoutDashboard } from "lucide-react";
import type { AirportConfig, AirportLocation, SmartNotification, TravelerMode } from "../types";

export function EnterpriseDashboard({
  airport,
  favorites,
  mode,
  notifications,
  recents
}: {
  airport: AirportConfig;
  favorites: AirportLocation[];
  mode: TravelerMode;
  notifications: SmartNotification[];
  recents: AirportLocation[];
}) {
  return (
    <section className="enterprise-panel dashboard-panel" aria-labelledby="dashboard-title">
      <div className="panel-heading">
        <LayoutDashboard aria-hidden="true" />
        <div>
          <p className="eyebrow">Home</p>
          <h2 id="dashboard-title">Personalized dashboard</h2>
        </div>
      </div>
      <div className="dashboard-grid">
        <span>{airport.iata}</span>
        <span>{mode.label}</span>
        <span>{favorites.length} favorites</span>
        <span>{recents.length} recent</span>
        <span>{notifications.filter((notification) => !notification.dismissed).length} alerts</span>
        <span>Weather placeholder</span>
      </div>
    </section>
  );
}
