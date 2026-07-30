import { useMemo, useState, type KeyboardEvent } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { AirportLocation, TravelerModeId } from "../types";
import { calculateDistance } from "../utils/navigation";
import { searchLocations } from "../utils/search";

type SearchCategoryFilter =
  | "all"
  | "restaurants"
  | "retail"
  | "restrooms"
  | "services"
  | "accessibility"
  | "transportation"
  | "emergency"
  | "lounges"
  | "parking";

type SearchSort = "distance" | "accessibility" | "popularity" | "walking-time";

type Props = {
  locations: AirportLocation[];
  travelerMode: TravelerModeId;
  recentSearches: AirportLocation[];
  currentLocation?: AirportLocation;
  onSelect: (location: AirportLocation) => void;
};

const categoryFilters: Array<{ id: SearchCategoryFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "restaurants", label: "Restaurants" },
  { id: "retail", label: "Retail" },
  { id: "restrooms", label: "Restrooms" },
  { id: "services", label: "Services" },
  { id: "accessibility", label: "Accessibility" },
  { id: "transportation", label: "Transportation" },
  { id: "emergency", label: "Emergency" },
  { id: "lounges", label: "Lounges" },
  { id: "parking", label: "Parking" }
];

const sortOptions: Array<{ id: SearchSort; label: string }> = [
  { id: "distance", label: "Distance" },
  { id: "accessibility", label: "Accessibility" },
  { id: "popularity", label: "Popularity" },
  { id: "walking-time", label: "Walking Time" }
];

function matchesFilter(location: AirportLocation, filter: SearchCategoryFilter): boolean {
  if (filter === "all") return true;
  if (filter === "restaurants") return location.category === "dining";
  if (filter === "retail") return location.category === "retail";
  if (filter === "restrooms") return location.category === "restroom";
  if (filter === "transportation") return location.category === "transportation";
  if (filter === "parking") return location.category === "parking";
  if (filter === "services") return ["care", "support", "operations"].includes(location.category);
  if (filter === "emergency") return location.category === "security" || location.keywords.some((keyword) => /emergency|medical|security|help/i.test(keyword));
  if (filter === "lounges") return location.keywords.some((keyword) => /lounge|uso|quiet|prayer/i.test(keyword)) || location.accessibilityFeatures.includes("quiet");

  return location.accessibilityFeatures.length > 0 || ["care", "support"].includes(location.category);
}

function accessibilityScore(location: AirportLocation): number {
  return (
    location.accessibilityFeatures.length * 10 +
    (location.accessibilityFeatures.includes("wheelchair-accessible") ? 20 : 0) +
    (location.accessibilityFeatures.includes("step-free") ? 18 : 0) +
    (location.accessibilityFeatures.includes("staffed") ? 8 : 0)
  );
}

function popularityScore(location: AirportLocation): number {
  return location.travelerModesSupported.length * 12 + location.keywords.length * 4 + (location.category === "gate" ? 8 : 0);
}

function sortResults(results: AirportLocation[], sortBy: SearchSort, currentLocation?: AirportLocation): AirportLocation[] {
  return [...results].sort((first, second) => {
    if (sortBy === "accessibility") {
      return accessibilityScore(second) - accessibilityScore(first) || first.name.localeCompare(second.name);
    }

    if (sortBy === "popularity") {
      return popularityScore(second) - popularityScore(first) || first.name.localeCompare(second.name);
    }

    if (!currentLocation) {
      return first.name.localeCompare(second.name);
    }

    return calculateDistance(currentLocation, first) - calculateDistance(currentLocation, second);
  });
}

export function SearchBar({ locations, travelerMode, recentSearches, currentLocation, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<SearchCategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SearchSort>("distance");
  const results = useMemo(
    () => searchLocations(query, locations, travelerMode),
    [locations, query, travelerMode]
  );
  const baseOptions = query ? results : recentSearches.length > 0 ? recentSearches : results;
  const visibleOptions = useMemo(() => {
    const filteredOptions = baseOptions.filter((location) => matchesFilter(location, categoryFilter));

    return query ? filteredOptions : sortResults(filteredOptions, sortBy, currentLocation);
  }, [baseOptions, categoryFilter, currentLocation, query, sortBy]);
  const hasResults = visibleOptions.length > 0;

  const selectLocation = (location: AirportLocation) => {
    onSelect(location);
    setQuery(location.name);
    setActiveIndex(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, visibleOptions.length - 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }

    if (event.key === "Enter" && visibleOptions[activeIndex]) {
      event.preventDefault();
      selectLocation(visibleOptions[activeIndex]);
    }

    if (event.key === "Escape") {
      setQuery("");
      setActiveIndex(0);
    }
  };

  return (
    <section className="search-shell" aria-label="Destination search">
      <label htmlFor="destination-search">Find a destination</label>
      <div className="search-input-wrap">
        <Search aria-hidden="true" />
        <input
          aria-activedescendant={visibleOptions[activeIndex] ? "destination-option-" + visibleOptions[activeIndex].id : undefined}
          aria-autocomplete="list"
          aria-controls="destination-results"
          aria-expanded={hasResults}
          autoComplete="off"
          id="destination-search"
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search gates, TSA, restrooms, quiet rooms, food, or support"
          role="combobox"
          type="search"
          value={query}
        />
        {query ? (
          <button aria-label="Clear destination search" onClick={() => setQuery("")} type="button">
            <X aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="search-filter-grid" aria-label="Advanced search filters">
        <label>
          <SlidersHorizontal aria-hidden="true" /> Category
          <select onChange={(event) => setCategoryFilter(event.target.value as SearchCategoryFilter)} value={categoryFilter}>
            {categoryFilters.map((filter) => (
              <option key={filter.id} value={filter.id}>{filter.label}</option>
            ))}
          </select>
        </label>
        <label>
          Sort by
          <select onChange={(event) => setSortBy(event.target.value as SearchSort)} value={sortBy}>
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="search-results" id="destination-results" role="listbox">
        <p className="search-context">{query ? "Best matches" : "Recent and recommended"}</p>
        {visibleOptions.length === 0 ? (
          <p className="empty-state" role="status">No match yet. Try gate, TSA, restroom, quiet room, coffee, parking, or support.</p>
        ) : null}
        {visibleOptions.map((location, index) => (
          <button
            aria-selected={index === activeIndex}
            className={index === activeIndex ? "result-row active" : "result-row"}
            id={"destination-option-" + location.id}
            key={location.id}
            onClick={() => selectLocation(location)}
            role="option"
            type="button"
          >
            <span>
              <strong>{location.name}</strong>
              <small>
                Terminal {location.terminal} - Floor {location.floor} - {location.category}
              </small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
