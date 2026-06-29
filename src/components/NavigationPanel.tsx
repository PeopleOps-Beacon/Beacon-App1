import { CheckCircle2, Footprints, Navigation } from "lucide-react";
import type { NavigationState, TravelerMode } from "../types";
import { formatDistance } from "../utils/navigation";

type Props = {
  navigation: NavigationState;
  mode: TravelerMode;
  onArrive: () => void;
};

export function NavigationPanel({ navigation, mode, onArrive }: Props) {
  const route = navigation.route;

  if (!route) {
    return (
      <section className="navigation-panel" aria-label="Navigation guidance">
        <Navigation aria-hidden="true" />
        <h2>Route waiting</h2>
        <p>Choose a destination to start mock navigation.</p>
      </section>
    );
  }

  const modeMessage: Record<TravelerMode["id"], string> = {
    veteran: "Calmer route selected with quieter support spaces visible.",
    sensory: "Lower-noise route selected with decompression options nearby.",
    accessibility: "Step-free route indicator active.",
    family: "Family amenities are prioritized near this route.",
    business: "Shortest path priority is active.",
    international: "Passport and customs reminders are active."
  };

  return (
    <section className="navigation-panel" aria-labelledby="navigation-title">
      <div className="panel-heading">
        <Navigation aria-hidden="true" />
        <div>
          <p className="eyebrow">Mock Navigation</p>
          <h2 id="navigation-title">Route to {route.to.name}</h2>
        </div>
      </div>

      <div className="route-stats">
        <span>{formatDistance(route.distanceFeet)}</span>
        <span>{route.estimatedWalkMinutes} min</span>
        <span>{route.stepCount} steps</span>
      </div>

      <p className="mode-guidance">{modeMessage[mode.id]}</p>

      <ol className="route-steps">
        {route.steps.map((step) => (
          <li key={step.id}>
            <Footprints aria-hidden="true" />
            <span>{step.instruction}</span>
          </li>
        ))}
      </ol>

      {navigation.hasArrived ? (
        <p className="arrival-message">
          <CheckCircle2 aria-hidden="true" />
          Arrival confirmed.
        </p>
      ) : (
        <button className="arrival-action" onClick={onArrive} type="button">
          Mark arrived
        </button>
      )}
    </section>
  );
}
