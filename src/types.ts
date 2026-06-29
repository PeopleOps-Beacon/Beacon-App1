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

export type UserPreferences = {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  theme: "dark" | "light" | "calm" | "high-contrast";
  preferredWalkingSpeed: "slow" | "standard" | "fast";
  accessibilityNeeds: AccessibilityFeature[];
  sensorySensitivity: "low" | "medium" | "high";
  preferredLanguage: "en" | "es" | "fr";
  notificationsEnabled: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  tone: "info" | "success" | "warning";
};

export type AnalyticsEventName =
  | "airport_changed"
  | "search_performed"
  | "destination_selected"
  | "traveler_mode_changed"
  | "navigation_started"
  | "navigation_completed"
  | "favorite_toggled"
  | "settings_updated";

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  timestamp: string;
  properties: Record<string, string | number | boolean>;
};
