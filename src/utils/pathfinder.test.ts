import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { buildNavigationGraph, createGraphRoute, findShortestPath } from "./pathfinder";

const airport = airports[0];
const start = airport.locations.find((location) => location.name === "Information Desk") ?? airport.locations[0];
const end = airport.locations.find((location) => location.name === "Gate A7") ?? airport.locations[1];

describe("pathfinder", () => {
  it("builds a graph from airport locations", () => {
    const graph = buildNavigationGraph(airport.locations);

    expect(graph.nodes.length).toBe(airport.locations.length);
    expect(graph.edges.length).toBeGreaterThan(airport.locations.length);
  });

  it("finds a Dijkstra path between two airport nodes", () => {
    const graph = buildNavigationGraph(airport.locations);
    const path = findShortestPath(graph, start.id, end.id, false);

    expect(path[0]).toBe(start.id);
    expect(path[path.length - 1]).toBe(end.id);
  });

  it("creates turn-by-turn route metadata", () => {
    const route = createGraphRoute(airport.locations, start, end, "accessibility");

    expect(route.steps.length).toBeGreaterThan(0);
    expect(route.steps[0].remainingDistanceFeet).toBeTypeOf("number");
    expect(route.estimatedWalkMinutes).toBeGreaterThan(0);
  });
});
