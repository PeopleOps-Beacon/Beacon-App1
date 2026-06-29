import { ConciergeBell } from "lucide-react";
import { useMemo, useState } from "react";
import { DirectoryService } from "../services/enterpriseServices";
import type { AirportConfig, AirportLocation } from "../types";

export function ServicesDirectory({
  airport,
  onSelect
}: {
  airport: AirportConfig;
  onSelect: (location: AirportLocation) => void;
}) {
  const [query, setQuery] = useState("");
  const services = useMemo(() => {
    const normalized = query.toLowerCase();
    return DirectoryService.byAirport(airport).filter((service) =>
      [service.name, service.category, service.description].join(" ").toLowerCase().includes(normalized)
    );
  }, [airport, query]);

  return (
    <section className="enterprise-panel" aria-labelledby="services-title">
      <div className="panel-heading">
        <ConciergeBell aria-hidden="true" />
        <div>
          <p className="eyebrow">Directory</p>
          <h2 id="services-title">Airport services</h2>
        </div>
      </div>
      <input
        aria-label="Search services"
        className="enterprise-input"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Coffee, charging, pet relief..."
        value={query}
      />
      <div className="service-list">
        {services.map((service) => {
          const location = airport.locations.find((item) => item.id.endsWith(service.locationId));
          return (
            <article key={service.id}>
              <strong>{service.name}</strong>
              <p>{service.description}</p>
              <small>
                {service.hours} · {service.accessibilityInformation}
              </small>
              {location ? (
                <button onClick={() => onSelect(location)} type="button">
                  Navigate
                </button>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
