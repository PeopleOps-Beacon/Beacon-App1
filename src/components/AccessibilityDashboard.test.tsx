import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { DemoDataGenerator } from "../services/DemoDataGenerator";
import { AccessibilityDashboard } from "./AccessibilityDashboard";

describe("AccessibilityDashboard", () => {
  it("renders accessibility monitoring metrics", () => {
    const demoData = DemoDataGenerator.generate(airports[0]);

    render(<AccessibilityDashboard metrics={demoData.accessibility} />);

    expect(screen.getByRole("heading", { name: /accessibility monitoring/i })).toBeInTheDocument();
    expect(screen.getByText(/Elevators Available/i)).toBeInTheDocument();
    expect(screen.getByText(/Wheelchair Assistance Requests/i)).toBeInTheDocument();
  });
});
