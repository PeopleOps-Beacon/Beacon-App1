import {
  airportAlerts,
  airportConditions,
  flights,
  serviceListings
} from "../data/enterprise";
import type {
  AirportAlert,
  AirportCondition,
  AirportConfig,
  AirportServiceListing
} from "../types";
import { resilientApiRequest } from "./apiClient";

export const AirportService = {
  listAlerts(airport: AirportConfig) {
    return resilientApiRequest<AirportAlert[]>(`alerts:${airport.id}`, () =>
      airportAlerts.filter((alert) => alert.airportId === airport.id)
    );
  },
  listConditions(airport: AirportConfig) {
    return resilientApiRequest<AirportCondition[]>(`conditions:${airport.id}`, () =>
      airportConditions.filter((condition) => condition.airportId === airport.id)
    );
  }
};

export const FlightService = {
  search(query: string) {
    const normalized = query.toLowerCase();
    return flights.filter(
      (flight) =>
        flight.flightNumber.toLowerCase().includes(normalized) ||
        flight.airline.toLowerCase().includes(normalized) ||
        flight.gate.toLowerCase().includes(normalized)
    );
  },
  list() {
    return [...flights];
  }
};

export const DirectoryService = {
  list() {
    return [...serviceListings];
  },
  byAirport(airport: AirportConfig): AirportServiceListing[] {
    const locationIds = new Set(airport.locations.map((location) => location.id.replace(`${airport.id}-`, "")));
    return serviceListings.filter((service) => locationIds.has(service.locationId));
  }
};
