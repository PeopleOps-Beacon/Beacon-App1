import { type ReactNode, useEffect, useMemo, useReducer } from "react";
import { airports, defaultAirport } from "../data/airports";
import { airportConditions } from "../data/enterprise";
import { travelerModes } from "../data/travelerModes";
import { analytics } from "../services/analytics";
import { BeaconAI } from "../services/BeaconAI";
import { FavoritesService } from "../services/FavoritesService";
import { NotificationCenterService } from "../services/NotificationCenter";
import { RecentDestinationsService } from "../services/RecentDestinationsService";
import { diagnostics } from "../services/diagnostics";
import { createSmartNotifications } from "../services/notifications";
import { readStoredValue, writeStoredValue } from "../services/storage";
import type {
  AirportConfig,
  AirportLocation,
  MapLayerId,
  OperationsState,
  RouteOption,
  RoutePreference,
  SmartNotification,
  TravelerModeId,
  UserPreferences
} from "../types";
import { createOperationalConditions } from "../utils/operations";
import { getRoutePreferenceForProfile, getTravelerProfile } from "../services/travelerProfiles";
import { createRouteOptions } from "../utils/smartRouting";
import { AppContext, type AppContextValue, type AppState } from "./appContextValue";

type StoredPlatformState = {
  airportId: string;
  travelerModeId: TravelerModeId;
  favoriteDestinationIds: string[];
  recentDestinationIds: string[];
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
  aiRecommendationsEnabled: true,
  smartNotificationsEnabled: true,
  reduceWalkingDistance: false,
  preferAccessibleRoutes: false,
  avoidCrowds: false,
  avoidNoise: false,
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
    recentDestinationIds: [],
    pinnedDestinationIds: [],
    selectedRoutePreference: "fastest",
    activeMapLayers: ["restrooms", "accessibility", "security"],
    dismissedNotificationIds: [],
    preferences: defaultPreferences
  });
  const airport = getInitialAirport(stored.airportId);
  const conditions = getAirportConditions(airport.id, defaultOperations);
  const preferences = { ...defaultPreferences, ...stored.preferences };
  const favoriteDestinationIds = stored.favoriteDestinationIds?.length
    ? stored.favoriteDestinationIds
    : FavoritesService.read();
  const recentDestinationIds = stored.recentDestinationIds?.length
    ? stored.recentDestinationIds
    : RecentDestinationsService.read();

  return {
    airportId: airport.id,
    travelerModeId: stored.travelerModeId,
    selectedDestination: null,
    currentLocation: getCurrentLocation(airport),
    recentSearches: RecentDestinationsService.resolve(recentDestinationIds, airport.locations),
    favoriteDestinationIds,
    recentDestinationIds,
    pinnedDestinationIds: stored.pinnedDestinationIds ?? [],
    selectedRoutePreference: stored.selectedRoutePreference ?? stored.preferences?.preferredRouteType ?? "fastest",
    routeOptions: [],
    activeMapLayers: stored.activeMapLayers ?? ["restrooms", "accessibility", "security"],
    conditions,
    navigation: {
      route: null,
      isNavigating: false,
      hasArrived: false
    },
    preferences,
    operations: defaultOperations,
    activeSettingsPanel: false,
    notifications: createNotificationsForState(
      airport,
      conditions,
      [],
      stored.travelerModeId,
      stored.dismissedNotificationIds ?? []
    )
  };
}

function getPerformanceNow(): number {
  if (typeof performance !== "undefined") {
    return performance.now();
  }

  return Date.now();
}

function withRoute(state: AppState, destination: AirportLocation, modeId = state.travelerModeId): AppState {
  const airport = getInitialAirport(state.airportId);
  const routeStartedAt = getPerformanceNow();
  let routeOptions: RouteOption[];

  try {
    routeOptions = createRouteOptions(
      airport.locations,
      state.currentLocation,
      destination,
      modeId,
      state.conditions
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Route generation failed";
    diagnostics.log("error", "Route generation failed", {
      airport: airport.iata,
      destination: destination.name,
      message
    });
    analytics.track("error_captured", { area: "routing", message });

    return {
      ...state,
      travelerModeId: modeId,
      selectedDestination: destination,
      routeOptions: [],
      navigation: { route: null, isNavigating: false, hasArrived: false }
    };
  }

  const routeCalculationMs = Math.round(getPerformanceNow() - routeStartedAt);
  const profile = getTravelerProfile(modeId, state.preferences);
  const recommendedPreference = state.preferences.aiRecommendationsEnabled
    ? getRoutePreferenceForProfile(profile, state.preferences)
    : state.selectedRoutePreference;
  const selectedRoute =
    routeOptions.find((option) => option.preference === recommendedPreference) ?? routeOptions[0];
  const recentDestinationIds = RecentDestinationsService.add(state.recentDestinationIds, destination.id);
  RecentDestinationsService.write(recentDestinationIds);

  if (routeCalculationMs > 2000) {
    diagnostics.log("warn", "Route calculation exceeded target", {
      airport: airport.iata,
      destination: destination.name,
      routeCalculationMs
    });
  }

  analytics.track("navigation_started", {
    airport: airport.iata,
    destination: destination.name,
    mode: modeId,
    routeCalculationMs
  });

  return {
    ...state,
    travelerModeId: modeId,
    selectedDestination: destination,
    recentSearches: [
      destination,
      ...state.recentSearches.filter((location) => location.id !== destination.id)
    ].slice(0, 10),
    routeOptions,
    recentDestinationIds,
    selectedRoutePreference: selectedRoute.preference,
    notifications: createNotificationsForState(
      airport,
      state.conditions,
      routeOptions,
      modeId,
      getDismissedNotificationIds(state.notifications)
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

function getRoutePreferenceForNeeds(needs: UserPreferences["accessibilityNeeds"]): RoutePreference | null {
  if (needs.includes("wheelchair-accessible")) {
    return "wheelchair";
  }

  if (needs.includes("step-free") || needs.includes("visual-assistance") || needs.includes("hearing-loop")) {
    return "accessible";
  }

  if (needs.includes("quiet") || needs.includes("low-sensory")) {
    return "quietest";
  }

  if (needs.includes("family-friendly")) {
    return "family";
  }

  return null;
}

function getAirportConditions(airportId: string, operations: OperationsState) {
  return [
    ...airportConditions.filter((condition) => condition.airportId === airportId),
    ...createOperationalConditions(airportId, operations)
  ];
}

function getDismissedNotificationIds(notifications: SmartNotification[]): string[] {
  return notifications
    .filter((notification) => notification.dismissed)
    .map((notification) => notification.id);
}

function createNotificationsForState(
  airport: AirportConfig,
  conditions: ReturnType<typeof getAirportConditions>,
  routeOptions: ReturnType<typeof createRouteOptions>,
  travelerMode: TravelerModeId,
  dismissedNotificationIds: string[]
): SmartNotification[] {
  const dismissedIds = new Set(dismissedNotificationIds);

  return createSmartNotifications(airport, conditions, routeOptions, travelerMode).map((notification) => ({
    ...notification,
    dismissed: dismissedIds.has(notification.id)
  }));
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "set-airport": {
      analytics.track("airport_changed", { airport: action.airport.iata });
      const conditions = getAirportConditions(action.airport.id, state.operations);
      return {
        ...state,
        airportId: action.airport.id,
        currentLocation: getCurrentLocation(action.airport),
        selectedDestination: null,
        recentSearches: [],
        routeOptions: [],
        conditions,
        navigation: { route: null, isNavigating: false, hasArrived: false },
        notifications: createNotificationsForState(
          action.airport,
          conditions,
          [],
          state.travelerModeId,
          getDismissedNotificationIds(state.notifications)
        )
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
            ? { ...NotificationCenterService.markRead(notification), dismissed: true }
            : notification
        )
      };
    case "toggle-favorite": {
      analytics.track("favorite_toggled", { destinationId: action.destinationId });
      const favoriteDestinationIds = FavoritesService.toggle(state.favoriteDestinationIds, action.destinationId);
      FavoritesService.write(favoriteDestinationIds);
      return { ...state, favoriteDestinationIds };
    }
    case "toggle-pinned":
      return { ...state, pinnedDestinationIds: toggleId(state.pinnedDestinationIds, action.destinationId) };
    case "set-operations": {
      const airport = getInitialAirport(state.airportId);
      const conditions = getAirportConditions(airport.id, action.operations);
      const routeOptions = state.selectedDestination
        ? createRouteOptions(
            airport.locations,
            state.currentLocation,
            state.selectedDestination,
            state.travelerModeId,
            conditions
          )
        : [];
      const route =
        routeOptions.find((option) => option.preference === state.selectedRoutePreference) ??
        routeOptions[0] ??
        state.navigation.route;

      return {
        ...state,
        operations: action.operations,
        conditions,
        routeOptions,
        navigation:
          state.selectedDestination && route ? { ...state.navigation, route } : state.navigation,
        notifications: createNotificationsForState(
          airport,
          conditions,
          routeOptions,
          state.travelerModeId,
          getDismissedNotificationIds(state.notifications)
        )
      };
    }
    case "set-preferences": {
      analytics.track("settings_updated", { keys: Object.keys(action.preferences).join(",") });
      const preferences = { ...state.preferences, ...action.preferences };
      const needRoutePreference = action.preferences.accessibilityNeeds
        ? getRoutePreferenceForNeeds(preferences.accessibilityNeeds)
        : null;
      const profileRoutePreference = preferences.aiRecommendationsEnabled
        ? getRoutePreferenceForProfile(getTravelerProfile(state.travelerModeId, preferences), preferences)
        : null;
      const selectedRoutePreference =
        action.preferences.preferredRouteType ?? needRoutePreference ?? profileRoutePreference ?? state.selectedRoutePreference;
      const route =
        state.routeOptions.find((option) => option.preference === selectedRoutePreference) ??
        state.navigation.route;

      return {
        ...state,
        selectedRoutePreference,
        preferences: { ...preferences, preferredRouteType: selectedRoutePreference },
        navigation: route ? { ...state.navigation, route } : state.navigation
      };
    }
    case "set-settings-open":
      return { ...state, activeSettingsPanel: action.isOpen };
    case "reset-preferences": {
      const route =
        state.routeOptions.find((option) => option.preference === defaultPreferences.preferredRouteType) ??
        state.navigation.route;

      return {
        ...state,
        selectedRoutePreference: defaultPreferences.preferredRouteType,
        preferences: defaultPreferences,
        navigation: route ? { ...state.navigation, route } : state.navigation
      };
    }
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
  const travelerProfile = useMemo(
    () => getTravelerProfile(state.travelerModeId, state.preferences),
    [state.preferences, state.travelerModeId]
  );
  const airportIntelligence = useMemo(
    () => BeaconAI.createAirportIntelligence(airport, state.operations, state.conditions),
    [airport, state.conditions, state.operations]
  );
  const routeRecommendation = useMemo(
    () =>
      state.selectedDestination && state.preferences.aiRecommendationsEnabled
        ? BeaconAI.getSuggestedRoute({
            airport,
            conditions: state.conditions,
            currentLocation: state.currentLocation,
            destination: state.selectedDestination,
            intelligence: airportIntelligence,
            preferences: state.preferences,
            profile: travelerProfile
          })
        : null,
    [airport, airportIntelligence, state.conditions, state.currentLocation, state.preferences, state.selectedDestination, travelerProfile]
  );
  const recommendationCards = useMemo(
    () => (state.preferences.aiRecommendationsEnabled ? BeaconAI.createRecommendationCards(airport, travelerProfile) : []),
    [airport, state.preferences.aiRecommendationsEnabled, travelerProfile]
  );
  const stressScore = useMemo(
    () =>
      BeaconAI.calculateStressScore({
        intelligence: airportIntelligence,
        preferences: state.preferences,
        profile: travelerProfile
      }),
    [airportIntelligence, state.preferences, travelerProfile]
  );

  useEffect(() => {
    writeStoredValue<StoredPlatformState>("beacon-platform-state", {
      airportId: state.airportId,
      travelerModeId: state.travelerModeId,
      favoriteDestinationIds: state.favoriteDestinationIds,
      recentDestinationIds: state.recentDestinationIds,
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
    state.recentDestinationIds,
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
      travelerProfile,
      airportIntelligence,
      routeRecommendation,
      recommendationCards,
      stressScore,
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
    [activeMode, airport, airportIntelligence, favoriteDestinations, pinnedDestinations, recommendationCards, routeRecommendation, state, stressScore, travelerProfile]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
