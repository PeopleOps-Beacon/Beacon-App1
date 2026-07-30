import { createContext } from "react";
import type {
  AIRecommendationCard,
  AirportConfig,
  AirportLocation,
  AirportCondition,
  AirportIntelligence,
  MapLayerId,
  NavigationState,
  OperationsState,
  RouteRecommendation,
  RouteOption,
  RoutePreference,
  SmartNotification,
  TravelerMode,
  TravelerModeId,
  TravelerProfile,
  UserPreferences
} from "../types";

export type AppState = {
  airportId: string;
  travelerModeId: TravelerModeId;
  selectedDestination: AirportLocation | null;
  currentLocation: AirportLocation;
  recentSearches: AirportLocation[];
  favoriteDestinationIds: string[];
  recentDestinationIds: string[];
  pinnedDestinationIds: string[];
  selectedRoutePreference: RoutePreference;
  routeOptions: RouteOption[];
  activeMapLayers: MapLayerId[];
  conditions: AirportCondition[];
  navigation: NavigationState;
  preferences: UserPreferences;
  operations: OperationsState;
  activeSettingsPanel: boolean;
  notifications: SmartNotification[];
};

export type AppContextValue = AppState & {
  airport: AirportConfig;
  airports: AirportConfig[];
  activeMode: TravelerMode;
  locations: AirportLocation[];
  favoriteDestinations: AirportLocation[];
  pinnedDestinations: AirportLocation[];
  travelerProfile: TravelerProfile;
  airportIntelligence: AirportIntelligence;
  routeRecommendation: RouteRecommendation | null;
  recommendationCards: AIRecommendationCard[];
  stressScore: number;
  setAirport: (airportId: string) => void;
  setTravelerMode: (modeId: TravelerModeId) => void;
  selectDestination: (destination: AirportLocation) => void;
  clearDestination: () => void;
  markArrived: () => void;
  selectRoutePreference: (preference: RoutePreference) => void;
  toggleMapLayer: (layerId: MapLayerId) => void;
  dismissNotification: (notificationId: string) => void;
  toggleFavorite: (destinationId: string) => void;
  togglePinned: (destinationId: string) => void;
  setOperations: (operations: OperationsState) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setSettingsOpen: (isOpen: boolean) => void;
  resetPreferences: () => void;
};

export const AppContext = createContext<AppContextValue | null>(null);
