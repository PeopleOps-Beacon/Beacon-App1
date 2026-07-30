import { CalendarClock, MapPin, Navigation, Route, Sparkles } from "lucide-react";
import type { AirportLocation, CalculatedRoute } from "../types";
import type { PresentationJourney } from "../navigationExperience";
import { locationName } from "../routeDisplay";

type MobileTripsScreenProps = {
  destinationId: string | null;
  locations: AirportLocation[];
  onBeginJourney: () => void;
  onPlan: () => void;
  onStartPresentationJourney: (journey: PresentationJourney) => void;
  presentationJourneys: PresentationJourney[];
  route: CalculatedRoute | null;
  startId: string | null;
};

export function MobileTripsScreen({
  destinationId,
  locations,
  onBeginJourney,
  onPlan,
  onStartPresentationJourney,
  presentationJourneys,
  route,
  startId
}: MobileTripsScreenProps) {
  const destinationName = locationName(locations, destinationId);
  const startName = locationName(locations, startId);

  return (
    <section className="mobile-trips-screen" aria-labelledby="mobile-trips-title">
      <div className="mobile-screen-heading">
        <CalendarClock aria-hidden="true" />
        <span>
          <h1 id="mobile-trips-title">Trips</h1>
          <p>Resume your current journey or launch a prepared Beacon demonstration.</p>
        </span>
      </div>

      {route ? (
        <section className="mobile-trip-card" aria-label="Active journey">
          <div>
            <Navigation aria-hidden="true" />
            <span>
              <strong>{destinationName}</strong>
              <small>
                From {startName} · {route.estimatedMinutes} minutes · {route.steps.length} steps
              </small>
            </span>
          </div>
          <button className="primary-action" onClick={onBeginJourney} type="button">
            Resume Journey
          </button>
        </section>
      ) : (
        <section className="mobile-trip-card empty" aria-label="No active journey">
          <div>
            <Route aria-hidden="true" />
            <span>
              <strong>No active trip</strong>
              <small>Plan a route when you are ready to move through the airport.</small>
            </span>
          </div>
          <button className="primary-action" onClick={onPlan} type="button">
            Plan My Route
          </button>
        </section>
      )}

      <section className="mobile-presentation-list" aria-label="Presentation mode journeys">
        <div className="mobile-section-title">
          <Sparkles aria-hidden="true" />
          <span>
            <strong>GSP Presentation Journeys</strong>
            <small>Meeting-ready routes with Beacon guidance moments.</small>
          </span>
        </div>
        {presentationJourneys.map((journey) => (
          <button key={journey.id} onClick={() => onStartPresentationJourney(journey)} type="button">
            <MapPin aria-hidden="true" />
            <span>
              <strong>{journey.title}</strong>
              <small>{journey.trigger}</small>
            </span>
          </button>
        ))}
      </section>
    </section>
  );
}
