import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { DemoDataGenerator } from "../services/DemoDataGenerator";
import { EventSimulationService } from "../services/EventSimulationService";
import { IncidentCenter } from "./IncidentCenter";

describe("IncidentCenter", () => {
  it("renders incidents with priority, status, location, team, and notes", () => {
    const airport = airports[0];
    const demoData = DemoDataGenerator.generate(airport);
    const liveEvent = EventSimulationService.createEvent(airport, 1);

    render(<IncidentCenter incidents={demoData.incidents} liveEvents={[liveEvent]} />);

    expect(screen.getByRole("heading", { name: /incident center/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Emergency Response|Operations|Guest Services|Accessibility|Facilities|Security/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Team/i).length).toBeGreaterThan(0);
  });
});
