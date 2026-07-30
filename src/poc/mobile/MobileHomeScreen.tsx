import { Info, LifeBuoy, MapPin, Navigation, Plane, Route, Sparkles, UserRound } from "lucide-react";
import type { AirportLocation, CalculatedRoute, TravelerProfile } from "../types";
import type { PresentationJourney } from "../navigationExperience";
import { locationName } from "../routeDisplay";
import { flightLabel, type SimulatedFlight } from "../flightSimulations";

type MobileHomeScreenProps = {
  activeRoute: CalculatedRoute | null;
  beaconLogoSrc: string;
  destinationId: string | null;
  flight: SimulatedFlight | null;
  locations: AirportLocation[];
  onAssistance: () => void;
  onPlan: () => void;
  onResumeJourney: () => void;
  onStartPresentationJourney: (journey: PresentationJourney) => void;
  presentationJourneys: PresentationJourney[];
  profile: TravelerProfile | undefined;
  startId: string | null;
};

export function MobileHomeScreen({
  activeRoute,
  beaconLogoSrc,
  destinationId,
  flight,
  locations,
  onAssistance,
  onPlan,
  onResumeJourney,
  onStartPresentationJourney,
  presentationJourneys,
  profile,
  startId
}: MobileHomeScreenProps) {
  const destinationName = flight?.gateLabel ?? locationName(locations, destinationId);
  const startName = locationName(locations, startId);
  const currentFlightLabel = flightLabel(flight);

  return (
    <section className="mobile-home-screen" aria-labelledby="mobile-home-title">
      <div className="mobile-home-hero">
        <div className="mobile-home-logo" aria-hidden="true">
          <img alt="" src={beaconLogoSrc} />
        </div>
        <p className="eyebrow">Beacon Wayfinding Technologies</p>
        <h1 id="mobile-home-title">Where can Beacon guide you today?</h1>
        <p>Clear airport directions personalized around your needs.</p>
        <div className="mobile-home-actions">
          <button aria-label="Start Navigation" className="primary-action" onClick={onPlan} type="button">
            Plan My Route
            <Navigation aria-hidden="true" />
          </button>
          <button aria-label="Request assistance" className="secondary-action" onClick={onAssistance} type="button">
            Request Assistance
            <LifeBuoy aria-hidden="true" />
          </button>
        </div>
      </div>

      <section className="mobile-airport-status" aria-label="Current airport">
        <MapPin aria-hidden="true" />
        <span>
          <strong>Greenville-Spartanburg International Airport</strong>
          <small>{currentFlightLabel ? `${currentFlightLabel} · ${flight?.gateLabel}` : "Simulated routing and travel status"}</small>
        </span>
      </section>

      <section className="mobile-demo-notices" aria-label="Demo notices">
        <Info aria-hidden="true" />
        <span>
          <small>
            Environmental previews are provided to support landmark recognition. Airport conditions, furniture,
            signage, tenants, and operational layouts may change.
          </small>
          <small>
            Airline names, flight details, and route conditions are simulated for demonstration purposes. No airline
            partnership or live system integration is implied.
          </small>
        </span>
      </section>

      <section className="mobile-companion-panel" aria-label="Saved traveler profile">
        <div>
          <UserRound aria-hidden="true" />
          <span>
            <strong>{profile?.name ?? "Fastest Route"}</strong>
            <small>{profile?.summary ?? "Uses the most direct available route."}</small>
          </span>
        </div>
      </section>

      {activeRoute ? (
        <section className="mobile-current-journey" aria-label="Recent or active journey">
          <div>
            {currentFlightLabel ? <Plane aria-hidden="true" /> : <Route aria-hidden="true" />}
            <span>
              <strong>{destinationName}</strong>
              <small>
                From {startName} · {activeRoute.estimatedMinutes} min
              </small>
            </span>
          </div>
          <button className="secondary-action" onClick={onResumeJourney} type="button">
            Resume Journey
          </button>
        </section>
      ) : null}

      <section className="mobile-presentation-list compact" aria-label="Presentation mode journeys">
        <div className="mobile-section-title">
          <Sparkles aria-hidden="true" />
          <span>
            <strong>Guided GSP demos</strong>
            <small>Simulated executive scenarios</small>
          </span>
        </div>
        {presentationJourneys.map((journey) => (
          <button key={journey.id} onClick={() => onStartPresentationJourney(journey)} type="button">
            <MapPin aria-hidden="true" />
            <span>
              <strong>{journey.title}</strong>
              <small>{journey.summary}</small>
            </span>
          </button>
        ))}
      </section>
    </section>
  );
}
