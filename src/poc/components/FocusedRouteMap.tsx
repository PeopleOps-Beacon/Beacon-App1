import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  CheckCircle2,
  Clock,
  CornerUpLeft,
  CornerUpRight,
  Flag,
  LifeBuoy,
  Map as MapIcon,
  MoreHorizontal,
  Navigation,
  Pause,
  Play,
  RefreshCw,
  SkipBack,
  SkipForward
} from "lucide-react";
import {
  accessibilitySummary,
  maneuverForStep,
  relevantLandmarkName,
  routeProfileLabel,
  routeUpdateSummary,
  shortInstruction,
  zoneForLocation,
  type ManeuverKind,
  type NavigationViewMode
} from "../navigationExperience";
import { visualReferenceForStep } from "../landmarkVisuals";
import { formatDistance, locationName, routeCondition, routeExplanation } from "../routeDisplay";
import { contextualGuidanceForStep, type ContextualGuidance } from "../contextualGuidance";
import { flightLabel, type SimulatedFlight } from "../flightSimulations";
import type { AirportLocation, CalculatedRoute, RouteConnection, RouteStep } from "../types";
import { LandmarkVisual } from "./LandmarkVisual";
import { TerminalMap } from "./TerminalMap";

type FocusedRouteMapProps = {
  locations: AirportLocation[];
  connections: RouteConnection[];
  route: CalculatedRoute | null;
  startId: string | null;
  destinationId: string | null;
  currentLocationId: string | null;
  currentStep: RouteStep | null;
  activeStepIndex: number;
  flight: SimulatedFlight | null;
  onAlerts: () => void;
  onAssistance: () => void;
  onNext: () => void;
  onPrevious: () => void;
  presentationMode?: boolean;
};

type RouteUpdateState = "idle" | "updating" | "ready";

function ManeuverGlyph({ kind }: { kind: ManeuverKind }) {
  if (kind === "right") {
    return <CornerUpRight aria-hidden="true" />;
  }

  if (kind === "left") {
    return <CornerUpLeft aria-hidden="true" />;
  }

  if (kind === "security") {
    return <Navigation aria-hidden="true" />;
  }

  if (kind === "elevator") {
    return <Accessibility aria-hidden="true" />;
  }

  if (kind === "arrival") {
    return <Flag aria-hidden="true" />;
  }

  return <ArrowUp aria-hidden="true" />;
}

function guidanceLabel(kind: ManeuverKind): string {
  if (kind === "right") {
    return "Turn right";
  }

  if (kind === "left") {
    return "Turn left";
  }

  if (kind === "security") {
    return "Enter security";
  }

  if (kind === "elevator") {
    return "Use elevator";
  }

  if (kind === "arrival") {
    return "Arrive";
  }

  return "Continue";
}

function DestinationStatus({
  activeStepIndex,
  destinationName,
  flight,
  minutes,
  currentZone,
  totalSteps
}: {
  activeStepIndex: number;
  destinationName: string;
  flight: SimulatedFlight | null;
  minutes: number | null;
  currentZone: string;
  totalSteps: number;
}) {
  const currentStepNumber = totalSteps > 0 ? Math.min(totalSteps, activeStepIndex + 1) : 0;
  const progress = totalSteps > 0 ? (currentStepNumber / totalSteps) * 100 : 0;
  const selectedFlightLabel = flightLabel(flight);
  const destinationLabel = selectedFlightLabel ?? "Destination";
  const destinationTitle = flight?.gateLabel ?? destinationName;
  const statusDetail = flight ? `Boarding ${flight.boardingTime} · ${flight.status}` : currentZone;

  return (
    <section className="destination-status-card" aria-label="Destination status">
      <div>
        <span>{destinationLabel}</span>
        <h1>{destinationTitle}</h1>
        <small>{statusDetail}</small>
      </div>
      <div className="destination-time">
        <Clock aria-hidden="true" />
        <strong>{minutes ? `${minutes} min` : "--"}</strong>
        <small>remaining</small>
      </div>
      <div className="journey-step-progress" aria-label={`Step ${currentStepNumber} of ${totalSteps}`}>
        <span>{totalSteps > 0 ? `Step ${currentStepNumber} of ${totalSteps}` : "Route ready"}</span>
        <i>
          <b style={{ width: `${progress}%` }} />
        </i>
      </div>
      <p>{flight ? currentZone : "Beacon guidance"}</p>
    </section>
  );
}

function PrimaryInstruction({
  step,
  landmarkName,
  maneuverKind
}: {
  step: RouteStep | null;
  landmarkName: string;
  maneuverKind: ManeuverKind;
}) {
  return (
    <section className="primary-instruction-card" aria-label="Next instruction">
      <div className={`maneuver-orb ${maneuverKind}`}>
        <ManeuverGlyph kind={maneuverKind} />
      </div>
      <div className="instruction-copy">
        <span>{guidanceLabel(maneuverKind)}</span>
        <h2>{shortInstruction(step)}</h2>
        <p>{step ? formatDistance(step.distanceFeet) : "--"} to next action</p>
        <strong>{landmarkName}</strong>
      </div>
    </section>
  );
}

function ContextAlert({
  guidance,
  route,
  routeUpdateState
}: {
  guidance: ContextualGuidance | null;
  route: CalculatedRoute | null;
  routeUpdateState: RouteUpdateState;
}) {
  if (routeUpdateState === "updating") {
    return (
      <div className="single-route-alert updating" role="status">
        <RefreshCw aria-hidden="true" />
        <span>
          <strong>Updating your route</strong>
          <small>Checking crowd levels and calmer corridors.</small>
        </span>
      </div>
    );
  }

  if (routeUpdateState === "ready") {
    const message =
      route?.preferences.includes("wheelchair") || route?.preferences.includes("avoidStairs")
        ? "A step-free route is ready."
        : "A quieter route is ready.";
    return (
      <div className="single-route-alert ready" role="status">
        <CheckCircle2 aria-hidden="true" />
        <span>
          <strong>{message}</strong>
          <small>{routeUpdateSummary(route)}</small>
        </span>
      </div>
    );
  }

  if (!guidance) {
    return (
      <div className="single-route-alert clear" role="status">
        <CheckCircle2 aria-hidden="true" />
        <span>
          <strong>Your current route remains clear.</strong>
        </span>
      </div>
    );
  }

  return (
    <div className={`single-route-alert ${guidance.severity}`} role="status">
      <Bell aria-hidden="true" />
      <span>
        <strong>{guidance.title}</strong>
        <small>{guidance.category}</small>
        <small>{guidance.message}</small>
      </span>
    </div>
  );
}

function WhatToExpectCard({
  currentStep,
  nextStep,
  onFullRoute,
  route,
  routeUpdateState
}: {
  currentStep: RouteStep | null;
  nextStep: RouteStep | null;
  onFullRoute: () => void;
  route: CalculatedRoute | null;
  routeUpdateState: RouteUpdateState;
}) {
  const visual = visualReferenceForStep(currentStep, routeUpdateState, route);
  const nextVisual = nextStep ? visualReferenceForStep(nextStep, "idle", route) : null;
  const preloadSrc = nextVisual?.imageSrc && nextVisual.imageSrc !== visual.imageSrc ? nextVisual.imageSrc : null;

  return (
    <section className="what-to-expect-card" aria-label="What you will see">
      <div className="expect-card-heading">
        <span>What you will see</span>
        <button className="inline-map-button" onClick={onFullRoute} type="button">
          <MapIcon aria-hidden="true" />
          View Map
        </button>
      </div>
      <LandmarkVisual turnDirection={currentStep?.turnDirection} visual={visual} />
      {preloadSrc ? (
        <span aria-hidden="true" className="visual-preload-cache">
          <img alt="" decoding="async" src={preloadSrc} />
        </span>
      ) : null}
      <div className="expect-copy">
        <strong>{visual.title}</strong>
        <p>{visual.recognitionCue}</p>
        <span className="sr-only">{visual.accessibilityDescription}</span>
        <small className="visual-authenticity-label">{visual.authenticityLabel}</small>
        {routeUpdateState !== "idle" ? (
          <small>{routeUpdateState === "updating" ? "Updating preview" : "Preview updated"}</small>
        ) : null}
      </div>
    </section>
  );
}

function NavigationActions({
  activeView,
  onAssistance,
  onFullRoute,
  onMore
}: {
  activeView: NavigationViewMode;
  onAssistance: () => void;
  onFullRoute: () => void;
  onMore: () => void;
}) {
  return (
    <nav className="simple-navigation-actions" aria-label="Navigation actions">
      <button
        aria-pressed={activeView === "overview"}
        className={activeView === "overview" ? "active" : ""}
        onClick={onFullRoute}
        type="button"
      >
        <MapIcon aria-hidden="true" />
        View Route
      </button>
      <button onClick={onAssistance} type="button">
        <LifeBuoy aria-hidden="true" />
        Request Assistance
      </button>
      <button
        aria-pressed={activeView === "steps"}
        className={activeView === "steps" ? "active" : ""}
        onClick={onMore}
        type="button"
      >
        <MoreHorizontal aria-hidden="true" />
        More
      </button>
    </nav>
  );
}

function StepNavigationControls({
  canGoBack,
  isLastStep,
  onNext,
  onPrevious
}: {
  canGoBack: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onPrevious: () => void;
}) {
  return (
    <nav className="step-navigation-controls" aria-label="Step navigation controls">
      <button disabled={!canGoBack} onClick={onPrevious} type="button">
        <ArrowLeft aria-hidden="true" />
        Back
      </button>
      <button className="gold next-step-action" onClick={onNext} type="button">
        <ArrowRight aria-hidden="true" />
        {isLastStep ? "I Am Here" : "Next Step"}
      </button>
    </nav>
  );
}

function GuidedDemoController({
  demoRunning,
  onDemoToggle,
  onNext,
  onPrevious,
  onRouteUpdate,
  routeUpdateState
}: {
  demoRunning: boolean;
  onDemoToggle: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRouteUpdate: () => void;
  routeUpdateState: RouteUpdateState;
}) {
  return (
    <section className="guided-demo-controller" aria-label="Guided demo controls">
      <span>GSP demo</span>
      <div>
        <button aria-label="Rewind demo" onClick={onPrevious} type="button">
          <SkipBack aria-hidden="true" />
          Back
        </button>
        <button aria-label={demoRunning ? "Pause demo" : "Start demo"} className="gold" onClick={onDemoToggle} type="button">
          {demoRunning ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {demoRunning ? "Pause" : "Play"}
        </button>
        <button aria-label="Advance demo" onClick={onNext} type="button">
          <SkipForward aria-hidden="true" />
          Next
        </button>
        <button aria-label="Demonstrate route update" onClick={onRouteUpdate} type="button">
          <RefreshCw aria-hidden="true" />
          Update
        </button>
      </div>
      {routeUpdateState !== "idle" ? (
        <p>{routeUpdateState === "updating" ? "Updating your route." : "A calmer route is ready."}</p>
      ) : null}
    </section>
  );
}

function GuidanceView({
  activeStepIndex,
  currentLocationId,
  currentStep,
  destinationId,
  destinationName,
  flight,
  locations,
  route,
  routeUpdateState,
  onFullRoute,
  onNext,
  onPrevious
}: {
  activeStepIndex: number;
  currentLocationId: string | null;
  currentStep: RouteStep | null;
  destinationId: string | null;
  destinationName: string;
  flight: SimulatedFlight | null;
  locations: AirportLocation[];
  route: CalculatedRoute | null;
  routeUpdateState: RouteUpdateState;
  onFullRoute: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const remainingMinutes = route
    ? Math.max(
        1,
        route.steps.slice(activeStepIndex).reduce((total, step) => total + Math.max(1, Math.round(step.distanceFeet / 220)), 0)
      )
    : null;
  const maneuverKind = maneuverForStep(currentStep);
  const currentLocation = locations.find((location) => location.id === (currentLocationId ?? currentStep?.from)) ?? null;
  const landmarkName = relevantLandmarkName(currentStep, locations);
  const guidance = routeUpdateState === "idle"
    ? contextualGuidanceForStep({ route, activeStepIndex, locations, destinationId, flight })
    : null;
  const totalSteps = route?.steps.length ?? 0;

  return (
    <>
      <DestinationStatus
        activeStepIndex={activeStepIndex}
        currentZone={zoneForLocation(currentLocation)}
        destinationName={destinationName}
        flight={flight}
        minutes={remainingMinutes}
        totalSteps={totalSteps}
      />
      <PrimaryInstruction landmarkName={landmarkName} maneuverKind={maneuverKind} step={currentStep} />
      <WhatToExpectCard
        currentStep={currentStep}
        nextStep={route?.steps[activeStepIndex + 1] ?? null}
        onFullRoute={onFullRoute}
        route={route}
        routeUpdateState={routeUpdateState}
      />
      <ContextAlert guidance={guidance} route={route} routeUpdateState={routeUpdateState} />
      <StepNavigationControls
        canGoBack={activeStepIndex > 0}
        isLastStep={totalSteps > 0 && activeStepIndex >= totalSteps - 1}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    </>
  );
}

function FullRouteView({
  connections,
  currentLocationId,
  currentStep,
  destinationId,
  flight,
  locations,
  onAssistance,
  onBack,
  onSteps,
  route,
  routeUpdateState,
  showAccessibilityLayer,
  startId
}: {
  connections: RouteConnection[];
  currentLocationId: string | null;
  currentStep: RouteStep | null;
  destinationId: string | null;
  flight: SimulatedFlight | null;
  locations: AirportLocation[];
  onAssistance: () => void;
  onBack: () => void;
  onSteps: () => void;
  route: CalculatedRoute | null;
  routeUpdateState: RouteUpdateState;
  showAccessibilityLayer: boolean;
  startId: string | null;
}) {
  const condition = routeCondition(route);
  const destinationName = flight?.gateLabel ?? locationName(locations, destinationId);

  return (
    <section className="route-detail-view" aria-label="Full route">
      <div className="detail-view-header">
        <button className="back-to-guidance" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" />
          Guidance
        </button>
        <div>
          <span>Full route</span>
          <h1>{destinationName}</h1>
          <p>{routeExplanation(route?.preferences ?? [])}</p>
        </div>
      </div>
      <div className="focused-map-stage overview-stage" style={{ "--map-zoom": 1 } as CSSProperties}>
        <TerminalMap
          adaptiveState={routeUpdateState}
          connections={connections}
          currentLocationId={currentLocationId ?? undefined}
          currentStep={currentStep}
          displayMode="full"
          locations={locations}
          mapView="fullRoute"
          route={route}
          selectedDestinationId={destinationId ?? undefined}
          selectedStartId={startId ?? undefined}
          showAccessibilityLayer={showAccessibilityLayer}
          showCaption={false}
          showConditions
        />
      </div>
      <div className="route-detail-summary" aria-label="Route details">
        <article>
          <CheckCircle2 aria-hidden="true" />
          <span>
            <strong>{routeProfileLabel(route)}</strong>
            <small>{accessibilitySummary(route)}</small>
          </span>
        </article>
        <article>
          <Bell aria-hidden="true" />
          <span>
            <strong>{condition.title}</strong>
            <small>{condition.message}</small>
          </span>
        </article>
      </div>
      <NavigationActions activeView="overview" onAssistance={onAssistance} onFullRoute={onBack} onMore={onSteps} />
    </section>
  );
}

function StepsView({
  activeStepIndex,
  locations,
  onAssistance,
  onBack,
  onNext,
  onPrevious,
  onRouteAlerts,
  route
}: {
  activeStepIndex: number;
  locations: AirportLocation[];
  onAssistance: () => void;
  onBack: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRouteAlerts: () => void;
  route: CalculatedRoute | null;
}) {
  return (
    <section className="route-detail-view step-list-view" aria-label="All route steps">
      <div className="detail-view-header">
        <button className="back-to-guidance" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" />
          Guidance
        </button>
        <div>
          <span>All steps</span>
          <h1>Landmark directions</h1>
          <p>Use this list when you want written directions without studying the map.</p>
        </div>
      </div>

      <ol className="enterprise-step-list">
        {(route?.steps ?? []).map((step, index) => {
          const status = index < activeStepIndex ? "completed" : index === activeStepIndex ? "active" : "upcoming";
          return (
            <li className={status} key={step.id}>
              <span>{index + 1}</span>
              <div>
                <strong>{shortInstruction(step)}</strong>
                <p>
                  {formatDistance(step.distanceFeet)}. Landmark: {relevantLandmarkName(step, locations)}
                </p>
                {step.accessibilityNote ? <em>{step.accessibilityNote}</em> : null}
                {step.reassurance ? <em>{step.reassurance}</em> : null}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="step-list-controls" aria-label="Step controls">
        <button onClick={onPrevious} type="button">
          <SkipBack aria-hidden="true" />
          Previous
        </button>
        <button className="gold" onClick={onNext} type="button">
          <ArrowRight aria-hidden="true" />
          Next Step
        </button>
        <button onClick={onRouteAlerts} type="button">
          <Bell aria-hidden="true" />
          Alerts
        </button>
      </div>
      <NavigationActions activeView="steps" onAssistance={onAssistance} onFullRoute={onBack} onMore={onBack} />
    </section>
  );
}

export function FocusedRouteMap({
  locations,
  connections,
  route,
  startId,
  destinationId,
  currentLocationId,
  currentStep,
  activeStepIndex,
  flight,
  onAlerts,
  onAssistance,
  onNext,
  onPrevious,
  presentationMode = false
}: FocusedRouteMapProps) {
  const [viewMode, setViewMode] = useState<NavigationViewMode>("guidance");
  const [showAccessibilityLayer, setShowAccessibilityLayer] = useState(false);
  const [routeUpdateState, setRouteUpdateState] = useState<RouteUpdateState>("idle");
  const [demoRunning, setDemoRunning] = useState(false);
  const routeUpdateTimer = useRef<number | null>(null);
  const totalSteps = route?.steps.length ?? 0;
  const currentLocation = useMemo(
    () => locations.find((location) => location.id === (currentLocationId ?? currentStep?.from)) ?? null,
    [currentLocationId, currentStep?.from, locations]
  );
  const destinationName = locationName(locations, destinationId);

  const simulateRouteUpdate = useCallback(() => {
    setViewMode("guidance");
    setRouteUpdateState("updating");
    setShowAccessibilityLayer(true);
    if (routeUpdateTimer.current) {
      window.clearTimeout(routeUpdateTimer.current);
    }
    routeUpdateTimer.current = window.setTimeout(() => {
      setRouteUpdateState("ready");
    }, 900);
  }, []);

  useEffect(
    () => () => {
      if (routeUpdateTimer.current) {
        window.clearTimeout(routeUpdateTimer.current);
      }
    },
    []
  );

  useEffect(() => {
    if (presentationMode) {
      setDemoRunning(true);
    }
  }, [presentationMode]);

  useEffect(() => {
    if (presentationMode && activeStepIndex >= 1 && routeUpdateState === "idle") {
      simulateRouteUpdate();
    }
  }, [activeStepIndex, presentationMode, routeUpdateState, simulateRouteUpdate]);

  useEffect(() => {
    if (!demoRunning || !route || totalSteps === 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      if (activeStepIndex >= totalSteps - 1) {
        setDemoRunning(false);
        onNext();
        return;
      }
      onNext();
    }, 2600);

    return () => window.clearInterval(timer);
  }, [activeStepIndex, demoRunning, onNext, route, totalSteps]);

  return (
    <section
      className={`beacon-navigation-shell calm-navigation-shell route-experience-shell${
        viewMode === "guidance" ? " guidance-active" : ""
      }`}
      aria-label="Beacon navigation"
    >
      <div className="navigation-phone-frame">
        <div className="navigation-frame-status" aria-label="Current airport area">
          <span>{zoneForLocation(currentLocation)}</span>
          <span>{routeProfileLabel(route)}</span>
        </div>

        {viewMode === "guidance" ? (
          <GuidanceView
            activeStepIndex={activeStepIndex}
            currentLocationId={currentLocationId}
            currentStep={currentStep}
            destinationId={destinationId}
            destinationName={destinationName}
            flight={flight}
            locations={locations}
            onFullRoute={() => setViewMode("overview")}
            onNext={onNext}
            onPrevious={onPrevious}
            route={route}
            routeUpdateState={routeUpdateState}
          />
        ) : null}

        {viewMode === "overview" ? (
          <FullRouteView
            connections={connections}
            currentLocationId={currentLocationId}
            currentStep={currentStep}
            destinationId={destinationId}
            flight={flight}
            locations={locations}
            onAssistance={onAssistance}
            onBack={() => setViewMode("guidance")}
            onSteps={() => setViewMode("steps")}
            route={route}
            routeUpdateState={routeUpdateState}
            showAccessibilityLayer={showAccessibilityLayer}
            startId={startId}
          />
        ) : null}

        {viewMode === "steps" ? (
          <StepsView
            activeStepIndex={activeStepIndex}
            locations={locations}
            onAssistance={onAssistance}
            onBack={() => setViewMode("guidance")}
            onNext={onNext}
            onPrevious={onPrevious}
            onRouteAlerts={onAlerts}
            route={route}
          />
        ) : null}

        {presentationMode ? (
          <GuidedDemoController
            demoRunning={demoRunning}
            onDemoToggle={() => setDemoRunning((value) => !value)}
            onNext={onNext}
            onPrevious={onPrevious}
            onRouteUpdate={simulateRouteUpdate}
            routeUpdateState={routeUpdateState}
          />
        ) : null}
      </div>
    </section>
  );
}
