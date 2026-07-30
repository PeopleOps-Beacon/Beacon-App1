import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalyticsLoader, DashboardLoader, MapLoader, NotificationLoader, ProgressIndicator, SearchLoader } from "./LoadingStates";

describe("LoadingStates", () => {
  it("renders accessible loading states", () => {
    render(
      <div>
        <ProgressIndicator label="Preparing demo" />
        <DashboardLoader />
        <MapLoader />
        <AnalyticsLoader />
        <SearchLoader />
        <NotificationLoader />
      </div>
    );

    expect(screen.getByText(/Preparing demo/i)).toBeInTheDocument();
    expect(screen.getByText(/Loading airport map/i)).toBeInTheDocument();
    expect(screen.getByText(/Loading search results/i)).toBeInTheDocument();
  });
});
