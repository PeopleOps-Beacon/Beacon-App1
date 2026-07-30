import type {
  AirportLocation,
  NavigationEdge,
  NavigationGraph,
  NavigationNode,
  Route,
  RouteStep,
  TravelerModeId
} from "../types";
import { estimateWalkTime } from "./navigation";

function distanceBetween(first: AirportLocation, second: AirportLocation): number {
  const floorPenalty = Math.abs(first.floor - second.floor) * 180;
  const dx = first.x - second.x;
  const dy = first.y - second.y;
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 18 + floorPenalty);
}

export function buildNavigationGraph(locations: AirportLocation[]): NavigationGraph {
  const nodes: NavigationNode[] = locations.map((location) => ({
    id: location.id,
    locationId: location.id,
    x: location.x,
    y: location.y,
    floor: location.floor,
    label: location.name
  }));
  const edges: NavigationEdge[] = [];

  locations.forEach((location) => {
    const neighbors = locations
      .filter((candidate) => candidate.id !== location.id)
      .map((candidate) => ({
        candidate,
        distance: distanceBetween(location, candidate)
      }))
      .sort((first, second) => first.distance - second.distance)
      .slice(0, 4);

    neighbors.forEach(({ candidate, distance }) => {
      edges.push({
        id: `${location.id}-${candidate.id}`,
        from: location.id,
        to: candidate.id,
        distanceFeet: distance,
        accessible:
          location.accessibilityFeatures.includes("step-free") &&
          candidate.accessibilityFeatures.includes("step-free"),
        landmark: candidate.category === "dining" ? candidate.name : undefined
      });
    });
  });

  return { nodes, edges };
}

export function findShortestPath(
  graph: NavigationGraph,
  startNodeId: string,
  endNodeId: string,
  requireAccessible: boolean
): string[] {
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set(graph.nodes.map((node) => node.id));

  graph.nodes.forEach((node) => {
    distances.set(node.id, node.id === startNodeId ? 0 : Number.POSITIVE_INFINITY);
    previous.set(node.id, null);
  });

  while (unvisited.size > 0) {
    const current = [...unvisited].sort(
      (first, second) => (distances.get(first) ?? Infinity) - (distances.get(second) ?? Infinity)
    )[0];

    if (!current || current === endNodeId) {
      break;
    }

    unvisited.delete(current);

    graph.edges
      .filter((edge) => edge.from === current && (!requireAccessible || edge.accessible))
      .forEach((edge) => {
        const nextDistance = (distances.get(current) ?? Infinity) + edge.distanceFeet;
        if (nextDistance < (distances.get(edge.to) ?? Infinity)) {
          distances.set(edge.to, nextDistance);
          previous.set(edge.to, current);
        }
      });
  }

  const path: string[] = [];
  let current: string | null = endNodeId;

  while (current) {
    path.unshift(current);
    current = previous.get(current) ?? null;
  }

  return path[0] === startNodeId ? path : [startNodeId, endNodeId];
}

export function createRouteFromGraph(
  graph: NavigationGraph,
  locations: AirportLocation[],
  from: AirportLocation,
  to: AirportLocation,
  travelerMode: TravelerModeId
): Route {
  const requireAccessible = travelerMode === "accessibility";
  const nodePath = findShortestPath(graph, from.id, to.id, requireAccessible);
  const nodeLocations = nodePath
    .map((id) => locations.find((location) => location.id === id))
    .filter((location): location is AirportLocation => Boolean(location));
  const path = nodeLocations.map((location) => ({ x: location.x, y: location.y }));
  const distanceFeet = nodeLocations.slice(1).reduce((total, location, index) => {
    return total + distanceBetween(nodeLocations[index], location);
  }, 0);
  const steps = buildRouteSteps(nodeLocations, distanceFeet);

  return {
    id: `${from.id}-${to.id}-${travelerMode}-graph`,
    from,
    to,
    distanceFeet,
    estimatedWalkMinutes: estimateWalkTime(distanceFeet, travelerMode),
    stepCount: Math.max(2, steps.length),
    steps,
    path,
    accessible: requireAccessible || to.accessibilityFeatures.includes("step-free")
  };
}

export function createGraphRoute(
  locations: AirportLocation[],
  from: AirportLocation,
  to: AirportLocation,
  travelerMode: TravelerModeId
): Route {
  return createRouteFromGraph(buildNavigationGraph(locations), locations, from, to, travelerMode);
}

function buildRouteSteps(path: AirportLocation[], totalDistanceFeet: number): RouteStep[] {
  let remaining = totalDistanceFeet;

  return path.slice(1).map((location, index) => {
    const previous = path[index];
    const segmentDistance = distanceBetween(previous, location);
    remaining = Math.max(0, remaining - segmentDistance);

    return {
      id: `step-${index + 1}`,
      instruction:
        index === path.length - 2
          ? `Proceed to ${location.name}. Destination will be on your right.`
          : `Continue ${segmentDistance} feet toward ${location.name}.`,
      distanceFeet: segmentDistance,
      remainingDistanceFeet: remaining
    };
  });
}
