import type { AirportConfig } from "../types";

export function createOfflineManifest(airport: AirportConfig): string[] {
  return [
    "/",
    "/index.html",
    `airport:${airport.id}:locations`,
    `airport:${airport.id}:map`,
    `airport:${airport.id}:search`
  ];
}

export function isOfflineReady(airport: AirportConfig): boolean {
  return airport.locations.length > 0 && airport.map.viewBox.length > 0;
}
