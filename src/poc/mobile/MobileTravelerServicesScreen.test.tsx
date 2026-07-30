import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { airportLocations } from "../mockData";
import { MobileLocationSelectionScreen } from "./MobileLocationSelectionScreen";
import { MobileTravelerServicesScreen } from "./MobileTravelerServicesScreen";

const existingServices = [
  ["Restroom", "restroom"],
  ["Nursing Room", "nursing-room"],
  ["Quiet Space", "quiet-space"],
  ["Information Desk", "information-desk"]
] as const;

const missingServices = [
  "Family Restroom",
  "Service Animal Relief Area",
  "Charging Stations",
  "Water Bottle Fill Stations",
  "Food and Coffee",
  "ATM",
  "Lost and Found",
  "Airport Assistance"
];

describe("MobileTravelerServicesScreen", () => {
  it("renders only the four existing traveler services", () => {
    render(
      <MobileTravelerServicesScreen
        locations={airportLocations}
        onBack={() => undefined}
        onSelect={() => undefined}
        selectedId={null}
      />
    );

    expect(screen.getByRole("heading", { name: "Traveler Services" })).toBeInTheDocument();
    existingServices.forEach(([name]) => {
      expect(screen.getByRole("button", { name: `Choose ${name} as destination` })).toBeInTheDocument();
    });
    missingServices.forEach((name) => {
      expect(screen.queryByText(name)).not.toBeInTheDocument();
    });
  });

  it.each(existingServices)("uses the existing destination callback for %s", (name, locationId) => {
    const onSelect = vi.fn();
    render(
      <MobileTravelerServicesScreen
        locations={airportLocations}
        onBack={() => undefined}
        onSelect={onSelect}
        selectedId={null}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: `Choose ${name} as destination` }));

    expect(onSelect).toHaveBeenCalledWith(locationId);
  });

  it("omits an expected service safely when its location is absent", () => {
    render(
      <MobileTravelerServicesScreen
        locations={airportLocations.filter((location) => location.id !== "nursing-room")}
        onBack={() => undefined}
        onSelect={() => undefined}
        selectedId={null}
      />
    );

    expect(screen.queryByText("Nursing Room")).not.toBeInTheDocument();
    expect(screen.getByText("Restroom")).toBeInTheDocument();
  });

  it("opens from Services while keeping direct destination search available", () => {
    render(
      <MobileLocationSelectionScreen
        description="Choose a destination."
        locations={airportLocations}
        onSelect={() => undefined}
        selectedId={null}
        stepLabel="Step 2 of 4"
        title="Where are you going?"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Services" }));
    expect(screen.getByRole("heading", { name: "Traveler Services" })).toBeInTheDocument();

    const searchInput = screen.getByRole("searchbox", { name: "Search locations" });
    fireEvent.change(searchInput, { target: { value: "Quiet Space" } });

    expect(screen.getByRole("button", { name: /Quiet Space/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Traveler Services" })).not.toBeInTheDocument();
  });
});
