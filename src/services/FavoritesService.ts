import type { AirportLocation } from "../types";

const favoriteKey = "beacon-smart-favorites";

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

function unique(ids: string[]): string[] {
  return Array.from(new Set(ids)).slice(0, 50);
}

export const FavoritesService = {
  read(): string[] {
    const raw = storage()?.getItem(favoriteKey);
    if (!raw) return [];

    try {
      return unique(JSON.parse(raw) as string[]);
    } catch {
      return [];
    }
  },
  write(ids: string[]) {
    storage()?.setItem(favoriteKey, JSON.stringify(unique(ids)));
  },
  toggle(ids: string[], locationId: string): string[] {
    return ids.includes(locationId) ? ids.filter((id) => id !== locationId) : unique([locationId, ...ids]);
  },
  resolve(ids: string[], locations: AirportLocation[]): AirportLocation[] {
    return ids
      .map((id) => locations.find((location) => location.id === id))
      .filter((location): location is AirportLocation => Boolean(location));
  }
};
