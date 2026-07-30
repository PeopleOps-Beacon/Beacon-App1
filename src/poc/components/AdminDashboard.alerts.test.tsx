import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { accessibilityStatus, airportLocations, mockAlerts, routeConnections } from "../mockData";
import { AdminDashboard } from "./AdminDashboard";

function renderDashboard(overrides: { alerts?: typeof mockAlerts } = {}) {
  const onAlertsChange = vi.fn();
  const onAccessibilityStatusChange = vi.fn();
  render(
    <AdminDashboard
      locations={airportLocations}
      connections={routeConnections}
      alerts={overrides.alerts ?? mockAlerts}
      assistanceRequests={[]}
      accessibilityStatus={accessibilityStatus}
      route={null}
      onBack={() => undefined}
      onExecutiveInsights={() => undefined}
      onLocationsChange={() => undefined}
      onConnectionsChange={() => undefined}
      onAlertsChange={onAlertsChange}
      onAssistanceRequestsChange={() => undefined}
      onAccessibilityStatusChange={onAccessibilityStatusChange}
    />
  );
  return { onAlertsChange, onAccessibilityStatusChange };
}

describe("AdminDashboard operational alerts", () => {
  it("creates an alert with the focused staff fields", () => {
    const { onAlertsChange } = renderDashboard({ alerts: [] });
    fireEvent.change(screen.getAllByLabelText("Type")[1], { target: { value: "route-closure" } });
    fireEvent.change(screen.getByLabelText("Alert title"), { target: { value: "Corridor closed" } });
    fireEvent.change(screen.getByLabelText("Short message"), { target: { value: "Follow Beacon's alternate route." } });
    fireEvent.change(screen.getByLabelText("Affected location"), { target: { value: "concourse-entrance" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Alert" }));

    expect(onAlertsChange).toHaveBeenCalledWith([
      expect.objectContaining({
        type: "route-closure",
        title: "Corridor closed",
        message: "Follow Beacon's alternate route.",
        locationId: "concourse-entrance"
      })
    ]);
  });

  it("edits an existing alert without changing its identity", () => {
    const existing = [mockAlerts[0]];
    const { onAlertsChange } = renderDashboard({ alerts: existing });
    fireEvent.click(screen.getByRole("button", { name: `Edit ${existing[0].title}` }));
    fireEvent.change(screen.getByLabelText("Alert title"), { target: { value: "Checkpoint delay" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Alert" }));

    expect(onAlertsChange).toHaveBeenCalledWith([
      expect.objectContaining({ id: existing[0].id, type: existing[0].type, title: "Checkpoint delay" })
    ]);
  });

  it("connects elevator availability to the simulated outage alert", () => {
    const { onAlertsChange, onAccessibilityStatusChange } = renderDashboard();
    fireEvent.click(screen.getByLabelText("Elevator availability"));
    expect(onAccessibilityStatusChange).toHaveBeenCalledWith(
      expect.objectContaining({ elevatorsAvailable: false })
    );
    expect(onAlertsChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ type: "elevator-unavailable", active: true })])
    );
  });
});
