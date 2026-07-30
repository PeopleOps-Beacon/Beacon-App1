import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { airports } from "../data/airports";
import { DemoMode } from "./DemoMode";

describe("DemoMode", () => {
  it("steps through scenarios and applies a selected scenario", async () => {
    const user = userEvent.setup();
    const onSelectDestination = vi.fn();
    const onSetTravelerMode = vi.fn();

    render(
      <DemoMode
        airport={airports[0]}
        onClose={vi.fn()}
        onSelectDestination={onSelectDestination}
        onSetTravelerMode={onSetTravelerMode}
      />
    );

    expect(screen.getByRole("heading", { name: /veteran with ptsd/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByRole("heading", { name: /traveler using wheelchair/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /apply scenario/i }));
    expect(onSetTravelerMode).toHaveBeenCalledWith("accessibility");
    expect(onSelectDestination).toHaveBeenCalled();
  });
});
