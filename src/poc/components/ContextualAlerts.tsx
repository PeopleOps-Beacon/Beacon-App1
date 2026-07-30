import { ArrowLeft } from "lucide-react";
import { contextualGuidanceForStep } from "../contextualGuidance";
import type { SimulatedFlight } from "../flightSimulations";
import type { AirportLocation, CalculatedRoute } from "../types";
import { ContextualAlertCard } from "./ContextualAlertCard";

type ContextualAlertsProps = {
  route: CalculatedRoute | null;
  activeStepIndex: number;
  destinationId: string | null;
  flight: SimulatedFlight | null;
  locations: AirportLocation[];
  onBack: () => void;
};

export function ContextualAlerts({ route, activeStepIndex, destinationId, flight, locations, onBack }: ContextualAlertsProps) {
  const guidance = contextualGuidanceForStep({ route, activeStepIndex, destinationId, flight, locations });

  return (
    <section className="route-experience-shell" aria-labelledby="contextual-alerts-title">
      <article className="route-screen-card contextual-alerts-screen">
        <div className="route-screen-heading">
          <p className="eyebrow">Contextual alerts</p>
          <h1 id="contextual-alerts-title">Alerts Along Your Route</h1>
          <p>Only alerts that affect this route are shown here.</p>
        </div>

        {guidance ? (
          <div className="contextual-alert-list">
            <p className="eyebrow">Current guidance</p>
            <ContextualAlertCard
              alert={guidance}
              relevance={guidance.category}
            />
          </div>
        ) : null}

        {!guidance ? <p className="quiet-status">Your current route remains clear.</p> : null}

        <button className="text-link-button" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" />
          Back to Navigation
        </button>
      </article>
    </section>
  );
}
