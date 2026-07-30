import type { LucideIcon } from "lucide-react";

export type TravelerModeId =
  | "veteran"
  | "sensory"
  | "accessibility"
  | "family"
  | "business"
  | "international";

export type TravelerMode = {
  id: TravelerModeId;
  label: string;
  description: string;
  routeIntent: string;
  accent: string;
  icon: LucideIcon;
};

export type TravelerProfilePreferences = {
  avoidCrowds?: boolean;
  avoidNoise?: boolean;
  preferQuietRoutes?: boolean;
  frequentBreaks?: boolean;
  avoidStairs?: boolean;
  preferElevators?: boolean;
  accessibleOnly?: boolean;
  strollerFriendly?: boolean;
  restroomPriority?: boolean;
  foodPriority?: boolean;
  fastestRoute?: boolean;
  coffeeStops?: boolean;
  gateAlerts?: boolean;
  lowStimulus?: boolean;
  avoidAnnouncements?: boolean;
  quietWaitingAreas?: boolean;
};

export type TravelerProfile = {
  id: TravelerModeId;
  label: string;
  preferences: TravelerProfilePreferences;
};

export type OperationsState = {
  crowding: number;
  noise: number;
  waitTime: number;
  support: number;
};

export type LocationCategory =
  | "security"
  | "ticketing"
  | "baggage"
  | "transportation"
  | "restroom"
  | "care"
  | "support"
  | "dining"
  | "retail"
  | "gate"
  | "parking"
  | "operations";

export type AccessibilityFeature =
  | "step-free"
  | "wheelchair-accessible"
  | "family-friendly"
  | "quiet"
  | "service-animal-friendly"
  | "hearing-loop"
  | "visual-assistance"
  | "staffed"
  | "low-sensory";

export type AirportLocation = {
  id: string;
  name: string;
  category: LocationCategory;
  terminal: string;
  floor: number;
  x: number;
  y: number;
  description: string;
  keywords: string[];
  accessibilityFeatures: AccessibilityFeature[];
  travelerModesSupported: TravelerModeId[];
  icon: string;
};

export type AirportTheme = {
  primary: string;
  accent: string;
  calm: string;
  contrast: string;
};

export type AirportTerminal = {
  id: string;
  name: string;
  floors: number[];
};

export type MapConfiguration = {
  defaultTerminal: string;
  defaultFloor: number;
  viewBox: string;
  floorLabels: Record<number, string>;
};

export type AirportInfoPage = {
  id: string;
  title: string;
  summary: string;
  details: string[];
};

export type AirportConfig = {
  id: string;
  name: string;
  iata: string;
  city: string;
  state: string;
  timezone: string;
  logo: string;
  theme: AirportTheme;
  terminals: AirportTerminal[];
  map: MapConfiguration;
  supportedTravelerModes: TravelerModeId[];
  accessibilityResources: string[];
  locations: AirportLocation[];
  informationPages: AirportInfoPage[];
};

export type RouteStep = {
  id: string;
  instruction: string;
  distanceFeet: number;
  remainingDistanceFeet?: number;
};

export type Route = {
  id: string;
  from: AirportLocation;
  to: AirportLocation;
  distanceFeet: number;
  estimatedWalkMinutes: number;
  stepCount: number;
  steps: RouteStep[];
  path: Array<{ x: number; y: number }>;
  accessible: boolean;
};

export type NavigationNode = {
  id: string;
  locationId?: string;
  x: number;
  y: number;
  floor: number;
  label: string;
};

export type NavigationEdge = {
  id: string;
  from: string;
  to: string;
  distanceFeet: number;
  accessible: boolean;
  landmark?: string;
};

export type NavigationGraph = {
  nodes: NavigationNode[];
  edges: NavigationEdge[];
};

export type NavigationState = {
  route: Route | null;
  isNavigating: boolean;
  hasArrived: boolean;
};

export type UserRole = "traveler" | "airport-admin" | "beacon-admin";

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  airportId?: string;
  provider: "firebase" | "pilot";
  createdAt: string;
  updatedAt: string;
};

export type UserPreferences = {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  theme: "dark" | "light" | "calm" | "high-contrast" | "system";
  preferredWalkingSpeed: "slow" | "standard" | "fast";
  preferredRouteType: RoutePreference;
  favoriteCategories: LocationCategory[];
  defaultAirportId: string;
  accessibilityNeeds: AccessibilityFeature[];
  sensorySensitivity: "low" | "medium" | "high";
  preferredLanguage: SupportedLanguage;
  notificationsEnabled: boolean;
  aiRecommendationsEnabled: boolean;
  smartNotificationsEnabled: boolean;
  reduceWalkingDistance: boolean;
  preferAccessibleRoutes: boolean;
  avoidCrowds: boolean;
  avoidNoise: boolean;
  voiceGuidanceEnabled: boolean;
  voiceVolume: number;
  voiceRate: number;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  tone: "info" | "success" | "warning";
};

export type AnalyticsEventName =
  | "session_started"
  | "airport_changed"
  | "search_performed"
  | "destination_selected"
  | "traveler_mode_changed"
  | "navigation_started"
  | "navigation_completed"
  | "favorite_toggled"
  | "settings_updated"
  | "route_type_selected"
  | "notification_dismissed"
  | "flight_selected"
  | "map_layer_toggled"
  | "admin_config_viewed"
  | "auth_login"
  | "auth_logout"
  | "auth_password_reset"
  | "auth_register"
  | "auth_profile_updated"
  | "auth_account_deleted"
  | "error_captured"
  | "ai_recommendation_viewed"
  | "ai_recommendation_selected";

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  timestamp: string;
  properties: Record<string, string | number | boolean>;
};

export type RoutePreference =
  | "fastest"
  | "accessible"
  | "quietest"
  | "family"
  | "least-walking"
  | "fewest-elevators"
  | "fewest-stairs"
  | "wheelchair";

export type RouteDifficulty = "easy" | "moderate" | "difficult";

export type RouteOption = Route & {
  preference: RoutePreference;
  label: string;
  accessibilityScore: number;
  turnCount: number;
  difficulty: RouteDifficulty;
  conditionWarnings: string[];
};

export type AirportIntelligence = {
  airportId: string;
  crowdHeatmap: Array<{ locationId: string; level: number }>;
  constructionZones: string[];
  closedWalkways: string[];
  securityWaitTime: number;
  restaurantWaitTime: number;
  parkingOccupancy: number;
  weatherAlerts: string[];
  crowdLevel: number;
  noiseLevel: number;
  severity: SmartNotificationSeverity;
};

export type RouteRecommendation = {
  recommendedRoute: RouteOption;
  alternativeRoute: RouteOption;
  estimatedTimeMinutes: number;
  accessibilityNotes: string[];
  crowdLevel: "low" | "medium" | "high";
  noiseLevel: "low" | "medium" | "high";
  reason: string;
};

export type AIRecommendationCard = {
  id: string;
  locationId: string;
  name: string;
  type: string;
  distanceFeet: number;
  walkingTimeMinutes: number;
  accessibility: string;
  description: string;
};

export type AirportConditionCategory =
  | "crowd"
  | "construction"
  | "closure"
  | "elevator"
  | "escalator"
  | "restroom"
  | "security"
  | "noise"
  | "shuttle"
  | "support"
  | "parking";

export type AirportCondition = {
  id: string;
  airportId: string;
  category: AirportConditionCategory;
  locationId?: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  avoidInRouting: boolean;
  waitMinutes?: number;
};

export type SmartNotificationSeverity = "low" | "medium" | "high" | "critical";

export type SmartNotificationCategory =
  | "gate-change"
  | "heavy-crowd"
  | "construction"
  | "quiet-route"
  | "accessible-restroom"
  | "security-wait"
  | "dining"
  | "time-to-depart"
  | "weather-delay"
  | "system"
  | "route"
  | "support";

export type SmartNotification = NotificationItem & {
  priority: SmartNotificationSeverity;
  severity: SmartNotificationSeverity;
  category: SmartNotificationCategory;
  modeTarget?: TravelerModeId;
  dismissed: boolean;
  read: boolean;
  readAt?: string;
  createdAt: string;
};

export type FlightStatus = "on-time" | "boarding" | "delayed" | "arrived" | "cancelled";

export type FlightInfo = {
  id: string;
  airline: string;
  flightNumber: string;
  gate: string;
  status: FlightStatus;
  boardingTime: string;
  departureTime: string;
  arrivalTime: string;
  terminal: string;
  carousel?: string;
  delayInformation?: string;
};

export type AirportServiceListing = {
  id: string;
  name: string;
  category: LocationCategory | "lounge" | "medical" | "pet-relief" | "charging" | "water";
  description: string;
  hours: string;
  accessibilityInformation: string;
  locationId: string;
};

export type AirportAlert = {
  id: string;
  airportId: string;
  title: string;
  category: "operations" | "weather" | "security" | "construction" | "transportation" | "accessibility";
  severity: "low" | "medium" | "high" | "critical";
  issuedAt: string;
  message: string;
};

export type MapLayerId =
  | "restrooms"
  | "dining"
  | "accessibility"
  | "transportation"
  | "security"
  | "medical"
  | "shopping"
  | "parking"
  | "charging"
  | "pet-relief";

export type SupportedLanguage = "en" | "es" | "fr" | "de" | "ja";

export type TranslationDictionary = Record<string, string>;

export type VoiceInstruction = {
  id: string;
  text: string;
  language: SupportedLanguage;
  rate: number;
  volume: number;
};

export type ApiResult<T> = {
  data: T;
  cached: boolean;
  receivedAt: string;
};

export type DiagnosticLog = {
  id: string;
  level: "info" | "warn" | "error";
  message: string;
  timestamp: string;
  context?: Record<string, string | number | boolean>;
};

export type FeatureFlags = {
  smartRoutes: boolean;
  voiceGuidance: boolean;
  adminConfig: boolean;
  flightModule: boolean;
  aiRecommendations: boolean;
};
