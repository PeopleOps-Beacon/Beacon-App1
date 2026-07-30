import { airportAlerts } from "../data/enterprise";
import type { AirportAlert, AirportConfig, AirportLocation } from "../types";

type ManagedLocationStatus = "open" | "restricted" | "closed";

export type ManagedLocation = {
  id: string;
  name: string;
  category: AirportLocation["category"];
  status: ManagedLocationStatus;
  accessibilityFeatures: AirportLocation["accessibilityFeatures"];
};

export type AirportAnnouncement = {
  id: string;
  title: string;
  message: string;
  severity: AirportAlert["severity"];
  issuedAt: string;
};

export type ServiceDisruption = {
  id: string;
  title: string;
  locationName: string;
  impact: string;
  severity: "medium" | "high" | "critical";
  active: boolean;
  updatedAt: string;
};

export type AirportAdminState = {
  airportId: string;
  mapRevision: string;
  managedLocations: ManagedLocation[];
  alerts: AirportAlert[];
  announcements: AirportAnnouncement[];
  disruptions: ServiceDisruption[];
  updatedAt: string;
};

const storagePrefix = "beacon-admin-config";

function storageKey(airportId: string): string {
  return storagePrefix + ":" + airportId;
}

function now(): string {
  return new Date().toISOString();
}

function createManagedLocations(airport: AirportConfig): ManagedLocation[] {
  return airport.locations.map((location) => ({
    id: location.id,
    name: location.name,
    category: location.category,
    status: "open",
    accessibilityFeatures: location.accessibilityFeatures
  }));
}

export function createDefaultAdminState(airport: AirportConfig): AirportAdminState {
  const timestamp = now();

  return {
    airportId: airport.id,
    mapRevision: airport.map.viewBox + ":" + airport.terminals.length,
    managedLocations: createManagedLocations(airport),
    alerts: airportAlerts.filter((alert) => alert.airportId === airport.id),
    announcements: [
      {
        id: "announcement-" + airport.id + "-welcome",
        title: airport.iata + " pilot operations",
        message: "Airport operations team is monitoring routes, services, and accessibility support.",
        severity: "low",
        issuedAt: timestamp
      }
    ],
    disruptions: [],
    updatedAt: timestamp
  };
}

export function readAdminState(airport: AirportConfig): AirportAdminState {
  if (typeof window === "undefined") {
    return createDefaultAdminState(airport);
  }

  try {
    const raw = window.localStorage.getItem(storageKey(airport.id));
    if (!raw) {
      return createDefaultAdminState(airport);
    }

    const stored = JSON.parse(raw) as AirportAdminState;
    const managedLocationIds = new Set(stored.managedLocations.map((location) => location.id));
    const missingLocations = createManagedLocations(airport).filter(
      (location) => !managedLocationIds.has(location.id)
    );

    return {
      ...stored,
      airportId: airport.id,
      managedLocations: [...stored.managedLocations, ...missingLocations],
      alerts: stored.alerts.length > 0 ? stored.alerts : airportAlerts.filter((alert) => alert.airportId === airport.id)
    };
  } catch {
    return createDefaultAdminState(airport);
  }
}

export function saveAdminState(state: AirportAdminState): AirportAdminState {
  const nextState = { ...state, updatedAt: now() };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey(state.airportId), JSON.stringify(nextState));
  }

  return nextState;
}

export function setManagedLocationStatus(
  state: AirportAdminState,
  locationId: string,
  status: ManagedLocationStatus
): AirportAdminState {
  return saveAdminState({
    ...state,
    managedLocations: state.managedLocations.map((location) =>
      location.id === locationId ? { ...location, status } : location
    )
  });
}

export function addAirportAnnouncement(
  state: AirportAdminState,
  announcement: Omit<AirportAnnouncement, "id" | "issuedAt">
): AirportAdminState {
  return saveAdminState({
    ...state,
    announcements: [
      {
        ...announcement,
        id: "announcement-" + state.airportId + "-" + Date.now(),
        issuedAt: now()
      },
      ...state.announcements
    ].slice(0, 8)
  });
}

export function addServiceDisruption(
  state: AirportAdminState,
  disruption: Omit<ServiceDisruption, "id" | "active" | "updatedAt">
): AirportAdminState {
  return saveAdminState({
    ...state,
    disruptions: [
      {
        ...disruption,
        id: "disruption-" + state.airportId + "-" + Date.now(),
        active: true,
        updatedAt: now()
      },
      ...state.disruptions
    ].slice(0, 8)
  });
}

export function toggleServiceDisruption(state: AirportAdminState, disruptionId: string): AirportAdminState {
  return saveAdminState({
    ...state,
    disruptions: state.disruptions.map((disruption) =>
      disruption.id === disruptionId
        ? { ...disruption, active: !disruption.active, updatedAt: now() }
        : disruption
    )
  });
}

export function summarizeAdminState(state: AirportAdminState) {
  const gates = state.managedLocations.filter((location) => location.category === "gate");
  const restaurants = state.managedLocations.filter((location) => location.category === "dining");
  const amenities = state.managedLocations.filter((location) =>
    ["restroom", "care", "support", "transportation", "parking", "retail"].includes(location.category)
  );
  const accessibilityLocations = state.managedLocations.filter(
    (location) => location.accessibilityFeatures.length > 0
  );

  return {
    gates: gates.length,
    restaurants: restaurants.length,
    amenities: amenities.length,
    accessibilityLocations: accessibilityLocations.length,
    activeAlerts: state.alerts.filter((alert) => alert.severity !== "low").length,
    activeDisruptions: state.disruptions.filter((disruption) => disruption.active).length
  };
}
