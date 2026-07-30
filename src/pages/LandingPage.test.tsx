import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LandingPage } from "./LandingPage";

describe("LandingPage", () => {
  it("renders executive messaging and launches demo mode", async () => {
    const user = userEvent.setup();
    const onLaunchDemo = vi.fn();

    render(<LandingPage onEnterProduct={vi.fn()} onLaunchDemo={onLaunchDemo} />);

    expect(
      screen.getByRole("heading", { name: /airport intelligence that feels calm, premium, and decisive/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /how beacon guides the journey/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /launch executive demo/i }));

    expect(onLaunchDemo).toHaveBeenCalled();
  });
});
