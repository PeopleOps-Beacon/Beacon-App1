import { Siren } from "lucide-react";
import type { AirportLocation } from "../types";

const emergencyKeywords = ["security", "first aid", "police", "help", "aed", "emergency"];

export function EmergencyPanel({
  locations,
  onSelect
}: {
  locations: AirportLocation[];
  onSelect: (location: AirportLocation) => void;
}) {
  const emergencyLocations = locations.filter((location) =>
    [...location.keywords, location.name.toLowerCase()].some((keyword) =>
      emergencyKeywords.some((emergency) => keyword.includes(emergency))
    )
  );

  return (
    <section className="enterprise-panel emergency-panel" aria-labelledby="emergency-title">
      <div className="panel-heading">
        <Siren aria-hidden="true" />
        <div>
          <p className="eyebrow">Emergency</p>
          <h2 id="emergency-title">Rapid assistance</h2>
        </div>
      </div>
      <div className="emergency-grid">
        {emergencyLocations.slice(0, 4).map((location) => (
          <button key={location.id} onClick={() => onSelect(location)} type="button">
            {location.name}
          </button>
        ))}
      </div>
    </section>
  );
}
