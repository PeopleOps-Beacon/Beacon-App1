import type { AirportLocation } from "../types";

const recentKey = "beacon-recent-destinations";
const maxRecentDestinations = 10;

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

export const RecentDestinationsService = {
  read(): string[] {
    const raw = storage()?.getItem(recentKey);
    if (!raw) return [];

    try {
      return (JSON.parse(raw) as string[]).slice(0, maxRecentDestinations);
    } catch {
      return [];
    }
  },
  write(ids: string[]) {
    storage()?.setItem(recentKey, JSON.stringify(Array.from(new Set(ids)).slice(0, maxRecentDestinations)));
  },
  add(ids: string[], locationId: string): string[] {
    return [locationId, ...ids.filter((id) => id !== locationId)].slice(0, maxRecentDestinations);
  },
  resolve(ids: string[], locations: AirportLocation[]): AirportLocation[] {
    return ids
      .map((id) => locations.find((location) => location.id === id))
      .filter((location): location is AirportLocation => Boolean(location));
  }
};
