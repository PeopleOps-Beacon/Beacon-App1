import { SlidersHorizontal } from "lucide-react";
import type { AirportConfig } from "../types";

export function AdminConfigPanel({ airport }: { airport: AirportConfig }) {
  return (
    <section className="enterprise-panel" aria-labelledby="admin-title">
      <div className="panel-heading">
        <SlidersHorizontal aria-hidden="true" />
        <div>
          <p className="eyebrow">Admin</p>
          <h2 id="admin-title">Configuration</h2>
        </div>
      </div>
      <dl className="admin-grid">
        <div>
          <dt>Locations</dt>
          <dd>{airport.locations.length}</dd>
        </div>
        <div>
          <dt>Terminals</dt>
          <dd>{airport.terminals.length}</dd>
        </div>
        <div>
          <dt>Resources</dt>
          <dd>{airport.accessibilityResources.length}</dd>
        </div>
      </dl>
    </section>
  );
}
