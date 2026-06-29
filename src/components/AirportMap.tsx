import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import type { AirportLocation, Route, TravelerMode } from "../types";

type Props = {
  locations: AirportLocation[];
  currentLocation: AirportLocation;
  selectedDestination: AirportLocation | null;
  route: Route | null;
  mode: TravelerMode;
  onSelect: (location: AirportLocation) => void;
};

export function AirportMap({
  locations,
  currentLocation,
  selectedDestination,
  route,
  mode,
  onSelect
}: Props) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const routePoints = useMemo(
    () => route?.path.map((point) => `${point.x},${point.y}`).join(" "),
    [route]
  );

  return (
    <section className="map-panel" aria-labelledby="map-title">
      <div className="map-toolbar">
        <div>
          <p className="eyebrow">Interactive Map</p>
          <h2 id="map-title">Terminal A navigation</h2>
        </div>
        <div className="map-controls" aria-label="Map controls">
          <button aria-label="Pan map left" onClick={() => setPan((value) => ({ ...value, x: value.x - 4 }))} type="button">
            ←
          </button>
          <button aria-label="Pan map right" onClick={() => setPan((value) => ({ ...value, x: value.x + 4 }))} type="button">
            →
          </button>
          <button aria-label="Pan map up" onClick={() => setPan((value) => ({ ...value, y: value.y - 4 }))} type="button">
            ↑
          </button>
          <button aria-label="Pan map down" onClick={() => setPan((value) => ({ ...value, y: value.y + 4 }))} type="button">
            ↓
          </button>
          <button aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(0.8, value - 0.1))} type="button">
            <Minus aria-hidden="true" />
          </button>
          <button aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(1.5, value + 0.1))} type="button">
            <Plus aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="svg-map-wrap">
        <svg
          aria-label="Airport terminal map with selectable destinations"
          className="airport-svg"
          role="img"
          viewBox="0 0 100 100"
        >
          <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
            <rect className="terminal-zone" height="34" rx="2" width="72" x="8" y="16" />
            <rect className="terminal-zone secondary" height="22" rx="2" width="60" x="20" y="58" />
            <path className="terminal-corridor" d="M18 42 H76 M42 42 V70 M54 42 V70" />
            {routePoints ? (
              <>
                <polyline className="route-polyline" points={routePoints} />
                <circle className="route-indicator" r="1.8">
                  <animateMotion dur={mode.id === "veteran" || mode.id === "sensory" ? "8s" : "5s"} repeatCount="indefinite">
                    <mpath href="#active-route" />
                  </animateMotion>
                </circle>
                <polyline id="active-route" points={routePoints} fill="none" />
              </>
            ) : null}
            <circle className="current-position" cx={currentLocation.x} cy={currentLocation.y} r="2.7" />
            {locations.map((location) => {
              const isSelected = selectedDestination?.id === location.id;
              const isSupported = location.travelerModesSupported.includes(mode.id);

              return (
                <g
                  aria-label={`Select ${location.name}`}
                  className={isSelected ? "map-location selected" : "map-location"}
                  key={location.id}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(location);
                    }
                  }}
                  onClick={() => onSelect(location)}
                  role="button"
                  tabIndex={0}
                >
                  <circle
                    className={isSupported ? "location-dot supported" : "location-dot"}
                    cx={location.x}
                    cy={location.y}
                    r={isSelected ? 2.8 : 1.9}
                  />
                  {isSelected ? (
                    <text className="location-label" x={location.x + 2.6} y={location.y - 2}>
                      {location.name}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </section>
  );
}
