import { ArrowLeft, ArrowRight, Bell, LifeBuoy, Map, Navigation } from "lucide-react";
import { formatDistance } from "../routeDisplay";
import type { RouteStep } from "../types";
import { NavigationProgress } from "./NavigationProgress";

type NavigationInstructionProps = {
  step: RouteStep | null;
  stepIndex: number;
  totalSteps: number;
  destinationName: string;
  estimatedMinutes: number | null;
  hasAlerts: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onMap: () => void;
  onAlerts: () => void;
  onAssistance: () => void;
};

export function NavigationInstruction({
  step,
  stepIndex,
  totalSteps,
  destinationName,
  estimatedMinutes,
  hasAlerts,
  onPrevious,
  onNext,
  onMap,
  onAlerts,
  onAssistance
}: NavigationInstructionProps) {
  const isLastStep = stepIndex >= totalSteps - 1;

  return (
    <section className="route-experience-shell" aria-labelledby="navigation-title">
      <article className="route-screen-card navigation-instruction-card">
        <div className="route-screen-heading">
          <p className="eyebrow">Step by step navigation</p>
          <h1 id="navigation-title">{destinationName}</h1>
        </div>

        {step ? (
          <>
            <NavigationProgress currentStep={stepIndex + 1} totalSteps={totalSteps} />

            <div className="direction-focus">
              <Navigation aria-hidden="true" />
              <h2>{step.instruction}</h2>
              <p>Continue for {formatDistance(step.distanceFeet)}.</p>
              <div className="instruction-context">
                <span>Landmark: {step.landmark}</span>
                <span>{estimatedMinutes ? `${estimatedMinutes} min remaining` : "Time updates as you move"}</span>
                {step.accessibilityNote ? <span>{step.accessibilityNote}</span> : null}
              </div>
              {step.reassurance ? <strong>{step.reassurance}</strong> : null}
            </div>

            <div className="navigation-action-grid" aria-label="Navigation actions">
              <button className="secondary-action" onClick={onPrevious} type="button">
                <ArrowLeft aria-hidden="true" />
                Previous
              </button>
              <button className="secondary-action" onClick={onMap} type="button">
                <Map aria-hidden="true" />
                Map
              </button>
              <button className="secondary-action" onClick={onAssistance} type="button">
                <LifeBuoy aria-hidden="true" />
                Request Assistance
              </button>
              {hasAlerts ? (
                <button className="secondary-action" onClick={onAlerts} type="button">
                  <Bell aria-hidden="true" />
                  Alerts
                </button>
              ) : null}
            </div>

            <button className="primary-action wide-action" onClick={onNext} type="button">
              {isLastStep ? "Confirm Arrival" : "Next Step"}
              <ArrowRight aria-hidden="true" />
            </button>
          </>
        ) : (
          <p className="form-error" role="alert">
            Generate a route before starting navigation.
          </p>
        )}
      </article>
    </section>
  );
}
