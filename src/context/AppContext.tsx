import { type ReactNode, useMemo, useReducer } from "react";
import { currentLocation, locations } from "../data/locations";
import { travelerModes } from "../data/travelerModes";
import { AppContext, type AppContextValue, type AppState } from "./appContextValue";
import type {
  AirportLocation,
  OperationsState,
  TravelerModeId,
  UserPreferences
} from "../types";
import { createRoute } from "../utils/navigation";

type AppAction =
  | { type: "set-traveler-mode"; modeId: TravelerModeId }
  | { type: "select-destination"; destination: AirportLocation }
  | { type: "clear-destination" }
  | { type: "arrive" }
  | { type: "set-operations"; operations: OperationsState }
  | { type: "set-preferences"; preferences: Partial<UserPreferences> };

const defaultOperations: OperationsState = {
  crowding: 54,
  noise: 42,
  waitTime: 18,
  support: 72
};

const initialState: AppState = {
  travelerModeId: "veteran",
  selectedDestination: null,
  currentLocation,
  recentSearches: [],
  navigation: {
    route: null,
    isNavigating: false,
    hasArrived: false
  },
  preferences: {
    reducedMotion: false,
    highContrast: true
  },
  operations: defaultOperations
};

function withRoute(state: AppState, destination: AirportLocation, modeId = state.travelerModeId): AppState {
  return {
    ...state,
    travelerModeId: modeId,
    selectedDestination: destination,
    recentSearches: [
      destination,
      ...state.recentSearches.filter((location) => location.id !== destination.id)
    ].slice(0, 5),
    navigation: {
      route: createRoute(state.currentLocation, destination, modeId),
      isNavigating: true,
      hasArrived: false
    }
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "set-traveler-mode": {
      if (state.selectedDestination) {
        return withRoute(state, state.selectedDestination, action.modeId);
      }

      return { ...state, travelerModeId: action.modeId };
    }
    case "select-destination":
      return withRoute(state, action.destination);
    case "clear-destination":
      return {
        ...state,
        selectedDestination: null,
        navigation: {
          route: null,
          isNavigating: false,
          hasArrived: false
        }
      };
    case "arrive":
      return {
        ...state,
        navigation: {
          ...state.navigation,
          isNavigating: false,
          hasArrived: true
        }
      };
    case "set-operations":
      return { ...state, operations: action.operations };
    case "set-preferences":
      return { ...state, preferences: { ...state.preferences, ...action.preferences } };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const activeMode = useMemo(
    () => travelerModes.find((mode) => mode.id === state.travelerModeId) ?? travelerModes[0],
    [state.travelerModeId]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      activeMode,
      locations,
      setTravelerMode: (modeId) => dispatch({ type: "set-traveler-mode", modeId }),
      selectDestination: (destination) => dispatch({ type: "select-destination", destination }),
      clearDestination: () => dispatch({ type: "clear-destination" }),
      markArrived: () => dispatch({ type: "arrive" }),
      setOperations: (operations) => dispatch({ type: "set-operations", operations }),
      setPreferences: (preferences) => dispatch({ type: "set-preferences", preferences })
    }),
    [activeMode, state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
