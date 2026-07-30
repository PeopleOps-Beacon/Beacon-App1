import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { routeProfileSummary } from "../routeDisplay";
import type { CalculatedRoute, PreferenceId, TravelerProfileId } from "../types";

type ArrivalConfirmationProps = {
  destinationName: string;
  onEnd: () => void;
  onPlanAnotherRoute: () => void;
  profileId: TravelerProfileId;
  route: CalculatedRoute;
};

type JourneyFeedback = "great" | "good" | "needs-improvement";

const accessibilityLabels: Partial<Record<PreferenceId, string>> = {
  wheelchair: "Wheelchair Accessible",
  avoidStairs: "Avoid Stairs",
  largerText: "Large Text",
  reducedStimulation: "Reduced Stimulation",
  avoidCrowds: "Lower-Crowd Routing",
  simplifiedDirections: "Simplified Directions",
  reassurance: "Reassurance Prompts",
  additionalTime: "Additional Time"
};

function profileLabel(profileId: TravelerProfileId, preferences: PreferenceId[]): string {
  const title = routeProfileSummary(profileId, preferences).title;
  return title === "Fastest Route" ? "Direct" : title.replace(/ Route$/, "");
}

function accessibilitySupport(preferences: PreferenceId[]): string {
  const support = preferences
    .map((preference) => accessibilityLabels[preference])
    .filter((label): label is string => Boolean(label));

  return support.length > 0 ? support.join(", ") : "Standard Route";
}

function optionalStops(route: CalculatedRoute): number {
  return route.locationIds
    .slice(1, -1)
    .filter((locationId) => locationId === "restroom" || locationId === "quiet-space").length;
}

export function ArrivalConfirmation({
  destinationName,
  onEnd,
  onPlanAnotherRoute,
  profileId,
  route
}: ArrivalConfirmationProps) {
  const [feedback, setFeedback] = useState<JourneyFeedback | null>(null);
  const optionalStopCount = optionalStops(route);
  const summary = [
    { label: "Destination", value: destinationName },
    { label: "Estimated Journey Time", value: `${route.estimatedMinutes} min` },
    { label: "Route Profile Used", value: profileLabel(profileId, route.preferences) },
    { label: "Accessibility Support Used", value: accessibilitySupport(route.preferences) },
    { label: "Optional Stops", value: optionalStopCount === 0 ? "None" : `${optionalStopCount} ${optionalStopCount === 1 ? "stop" : "stops"}` },
    { label: "Route Updates", value: "No Route Changes" }
  ];
  const feedbackOptions: Array<{ id: JourneyFeedback; emoji: string; label: string }> = [
    { id: "great", emoji: "😊", label: "Great" },
    { id: "good", emoji: "😐", label: "Good" },
    { id: "needs-improvement", emoji: "😕", label: "Needs Improvement" }
  ];

  return (
    <section className="route-experience-shell calm-arrival-shell" aria-labelledby="arrival-title">
      <article className="route-screen-card arrival-confirmation calm-arrival-card journey-complete-card">
        <div className="arrival-success-orb">
          <CheckCircle2 aria-hidden="true" />
        </div>
        <div className="route-screen-heading journey-complete-heading">
          <h1 id="arrival-title">Journey Complete</h1>
          <p>You have arrived at {destinationName}.</p>
        </div>

        <dl className="journey-complete-summary" aria-label="Journey summary">
          {summary.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        <fieldset className="journey-feedback">
          <legend>How was your journey?</legend>
          <div>
            {feedbackOptions.map((option) => (
              <button
                aria-pressed={feedback === option.id}
                key={option.id}
                onClick={() => setFeedback(option.id)}
                type="button"
              >
                <span aria-hidden="true">{option.emoji}</span>
                {option.label}
              </button>
            ))}
          </div>
          <span aria-live="polite" className="sr-only">
            {feedback ? `${feedbackOptions.find((option) => option.id === feedback)?.label} selected` : ""}
          </span>
        </fieldset>

        <div className="arrival-action-row journey-complete-actions">
          <button className="primary-action" onClick={onEnd} type="button">
            End Journey
          </button>
          <button className="secondary-action" onClick={onPlanAnotherRoute} type="button">
            Plan Another Route
          </button>
        </div>
      </article>
    </section>
  );
}
