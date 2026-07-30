import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { imageRightsRegistry, isPresentationPermissionStatus } from "./gspImageRights";
import { landmarkVisualLibrary } from "./landmarkVisuals";
import { airportLocations, routeConnections } from "./mockData";
import { calculateRoute } from "./routeEngine";

describe("Beacon route engine", () => {
  it("avoids stairs for mobility support routes", () => {
    const route = calculateRoute({
      startId: "parking-garage",
      destinationId: "gate-a1",
      preferences: ["wheelchair", "avoidStairs"]
    });

    expect(route.locationIds).toContain("elevators");
    expect(route.locationIds).not.toContain("stairs");
  });

  it("avoids closed route segments", () => {
    const route = calculateRoute({
      startId: "security-checkpoint",
      destinationId: "concourse-entrance",
      connections: routeConnections.map((connection) =>
        connection.id === "security-stairs" || connection.id === "security-concourse"
          ? { ...connection, closed: true }
          : connection
      )
    });

    expect(route.locationIds).toEqual(["security-checkpoint", "elevators", "concourse-entrance"]);
  });

  it("adds a quiet space stop when requested", () => {
    const route = calculateRoute({
      startId: "parking-garage",
      destinationId: "gate-a1",
      preferences: ["quietStop", "reducedStimulation", "avoidCrowds"]
    });

    expect(route.locationIds).toContain("quiet-space");
    expect(route.steps.some((step) => step.instruction.toLowerCase().includes("quiet space"))).toBe(true);
  });

  it("routes directly to the simulated Nursing Room", () => {
    const route = calculateRoute({
      startId: "main-entrance",
      destinationId: "nursing-room"
    });

    const finalStep = route.steps[route.steps.length - 1];

    expect(route.locationIds[route.locationIds.length - 1]).toBe("nursing-room");
    expect(finalStep?.visualId).toBe("nursing-room-entrance");
    expect(finalStep?.recognitionCue).toBe(
      "Look for the private entrance beneath the Nursing Room sign."
    );
  });

  it("classifies the Nursing Room location as simulated", () => {
    const nursingRoom = airportLocations.find((location) => location.id === "nursing-room");

    expect(nursingRoom).toMatchObject({
      name: "Nursing Room",
      type: "restroom",
      classification: "simulated"
    });
  });

  it("resolves the Nursing Room visual ID with its recognition cue", () => {
    const visual = landmarkVisualLibrary["nursing-room-entrance"];

    expect(visual.actualOrSimulated).toBe("simulated");
    expect(visual.overlayLabel).toBe("NURSING ROOM");
    expect(visual.imageWidth).toBe(1448);
    expect(visual.imageHeight).toBe(1086);
    expect(visual.altText).toBe("A private airport nursing room entrance with a wide accessible approach.");
    expect(visual.recognitionCue).toBe("Look for the private entrance beneath the Nursing Room sign.");
  });

  it("uses lower-crowd routing when requested", () => {
    const route = calculateRoute({
      startId: "security-checkpoint",
      destinationId: "gate-b2",
      preferences: ["avoidCrowds", "reducedStimulation"]
    });

    expect(route.locationIds).toContain("alternate-hallway");
  });

  it("attaches environmental preview metadata to each step", () => {
    const route = calculateRoute({
      startId: "main-entrance",
      destinationId: "gate-a12",
      preferences: ["simplifiedDirections", "quietStop", "tsaPreCheck"]
    });

    expect(route.steps.length).toBeGreaterThan(0);
    expect(route.steps.every((step) => step.visualId && step.altText && step.recognitionCue)).toBe(true);
    expect(route.steps.every((step) => step.directionOverlay && step.accessibilityDescription)).toBe(true);
    expect(route.steps.map((step) => step.visualId)).toEqual(
      expect.arrayContaining(["tsa-precheck", "quiet-space", "gate-a12-podium"])
    );
  });

  it("uses approved GSP or simulated local assets for the GSP demonstration sequence", () => {
    const gspVisualIds = [
      "main-entrance",
      "delta-check-in",
      "tsa-precheck",
      "information-desk-approach",
      "post-security-concourse",
      "concourse-a-entrance",
      "quiet-space",
      "gate-a12-podium"
    ] as const;

    gspVisualIds.forEach((visualId) => {
      const visual = landmarkVisualLibrary[visualId];
      const rightsRecord = imageRightsRegistry[visual.rightsRecordId];

      expect(rightsRecord).toBeDefined();
      expect(isPresentationPermissionStatus(visual.permissionStatus)).toBe(true);
      expect(visual.imageSrc).toBeTruthy();
      expect(visual.imageSrc).not.toMatch(/^https?:\/\//);
      expect(existsSync(resolve(process.cwd(), rightsRecord.localFilePath))).toBe(true);
      expect(visual.imageWidth).toBe(1448);
      expect(visual.imageHeight).toBe(1086);
      expect(visual.authenticityLabel).toBe(
        visual.actualOrSimulated === "actual" ? "GSP location preview" : "Simulated visual"
      );
      expect(visual.reviewChecks.every((check) => check.status === "pass")).toBe(true);
    });
  });

  it("keeps the full visual registry presentation-safe", () => {
    Object.values(landmarkVisualLibrary).forEach((visual) => {
      const rightsRecord = imageRightsRegistry[visual.rightsRecordId];

      expect(visual.imageSrc, visual.id).toBeTruthy();
      expect(visual.imageSrc, visual.id).not.toMatch(/^https?:\/\//);
      expect(visual.altText.trim(), visual.id).toBeTruthy();
      expect(visual.recognitionCue.trim(), visual.id).toBeTruthy();
      expect(visual.source, visual.id).toBe(visual.imageSrc);
      expect(rightsRecord, visual.id).toBeDefined();
      expect(rightsRecord.permissionStatus, visual.id).toBe(visual.permissionStatus);
      expect(isPresentationPermissionStatus(visual.permissionStatus), visual.id).toBe(true);
      expect(existsSync(resolve(process.cwd(), rightsRecord.localFilePath)), visual.id).toBe(true);

      if (visual.actualOrSimulated === "actual") {
        expect(visual.authenticityLabel, visual.id).toBe("GSP location preview");
        expect(visual.simulatedLabel, visual.id).toBe(false);
        expect(visual.permissionStatus, visual.id).toBe("GSP Supplied");
      } else {
        expect(visual.authenticityLabel, visual.id).toBe("Simulated visual");
        expect(visual.simulatedLabel, visual.id).toBe(true);
      }
    });
  });
});
