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

    expect(screen.getByRole("heading", { name: /noise reduced/i })).toBeInTheDocument();
    expect(screen.getByText(/lower noise exposure/i)).toBeInTheDocument();
  });
});
