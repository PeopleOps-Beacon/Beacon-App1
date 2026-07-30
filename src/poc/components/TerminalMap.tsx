import {
  alertPoint,
  calculateMapRouteState,
  geometryForConnection,
  getLocationById,
  headingBetween,
  mapRooms,
  mapZones,
  midpoint,
  pathFromPoints,
  viewBoxForRouteState,
  type MapOrientationMode,
  type MapPoint,
  type MapViewMode,
  type RouteSegmentGeometry
} from "../mapModel";
import type { AirportLocation, CalculatedRoute, RouteConnection, RouteStep } from "../types";

type TerminalMapProps = {
  locations: AirportLocation[];
  connections: RouteConnection[];
  route: CalculatedRoute | null;
  selectedStartId?: string;
  selectedDestinationId?: string;
  currentLocationId?: string;
  currentStep?: RouteStep | null;
  displayMode?: "full" | "preview" | "focused";
  mapView?: MapViewMode;
  orientationMode?: MapOrientationMode;
  showAccessibilityLayer?: boolean;
  showConditions?: boolean;
  adaptiveState?: "idle" | "updating" | "ready";
  showCaption?: boolean;
  showMapStatus?: boolean;
  showProgressSummary?: boolean;
  showStartMarker?: boolean;
  focusedLandmarkId?: string;
};

function routeIncludesConnection(routeIds: string[], connection: RouteConnection): boolean {
  return routeIds.some((locationId, index) => {
    const nextLocationId = routeIds[index + 1];
    return Boolean(
      nextLocationId &&
        ((connection.from === locationId && connection.to === nextLocationId) ||
          (connection.to === locationId && connection.from === nextLocationId))
    );
  });
}

function connectionEndpointIds(routeIds: string[], connection: RouteConnection): { fromId: string; toId: string } {
  const routeIndex = routeIds.findIndex((locationId, index) => {
    const nextLocationId = routeIds[index + 1];
    return Boolean(
      nextLocationId &&
        ((connection.from === locationId && connection.to === nextLocationId) ||
          (connection.to === locationId && connection.from === nextLocationId))
    );
  });

  if (routeIndex >= 0) {
    return { fromId: routeIds[routeIndex], toId: routeIds[routeIndex + 1] };
  }

  return { fromId: connection.from, toId: connection.to };
}

function percentText(route: CalculatedRoute | null, routeState: ReturnType<typeof calculateMapRouteState>): string {
  if (!route || route.steps.length === 0) {
    return "0%";
  }
  return `${routeState.completionPercent}%`;
}

function routeReason(route: CalculatedRoute | null): string {
  if (!route) {
    return "No route selected";
  }

  if (route.preferences.includes("wheelchair") || route.preferences.includes("avoidStairs")) {
    return "Accessible route";
  }

  if (route.preferences.includes("avoidCrowds")) {
    return "Lower crowd route";
  }

  if (route.preferences.includes("reducedStimulation") || route.preferences.includes("quietStop")) {
    return "Calmer route";
  }

  return "Fastest available route";
}

function maneuverLabel(step: RouteStep | null | undefined): string {
  if (!step) {
    return "Next action";
  }

  const instruction = step.instruction.toLowerCase();
  if (instruction.includes("turn right")) {
    return "Turn right";
  }
  if (instruction.includes("turn left")) {
    return "Turn left";
  }
  if (instruction.includes("elevator")) {
    return "Use elevator";
  }
  if (instruction.includes("stairs")) {
    return "Use stairs";
  }
  if (instruction.includes("security")) {
    return "Enter security";
  }
  if (instruction.includes("continue")) {
    return "Continue";
  }
  return "Proceed";
}

function labelOffset(location: AirportLocation): MapPoint {
  if (location.type === "gate") {
    return { x: 2.2, y: -1.3 };
  }
  if (location.type === "vertical") {
    return { x: 2.4, y: 2.6 };
  }
  if (location.type === "restroom" || location.type === "quiet") {
    return { x: 2.4, y: -2 };
  }
  if (location.type === "parking" || location.type === "transportation") {
    return { x: 2.4, y: 3 };
  }
  return { x: 2.3, y: 0.9 };
}

function MapSymbol({ type }: { type: AirportLocation["type"] }) {
  if (type === "vertical") {
    return (
      <>
        <rect x="-2.6" y="-2.6" width="5.2" height="5.2" rx="1" />
        <path d="M -1.1 1.1 L 0 2.1 L 1.1 1.1 M -1.1 -1.1 L 0 -2.1 L 1.1 -1.1" />
      </>
    );
  }

  if (type === "restroom") {
    return (
      <>
        <rect x="-2.8" y="-2.2" width="5.6" height="4.4" rx="1" />
        <path d="M -0.8 -1.1 V 1.1 M 0.8 -1.1 V 1.1" />
      </>
    );
  }

  if (type === "information") {
    return (
      <>
        <circle r="2.8" />
        <path d="M 0 -0.3 V 1.6 M 0 -1.7 V -1.5" />
      </>
    );
  }

  if (type === "quiet") {
    return (
      <>
        <path d="M -2.7 -1.6 Q 0 -3 2.7 -1.6 V 1.9 Q 0 3 -2.7 1.9 Z" />
        <path d="M -1.2 0.8 Q 0 1.6 1.2 0.8" />
      </>
    );
  }

  if (type === "gate") {
    return (
      <>
        <path d="M -2.8 2.4 L 0 -2.8 L 2.8 2.4 Z" />
        <path d="M -1.2 0.8 H 1.2" />
      </>
    );
  }

  return (
    <>
      <circle r="2.4" />
      <path d="M -1.1 0 H 1.1 M 0 -1.1 V 1.1" />
    </>
  );
}

function AirportFloorPlan() {
  return (
    <>
      <rect className="map-terminal-shadow" x="3" y="14" width="94" height="85" rx="7" />
      <g className="airport-zone-layer" aria-hidden="true">
        {mapZones.map((zone) => (
          <g className={`airport-zone ${zone.className}`} key={zone.id}>
            <path d={zone.path} />
            <text x={zone.label.x} y={zone.label.y}>
              {zone.name}
            </text>
          </g>
        ))}
      </g>
      <g className="airport-room-layer" aria-hidden="true">
        {mapRooms.map((room) => (
          <g className={`airport-room ${room.className}`} key={room.id}>
            <rect x={room.x} y={room.y} width={room.width} height={room.height} rx="1.4" />
          </g>
        ))}
        {[0, 1, 2, 3].map((lane) => (
          <line className="security-lane" key={lane} x1={48 + lane * 6} y1="59.5" x2={48 + lane * 6} y2="70.5" />
        ))}
        {[28, 36, 44, 76, 84, 91].map((x) => (
          <line className="gate-door" key={x} x1={x} y1="16" x2={x} y2="22" />
        ))}
      </g>
    </>
  );
}

function WalkablePathLayer({
  connections,
  routeIds,
  displayMode
}: {
  connections: RouteConnection[];
  routeIds: string[];
  displayMode: TerminalMapProps["displayMode"];
}) {
  const visibleConnections =
    displayMode === "full" ? connections : connections.filter((connection) => routeIncludesConnection(routeIds, connection));

  return (
    <g className="walkable-path-layer" aria-hidden="true">
      {visibleConnections.map((connection) => {
        const endpoints = connectionEndpointIds(routeIds, connection);
        const points = geometryForConnection(connection, endpoints.fromId, endpoints.toId);
        return (
          <path
            className={`walkable-path ${connection.reducedStimulation ? "quiet" : ""} ${
              connection.crowdLevel >= 4 ? "crowded" : ""
            } ${connection.hasElevator ? "elevator" : ""}`}
            d={pathFromPoints(points)}
            key={connection.id}
          />
        );
      })}
    </g>
  );
}

function RestrictedPathLayer({ connections }: { connections: RouteConnection[] }) {
  const restricted = connections.filter((connection) => connection.closed || connection.hasStairs);
  return (
    <g className="restricted-path-layer" aria-hidden="true">
      {restricted.map((connection) => (
        <path
          className={`restricted-path ${connection.closed ? "closed" : "stairs"}`}
          d={pathFromPoints(geometryForConnection(connection))}
          key={connection.id}
        />
      ))}
    </g>
  );
}

function CompletedRouteLayer({ segments }: { segments: RouteSegmentGeometry[] }) {
  return (
    <g className="completed-route-layer" aria-hidden="true">
      {segments.map((segment) => (
        <path className="completed-route" d={pathFromPoints(segment.points)} key={segment.connection.id} />
      ))}
    </g>
  );
}

function ActiveRouteLayer({ segments, nextSegment }: { segments: RouteSegmentGeometry[]; nextSegment: RouteSegmentGeometry | null }) {
  return (
    <g className="active-route-layer" aria-hidden="true">
      {segments.map((segment) => {
        const isNext = segment.connection.id === nextSegment?.connection.id;
        const path = pathFromPoints(segment.points);
        return (
          <g className={isNext ? "next-route-segment" : ""} key={segment.connection.id}>
            <path className="active-route-halo" d={path} />
            <path className="active-route-line" d={path} />
          </g>
        );
      })}
      {segments.map((segment) => {
        const point = midpoint(segment.points);
        const angle = headingBetween(segment.points[0], segment.points[segment.points.length - 1]);
        return (
          <path
            aria-hidden="true"
            className="route-chevron"
            d="M -1.5 2.2 L 0 -2.2 L 1.5 2.2 Z"
            key={`${segment.connection.id}-chevron`}
            transform={`translate(${point.x} ${point.y}) rotate(${angle})`}
          />
        );
      })}
    </g>
  );
}

function RouteUpdateLayer({
  connections,
  adaptiveState
}: {
  connections: RouteConnection[];
  adaptiveState: NonNullable<TerminalMapProps["adaptiveState"]>;
}) {
  if (adaptiveState === "idle") {
    return null;
  }

  const adaptiveConnectionIds = ["security-elevators", "elevators-concourse", "concourse-alternate", "alternate-b2"];
  const adaptiveConnections = adaptiveConnectionIds
    .map((connectionId) => connections.find((connection) => connection.id === connectionId))
    .filter((connection): connection is RouteConnection => Boolean(connection));

  if (adaptiveConnections.length === 0) {
    return null;
  }

  return (
    <g className={`adaptive-route-layer ${adaptiveState}`} aria-hidden="true">
      {adaptiveConnections.map((connection) => {
        const path = pathFromPoints(geometryForConnection(connection));
        return (
          <g key={connection.id}>
            <path className="adaptive-route-halo" d={path} />
            <path className="adaptive-route-line" d={path} />
          </g>
        );
      })}
      <g className="adaptive-update-marker" transform="translate(67 60)">
        <circle r="6.3" />
        <path d="M -1.7 1.7 L 0 3.1 L 1.7 1.7 M -1.7 -1.7 L 0 -3.1 L 1.7 -1.7" />
      </g>
    </g>
  );
}

function CurrentLocationIndicator({ location, heading }: { location: AirportLocation | null; heading: number }) {
  if (!location) {
    return null;
  }

  return (
    <g className="current-location-indicator" transform={`translate(${location.x} ${location.y}) rotate(${heading})`}>
      <circle className="current-accuracy-ring" r="7.3" />
      <path className="current-heading-cone" d="M 0 -10 L 5.4 2.4 Q 0 0 -5.4 2.4 Z" />
      <circle className="current-location-core" r="3.2" />
      <circle className="current-location-dot" r="1.3" />
    </g>
  );
}

function DestinationMarker({ location }: { location: AirportLocation | null }) {
  if (!location) {
    return null;
  }

  return (
    <g className="destination-marker" transform={`translate(${location.x} ${location.y})`}>
      <circle className="destination-radius" r="7" />
      <path className="destination-flag" d="M -3.8 4.8 V -5.6 H 4 L 2.1 -2.3 L 4 1 H -3.8" />
      <text x="5.8" y="-4.5">
        {location.name}
      </text>
    </g>
  );
}

function ManeuverIconPath({ label }: { label: string }) {
  if (label === "Turn left") {
    return <path d="M 1.8 2.7 V -1.6 H -2.2 M -2.2 -1.6 L -0.4 -3.4 M -2.2 -1.6 L -0.4 0.2" />;
  }

  if (label === "Use elevator") {
    return <path d="M -1.5 1.8 L 0 3.1 L 1.5 1.8 M -1.5 -1.8 L 0 -3.1 L 1.5 -1.8" />;
  }

  if (label === "Enter security") {
    return <path d="M -2.4 -2.3 H 2.4 V 2.3 H -2.4 Z M -1 0 H 1" />;
  }

  if (label === "Continue") {
    return <path d="M 0 3 V -3 M 0 -3 L -2 -1 M 0 -3 L 2 -1" />;
  }

  return <path d="M -1.8 2.7 V -1.6 H 2.2 M 2.2 -1.6 L 0.4 -3.4 M 2.2 -1.6 L 0.4 0.2" />;
}

function ManeuverMarker({ location, step }: { location: AirportLocation | null; step?: RouteStep | null }) {
  if (!location || !step) {
    return null;
  }

  const label = maneuverLabel(step);

  return (
    <g className="maneuver-marker" transform={`translate(${location.x} ${location.y})`}>
      <rect x="-6.2" y="-6.2" width="12.4" height="12.4" rx="3.2" />
      <ManeuverIconPath label={label} />
      <text x="7.8" y="-1.8">
        {label}
      </text>
      <text className="maneuver-distance" x="7.8" y="3.1">
        {step.distanceFeet} ft
      </text>
    </g>
  );
}

function LandmarkLayer({
  locations,
  routeIds,
  displayMode,
  currentStep,
  destinationId,
  selectedStartId,
  alerts,
  focusedLandmarkId
}: {
  locations: AirportLocation[];
  routeIds: string[];
  displayMode: TerminalMapProps["displayMode"];
  currentStep?: RouteStep | null;
  destinationId?: string;
  selectedStartId?: string;
  alerts: CalculatedRoute["alerts"];
  focusedLandmarkId?: string;
}) {
  const alertLocationIds = new Set(alerts.map((alert) => alert.locationId));
  const focusedIds = new Set([currentStep?.to, focusedLandmarkId, currentStep?.to === destinationId ? destinationId : undefined]);
  const priorityIds = new Set(
    displayMode === "focused"
      ? [...focusedIds]
      : [...routeIds, currentStep?.from, currentStep?.to, destinationId, selectedStartId, ...alertLocationIds]
  );
  const visibleLocations = locations.filter((location) => {
    if (displayMode === "full") {
      return location.type !== "hallway";
    }
    return priorityIds.has(location.id);
  });

  return (
    <g className="landmark-layer">
      {visibleLocations.map((location) => {
        const offset = labelOffset(location);
        const isActiveLandmark = location.id === currentStep?.to;
        const isRouteLocation = routeIds.includes(location.id);
        const showLabel = (displayMode === "full" || priorityIds.has(location.id) || isActiveLandmark) && location.id !== destinationId;

        return (
          <g
            className={`landmark ${location.type} ${isRouteLocation ? "on-route" : ""} ${
              isActiveLandmark ? "active-landmark" : ""
            }`}
            key={location.id}
            transform={`translate(${location.x} ${location.y})`}
          >
            <MapSymbol type={location.type} />
            {showLabel ? (
              <text className="landmark-label" x={offset.x} y={offset.y}>
                {location.name}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

function AccessibilityLayer({ locations, connections }: { locations: AirportLocation[]; connections: RouteConnection[] }) {
  const relevantLocations = locations.filter((location) =>
    ["vertical", "restroom", "quiet", "information"].includes(location.type)
  );
  const accessibleSegments = connections.filter((connection) => connection.wheelchairAccessible && !connection.hasStairs);

  return (
    <g className="accessibility-layer">
      {accessibleSegments.map((connection) => (
        <path className="step-free-path" d={pathFromPoints(geometryForConnection(connection))} key={connection.id} />
      ))}
      {relevantLocations.map((location) => (
        <g className={`accessibility-point ${location.type}`} key={location.id} transform={`translate(${location.x} ${location.y})`}>
          <circle r="4" />
          <text x="5" y="1.2">
            {location.type === "vertical"
              ? "Lift"
              : location.type === "restroom"
                ? "WC"
                : location.type === "quiet"
                  ? "Quiet"
                  : "Help"}
          </text>
        </g>
      ))}
    </g>
  );
}

function ConditionLayer({
  route,
  connections,
  locations,
  showConditions
}: {
  route: CalculatedRoute | null;
  connections: RouteConnection[];
  locations: AirportLocation[];
  showConditions: boolean;
}) {
  if (!showConditions) {
    return null;
  }

  const routeIds = route?.locationIds ?? [];
  const relevantConnections = connections.filter(
    (connection) => routeIncludesConnection(routeIds, connection) && (connection.crowdLevel >= 4 || connection.noiseLevel >= 4)
  );

  return (
    <g className="condition-layer">
      {relevantConnections.map((connection) => {
        const endpoints = connectionEndpointIds(routeIds, connection);
        const point = midpoint(geometryForConnection(connection, endpoints.fromId, endpoints.toId));
        return (
          <g className="condition-marker crowded" key={connection.id} transform={`translate(${point.x} ${point.y})`}>
            <circle r="4.5" />
            <text x="6" y="1.5">
              Busy
            </text>
          </g>
        );
      })}
      {(route?.alerts ?? []).slice(0, 4).map((alert) => {
        const point = alertPoint(alert, locations);
        if (!point) {
          return null;
        }
        return (
          <g className={`condition-marker ${alert.severity}`} key={alert.id} transform={`translate(${point.x} ${point.y})`}>
            <circle r="4.2" />
            <path d="M 0 -2.3 V 0.8 M 0 2.1 V 2.3" />
          </g>
        );
      })}
    </g>
  );
}

function MapLegend({
  showAccessibilityLayer,
  showConditions,
  route
}: {
  showAccessibilityLayer: boolean;
  showConditions: boolean;
  route: CalculatedRoute | null;
}) {
  return (
    <div className="map-status-strip" aria-label="Map system status">
      <span>Level 1</span>
      <span>Simulated positioning</span>
      <span>{routeReason(route)}</span>
      {showAccessibilityLayer ? <span>Accessibility layer on</span> : null}
      {showConditions ? <span>Conditions visible</span> : null}
    </div>
  );
}

export function TerminalMap({
  locations,
  connections,
  route,
  selectedStartId,
  selectedDestinationId,
  currentLocationId,
  currentStep,
  displayMode = "full",
  mapView,
  orientationMode = "north",
  showAccessibilityLayer = false,
  showConditions = true,
  adaptiveState = "idle",
  showCaption = true,
  showMapStatus = true,
  showProgressSummary = true,
  showStartMarker = true,
  focusedLandmarkId
}: TerminalMapProps) {
  const routeIds = route?.locationIds ?? [];
  const routeState = calculateMapRouteState({ route, locations, connections, currentLocationId, currentStep });
  const resolvedMapView: MapViewMode =
    mapView ?? (displayMode === "focused" ? "guidance" : displayMode === "preview" ? "preview" : "fullRoute");
  const mapDescription =
    displayMode === "focused"
      ? "Layered Beacon guidance map showing current position, heading, next maneuver, active route, route conditions, and airport landmarks."
      : "Layered fictionalized Beacon airport map showing terminal zones, walkable corridors, route geometry, landmarks, accessibility features, and route conditions.";
  const selectedStart = getLocationById(locations, selectedStartId);
  const selectedDestination = getLocationById(locations, selectedDestinationId) ?? routeState.destination;
  const rotation =
    orientationMode === "direction" && resolvedMapView === "guidance" && routeState.currentLocation
      ? -routeState.heading
      : 0;
  const completedSegments =
    resolvedMapView === "guidance" ? routeState.completedSegments.slice(-1) : routeState.completedSegments;
  const upcomingSegments =
    resolvedMapView === "guidance" ? routeState.upcomingSegments.slice(0, 2) : routeState.upcomingSegments;
  const showDestinationMarker =
    resolvedMapView !== "guidance" || selectedDestination?.id === routeState.nextLocation?.id;

  return (
    <figure
      className={`poc-map-shell enterprise-map ${displayMode}-map ${resolvedMapView}-view orientation-${orientationMode} adaptive-${adaptiveState}`}
      aria-label="Beacon indoor airport map"
    >
      <svg
        className="poc-terminal-map enterprise-terminal-map"
        viewBox={viewBoxForRouteState(routeState, resolvedMapView)}
        role="img"
        aria-labelledby="map-title map-desc"
      >
        <title id="map-title">Beacon indoor airport map</title>
        <desc id="map-desc">{mapDescription}</desc>

        <defs>
          <filter id="map-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.2" stdDeviation="1.6" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        <g className="map-rotating-layer" transform={`rotate(${rotation} 50 50)`}>
          <AirportFloorPlan />
          <WalkablePathLayer connections={connections} displayMode={displayMode} routeIds={routeIds} />
          {displayMode === "focused" ? null : <RestrictedPathLayer connections={connections} />}
          {showAccessibilityLayer ? <AccessibilityLayer connections={connections} locations={locations} /> : null}
          <CompletedRouteLayer segments={completedSegments} />
          <ActiveRouteLayer nextSegment={routeState.nextSegment} segments={upcomingSegments} />
          <RouteUpdateLayer adaptiveState={adaptiveState} connections={connections} />
          <ConditionLayer connections={connections} locations={locations} route={route} showConditions={showConditions} />
          {showStartMarker && selectedStart ? (
            <g className="start-marker" transform={`translate(${selectedStart.x} ${selectedStart.y})`}>
              <circle r="4.8" />
              <text x="5.8" y="1.2">
                Start
              </text>
            </g>
          ) : null}
          <DestinationMarker location={showDestinationMarker ? selectedDestination : null} />
          <ManeuverMarker location={routeState.maneuverLocation} step={currentStep} />
          <CurrentLocationIndicator heading={routeState.heading} location={routeState.currentLocation} />
        </g>

        <LandmarkLayer
          alerts={route?.alerts ?? []}
          currentStep={currentStep}
          destinationId={selectedDestination?.id}
          displayMode={displayMode}
          locations={locations}
          routeIds={routeIds}
          selectedStartId={selectedStart?.id}
          focusedLandmarkId={focusedLandmarkId}
        />
      </svg>

      {showMapStatus ? (
        <MapLegend route={route} showAccessibilityLayer={showAccessibilityLayer} showConditions={showConditions} />
      ) : null}

      {showProgressSummary && route ? (
        <div className="map-progress-summary" aria-label="Route progress">
          <span>{percentText(route, routeState)} complete</span>
          <i aria-hidden="true">
            <b style={{ width: percentText(route, routeState) }} />
          </i>
          <span>{routeState.remainingMinutes} min remaining</span>
        </div>
      ) : null}

      {showCaption ? (
        <figcaption>
          Fictionalized demo map. Not official airport data. Highlighted paths adjust when route preferences or staff
          route closures change.
        </figcaption>
      ) : null}
    </figure>
  );
}
