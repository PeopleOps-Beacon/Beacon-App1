import { useMemo, useState, type KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import type { AirportLocation, TravelerModeId } from "../types";
import { searchLocations } from "../utils/search";

type Props = {
  locations: AirportLocation[];
  travelerMode: TravelerModeId;
  recentSearches: AirportLocation[];
  onSelect: (location: AirportLocation) => void;
};

export function SearchBar({ locations, travelerMode, recentSearches, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(
    () => searchLocations(query, locations, travelerMode),
    [locations, query, travelerMode]
  );
  const visibleOptions = query ? results : recentSearches.length > 0 ? recentSearches : results;

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
          aria-activedescendant={visibleOptions[activeIndex]?.id}
          aria-autocomplete="list"
          aria-controls="destination-results"
          autoComplete="off"
          id="destination-search"
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Try TSA, Gate A7, USO, coffee..."
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

      <div className="search-results" id="destination-results" role="listbox">
        <p className="search-context">{query ? "Best matches" : "Recent and recommended"}</p>
        {visibleOptions.map((location, index) => (
          <button
            aria-selected={index === activeIndex}
            className={index === activeIndex ? "result-row active" : "result-row"}
            id={location.id}
            key={location.id}
            onClick={() => selectLocation(location)}
            role="option"
            type="button"
          >
            <span>
              <strong>{location.name}</strong>
              <small>
                Terminal {location.terminal} · Floor {location.floor} · {location.category}
              </small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
