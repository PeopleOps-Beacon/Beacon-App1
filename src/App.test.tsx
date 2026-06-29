import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("Beacon OS", () => {
  it("renders Firebase-ready account access", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /traveler-safe sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
  });

  it("switches traveler modes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /sensory/i }));

    await user.type(screen.getByRole("combobox", { name: /find a destination/i }), "quiet");
    await user.click(screen.getByRole("option", { name: /quiet room/i }));

    expect(screen.getByText(/lower-noise route selected/i)).toBeInTheDocument();
  });

  it("selects a destination and starts mock navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole("combobox", { name: /find a destination/i }), "gate a7");
    await user.keyboard("{Enter}");

    expect(screen.getByRole("heading", { name: /^gate a7$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /route to gate a7/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /mark arrived/i }));

    expect(screen.getByText(/arrival confirmed/i)).toBeInTheDocument();
  });
});
