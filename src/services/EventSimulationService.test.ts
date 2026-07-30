import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { EventSimulationService } from "./EventSimulationService";

describe("EventSimulationService", () => {
  it("creates and advances simulated live airport events", () => {
    const airport = airports[0];
    const initial = EventSimulationService.createInitialEvents(airport, 2);
    const advanced = EventSimulationService.advanceEvents(airport, initial, 4);

    expect(initial).toHaveLength(2);
    expect(advanced).toHaveLength(3);
    expect(advanced[0].locationName).toBeTruthy();
    expect(EventSimulationService.toTimelineEvent(advanced[0]).timestamp).toBe(advanced[0].createdAt);
  });
});
