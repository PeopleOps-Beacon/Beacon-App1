import { useEffect, useMemo, useState } from "react";
import { AdminDashboard } from "./components/AdminDashboard";
import { ExecutiveInsights } from "./components/ExecutiveInsights";
import {
  accessibilityStatus as initialAccessibilityStatus,
  airportLocations,
  assistanceRequests as initialAssistanceRequests,
  mockAlerts,
  preferenceLabels,
  routeConnections,
  simulatedExecutiveInsights,
  travelerProfiles
} from "./mockData";
import { calculateRoute } from "./routeEngine";
import type {
  AccessibilityStatus,
  AirportLocation,
  AssistanceRequest,
  ContextualAlert,
  PreferenceId,
  RouteConnection,
  TravelerProfileId
} from "./types";
import "./beacon-poc.css";
import { ArrivalConfirmation } from "./components/ArrivalConfirmation";
import { AssistanceMenu } from "./components/AssistanceMenu";
import { ContextualAlerts } from "./components/ContextualAlerts";
import { FocusedRouteMap } from "./components/FocusedRouteMap";
import { RouteSummary } from "./components/RouteSummary";
import { presentationJourneys, type PresentationJourney } from "./navigationExperience";
import { locationName } from "./routeDisplay";
import { MobileAppShell } from "./mobile/MobileAppShell";
import { MobileHomeScreen } from "./mobile/MobileHomeScreen";
import { MobileLocationSelectionScreen } from "./mobile/MobileLocationSelectionScreen";
import { MobileTravelerSupportScreen } from "./mobile/MobileTravelerSupportScreen";
import { triggerHaptic } from "./mobile/mobileInteractions";
import type { MobileTabId } from "./mobile/BeaconTabNavigator";
import { personalizeRouteForFlight, simulatedFlights, type SimulatedFlight } from "./flightSimulations";

type AppScreen =
  | "welcome"
  | "start"
  | "destination"
  | "preferences"
  | "route"
  | "navigate"
  | "map"
  | "alerts"
  | "assistance"
  | "arrival"
  | "admin"
  | "executive-insights";
type PassengerOnlyScreen = Exclude<AppScreen, "admin" | "executive-insights">;

const beaconLogoSrc = "/brand/beacon-logo-optimized.webp";
const beaconMarkSrc = "/brand/beacon-mark-optimized.webp";

const selectableLocationIds = [
  "parking-garage",
  "main-entrance",
  "ticket-counter",
  "security-checkpoint",
  "concourse-entrance",
  "gate-a1",
  "gate-a12",
  "gate-a2",
  "gate-b1",
  "gate-b2",
  "restroom",
  "baggage-claim",
  "ground-transportation",
  "quiet-space",
  "nursing-room",
  "information-desk"
];

const preferenceGroups: Array<{ title: string; preferences: PreferenceId[] }> = [
  { title: "Mobility", preferences: ["wheelchair", "avoidStairs"] },
  { title: "Sensory Comfort", preferences: ["reducedStimulation", "avoidCrowds", "quietStop"] },
  { title: "Vision and Reading", preferences: ["largerText"] },
  { title: "Cognitive Support", preferences: ["simplifiedDirections", "reassurance"] },
  { title: "Time and Pace", preferences: ["additionalTime", "restroomStop"] }
];

const passengerSessionKey = "beacon-passenger-mobile-session";

type PassengerSession = {
  activeStepIndex: number;
  destinationId: string | null;
  preferences: PreferenceId[];
  presentationMode: boolean;
  profileId: TravelerProfileId;
  returnScreen: PassengerOnlyScreen;
  screen: PassengerOnlyScreen;
  showAllAlerts: boolean;
  startId: string | null;
  selectedFlightId: string | null;
};

function selectedLocations(locations: AirportLocation[]): AirportLocation[] {
  return selectableLocationIds
    .map((id) => locations.find((location) => location.id === id))
    .filter((location): location is AirportLocation => Boolean(location));
}

function readPassengerSession(): Partial<PassengerSession> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawSession = window.sessionStorage.getItem(passengerSessionKey);
    return rawSession ? (JSON.parse(rawSession) as Partial<PassengerSession>) : {};
  } catch {
    return {};
  }
}

function normalizePassengerScreen(screen: Partial<PassengerSession>["screen"]): PassengerOnlyScreen {
  const validScreens: PassengerOnlyScreen[] = [
    "welcome",
    "start",
    "destination",
    "preferences",
    "route",
    "navigate",
    "map",
    "alerts",
    "assistance",
    "arrival"
  ];

  return screen && validScreens.includes(screen) ? screen : "welcome";
}

function writePassengerSession(session: PassengerSession) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(passengerSessionKey, JSON.stringify(session));
  } catch {
    // Session persistence should never block guidance.
  }
}

export function BeaconWayfindingApp() {
  const savedSession = readPassengerSession();
  const [screen, setScreen] = useState<AppScreen>(normalizePassengerScreen(savedSession.screen));
  const [returnScreen, setReturnScreen] = useState<PassengerOnlyScreen>(
    normalizePassengerScreen(savedSession.returnScreen)
  );
  const [locations, setLocations] = useState<AirportLocation[]>(airportLocations);
  const [connections, setConnections] = useState<RouteConnection[]>(routeConnections);
  const [alerts, setAlerts] = useState<ContextualAlert[]>(mockAlerts);
  const [assistanceRequests, setAssistanceRequests] = useState<AssistanceRequest[]>(initialAssistanceRequests);
  const [accessibilityStatus, setAccessibilityStatus] = useState<AccessibilityStatus>(initialAccessibilityStatus);
  const [startId, setStartId] = useState<string | null>(savedSession.startId ?? null);
  const [destinationId, setDestinationId] = useState<string | null>(savedSession.destinationId ?? null);
  const [preferences, setPreferences] = useState<PreferenceId[]>(savedSession.preferences ?? []);
  const [profileId, setProfileId] = useState<TravelerProfileId>(savedSession.profileId ?? "standard");
  const [activeStepIndex, setActiveStepIndex] = useState(savedSession.activeStepIndex ?? 0);
  const [showAllAlerts, setShowAllAlerts] = useState(savedSession.showAllAlerts ?? false);
  const [submittedAssistanceType, setSubmittedAssistanceType] = useState<string | null>(null);
  const [presentationMode, setPresentationMode] = useState(savedSession.presentationMode ?? false);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(savedSession.selectedFlightId ?? null);

  const passengerLocations = useMemo(() => selectedLocations(locations), [locations]);
  const selectedFlight = useMemo(
    () => simulatedFlights.find((flight) => flight.id === selectedFlightId) ?? null,
    [selectedFlightId]
  );
  const routeResult = useMemo(() => {
    if (!startId || !destinationId || startId === destinationId) {
      return { route: null, error: null };
    }

    try {
      return {
        route: personalizeRouteForFlight(calculateRoute({
          startId,
          destinationId,
          preferences,
          locations,
          connections,
          alerts
        }), selectedFlight),
        error: null
      };
    } catch (error) {
      return {
        route: null,
        error: error instanceof Error ? error.message : "Beacon could not create this route."
      };
    }
  }, [alerts, connections, destinationId, locations, preferences, selectedFlight, startId]);

  const route = routeResult.route;
  const routeError = routeResult.error;
  const largerTextEnabled = preferences.includes("largerText");
  const currentNavigationStep = route?.steps[activeStepIndex] ?? null;
  const destinationName = locationName(locations, destinationId);
  const currentRouteLocationId = currentNavigationStep?.from ?? startId;
  const currentLocationName = currentNavigationStep
    ? locationName(locations, currentNavigationStep.from)
    : screen === "arrival"
      ? destinationName
      : locationName(locations, startId);
  const activeProfile = travelerProfiles.find((item) => item.id === profileId);

  useEffect(() => {
    if (screen === "admin" || screen === "executive-insights") {
      return;
    }

    writePassengerSession({
      activeStepIndex,
      destinationId,
      preferences,
      presentationMode,
      profileId,
      returnScreen,
      screen,
      selectedFlightId,
      showAllAlerts,
      startId
    });
  }, [
    activeStepIndex,
    destinationId,
    preferences,
    presentationMode,
    profileId,
    returnScreen,
    screen,
    selectedFlightId,
    showAllAlerts,
    startId
  ]);

  useEffect(() => {
    function resetScrollPosition() {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (navigator.userAgent.toLowerCase().includes("jsdom")) {
        return;
      }
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } catch {
        // Some test environments do not implement scrolling.
      }
    }

    let frame = 0;
    let timeout = 0;
    resetScrollPosition();
    frame = window.requestAnimationFrame(resetScrollPosition);
    timeout = window.setTimeout(resetScrollPosition, 50);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [screen]);

  function togglePreference(preference: PreferenceId) {
    setPreferences((current) =>
      current.includes(preference) ? current.filter((item) => item !== preference) : [...current, preference]
    );
    setProfileId("custom");
  }

  function applyProfile(nextProfileId: TravelerProfileId) {
    const profile = travelerProfiles.find((item) => item.id === nextProfileId);
    if (!profile) {
      return;
    }
    setProfileId(nextProfileId);
    setPreferences(profile.preferences);
  }

  function goHome() {
    setScreen("welcome");
  }

  function openAssistance() {
    if (screen !== "admin" && screen !== "executive-insights" && screen !== "assistance") {
      setReturnScreen(screen);
    }
    setSubmittedAssistanceType(null);
    setScreen("assistance");
  }

  function returnFromAssistance() {
    setSubmittedAssistanceType(null);
    setScreen(returnScreen);
  }

  function submitAssistance(requestType: string) {
    const request: AssistanceRequest = {
      id: `assist-${Date.now()}`,
      travelerLocation: currentLocationName,
      requestType,
      submittedAt: new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit"
      }).format(new Date()),
      priority: requestType.includes("Emergency") || requestType.includes("Security") ? "Critical" : "Medium",
      status: "New",
      assignedStaff: "Unassigned"
    };

    setAssistanceRequests((current) => [request, ...current]);
    setSubmittedAssistanceType(requestType);
  }

  function showRouteResults() {
    if (!startId) {
      setScreen("start");
      return;
    }

    if (!destinationId || startId === destinationId) {
      setScreen("destination");
      return;
    }

    setActiveStepIndex(0);
    setShowAllAlerts(false);
    setPresentationMode(false);
    setScreen("route");
  }

  function selectFlight(flight: SimulatedFlight) {
    setSelectedFlightId(flight.id);
    setStartId((current) => current ?? flight.startId);
    setDestinationId(flight.gateId);
    setProfileId(flight.profileId);
    setPreferences(flight.preferences);
    setActiveStepIndex(0);
    setShowAllAlerts(false);
    triggerHaptic("light");
    setScreen("preferences");
  }

  function beginNavigation() {
    setActiveStepIndex(0);
    triggerHaptic("success");
    setScreen("navigate");
  }

  function startPresentationJourney(journey: PresentationJourney) {
    setStartId(journey.startId);
    setDestinationId(journey.destinationId);
    setSelectedFlightId(journey.flightId ?? null);
    setPreferences(journey.preferences);
    setProfileId(journey.profileId);
    setActiveStepIndex(0);
    setShowAllAlerts(false);
    setPresentationMode(true);
    triggerHaptic("success");
    setScreen("route");
  }

  function showPreviousStep() {
    if (activeStepIndex === 0) {
      return;
    }

    setActiveStepIndex((index) => Math.max(0, index - 1));
  }

  function showNextStep() {
    if (!route) {
      return;
    }

    if (activeStepIndex >= route.steps.length - 1) {
      triggerHaptic("success");
      setScreen("arrival");
      return;
    }

    triggerHaptic("light");
    setActiveStepIndex((index) => Math.min(route.steps.length - 1, index + 1));
  }

  function endNavigation() {
    setStartId(null);
    setDestinationId(null);
    setPreferences([]);
    setProfileId("standard");
    setActiveStepIndex(0);
    setShowAllAlerts(false);
    setPresentationMode(false);
    setSelectedFlightId(null);
    setScreen("welcome");
  }

  function activeBottomItem(): MobileTabId {
    if (screen === "assistance") {
      return "help";
    }
    if (screen === "start" || screen === "destination" || screen === "preferences") {
      return "plan";
    }
    if (screen === "route" || screen === "navigate" || screen === "map" || screen === "alerts" || screen === "arrival") {
      return "journey";
    }
    return "home";
  }

  function goToPlanFromTab() {
    setPresentationMode(false);
    setScreen("start");
  }

  function goToJourneyFromTab() {
    if (route) {
      setScreen("navigate");
      return;
    }
    setScreen("start");
  }

  if (screen === "admin") {
    return (
      <div className={`beacon-poc ${largerTextEnabled ? "large-text" : ""}`}>
        <AdminDashboard
          accessibilityStatus={accessibilityStatus}
          alerts={alerts}
          assistanceRequests={assistanceRequests}
          connections={connections}
          locations={locations}
          route={route}
          onAccessibilityStatusChange={setAccessibilityStatus}
          onAlertsChange={setAlerts}
          onAssistanceRequestsChange={setAssistanceRequests}
          onBack={() => setScreen("welcome")}
          onConnectionsChange={setConnections}
          onExecutiveInsights={() => setScreen("executive-insights")}
          onLocationsChange={setLocations}
        />
        <Footer />
      </div>
    );
  }

  if (screen === "executive-insights") {
    return (
      <div className={`beacon-poc ${largerTextEnabled ? "large-text" : ""}`}>
        <ExecutiveInsights insights={simulatedExecutiveInsights} onBack={() => setScreen("admin")} />
        <Footer />
      </div>
    );
  }

  const journeyActive = screen === "route" || screen === "navigate" || screen === "arrival";
  const hideMobileTabs = screen === "navigate" || screen === "arrival";

  return (
    <div
      className={`beacon-poc beacon-mobile-app ${largerTextEnabled ? "large-text" : ""} ${
        journeyActive ? "journey-active" : ""
      }`}
    >
      <MobileAppShell
        activeTab={activeBottomItem()}
        beaconMarkSrc={beaconMarkSrc}
        hideTabs={hideMobileTabs}
        onAdmin={() => setScreen("admin")}
        onHelp={openAssistance}
        onHome={goHome}
        onJourney={goToJourneyFromTab}
        onPlan={goToPlanFromTab}
        routeActive={journeyActive}
      >
        {screen === "welcome" ? (
          <MobileHomeScreen
            activeRoute={route}
            beaconLogoSrc={beaconLogoSrc}
            destinationId={destinationId}
            flight={selectedFlight}
            locations={locations}
            onAssistance={openAssistance}
            onPlan={goToPlanFromTab}
            onResumeJourney={goToJourneyFromTab}
            onStartPresentationJourney={startPresentationJourney}
            presentationJourneys={presentationJourneys}
            profile={activeProfile}
            startId={startId}
          />
        ) : null}

        {screen === "start" ? (
          <MobileLocationSelectionScreen
            description="Choose the place Beacon should meet you."
            locations={passengerLocations}
            onSelect={(locationId) => {
              setStartId(locationId);
              if (destinationId === locationId) {
                setDestinationId(null);
              }
              triggerHaptic("light");
              setScreen("destination");
            }}
            selectedId={startId}
            stepLabel="Step 1 of 4"
            title="Where are you now?"
          />
        ) : null}

        {screen === "destination" ? (
          <>
            <MobileLocationSelectionScreen
              description="Choose the place Beacon should guide you toward."
              disabledId={startId}
              flights={simulatedFlights}
              locations={passengerLocations}
              onSelect={(locationId) => {
                setSelectedFlightId(null);
                setDestinationId(locationId);
                triggerHaptic("light");
                setScreen("preferences");
              }}
              onSelectFlight={selectFlight}
              selectedId={destinationId}
              selectedFlightId={selectedFlightId}
              stepLabel="Step 2 of 4"
              title="Where are you going?"
            />
            {!startId ? (
              <p className="form-error" role="alert">
                Select a starting point before choosing a destination.
              </p>
            ) : null}
          </>
        ) : null}

        {screen === "preferences" ? (
          <MobileTravelerSupportScreen
            onApplyProfile={applyProfile}
            onBack={() => setScreen("destination")}
            onPrepareRoute={showRouteResults}
            onSelectCustom={() => setProfileId("custom")}
            onTogglePreference={togglePreference}
            preferenceGroups={preferenceGroups}
            preferenceLabels={preferenceLabels}
            preferences={preferences}
            profileId={profileId}
            routeError={routeError}
            travelerProfiles={travelerProfiles}
          />
        ) : null}

        {screen === "route" ? (
          <RouteSummary
            connections={connections}
            destinationId={destinationId}
            flight={selectedFlight}
            locations={locations}
            onBegin={beginNavigation}
            onModify={() => {
              setPresentationMode(false);
              setScreen("preferences");
            }}
            presentationMode={presentationMode}
            preferences={preferences}
            profileId={profileId}
            route={route}
            routeError={routeError}
            startId={startId}
          />
        ) : null}

        {screen === "navigate" ? (
          <FocusedRouteMap
            activeStepIndex={activeStepIndex}
            connections={connections}
            currentLocationId={currentRouteLocationId}
            currentStep={currentNavigationStep}
            destinationId={destinationId}
            flight={selectedFlight}
            locations={locations}
            onAssistance={openAssistance}
            onAlerts={() => setScreen("alerts")}
            onNext={showNextStep}
            onPrevious={showPreviousStep}
            presentationMode={presentationMode}
            route={route}
            startId={startId}
          />
        ) : null}

        {screen === "map" ? (
          <FocusedRouteMap
            activeStepIndex={activeStepIndex}
            connections={connections}
            currentStep={currentNavigationStep}
            currentLocationId={currentRouteLocationId}
            destinationId={destinationId}
            flight={selectedFlight}
            locations={locations}
            onAlerts={() => setScreen("alerts")}
            onAssistance={openAssistance}
            onNext={showNextStep}
            onPrevious={showPreviousStep}
            presentationMode={presentationMode}
            route={route}
            startId={startId}
          />
        ) : null}

        {screen === "alerts" ? (
          <ContextualAlerts
            activeStepIndex={activeStepIndex}
            destinationId={destinationId}
            flight={selectedFlight}
            locations={locations}
            onBack={() => setScreen(route ? "navigate" : "route")}
            route={route}
          />
        ) : null}

        {screen === "assistance" ? (
          <AssistanceMenu
            currentLocationName={currentLocationName}
            onBack={returnFromAssistance}
            onPreferences={() => setScreen("preferences")}
            onSubmit={submitAssistance}
            submittedRequestType={submittedAssistanceType}
          />
        ) : null}

        {screen === "arrival" && route ? (
          <ArrivalConfirmation
            destinationName={destinationName}
            onEnd={endNavigation}
            onPlanAnotherRoute={goToPlanFromTab}
            profileId={profileId}
            route={route}
          />
        ) : null}

      </MobileAppShell>
    </div>
  );
}

function Footer() {
  return (
    <footer className="poc-footer">
      Beacon is currently a proof of concept. Route information, airport locations, alerts, and assistance features
      shown in this demonstration are simulated and are not connected to Greenville Spartanburg International Airport.
    </footer>
  );
}
