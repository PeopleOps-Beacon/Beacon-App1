import { createContext } from "react";
import type {
  AirportLocation,
  NavigationState,
  OperationsState,
  TravelerMode,
  TravelerModeId,
  UserPreferences
} from "../types";

export type AppState = {
  travelerModeId: TravelerModeId;
  selectedDestination: AirportLocation | null;
  currentLocation: AirportLocation;
  recentSearches: AirportLocation[];
  navigation: NavigationState;
  preferences: UserPreferences;
  operations: OperationsState;
};

export type AppContextValue = AppState & {
  activeMode: TravelerMode;
  locations: AirportLocation[];
  setTravelerMode: (modeId: TravelerModeId) => void;
  selectDestination: (destination: AirportLocation) => void;
  clearDestination: () => void;
  markArrived: () => void;
  setOperations: (operations: OperationsState) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
};

export const AppContext = createContext<AppContextValue | null>(null);
