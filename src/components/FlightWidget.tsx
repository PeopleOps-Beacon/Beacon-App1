import { PlaneTakeoff } from "lucide-react";
import { useMemo, useState } from "react";
import { FlightService } from "../services/enterpriseServices";
import type { FlightInfo } from "../types";

export function FlightWidget() {
  const [query, setQuery] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<FlightInfo | null>(null);
  const flights = useMemo(
    () => (query ? FlightService.search(query) : FlightService.list()).slice(0, 4),
    [query]
  );

  return (
    <section className="enterprise-panel" aria-labelledby="flight-title">
      <div className="panel-heading">
        <PlaneTakeoff aria-hidden="true" />
        <div>
          <p className="eyebrow">Flight Info</p>
          <h2 id="flight-title">My flight</h2>
        </div>
      </div>
      <input
        aria-label="Search flights"
        className="enterprise-input"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search DL 241, gate A7..."
        value={query}
      />
      <div className="flight-list">
        {flights.map((flight) => (
          <button key={flight.id} onClick={() => setSelectedFlight(flight)} type="button">
            <strong>
              {flight.airline} {flight.flightNumber}
            </strong>
            <span>
              Gate {flight.gate} · {flight.status} · Departs {flight.departureTime}
            </span>
          </button>
        ))}
      </div>
      {selectedFlight ? (
        <article className="flight-detail">
          <strong>{selectedFlight.flightNumber}</strong>
          <p>
            Boarding {selectedFlight.boardingTime}. Carousel {selectedFlight.carousel ?? "TBD"}.
          </p>
          {selectedFlight.delayInformation ? <p>{selectedFlight.delayInformation}</p> : null}
        </article>
      ) : null}
    </section>
  );
}
