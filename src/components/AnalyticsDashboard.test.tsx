import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { DemoDataGenerator } from "../services/DemoDataGenerator";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

describe("AnalyticsDashboard", () => {
  it("renders responsive mock analytics charts", () => {
    const demoData = DemoDataGenerator.generate(airports[0]);

    render(<AnalyticsDashboard analytics={demoData.analytics} />);

    expect(screen.getByRole("heading", { name: /airport analytics/i })).toBeInTheDocument();
    expect(screen.getByText(/Daily Travelers/i)).toBeInTheDocument();
    expect(screen.getByText(/Navigation Success Rate/i)).toBeInTheDocument();
  });
});
