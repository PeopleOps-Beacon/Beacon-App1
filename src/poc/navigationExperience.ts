import type { AirportLocation, CalculatedRoute, PreferenceId, RouteStep, TravelerProfileId } from "./types";

export type NavigationViewMode = "guidance" | "overview" | "steps";

export type PresentationJourney = {
  id: "gsp" | "american-gate-change" | "united-arrival";
  title: string;
  summary: string;
  startId: string;
  destinationId: string;
  flightId?: string;
  profileId: TravelerProfileId;
  preferences: PreferenceId[];
  trigger: string;
};

export type ManeuverKind =
  | "right"
  | "left"
  | "straight"
  | "security"
  | "elevator"
  | "arrival"
  | "updated";

export const presentationJourneys: PresentationJourney[] = [
  {
    id: "gsp",
    title: "GSP Executive Walkthrough",
    summary: "Delta passenger to Gate A12 with TSA PreCheck guidance.",
    startId: "main-entrance",
    destinationId: "gate-a12",
    flightId: "delta-1842",
    profileId: "sensory",
    preferences: ["simplifiedDirections", "reassurance", "quietStop", "tsaPreCheck"],
    trigger: "Shows Delta check in, TSA PreCheck, visual anticipation, simple guidance, assistance access, and arrival."
  },
  {
    id: "american-gate-change",
    title: "American Gate Change",
    summary: "Parking connection to Gate B6 with mobility support.",
    startId: "parking-garage",
    destinationId: "gate-b2",
    flightId: "american-2231",
    profileId: "mobility",
    preferences: ["wheelchair", "avoidStairs", "additionalTime"],
    trigger: "Shows American check in, elevator routing, step-free guidance, a gate change, and arrival."
  },
  {
    id: "united-arrival",
    title: "United Arrival Pickup",
    summary: "Baggage Claim to Ground Transportation by the fastest route.",
    startId: "baggage-claim",
    destinationId: "ground-transportation",
    flightId: "united-491",
    profileId: "standard",
    preferences: [],
    trigger: "Shows baggage claim, ground transportation, short-route guidance, and arrival."
  }
];

export function zoneForLocation(location: AirportLocation | null | undefined): string {
  if (!location) {
    return "Airport terminal";
  }

  if (location.zone) {
    return location.zone;
  }

  if (location.type === "parking" || location.type === "entry" || location.type === "ticketing") {
    return "Main Terminal";
  }

  if (location.type === "security") {
    return "Security Zone";
  }

  if (location.type === "gate") {
    return location.id.includes("gate-b") ? "Concourse B" : "Concourse A";
  }

  if (location.type === "baggage" || location.type === "transportation") {
    return "Arrivals Level";
  }

  if (location.type === "quiet" || location.type === "information" || location.type === "restroom") {
    return "Central Concourse";
  }

  return "Central Concourse";
}

export function maneuverForStep(step: RouteStep | null | undefined): ManeuverKind {
  if (step?.maneuver === "turn_right") {
    return "right";
  }

  if (step?.maneuver === "turn_left") {
    return "left";
  }

  if (step?.maneuver === "security") {
    return "security";
  }

  if (step?.maneuver === "elevator") {
    return "elevator";
  }

  if (step?.maneuver === "arrival") {
    return "arrival";
  }

  const instruction = step?.instruction.toLowerCase() ?? "";

  if (!step) {
    return "straight";
  }

  if (instruction.includes("turn right")) {
    return "right";
  }

  if (instruction.includes("turn left")) {
    return "left";
  }

  if (instruction.includes("elevator")) {
    return "elevator";
  }

  if (instruction.includes("security")) {
    return "security";
  }

  if (instruction.includes("arrived") || instruction.includes("gate is on")) {
    return "arrival";
  }

  return "straight";
}

export function shortInstruction(step: RouteStep | null | undefined): string {
  if (!step) {
    return "Beacon is preparing your route.";
  }

  const sentence = step.instruction.split(".")[0]?.trim();
  const cleanedSentence = sentence
    ?.replace(/^Proceed along the (.+?) toward .+$/i, "Follow the $1")
    .replace(/^Proceed straight toward the security checkpoint$/i, "Continue toward Security")
    .replace(/^Turn right after the information desk toward .+$/i, "Turn right after the Information Desk")
    .replace(/^Continue toward (.+)$/i, "Continue toward $1")
    .replace(/^Go to (.+)$/i, "Go to $1")
    .trim();

  if (cleanedSentence?.toLowerCase().includes("your gate is on the left")) {
    return "Your gate is ahead on the left.";
  }

  return cleanedSentence ? `${cleanedSentence}.` : step.instruction;
}

export function nextActionTime(distanceFeet: number): string {
  const minutes = Math.max(1, Math.round(distanceFeet / 220));
  return minutes === 1 ? "About 1 minute" : `About ${minutes} minutes`;
}

export function routeProfileLabel(route: CalculatedRoute | null): string {
  if (!route) {
    return "Route profile";
  }

  if (route.preferences.includes("wheelchair") || route.preferences.includes("avoidStairs")) {
    return "Step-free route";
  }

  if (route.preferences.includes("avoidCrowds")) {
    return "Lower-crowd route";
  }

  if (route.preferences.includes("reducedStimulation") || route.preferences.includes("quietStop")) {
    return "Calmer route";
  }

  if (route.preferences.includes("simplifiedDirections") && route.preferences.includes("reassurance")) {
    return "Simple route";
  }

  return "Direct route";
}

export function accessibilitySummary(route: CalculatedRoute | null): string {
  if (!route) {
    return "Accessibility support appears here after a route is prepared.";
  }

  if (route.preferences.includes("wheelchair") || route.preferences.includes("avoidStairs")) {
    return "Beacon is using step-free paths and elevator-aware segments where available.";
  }

  if (route.preferences.includes("reducedStimulation") || route.preferences.includes("quietStop")) {
    return "Beacon is limiting visual clutter and emphasizing calmer landmarks.";
  }

  if (route.preferences.includes("simplifiedDirections")) {
    return "Beacon is showing one action at a time with landmark-first language.";
  }

  return "No special support selected; assistance remains one tap away.";
}

export function routeUpdateSummary(route: CalculatedRoute | null): string {
  if (!route) {
    return "Beacon will explain route changes here.";
  }

  if (route.preferences.includes("wheelchair") || route.preferences.includes("avoidStairs")) {
    return "Elevator status checked. Step-free routing is active and highlighted.";
  }

  if (route.preferences.includes("avoidCrowds") || route.preferences.includes("reducedStimulation")) {
    return "Central concourse congestion is elevated. Beacon is emphasizing the calmer path.";
  }

  return "Security congestion is elevated. Beacon is keeping the direct route visible and monitoring alternatives.";
}

export function relevantLandmarkName(step: RouteStep | null | undefined, locations: AirportLocation[]): string {
  if (!step) {
    return "Next landmark";
  }

  if (step.landmarkName) {
    return step.landmarkName;
  }

  return locations.find((location) => location.id === step.to)?.name ?? step.landmark;
}
