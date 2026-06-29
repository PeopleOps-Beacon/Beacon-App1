import type { AirportLocation, TravelerModeId } from "../types";

const synonyms: Record<string, string[]> = {
  bathroom: ["restroom", "toilet", "family restroom"],
  tsa: ["security", "checkpoint", "screening"],
  coffee: ["cafe", "espresso", "drink"],
  uber: ["ride share", "pickup", "lyft"],
  military: ["uso", "veteran"],
  baby: ["nursing", "family", "infant"],
  help: ["information", "support", "assistance"]
};

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function expandQuery(query: string): string[] {
  const normalized = normalize(query);
  const expansions = Object.entries(synonyms)
    .filter(([word]) => normalized.includes(word))
    .flatMap(([, values]) => values);

  return [normalized, ...expansions];
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
  const queryTerms = expandQuery(query);
  const normalizedQuery = queryTerms[0];

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

      const score = Math.max(...queryTerms.map((term) => fuzzyScore(term, searchable)));
      const modeBoost =
        travelerMode && location.travelerModesSupported.includes(travelerMode) ? 12 : 0;
      const categoryBoost = normalizedQuery === location.category ? 20 : 0;
      const gateBoost =
        normalizedQuery.replace(/\s/g, "") === location.name.toLowerCase().replace(/\s/g, "")
          ? 25
          : 0;

      return { location, score: score + modeBoost + categoryBoost + gateBoost };
    })
    .filter((entry) => entry.score > 0)
    .sort((first, second) => second.score - first.score || first.location.name.localeCompare(second.location.name))
    .slice(0, 8)
    .map((entry) => entry.location);
}
