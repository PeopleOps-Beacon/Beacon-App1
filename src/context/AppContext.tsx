import { type ReactNode, useEffect, useMemo, useReducer } from "react";
import { airports, defaultAirport } from "../data/airports";
import { airportConditions } from "../data/enterprise";
import { travelerModes } from "../data/travelerModes";
import { analytics } from "../services/analytics";
import { createSmartNotifications } from "../services/notifications";
import { readStoredValue, writeStoredValue } from "../services/storage";
import type {
  AirportConfig,
  AirportLocation,
  MapLayerId,
  OperationsState,
  RoutePreference,
  TravelerModeId,
  UserPreferences
} from "../types";
import { createRouteOptions } from "../utils/smartRouting";
import { AppContext, type AppContextValue, type AppState } from "./appContextValue";

type StoredPlatformState = {
  airportId: string;
  travelerModeId: TravelerModeId;
  favoriteDestinationIds: string[];
  pinnedDestinationIds: string[];
  selectedRoutePreference: RoutePreference;
  activeMapLayers: MapLayerId[];
  dismissedNotificationIds: string[];
  preferences: UserPreferences;
};

type AppAction =
  | { type: "set-airport"; airport: AirportConfig }
  | { type: "set-traveler-mode"; modeId: TravelerModeId }
  | { type: "select-destination"; destination: AirportLocation }
  | { type: "clear-destination" }
  | { type: "arrive" }
  | { type: "select-route-preference"; preference: RoutePreference }
  | { type: "toggle-map-layer"; layerId: MapLayerId }
  | { type: "dismiss-notification"; notificationId: string }
  | { type: "toggle-favorite"; destinationId: string }
  | { type: "toggle-pinned"; destinationId: string }
  | { type: "set-operations"; operations: OperationsState }
  | { type: "set-preferences"; preferences: Partial<UserPreferences> }
  | { type: "set-settings-open"; isOpen: boolean }
  | { type: "reset-preferences" };

const defaultOperations: OperationsState = {
  crowding: 54,
  noise: 42,
  waitTime: 18,
  support: 72
};

const defaultPreferences: UserPreferences = {
  reducedMotion: false,
  highContrast: true,
  largeText: false,
  theme: "dark",
  preferredWalkingSpeed: "standard",
  preferredRouteType: "fastest",
  favoriteCategories: [],
  defaultAirportId: defaultAirport.id,
  accessibilityNeeds: [],
  sensorySensitivity: "medium",
  preferredLanguage: "en",
  notificationsEnabled: true,
  voiceGuidanceEnabled: true,
  voiceVolume: 0.8,
  voiceRate: 1
};

function getInitialAirport(storedAirportId: string): AirportConfig {
  return airports.find((airport) => airport.id === storedAirportId) ?? defaultAirport;
}

function getCurrentLocation(airport: AirportConfig): AirportLocation {
  return (
    airport.locations.find((location) => location.name === "Information Desk") ??
    airport.locations[0]
  );
}

function readInitialState(): AppState {
  const stored = readStoredValue<StoredPlatformState>("beacon-platform-state", {
    airportId: defaultAirport.id,
    travelerModeId: "veteran",
    favoriteDestinationIds: [],
    pinnedDestinationIds: [],
    selectedRoutePreference: "fastest",
    activeMapLayers: ["restrooms", "accessibility", "security"],
    dismissedNotificationIds: [],
    preferences: defaultPreferences
  });
  const airport = getInitialAirport(stored.airportId);
  const conditions = getAirportConditions(airport.id);

  return {
    airportId: airport.id,
    travelerModeId: stored.travelerModeId,
    selectedDestination: null,
    currentLocation: getCurrentLocation(airport),
    recentSearches: [],
    favoriteDestinationIds: stored.favoriteDestinationIds ?? [],
    pinnedDestinationIds: stored.pinnedDestinationIds ?? [],
    selectedRoutePreference: stored.selectedRoutePreference ?? "fastest",
    routeOptions: [],
    activeMapLayers: stored.activeMapLayers ?? ["restrooms", "accessibility", "security"],
    conditions,
    navigation: {
      route: null,
      isNavigating: false,
      hasArrived: false
    },
    preferences: { ...defaultPreferences, ...stored.preferences },
    operations: defaultOperations,
    activeSettingsPanel: false,
    notifications: createSmartNotifications(airport, conditions, [], stored.travelerModeId).filter(
      (notification) => !stored.dismissedNotificationIds.includes(notification.id)
    )
  };
}

function withRoute(state: AppState, destination: AirportLocation, modeId = state.travelerModeId): AppState {
  const airport = getInitialAirport(state.airportId);
  const routeOptions = createRouteOptions(
    airport.locations,
    state.currentLocation,
    destination,
    modeId,
    state.conditions
  );
  const selectedRoute =
    routeOptions.find((option) => option.preference === state.selectedRoutePreference) ?? routeOptions[0];

  analytics.track("navigation_started", {
    airport: airport.iata,
    destination: destination.name,
    mode: modeId
  });

  return {
    ...state,
    travelerModeId: modeId,
    selectedDestination: destination,
    recentSearches: [
      destination,
      ...state.recentSearches.filter((location) => location.id !== destination.id)
    ].slice(0, 6),
    routeOptions,
    notifications: createSmartNotifications(airport, state.conditions, routeOptions, modeId).filter(
      (notification) => !state.notifications.some((existing) => existing.id === notification.id && existing.dismissed)
    ),
    navigation: {
      route: selectedRoute,
      isNavigating: true,
      hasArrived: false
    }
  };
}

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((value) => value !== id) : [id, ...ids].slice(0, 12);
}

function getAirportConditions(airportId: string) {
  return airportConditions.filter((condition) => condition.airportId === airportId);
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "set-airport": {
      analytics.track("airport_changed", { airport: action.airport.iata });
      const conditions = getAirportConditions(action.airport.id);
      return {
        ...state,
        airportId: action.airport.id,
        currentLocation: getCurrentLocation(action.airport),
        selectedDestination: null,
        recentSearches: [],
        routeOptions: [],
        conditions,
        navigation: { route: null, isNavigating: false, hasArrived: false },
        notifications: createSmartNotifications(action.airport, conditions, [], state.travelerModeId)
      };
    }
    case "set-traveler-mode": {
      analytics.track("traveler_mode_changed", { mode: action.modeId });
      if (state.selectedDestination) {
        return withRoute(state, state.selectedDestination, action.modeId);
      }

      return { ...state, travelerModeId: action.modeId };
    }
    case "select-destination":
      analytics.track("destination_selected", {
        destination: action.destination.name,
        category: action.destination.category
      });
      return withRoute(state, action.destination);
    case "clear-destination":
      return {
        ...state,
        selectedDestination: null,
        routeOptions: [],
        navigation: { route: null, isNavigating: false, hasArrived: false }
      };
    case "arrive":
      analytics.track("navigation_completed", {
        destination: state.selectedDestination?.name ?? "unknown"
      });
      return {
        ...state,
        navigation: {
          ...state.navigation,
          isNavigating: false,
          hasArrived: true
        }
      };
    case "select-route-preference": {
      analytics.track("route_type_selected", { preference: action.preference });
      const route =
        state.routeOptions.find((option) => option.preference === action.preference) ??
        state.navigation.route;
      return {
        ...state,
        selectedRoutePreference: action.preference,
        preferences: { ...state.preferences, preferredRouteType: action.preference },
        navigation: route ? { ...state.navigation, route } : state.navigation
      };
    }
    case "toggle-map-layer":
      analytics.track("map_layer_toggled", { layer: action.layerId });
      return {
        ...state,
        activeMapLayers: state.activeMapLayers.includes(action.layerId)
          ? state.activeMapLayers.filter((layerId) => layerId !== action.layerId)
          : [...state.activeMapLayers, action.layerId]
      };
    case "dismiss-notification":
      analytics.track("notification_dismissed", { notificationId: action.notificationId });
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.notificationId
            ? { ...notification, dismissed: true }
            : notification
        )
      };
    case "toggle-favorite":
      analytics.track("favorite_toggled", { destinationId: action.destinationId });
      return { ...state, favoriteDestinationIds: toggleId(state.favoriteDestinationIds, action.destinationId) };
    case "toggle-pinned":
      return { ...state, pinnedDestinationIds: toggleId(state.pinnedDestinationIds, action.destinationId) };
    case "set-operations":
      return { ...state, operations: action.operations };
    case "set-preferences":
      analytics.track("settings_updated", { keys: Object.keys(action.preferences).join(",") });
      return { ...state, preferences: { ...state.preferences, ...action.preferences } };
    case "set-settings-open":
      return { ...state, activeSettingsPanel: action.isOpen };
    case "reset-preferences":
      return { ...state, preferences: defaultPreferences };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, readInitialState);
  const airport = useMemo(() => getInitialAirport(state.airportId), [state.airportId]);
  const activeMode = useMemo(
    () => travelerModes.find((mode) => mode.id === state.travelerModeId) ?? travelerModes[0],
    [state.travelerModeId]
  );
  const favoriteDestinations = useMemo(
    () => airport.locations.filter((location) => state.favoriteDestinationIds.includes(location.id)),
    [airport.locations, state.favoriteDestinationIds]
  );
  const pinnedDestinations = useMemo(
    () => airport.locations.filter((location) => state.pinnedDestinationIds.includes(location.id)),
    [airport.locations, state.pinnedDestinationIds]
  );

  useEffect(() => {
    writeStoredValue<StoredPlatformState>("beacon-platform-state", {
      airportId: state.airportId,
      travelerModeId: state.travelerModeId,
      favoriteDestinationIds: state.favoriteDestinationIds,
      pinnedDestinationIds: state.pinnedDestinationIds,
      selectedRoutePreference: state.selectedRoutePreference,
      activeMapLayers: state.activeMapLayers,
      dismissedNotificationIds: state.notifications
        .filter((notification) => notification.dismissed)
        .map((notification) => notification.id),
      preferences: state.preferences
    });
  }, [
    state.airportId,
    state.favoriteDestinationIds,
    state.activeMapLayers,
    state.notifications,
    state.pinnedDestinationIds,
    state.selectedRoutePreference,
    state.preferences,
    state.travelerModeId
  ]);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      airport,
      airports,
      activeMode,
      locations: airport.locations,
      favoriteDestinations,
      pinnedDestinations,
      setAirport: (airportId) => {
        const selectedAirport = airports.find((candidate) => candidate.id === airportId);
        if (selectedAirport) {
          dispatch({ type: "set-airport", airport: selectedAirport });
        }
      },
      setTravelerMode: (modeId) => dispatch({ type: "set-traveler-mode", modeId }),
      selectDestination: (destination) => dispatch({ type: "select-destination", destination }),
      clearDestination: () => dispatch({ type: "clear-destination" }),
      markArrived: () => dispatch({ type: "arrive" }),
      selectRoutePreference: (preference) =>
        dispatch({ type: "select-route-preference", preference }),
      toggleMapLayer: (layerId) => dispatch({ type: "toggle-map-layer", layerId }),
      dismissNotification: (notificationId) =>
        dispatch({ type: "dismiss-notification", notificationId }),
      toggleFavorite: (destinationId) => dispatch({ type: "toggle-favorite", destinationId }),
      togglePinned: (destinationId) => dispatch({ type: "toggle-pinned", destinationId }),
      setOperations: (operations) => dispatch({ type: "set-operations", operations }),
      setPreferences: (preferences) => dispatch({ type: "set-preferences", preferences }),
      setSettingsOpen: (isOpen) => dispatch({ type: "set-settings-open", isOpen }),
      resetPreferences: () => dispatch({ type: "reset-preferences" })
    }),
    [activeMode, airport, favoriteDestinations, pinnedDestinations, state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
