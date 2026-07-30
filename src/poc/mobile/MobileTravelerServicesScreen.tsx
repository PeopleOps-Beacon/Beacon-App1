import { ArrowLeft, Baby, ChevronRight, Info, Volume2, Waves } from "lucide-react";
import type { AirportLocation } from "../types";

type MobileTravelerServicesScreenProps = {
  locations: AirportLocation[];
  onBack: () => void;
  onSelect: (locationId: string) => void;
  selectedId: string | null;
};

const travelerServiceIds = ["restroom", "nursing-room", "quiet-space", "information-desk"] as const;

function ServiceIcon({ locationId }: { locationId: string }) {
  const Icon =
    locationId === "nursing-room"
      ? Baby
      : locationId === "quiet-space"
        ? Volume2
        : locationId === "information-desk"
          ? Info
          : Waves;

  return <Icon aria-hidden="true" />;
}

export function MobileTravelerServicesScreen({
  locations,
  onBack,
  onSelect,
  selectedId
}: MobileTravelerServicesScreenProps) {
  const services = travelerServiceIds
    .map((locationId) => locations.find((location) => location.id === locationId))
    .filter((location): location is AirportLocation => Boolean(location && !location.unavailable));

  return (
    <section className="mobile-traveler-services" aria-labelledby="traveler-services-title">
      <div className="mobile-traveler-services-heading">
        <button aria-label="Back to location categories" className="mobile-services-back" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" />
        </button>
        <span>
          <h2 id="traveler-services-title">Traveler Services</h2>
          <p>Find helpful airport services and add them to your journey.</p>
        </span>
      </div>

      <div className="mobile-location-list mobile-traveler-services-list" role="list">
        {services.map((service) => {
          const selected = selectedId === service.id;

          return (
            <button
              aria-label={`Choose ${service.name} as destination`}
              aria-pressed={selected}
              className={selected ? "selected" : ""}
              key={service.id}
              onClick={() => onSelect(service.id)}
              type="button"
            >
              <span className="mobile-location-icon">
                <ServiceIcon locationId={service.id} />
              </span>
              <span>
                <strong>{service.name}</strong>
                <small>{service.description}</small>
              </span>
              <ChevronRight aria-hidden="true" className="mobile-service-chevron" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
