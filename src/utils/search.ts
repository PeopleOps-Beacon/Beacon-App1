import type { AirportLocation, TravelerModeId } from "../types";

const synonymGroups = [
  ["bathroom", "restroom", "toilet", "washroom", "lavatory", "family restroom"],
  ["food", "eat", "dining", "restaurant", "restaurants", "meal", "snack"],
  ["coffee", "cafe", "espresso", "drink", "tea"],
  ["tsa", "security", "checkpoint", "screening"],
  ["gate", "boarding", "concourse"],
  ["terminal", "concourse", "atrium"],
  ["parking", "garage", "car", "rental", "rideshare", "uber", "lyft", "pickup"],
  ["quiet", "sensory", "low sensory", "calm", "prayer", "meditation"],
  ["accessibility", "accessible", "wheelchair", "elevator", "step free", "mobility"],
  ["charging", "charger", "outlet", "power"],
  ["lounge", "veteran", "military", "uso"],
  ["family", "baby", "nursing", "stroller", "infant"],
  ["pet", "animal", "service animal", "relief"],
  ["exit", "ground transportation", "baggage", "carousel"],
  ["help", "information", "support", "assistance", "desk"]
];

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9s]/g, " ").replace(/s+/g, " ").trim();
}

function expandQuery(query: string): string[] {
  const normalized = normalize(query);
  const words = normalized.split(" ").filter(Boolean);
  const expansions = new Set([normalized, ...words]);

  for (const group of synonymGroups) {
    const normalizedGroup = group.map(normalize);
    if (normalizedGroup.some((word) => normalized.includes(word) || words.includes(word))) {
      normalizedGroup.forEach((word) => expansions.add(word));
    }
  }

  return [...expansions].filter(Boolean);
}

function levenshtein(first: string, second: string): number {
  const rows = first.length + 1;
  const columns = second.length + 1;
  const matrix = Array.from({ length: rows }, () => Array<number>(columns).fill(0));

  for (let row = 0; row < rows; row += 1) matrix[row][0] = row;
  for (let column = 0; column < columns; column += 1) matrix[0][column] = column;

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const cost = first[row - 1] === second[column - 1] ? 0 : 1;
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost
      );
    }
  }

  return matrix[first.length][second.length];
}

function fuzzyScore(term: string, target: string): number {
  if (!term) return 0;

  const normalizedTarget = normalize(target);
  if (normalizedTarget === term) return 130;
  if (normalizedTarget.startsWith(term)) return 115;
  if (normalizedTarget.includes(term)) return 90;

  const targetWords = normalizedTarget.split(" ").filter(Boolean);
  if (targetWords.some((word) => word.startsWith(term))) return 76;
  if (targetWords.some((word) => term.length > 2 && levenshtein(term, word) <= 1)) return 68;
  if (targetWords.some((word) => term.length > 4 && levenshtein(term, word) <= 2)) return 56;

  let queryIndex = 0;
  for (const character of normalizedTarget) {
    if (character === term[queryIndex]) {
      queryIndex += 1;
    }
    if (queryIndex === term.length) {
      return 34;
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
      const searchableFields = [
        location.name,
        location.category,
        location.terminal,
        location.description,
        ...location.keywords,
        ...location.accessibilityFeatures
      ];
      const searchable = searchableFields.join(" ");
      const score = Math.max(...queryTerms.map((term) => fuzzyScore(term, searchable)));
      const categoryBoost = queryTerms.includes(normalize(location.category)) ? 28 : 0;
      const modeBoost = travelerMode && location.travelerModesSupported.includes(travelerMode) ? 12 : 0;
      const exactNameBoost = normalize(location.name).replace(/s/g, "") === normalizedQuery.replace(/s/g, "") ? 35 : 0;
      const keywordBoost = location.keywords.some((keyword) => queryTerms.includes(normalize(keyword))) ? 18 : 0;

      return { location, score: score + categoryBoost + modeBoost + exactNameBoost + keywordBoost };
    })
    .filter((entry) => entry.score > 0)
    .sort((first, second) => second.score - first.score || first.location.name.localeCompare(second.location.name))
    .slice(0, 8)
    .map((entry) => entry.location);
}
