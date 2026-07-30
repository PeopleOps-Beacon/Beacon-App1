import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { airportLocations } from "../mockData";
import { calculateRoute } from "../routeEngine";
import { ContextualAlerts } from "./ContextualAlerts";

describe("ContextualAlerts", () => {
  it("shows one stable contextual guidance message for the active step", () => {
    const route = calculateRoute({ startId: "main-entrance", destinationId: "gate-a1", alerts: [] });
    const { container, rerender } = render(
      <ContextualAlerts
        activeStepIndex={0}
        destinationId="gate-a1"
        flight={null}
        locations={airportLocations}
        route={route}
        onBack={() => undefined}
      />
    );
    const title = screen.getByText("Ticket Counter Ahead");

    expect(title).toBeInTheDocument();
    expect(screen.getByText("Current guidance")).toBeInTheDocument();
    expect(container.querySelectorAll(".contextual-alert-card")).toHaveLength(1);

    rerender(
      <ContextualAlerts
        activeStepIndex={0}
        destinationId="gate-a1"
        flight={null}
        locations={airportLocations}
        route={route}
        onBack={() => undefined}
      />
    );
    expect(screen.getByText("Ticket Counter Ahead")).toBeInTheDocument();
    expect(container.querySelectorAll(".contextual-alert-card")).toHaveLength(1);
  });

  it("shows the clear route fallback when no journey step exists", () => {
    render(
      <ContextualAlerts
        activeStepIndex={0}
        destinationId={null}
        flight={null}
        locations={airportLocations}
        route={null}
        onBack={() => undefined}
      />
    );

    expect(screen.getByText("Your current route remains clear.")).toBeInTheDocument();
  });
});
