import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { GuidedTour } from "./GuidedTour";

describe("GuidedTour", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("walks forward, dismisses, and restarts", async () => {
    const user = userEvent.setup();
    render(<GuidedTour />);

    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByRole("heading", { name: /navigation/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(screen.getByRole("button", { name: /restart guided tour/i })).toBeInTheDocument();
  });
});
