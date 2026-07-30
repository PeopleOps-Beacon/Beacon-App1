import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BeaconWayfindingApp } from "../BeaconWayfindingApp";
import { simulatedExecutiveInsights } from "../mockData";
import { ExecutiveInsights } from "./ExecutiveInsights";

const metricLabels = [
  "Simulated journeys",
  "Average journey time",
  "Accessibility route percentage",
  "Most requested destination",
  "Most requested traveler service",
  "Passenger satisfaction",
  "Assistance requests",
  "Potential Staff Interactions Reduced"
];

describe("ExecutiveInsights", () => {
  it("renders the eight metrics with clear simulation disclosure", () => {
    render(<ExecutiveInsights insights={simulatedExecutiveInsights} onBack={() => undefined} />);

    expect(screen.getByRole("heading", { name: "Executive Insights" })).toBeInTheDocument();
    expect(screen.getByText("Simulated Demonstration Data")).toBeInTheDocument();
    expect(
      screen.getByText(
        "These metrics demonstrate the type of operational insight Beacon could provide in a live airport deployment."
      )
    ).toBeInTheDocument();

    metricLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    expect(
      screen.getByText("Illustrative estimate based on simulated wayfinding and assistance scenarios.")
    ).toBeInTheDocument();
  });

  it("opens from the admin navigation", () => {
    render(<BeaconWayfindingApp />);

    fireEvent.click(screen.getByRole("button", { name: "Demo Admin" }));
    fireEvent.click(screen.getByRole("button", { name: "Executive Insights" }));

    expect(screen.getByRole("heading", { name: "Executive Insights" })).toBeInTheDocument();
  });
});
