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

export type RouteStep = {
  id: string;
  instruction: string;
  distanceFeet: number;
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

export type NavigationState = {
  route: Route | null;
  isNavigating: boolean;
  hasArrived: boolean;
};

export type UserPreferences = {
  reducedMotion: boolean;
  highContrast: boolean;
};
