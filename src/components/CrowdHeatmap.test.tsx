import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { DemoDataGenerator } from "../services/DemoDataGenerator";
import { CrowdHeatmap } from "./CrowdHeatmap";

describe("CrowdHeatmap", () => {
  it("renders low, medium, high, and critical crowd legend levels", () => {
    const demoData = DemoDataGenerator.generate(airports[0]);

    render(<CrowdHeatmap zones={demoData.crowdZones} />);

    expect(screen.getByRole("heading", { name: /crowd density/i })).toBeInTheDocument();
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });
});
