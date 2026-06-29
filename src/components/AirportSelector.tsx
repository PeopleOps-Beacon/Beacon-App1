import { Plane } from "lucide-react";
import type { AirportConfig } from "../types";

type Props = {
  airport: AirportConfig;
  airports: AirportConfig[];
  onChange: (airportId: string) => void;
};

export function AirportSelector({ airport, airports, onChange }: Props) {
  return (
    <section className="airport-selector" aria-label="Airport selector">
      <div className="panel-heading">
        <Plane aria-hidden="true" />
        <div>
          <p className="eyebrow">Pilot Airport</p>
          <h2>{airport.iata}</h2>
        </div>
      </div>
      <label>
        Airport
        <select onChange={(event) => onChange(event.target.value)} value={airport.id}>
          {airports.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.iata} - {candidate.city}, {candidate.state}
            </option>
          ))}
        </select>
      </label>
      <p>
        {airport.name} · {airport.timezone}
      </p>
    </section>
  );
}
