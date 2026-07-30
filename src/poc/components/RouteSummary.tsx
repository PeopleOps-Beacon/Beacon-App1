import { ArrowRight, Clock, MapPin, Plane, Settings, ShieldCheck, Sparkles } from "lucide-react";
import { formatDistance, locationName, routeCondition, routeExplanation, routeProfileSummary } from "../routeDisplay";
import { visualReferenceForStep } from "../landmarkVisuals";
import { flightLabel, type SimulatedFlight } from "../flightSimulations";
import type {
  AirportLocation,
  CalculatedRoute,
  PreferenceId,
  RouteConnection,
  TravelerProfileId
} from "../types";
import { LandmarkVisual } from "./LandmarkVisual";
import { RoutePreviewMap } from "./RoutePreviewMap";

type RouteSummaryProps = {
  locations: AirportLocation[];
  connections: RouteConnection[];
  route: CalculatedRoute | null;
  routeError: string | null;
  startId: string | null;
  destinationId: string | null;
  flight: SimulatedFlight | null;
  preferences: PreferenceId[];
  profileId: TravelerProfileId;
  presentationMode?: boolean;
  onBegin: () => void;
  onModify: () => void;
};

export function RouteSummary({
  locations,
  connections,
  route,
  routeError,
  startId,
  destinationId,
  flight,
  preferences,
  profileId,
  presentationMode = false,
  onBegin,
  onModify
}: RouteSummaryProps) {
  const profile = routeProfileSummary(profileId, preferences);
  const profileTitle = profile.title;
  const destinationName = flight?.gateLabel ?? locationName(locations, destinationId);
  const startName = locationName(locations, startId);
  const explanation = flight?.routeNote ?? routeExplanation(preferences);
  const arrivalReference = visualReferenceForStep(route?.steps[route.steps.length - 1]);
  const condition = flight
    ? { title: flight.conditionTitle, message: flight.conditionMessage }
    : routeCondition(route);
  const selectedFlightLabel = flightLabel(flight);
  const securityLabel = flight?.securityType === "tsa-precheck" ? "TSA PreCheck" : "Standard Screening";

  return (
    <section className="route-experience-shell executive-summary-shell" aria-labelledby="route-results-title">
      <article className="route-screen-card route-summary-focused executive-route-summary">
        <div className="route-screen-heading">
          <p className="eyebrow">{presentationMode ? "GSP stakeholder demonstration" : "Passenger route"}</p>
          <h1 id="route-results-title">Your route is ready</h1>
          <p>{presentationMode ? "A calm, personalized airport journey prepared for presentation." : "Review the essentials, then begin guidance."}</p>
        </div>

        {routeError ? (
          <p className="form-error" role="alert">
            {routeError}
          </p>
        ) : null}

        <div className="executive-route-hero" aria-label="Route destination">
          <span>
            <MapPin aria-hidden="true" />
            Destination
          </span>
          <strong>{destinationName}</strong>
          <small>Starting at {startName}</small>
        </div>

        {flight ? (
          <section className="route-flight-card" aria-label="Simulated flight details">
            <span>
              <Plane aria-hidden="true" />
              <strong>{selectedFlightLabel}</strong>
              <small>
                {flight.destinationCity} · Boarding {flight.boardingTime} · {flight.status}
              </small>
            </span>
            <span>
              <ShieldCheck aria-hidden="true" />
              <strong>{securityLabel}</strong>
              <small>Estimated wait: {flight.securityWaitMinutes} minutes · Simulated data</small>
            </span>
          </section>
        ) : null}

        <div className="executive-route-metrics" aria-label="Route essentials">
          <span>
            <Clock aria-hidden="true" />
            <small>Estimated time</small>
            <strong>{route ? `${route.estimatedMinutes} min` : "--"}</strong>
          </span>
          <span>
            <MapPin aria-hidden="true" />
            <small>Distance</small>
            <strong>{route ? formatDistance(route.distanceFeet) : "--"}</strong>
          </span>
          <span>
            <Sparkles aria-hidden="true" />
            <small>Route profile</small>
            <strong>{profileTitle}</strong>
          </span>
        </div>

        <section className="route-review-visual" aria-label="Route visual preview">
          <LandmarkVisual compact visual={arrivalReference} />
          <span>
            <small>Destination preview</small>
            <strong>{arrivalReference.title}</strong>
            <p>{arrivalReference.recognitionCue}</p>
          </span>
        </section>

        <section className="route-intelligence-card executive-route-copy" aria-label="Route explanation">
          <span>Why this route</span>
          <strong>{explanation}</strong>
        </section>

        <section className="route-condition-pill" aria-label="Important route condition">
          <AlertConditionIcon />
          <span>
            <strong>{condition.title}</strong>
            <small>{condition.message}</small>
          </span>
        </section>

        <RoutePreviewMap
          connections={connections}
          destinationId={destinationId}
          locations={locations}
          route={route}
          startId={startId}
        />

        <div className="route-primary-actions">
          <button aria-label="Begin navigation" className="primary-action" disabled={!route} onClick={onBegin} type="button">
            Begin Journey
            <ArrowRight aria-hidden="true" />
          </button>
          <button className="text-link-button" onClick={onModify} type="button">
            <Settings aria-hidden="true" />
            Modify Route
          </button>
        </div>
      </article>
    </section>
  );
}

function AlertConditionIcon() {
  return <Sparkles aria-hidden="true" />;
}
