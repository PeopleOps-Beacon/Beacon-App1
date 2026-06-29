import { createContext } from "react";
import type {
  AirportConfig,
  AirportLocation,
  NotificationItem,
  NavigationState,
  OperationsState,
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
  navigation: NavigationState;
  preferences: UserPreferences;
  operations: OperationsState;
  activeSettingsPanel: boolean;
  notifications: NotificationItem[];
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
  toggleFavorite: (destinationId: string) => void;
  togglePinned: (destinationId: string) => void;
  setOperations: (operations: OperationsState) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setSettingsOpen: (isOpen: boolean) => void;
  resetPreferences: () => void;
};

export const AppContext = createContext<AppContextValue | null>(null);
