export type LocationType =
  | "parking"
  | "entry"
  | "ticketing"
  | "security"
  | "concourse"
  | "gate"
  | "restroom"
  | "baggage"
  | "transportation"
  | "quiet"
  | "information"
  | "vertical"
  | "hallway";

export type AirportLocation = {
  id: string;
  name: string;
  type: LocationType;
  x: number;
  y: number;
  floor?: string;
  zone?: string;
  landmarkPriority?: 1 | 2 | 3 | 4 | 5;
  labelVisibility?: "always" | "route" | "guidance" | "accessibility" | "hidden";
  services?: string[];
  description: string;
  accessibility: string[];
  classification?: "actual" | "simulated";
  unavailable?: boolean;
};

export type RouteConnection = {
  id: string;
  from: string;
  to: string;
  distanceFeet: number;
  estimatedMinutes: number;
  crowdLevel: 1 | 2 | 3 | 4 | 5;
  noiseLevel: 1 | 2 | 3 | 4 | 5;
  wheelchairAccessible: boolean;
  hasStairs: boolean;
  hasElevator: boolean;
  reducedStimulation: boolean;
  closed: boolean;
  floor?: string;
  direction?: string;
  landmarkReference?: string;
  elevatorDependency?: boolean;
  description: string;
};

export type PreferenceId =
  | "reducedStimulation"
  | "avoidCrowds"
  | "wheelchair"
  | "avoidStairs"
  | "restroomStop"
  | "quietStop"
  | "largerText"
  | "simplifiedDirections"
  | "additionalTime"
  | "reassurance"
  | "tsaPreCheck";

export type TravelerProfileId = "standard" | "mobility" | "sensory" | "custom";

export type TravelerProfile = {
  id: TravelerProfileId;
  name: string;
  summary: string;
  preferences: PreferenceId[];
};

export type LandmarkVisualId =
  | "main-entrance"
  | "main-entrance-ticketing"
  | "ticket-counter"
  | "security-checkpoint"
  | "security-standard"
  | "security-exit"
  | "post-security-concourse"
  | "information-desk"
  | "information-desk-approach"
  | "information-desk-right-turn"
  | "elevator"
  | "elevator-left"
  | "elevator-right"
  | "escalator"
  | "restroom"
  | "accessible-restroom"
  | "family-restroom"
  | "nursing-room-entrance"
  | "quiet-space"
  | "concourse-split"
  | "concourse-a-entrance"
  | "concourse-b-entrance"
  | "coffee-shop"
  | "gate-area"
  | "gate-a1-podium"
  | "gate-a12-podium"
  | "gate-b6-podium"
  | "gate-seating"
  | "baggage-claim"
  | "ground-transportation"
  | "parking-connection"
  | "airport-assistance-desk"
  | "service-animal-relief"
  | "rental-car-area"
  | "delta-check-in"
  | "american-check-in"
  | "united-check-in"
  | "southwest-check-in"
  | "tsa-precheck";

export type VisualDirectionOverlay =
  | "straight"
  | "left"
  | "right"
  | "enter-left"
  | "enter-right"
  | "landmark-left"
  | "landmark-right"
  | "arrive";

export type VisualPriority = "primary" | "supporting";

export type LandmarkType =
  | "entrance"
  | "ticketing"
  | "security"
  | "information_desk"
  | "elevator"
  | "restroom"
  | "quiet_space"
  | "concourse"
  | "gate"
  | "baggage_claim"
  | "ground_transportation"
  | "parking";

export type RouteManeuver = "straight" | "turn_left" | "turn_right" | "security" | "elevator" | "arrival";

export type RouteStepCompletionState = "completed" | "active" | "upcoming";

export type RouteStep = {
  id: string;
  connectionId: string;
  from: string;
  to: string;
  instruction: string;
  maneuver: RouteManeuver;
  distanceFeet: number;
  estimatedMinutes: number;
  landmark: string;
  landmarkName: string;
  landmarkType: LandmarkType;
  recognitionCue: string;
  visualId: LandmarkVisualId;
  visualAsset: LandmarkVisualId;
  directionOverlay: VisualDirectionOverlay;
  visualPriority: VisualPriority;
  simulatedLabel: boolean;
  altText: string;
  accessibilityDescription: string;
  currentMapFocus: string;
  turnDirection?: "left" | "right" | "straight";
  completionState?: RouteStepCompletionState;
  accessibilityNote?: string;
  reassurance?: string;
};

export const operationalAlertTypes = [
  "construction",
  "gate-change",
  "busy-checkpoint",
  "elevator-unavailable",
  "route-closure",
  "noise-condition",
  "crowded-corridor",
  "amenity-unavailable"
] as const;

export type OperationalAlertType = (typeof operationalAlertTypes)[number];

export type ContextualAlertPriority =
  | "safety"
  | "accessibility-barrier"
  | "boarding"
  | "delay"
  | "accessibility-information"
  | "general-information";

export type ContextualAlert = {
  id: string;
  type: OperationalAlertType;
  title: string;
  message: string;
  locationId: string;
  nearbyLocationIds?: string[];
  connectionId?: string;
  priorityCategory?: ContextualAlertPriority;
  severity: "information" | "caution" | "assistance";
  active: boolean;
  startTime: string;
  endTime: string;
};

export type CalculatedRoute = {
  locationIds: string[];
  steps: RouteStep[];
  distanceFeet: number;
  estimatedMinutes: number;
  alerts: ContextualAlert[];
  preferences: PreferenceId[];
};

export type AssistanceRequest = {
  id: string;
  travelerLocation: string;
  requestType: string;
  submittedAt: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "New" | "Acknowledged" | "Staff Dispatched" | "Resolved";
  assignedStaff: string;
};

export type AccessibilityStatus = {
  elevatorsAvailable: boolean;
  accessibleRestroomsAvailable: boolean;
  quietSpaceAvailable: boolean;
  sensoryConditions: "Low" | "Moderate" | "High";
  crowdConditions: "Low" | "Moderate" | "High";
  constructionNotes: string;
  temporaryObstacles: string;
};

export type SimulatedExecutiveInsightMetrics = {
  simulatedJourneys: number;
  averageJourneyTimeMinutes: number;
  accessibilityRoutePercentage: number;
  mostRequestedDestination: string;
  mostRequestedTravelerService: string;
  passengerSatisfaction: string;
  assistanceRequests: number;
  potentialStaffInteractionsReduced: number;
};

export type SimulatedExecutiveInsights = {
  reportingPeriod: string;
  simulationSource: string;
  metricAssumptions: string[];
  metrics: SimulatedExecutiveInsightMetrics;
};
