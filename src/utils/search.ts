import type { AirportLocation, TravelerModeId } from "../types";

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function fuzzyScore(query: string, target: string): number {
  if (!query) {
    return 0;
  }

  const normalizedTarget = normalize(target);
  if (normalizedTarget.includes(query)) {
    return normalizedTarget.startsWith(query) ? 100 : 80;
  }

  let queryIndex = 0;
  for (const character of normalizedTarget) {
    if (character === query[queryIndex]) {
      queryIndex += 1;
    }
    if (queryIndex === query.length) {
      return 50 - Math.min(30, normalizedTarget.length - query.length);
    }
  }

  return 0;
}

export function searchLocations(
  query: string,
  locations: AirportLocation[],
  travelerMode?: TravelerModeId
): AirportLocation[] {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return locations
      .filter((location) =>
        travelerMode ? location.travelerModesSupported.includes(travelerMode) : true
      )
      .slice(0, 8);
  }

  return locations
    .map((location) => {
      const searchable = [
        location.name,
        location.category,
        location.terminal,
        location.description,
        ...location.keywords,
        ...location.accessibilityFeatures
      ].join(" ");

      const score = fuzzyScore(normalizedQuery, searchable);
      const modeBoost =
        travelerMode && location.travelerModesSupported.includes(travelerMode) ? 12 : 0;

      return { location, score: score + modeBoost };
    })
    .filter((entry) => entry.score > 0)
    .sort((first, second) => second.score - first.score || first.location.name.localeCompare(second.location.name))
    .slice(0, 8)
    .map((entry) => entry.location);
}
