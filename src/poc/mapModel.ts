import type { AirportLocation, CalculatedRoute, ContextualAlert, RouteConnection, RouteStep } from "./types";

export type MapPoint = {
  x: number;
  y: number;
};

export type MapOrientationMode = "north" | "direction";

export type MapViewMode = "guidance" | "fullRoute" | "preview";

export type MapZone = {
  id: string;
  name: string;
  path: string;
  label: MapPoint;
  className: string;
};

export type MapRoom = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  className: string;
};

export type RouteSegmentGeometry = {
  connection: RouteConnection;
  points: MapPoint[];
  fromId: string;
  toId: string;
};

export type MapRouteState = {
  routeSegments: RouteSegmentGeometry[];
  completedSegments: RouteSegmentGeometry[];
  upcomingSegments: RouteSegmentGeometry[];
  nextSegment: RouteSegmentGeometry | null;
  currentLocation: AirportLocation | null;
  nextLocation: AirportLocation | null;
  destination: AirportLocation | null;
  maneuverLocation: AirportLocation | null;
  heading: number;
  completionPercent: number;
  remainingDistanceFeet: number;
  remainingMinutes: number;
};

export const mapZones: MapZone[] = [
  {
    id: "landside",
    name: "Landside",
    path: "M6 66 H34 Q40 66 40 72 V92 Q40 96 36 96 H8 Q4 96 4 92 V70 Q4 66 6 66 Z",
    label: { x: 8, y: 70 },
    className: "landside"
  },
  {
    id: "ticketing",
    name: "Ticketing Hall",
    path: "M32 52 H60 Q65 52 65 58 V76 Q65 81 60 81 H32 Q28 81 28 76 V58 Q28 52 32 52 Z",
    label: { x: 34, y: 56 },
    className: "ticketing"
  },
  {
    id: "security",
    name: "Security",
    path: "M47 57 H76 Q80 57 80 62 V69 Q80 73 76 73 H47 Q43 73 43 69 V62 Q43 57 47 57 Z",
    label: { x: 48, y: 61 },
    className: "security"
  },
  {
    id: "concourse",
    name: "Main Concourse",
    path: "M28 16 H90 Q94 16 94 20 V44 Q94 48 90 48 H52 Q48 48 48 44 V38 H26 Q22 38 22 34 V22 Q22 16 28 16 Z",
    label: { x: 31, y: 20 },
    className: "concourse"
  },
  {
    id: "b-concourse",
    name: "B Gates",
    path: "M70 22 H94 Q97 22 97 25 V44 Q97 48 94 48 H76 Q72 48 72 44 V34 H70 Z",
    label: { x: 77, y: 26 },
    className: "gates"
  },
  {
    id: "quiet-corridor",
    name: "Quiet Corridor",
    path: "M22 40 H42 Q46 40 46 44 V50 Q46 54 42 54 H22 Q18 54 18 50 V44 Q18 40 22 40 Z",
    label: { x: 20, y: 44 },
    className: "quiet"
  },
  {
    id: "alternate-corridor",
    name: "Alternate Corridor",
    path: "M73 46 H93 Q96 46 96 49 V62 Q96 65 93 65 H76 Q73 65 73 62 Z",
    label: { x: 76, y: 50 },
    className: "alternate"
  },
  {
    id: "arrivals",
    name: "Arrivals",
    path: "M21 82 H48 Q52 82 52 87 V96 Q52 99 48 99 H21 Q17 99 17 96 V87 Q17 82 21 82 Z",
    label: { x: 23, y: 86 },
    className: "arrivals"
  }
];

export const mapRooms: MapRoom[] = [
  { id: "gate-a1-bay", name: "Gate A1 Bay", x: 25, y: 17, width: 14, height: 8, className: "gate-bay" },
  { id: "gate-a2-bay", name: "Gate A2 Bay", x: 40, y: 28, width: 12, height: 8, className: "gate-bay" },
  { id: "gate-b1-bay", name: "Gate B1 Bay", x: 74, y: 30, width: 12, height: 8, className: "gate-bay" },
  { id: "gate-b2-bay", name: "Gate B2 Bay", x: 82, y: 17, width: 12, height: 8, className: "gate-bay" },
  { id: "restroom-room", name: "Restroom", x: 53, y: 25, width: 9, height: 9, className: "service-room" },
  { id: "quiet-room", name: "Quiet Space", x: 22, y: 39, width: 12, height: 8, className: "quiet-room" },
  { id: "info-desk-room", name: "Information Desk", x: 42, y: 46, width: 9, height: 7, className: "service-room" },
  { id: "elevator-core", name: "Elevators", x: 64, y: 56, width: 7, height: 8, className: "vertical-core" },
  { id: "stair-core", name: "Stairs", x: 72, y: 56, width: 7, height: 8, className: "vertical-core" },
  { id: "bag-claim-room", name: "Baggage Claim", x: 26, y: 84, width: 16, height: 10, className: "baggage-room" }
];

export const mapConnectionGeometry: Record<string, MapPoint[]> = {
  "parking-main": [
    { x: 10, y: 78 },
    { x: 16, y: 78 },
    { x: 24, y: 76 }
  ],
  "parking-ground": [
    { x: 10, y: 78 },
    { x: 10, y: 92 },
    { x: 16, y: 92 }
  ],
  "ground-baggage": [
    { x: 16, y: 92 },
    { x: 25, y: 92 },
    { x: 34, y: 88 }
  ],
  "main-ticket": [
    { x: 24, y: 76 },
    { x: 32, y: 76 },
    { x: 38, y: 72 }
  ],
  "main-baggage": [
    { x: 24, y: 76 },
    { x: 31, y: 82 },
    { x: 34, y: 88 }
  ],
  "main-service": [
    { x: 24, y: 76 },
    { x: 23, y: 66 },
    { x: 26, y: 58 }
  ],
  "service-info": [
    { x: 26, y: 58 },
    { x: 34, y: 54 },
    { x: 46, y: 50 }
  ],
  "ticket-security": [
    { x: 38, y: 72 },
    { x: 44, y: 70 },
    { x: 52, y: 64 }
  ],
  "ticket-info": [
    { x: 38, y: 72 },
    { x: 40, y: 58 },
    { x: 46, y: 50 }
  ],
  "info-security": [
    { x: 46, y: 50 },
    { x: 50, y: 56 },
    { x: 52, y: 64 }
  ],
  "security-concourse": [
    { x: 52, y: 64 },
    { x: 58, y: 60 },
    { x: 62, y: 54 }
  ],
  "security-elevators": [
    { x: 52, y: 64 },
    { x: 62, y: 64 },
    { x: 67, y: 60 }
  ],
  "security-stairs": [
    { x: 52, y: 64 },
    { x: 64, y: 64 },
    { x: 74, y: 60 }
  ],
  "stairs-concourse": [
    { x: 74, y: 60 },
    { x: 68, y: 56 },
    { x: 62, y: 54 }
  ],
  "elevators-concourse": [
    { x: 67, y: 60 },
    { x: 64, y: 56 },
    { x: 62, y: 54 }
  ],
  "concourse-central": [
    { x: 62, y: 54 },
    { x: 62, y: 46 },
    { x: 62, y: 40 }
  ],
  "concourse-alternate": [
    { x: 62, y: 54 },
    { x: 72, y: 54 },
    { x: 82, y: 52 }
  ],
  "alternate-b1": [
    { x: 82, y: 52 },
    { x: 82, y: 42 },
    { x: 78, y: 34 }
  ],
  "alternate-b2": [
    { x: 82, y: 52 },
    { x: 88, y: 42 },
    { x: 86, y: 22 }
  ],
  "central-a2": [
    { x: 62, y: 40 },
    { x: 54, y: 36 },
    { x: 46, y: 32 }
  ],
  "a2-a1": [
    { x: 46, y: 32 },
    { x: 40, y: 27 },
    { x: 34, y: 22 }
  ],
  "a2-a12": [
    { x: 46, y: 32 },
    { x: 41, y: 27 },
    { x: 36, y: 22 }
  ],
  "central-restroom": [
    { x: 62, y: 40 },
    { x: 58, y: 35 },
    { x: 56, y: 30 }
  ],
  "restroom-a1": [
    { x: 56, y: 30 },
    { x: 45, y: 25 },
    { x: 34, y: 22 }
  ],
  "restroom-a12": [
    { x: 56, y: 30 },
    { x: 46, y: 25 },
    { x: 36, y: 22 }
  ],
  "central-b1": [
    { x: 62, y: 40 },
    { x: 70, y: 38 },
    { x: 78, y: 34 }
  ],
  "b1-b2": [
    { x: 78, y: 34 },
    { x: 83, y: 28 },
    { x: 86, y: 22 }
  ],
  "central-quiet": [
    { x: 62, y: 40 },
    { x: 45, y: 42 },
    { x: 30, y: 42 }
  ],
  "quiet-a1": [
    { x: 30, y: 42 },
    { x: 30, y: 30 },
    { x: 34, y: 22 }
  ],
  "quiet-a12": [
    { x: 30, y: 42 },
    { x: 31, y: 30 },
    { x: 36, y: 22 }
  ],
  "baggage-info": [
    { x: 34, y: 88 },
    { x: 40, y: 70 },
    { x: 46, y: 50 }
  ]
};

export function getLocationById(locations: AirportLocation[], id: string | null | undefined): AirportLocation | null {
  if (!id) {
    return null;
  }
  return locations.find((location) => location.id === id) ?? null;
}

export function connectionMatches(connection: RouteConnection, fromId: string, toId: string): boolean {
  return (connection.from === fromId && connection.to === toId) || (connection.to === fromId && connection.from === toId);
}

export function getConnectionBetween(
  connections: RouteConnection[],
  fromId: string,
  toId: string
): RouteConnection | null {
  return connections.find((connection) => connectionMatches(connection, fromId, toId)) ?? null;
}

export function geometryForConnection(connection: RouteConnection, fromId = connection.from, toId = connection.to): MapPoint[] {
  const points = mapConnectionGeometry[connection.id] ?? [
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ];

  if (connection.from === fromId && connection.to === toId) {
    return points;
  }

  return [...points].reverse();
}

export function pathFromPoints(points: MapPoint[]): string {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  const [first, ...rest] = points;
  if (rest.length === 1) {
    return `M ${first.x} ${first.y} L ${rest[0].x} ${rest[0].y}`;
  }

  const commands = [`M ${first.x} ${first.y}`];
  rest.slice(0, -1).forEach((point, index) => {
    const next = rest[index + 1];
    const midpoint = { x: (point.x + next.x) / 2, y: (point.y + next.y) / 2 };
    commands.push(`Q ${point.x} ${point.y} ${midpoint.x} ${midpoint.y}`);
  });

  const last = rest[rest.length - 1];
  commands.push(`L ${last.x} ${last.y}`);
  return commands.join(" ");
}

export function midpoint(points: MapPoint[]): MapPoint {
  if (points.length === 0) {
    return { x: 0, y: 0 };
  }
  return points[Math.floor(points.length / 2)];
}

export function headingBetween(from: MapPoint, to: MapPoint): number {
  return (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI + 90;
}

export function calculateMapRouteState({
  route,
  locations,
  connections,
  currentLocationId,
  currentStep
}: {
  route: CalculatedRoute | null;
  locations: AirportLocation[];
  connections: RouteConnection[];
  currentLocationId?: string;
  currentStep?: RouteStep | null;
}): MapRouteState {
  const routeIds = route?.locationIds ?? [];
  const routeSegments: RouteSegmentGeometry[] = routeIds.slice(0, -1).flatMap((fromId, index) => {
    const toId = routeIds[index + 1];
    const connection = getConnectionBetween(connections, fromId, toId);
    if (!connection) {
      return [];
    }
    return [{ connection, points: geometryForConnection(connection, fromId, toId), fromId, toId }];
  });

  const currentId = currentLocationId ?? currentStep?.from ?? routeIds[0];
  const currentIndex = Math.max(0, routeIds.findIndex((id) => id === currentId));
  const completedSegments = routeSegments.slice(0, currentIndex);
  const upcomingSegments = routeSegments.slice(currentIndex);
  const nextSegment = upcomingSegments[0] ?? null;
  const currentLocation = getLocationById(locations, currentId);
  const nextLocation = getLocationById(locations, currentStep?.to ?? routeIds[currentIndex + 1]);
  const destination = getLocationById(locations, routeIds[routeIds.length - 1]);
  const maneuverLocation = nextLocation;
  const heading = nextSegment ? headingBetween(nextSegment.points[0], nextSegment.points[nextSegment.points.length - 1]) : 0;
  const remainingSegments = routeSegments.slice(currentIndex);
  const remainingDistanceFeet = remainingSegments.reduce((total, segment) => total + segment.connection.distanceFeet, 0);
  const remainingMinutes = remainingSegments.reduce((total, segment) => total + segment.connection.estimatedMinutes, 0);
  const completionPercent = routeSegments.length > 0 ? Math.round((completedSegments.length / routeSegments.length) * 100) : 0;

  return {
    routeSegments,
    completedSegments,
    upcomingSegments,
    nextSegment,
    currentLocation,
    nextLocation,
    destination,
    maneuverLocation,
    heading,
    completionPercent,
    remainingDistanceFeet,
    remainingMinutes: Math.max(1, remainingMinutes)
  };
}

export function viewBoxForRouteState(routeState: MapRouteState, viewMode: MapViewMode): string {
  if (viewMode !== "guidance" || !routeState.currentLocation || !routeState.nextLocation) {
    return "0 0 100 100";
  }

  const points = [
    { x: routeState.currentLocation.x, y: routeState.currentLocation.y },
    { x: routeState.nextLocation.x, y: routeState.nextLocation.y },
    ...(routeState.nextSegment?.points ?? [])
  ];
  const minX = Math.max(0, Math.min(...points.map((point) => point.x)) - 16);
  const minY = Math.max(0, Math.min(...points.map((point) => point.y)) - 16);
  const maxX = Math.min(100, Math.max(...points.map((point) => point.x)) + 16);
  const maxY = Math.min(100, Math.max(...points.map((point) => point.y)) + 16);
  const size = Math.max(maxX - minX, maxY - minY, 62);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const startX = Math.max(0, Math.min(100 - size, centerX - size / 2));
  const startY = Math.max(0, Math.min(100 - size, centerY - size / 2));

  return `${startX} ${startY} ${size} ${size}`;
}

export function alertPoint(alert: ContextualAlert, locations: AirportLocation[]): MapPoint | null {
  const location = getLocationById(locations, alert.locationId);
  return location ? { x: location.x, y: location.y } : null;
}
