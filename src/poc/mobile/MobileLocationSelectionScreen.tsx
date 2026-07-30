import { BaggageClaim, Bus, DoorOpen, Info, MapPin, Plane, Search, ShieldCheck, Sparkles, Ticket, Volume2, Waves } from "lucide-react";
import { useMemo, useState } from "react";
import type { AirportLocation, LocationType } from "../types";
import { flightLabel, type SimulatedFlight } from "../flightSimulations";
import { MobileTravelerServicesScreen } from "./MobileTravelerServicesScreen";

type MobileLocationSelectionScreenProps = {
  description: string;
  disabledId?: string | null;
  flights?: SimulatedFlight[];
  locations: AirportLocation[];
  onSelect: (locationId: string) => void;
  onSelectFlight?: (flight: SimulatedFlight) => void;
  selectedId: string | null;
  selectedFlightId?: string | null;
  stepLabel: string;
  title: string;
};

type LocationCategory = {
  id: string;
  label: string;
  types: LocationType[];
};

const categories: LocationCategory[] = [
  { id: "popular", label: "Popular", types: ["parking", "entry", "ticketing", "security", "gate"] },
  { id: "gates", label: "Gates", types: ["gate"] },
  { id: "services", label: "Services", types: ["restroom", "quiet", "information", "vertical"] },
  { id: "arrivals", label: "Arrivals", types: ["baggage", "transportation"] }
];

function LocationIcon({ type }: { type: LocationType }) {
  const Icon =
    type === "entry"
      ? DoorOpen
      : type === "ticketing"
        ? Ticket
        : type === "security"
          ? ShieldCheck
          : type === "gate"
            ? Plane
            : type === "restroom"
              ? Waves
              : type === "baggage"
                ? BaggageClaim
                : type === "transportation"
                  ? Bus
                  : type === "quiet"
                    ? Volume2
                    : type === "information"
                      ? Info
                      : Sparkles;

  return <Icon aria-hidden="true" />;
}

export function MobileLocationSelectionScreen({
  description,
  disabledId,
  flights = [],
  locations,
  onSelect,
  onSelectFlight,
  selectedId,
  selectedFlightId,
  stepLabel,
  title
}: MobileLocationSelectionScreenProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("popular");
  const selectedCategory = categories.find((category) => category.id === activeCategory) ?? categories[0];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredLocations = useMemo(() => {
    const source = normalizedQuery
      ? locations
      : locations.filter((location) => selectedCategory.types.includes(location.type));

    return source
      .filter((location) =>
        `${location.name} ${location.description} ${location.type}`.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, normalizedQuery ? 12 : 8);
  }, [locations, normalizedQuery, selectedCategory.types]);

  return (
    <section className="mobile-selection-screen" aria-labelledby={`${stepLabel}-title`}>
      <div className="mobile-flow-progress" aria-label="Route planning progress">
        <span>{stepLabel}</span>
        <b />
      </div>
      <div className="mobile-screen-heading">
        <MapPin aria-hidden="true" />
        <span>
          <h1 id={`${stepLabel}-title`}>{title}</h1>
          <p>{description}</p>
        </span>
      </div>

      {flights.length > 0 && onSelectFlight ? (
        <section className="mobile-flight-selector" aria-label="Simulated flights">
          <div className="mobile-section-title">
            <Plane aria-hidden="true" />
            <span>
              <strong>Simulated flights</strong>
              <small>Demo data only. Beacon is not connected to live airline systems.</small>
            </span>
          </div>
          <div className="mobile-flight-list">
            {flights.map((flight) => {
              const selected = selectedFlightId === flight.id;
              return (
                <button
                  aria-pressed={selected}
                  className={selected ? "selected" : ""}
                  key={flight.id}
                  onClick={() => onSelectFlight(flight)}
                  type="button"
                >
                  <span className="mobile-location-icon">
                    <Plane aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{flightLabel(flight)}</strong>
                    <small>
                      {flight.destinationCity} · {flight.gateLabel} · Boarding {flight.boardingTime}
                    </small>
                  </span>
                  <em>{flight.status}</em>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <label className="mobile-search-field">
        <Search aria-hidden="true" />
        <span className="sr-only">Search locations</span>
        <input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search airport locations"
          type="search"
          value={query}
        />
      </label>

      <div className="mobile-category-tabs" aria-label="Location categories">
        {categories.map((category) => (
          <button
            aria-pressed={activeCategory === category.id}
            className={activeCategory === category.id ? "active" : ""}
            key={category.id}
            onClick={() => {
              setQuery("");
              setActiveCategory(category.id);
            }}
            type="button"
          >
            {category.label}
          </button>
        ))}
      </div>

      {activeCategory === "services" && !normalizedQuery ? (
        <MobileTravelerServicesScreen
          locations={locations}
          onBack={() => setActiveCategory("popular")}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      ) : (
        <div className="mobile-location-list" role="list">
          {filteredLocations.map((location) => {
            const disabled = disabledId === location.id || location.unavailable;
            return (
              <button
                aria-pressed={selectedId === location.id}
                className={selectedId === location.id ? "selected" : ""}
                disabled={disabled}
                key={location.id}
                onClick={() => onSelect(location.id)}
                type="button"
              >
                <span className="mobile-location-icon">
                  <LocationIcon type={location.type} />
                </span>
                <span>
                  <strong>{location.name}</strong>
                  <small>{location.description}</small>
                  {location.classification === "simulated" ? <small>Simulated location</small> : null}
                </span>
                <em>{selectedId === location.id ? "Selected" : disabled ? "Unavailable" : "Choose"}</em>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
