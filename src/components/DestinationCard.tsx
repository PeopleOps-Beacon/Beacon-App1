import { Accessibility, Clock, MapPin, Tags, X } from "lucide-react";
import type { AirportLocation, Route, TravelerMode } from "../types";
import { formatDistance, getNearbyLocations } from "../utils/navigation";

type Props = {
  destination: AirportLocation | null;
  locations: AirportLocation[];
  mode: TravelerMode;
  route: Route | null;
  onClear: () => void;
};

export function DestinationCard({ destination, locations, mode, route, onClear }: Props) {
  if (!destination) {
    return (
      <section className="destination-card empty" aria-label="Destination details">
        <MapPin aria-hidden="true" />
        <h2>Select a destination</h2>
        <p>Search or tap the map to generate a mock route and see traveler-mode guidance.</p>
      </section>
    );
  }

  const nearby = getNearbyLocations(destination, locations, mode.id === "family" ? 5 : 3);

  return (
    <section className="destination-card" aria-labelledby="destination-title">
      <div className="destination-heading">
        <div>
          <p className="eyebrow">{destination.category}</p>
          <h2 id="destination-title">{destination.name}</h2>
        </div>
        <button aria-label="Clear selected destination" onClick={onClear} type="button">
          <X aria-hidden="true" />
        </button>
      </div>

      <p>{destination.description}</p>

      <div className="detail-grid">
        <span>
          <MapPin aria-hidden="true" />
          Terminal {destination.terminal}, Floor {destination.floor}
        </span>
        <span>
          <Clock aria-hidden="true" />
          {route ? `${route.estimatedWalkMinutes} min walk` : "No route yet"}
        </span>
        <span>
          <Tags aria-hidden="true" />
          {route ? formatDistance(route.distanceFeet) : "Select route"}
        </span>
        <span>
          <Accessibility aria-hidden="true" />
          {route?.accessible ? "Accessible route" : "Standard route"}
        </span>
      </div>

      <div className="tag-section">
        <h3>Accessibility features</h3>
        <div className="tag-list">
          {destination.accessibilityFeatures.map((feature) => (
            <span key={feature}>{feature}</span>
          ))}
        </div>
      </div>

      <div className="tag-section">
        <h3>Supported traveler modes</h3>
        <div className="tag-list">
          {destination.travelerModesSupported.map((supportedMode) => (
            <span className={supportedMode === mode.id ? "active-tag" : ""} key={supportedMode}>
              {supportedMode}
            </span>
          ))}
        </div>
      </div>

      <div className="tag-section">
        <h3>Nearby amenities</h3>
        <div className="nearby-list">
          {nearby.map((location) => (
            <span key={location.id}>{location.name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
