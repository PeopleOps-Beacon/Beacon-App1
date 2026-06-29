import { createContext } from "react";
import type {
  AirportConfig,
  AirportLocation,
  AirportCondition,
  MapLayerId,
  NavigationState,
  OperationsState,
  RouteOption,
  RoutePreference,
  SmartNotification,
  TravelerMode,
  TravelerModeId,
  UserPreferences
} from "../types";

export type AppState = {
  airportId: string;
  travelerModeId: TravelerModeId;
  selectedDestination: AirportLocation | null;
  currentLocation: AirportLocation;
  recentSearches: AirportLocation[];
  favoriteDestinationIds: string[];
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
