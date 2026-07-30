import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CalculatedRoute } from "../types";
import { ArrivalConfirmation } from "./ArrivalConfirmation";

const route: CalculatedRoute = {
  locationIds: ["main-entrance", "restroom", "quiet-space", "gate-a12"],
  steps: [],
  distanceFeet: 1320,
  estimatedMinutes: 12,
  alerts: [],
  preferences: ["wheelchair", "avoidStairs", "largerText", "reducedStimulation", "quietStop", "restroomStop"]
};

function renderArrival(onEnd = vi.fn(), onPlanAnotherRoute = vi.fn()) {
  render(
    <ArrivalConfirmation
      destinationName="Gate A12"
      onEnd={onEnd}
      onPlanAnotherRoute={onPlanAnotherRoute}
      profileId="sensory"
      route={route}
    />
  );

  return { onEnd, onPlanAnotherRoute };
}

describe("ArrivalConfirmation", () => {
  it("renders Journey Complete with exactly the six required summary values", () => {
    renderArrival();

    expect(screen.getByRole("heading", { name: "Journey Complete" })).toBeInTheDocument();
    expect(screen.getByText("You have arrived at Gate A12.")).toBeInTheDocument();

    [
      "Destination",
      "Estimated Journey Time",
      "Route Profile Used",
      "Accessibility Support Used",
      "Optional Stops",
      "Route Updates"
    ].forEach((label) => expect(screen.getByText(label)).toBeInTheDocument());

    expect(screen.getByText("12 min")).toBeInTheDocument();
    expect(screen.getByText("Calm and Simple")).toBeInTheDocument();
    expect(
      screen.getByText("Wheelchair Accessible, Avoid Stairs, Large Text, Reduced Stimulation")
    ).toBeInTheDocument();
    expect(screen.getByText("2 stops")).toBeInTheDocument();
    expect(screen.getByText("No Route Changes")).toBeInTheDocument();
  });

  it("does not count the final destination as an optional stop", () => {
    render(
      <ArrivalConfirmation
        destinationName="Quiet Space"
        onEnd={() => undefined}
        onPlanAnotherRoute={() => undefined}
        profileId="standard"
        route={{ ...route, locationIds: ["main-entrance", "restroom", "quiet-space"], preferences: [] }}
      />
    );

    expect(screen.getByText("1 stop")).toBeInTheDocument();
    expect(screen.getByText("Standard Route")).toBeInTheDocument();
  });

  it("stores one-tap feedback in local component state", () => {
    renderArrival();
    const feedback = screen.getByRole("button", { name: "Great" });

    fireEvent.click(feedback);

    expect(feedback).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Great selected")).toBeInTheDocument();
  });

  it("keeps End Journey and Plan Another Route connected to their existing callbacks", () => {
    const { onEnd, onPlanAnotherRoute } = renderArrival();

    fireEvent.click(screen.getByRole("button", { name: "End Journey" }));
    fireEvent.click(screen.getByRole("button", { name: "Plan Another Route" }));

    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(onPlanAnotherRoute).toHaveBeenCalledTimes(1);
  });
});
