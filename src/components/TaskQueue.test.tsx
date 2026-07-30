import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { DemoDataGenerator } from "../services/DemoDataGenerator";
import { TaskQueue } from "./TaskQueue";

describe("TaskQueue", () => {
  it("renders staff tasks with priority, assignment, status, and ETA", () => {
    const demoData = DemoDataGenerator.generate(airports[0]);

    render(<TaskQueue tasks={demoData.tasks} />);

    expect(screen.getByRole("heading", { name: /task queue/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Escort Traveler|Accessibility Assistance|Maintenance Request|Cleaning Request|Customer Assistance|Security Response/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ETA/i).length).toBeGreaterThan(0);
  });
});
