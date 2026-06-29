import { Info } from "lucide-react";
import type { AirportConfig } from "../types";

export function AirportInfoPanel({ airport }: { airport: AirportConfig }) {
  return (
    <section className="info-panel" aria-labelledby="airport-info-title">
      <div className="panel-heading">
        <Info aria-hidden="true" />
        <div>
          <p className="eyebrow">Airport Info</p>
          <h2 id="airport-info-title">Pilot directory</h2>
        </div>
      </div>
      <div className="info-list">
        {airport.informationPages.map((page) => (
          <details key={page.id}>
            <summary>{page.title}</summary>
            <p>{page.summary}</p>
            <ul>
              {page.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}
