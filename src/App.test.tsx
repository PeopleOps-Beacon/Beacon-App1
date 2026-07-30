import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";

async function selectBasicJourney(user: ReturnType<typeof userEvent.setup>) {
  render(<App />);

  await user.click(screen.getByRole("button", { name: /start navigation/i }));
  await user.click(screen.getByRole("button", { name: /parking garage/i }));
  await user.click(screen.getByRole("button", { name: /^gate a1\b/i }));
}

describe("Beacon Wayfinding Technologies proof of concept", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("selects a starting point", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /start navigation/i }));
    await user.click(screen.getByRole("button", { name: /parking garage/i }));

    expect(screen.getByRole("heading", { name: /where are you going/i })).toBeInTheDocument();
  });

  it("selects a destination and prevents duplicate start and destination", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /start navigation/i }));
    await user.click(screen.getByRole("button", { name: /parking garage/i }));

    expect(screen.getByRole("button", { name: /parking garage/i })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /^gate a1\b/i }));

    expect(screen.getByRole("heading", { name: /what support would help/i })).toBeInTheDocument();
  });

  it("finds and selects the simulated Nursing Room in location search", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /start navigation/i }));
    await user.click(screen.getByRole("button", { name: /main entrance/i }));
    await user.type(screen.getByPlaceholderText(/search airport locations/i), "nursing room");

    const nursingRoom = screen.getByRole("button", { name: /nursing room/i });
    expect(nursingRoom).toHaveTextContent(/a private space for nursing, pumping, and infant care/i);
    expect(nursingRoom).toHaveTextContent(/simulated location/i);

    await user.click(nursingRoom);
    expect(screen.getByRole("heading", { name: /what support would help/i })).toBeInTheDocument();
  });

  it("applies accessibility preferences from a traveler profile", async () => {
    const user = userEvent.setup();
    await selectBasicJourney(user);

    const mobilityProfile = screen.getByRole("button", { name: /mobility support/i });
    await user.click(mobilityProfile);

    expect(mobilityProfile).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("checkbox", { name: /wheelchair accessible route/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /generate route/i }));

    expect(screen.getByText(/mobility support/i)).toBeInTheDocument();
  });

  it("generates a personalized route", async () => {
    const user = userEvent.setup();
    await selectBasicJourney(user);

    await user.click(screen.getByRole("button", { name: /generate route/i }));

    expect(screen.getByRole("heading", { name: /your route is ready/i })).toBeInTheDocument();
    expect(screen.getAllByText(/parking garage/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/gate a1/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/the next few steps/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /begin navigation/i })).toBeEnabled();
  });

  it("selects a simulated airline flight during planning", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /start navigation/i }));
    await user.click(screen.getByRole("button", { name: /main entrance/i }));
    await user.click(screen.getByRole("button", { name: /delta 1842/i }));

    expect(screen.getByRole("heading", { name: /what support would help/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /i have tsa precheck/i })).toBeChecked();

    await user.click(screen.getByRole("button", { name: /generate route/i }));

    expect(screen.getByText(/delta 1842/i)).toBeInTheDocument();
    expect(screen.getAllByText(/tsa precheck/i).length).toBeGreaterThan(0);
  });

  it("moves through the focused passenger route screens", async () => {
    const user = userEvent.setup();
    await selectBasicJourney(user);

    await user.click(screen.getByRole("button", { name: /generate route/i }));
    await user.click(screen.getByRole("button", { name: /begin navigation/i }));

    expect(screen.getByRole("heading", { name: /gate a1/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/destination status/i)).toBeInTheDocument();
    expect(screen.getByText(/step 1 of/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what you will see/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next step/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /view map/i }));
    expect(screen.getByLabelText(/full route/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /more/i }));
    expect(screen.getByRole("heading", { name: /landmark directions/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /alerts/i }));
    expect(screen.getByRole("heading", { name: /alerts along your route/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /back to navigation/i }));
    expect(screen.getByLabelText(/destination status/i)).toBeInTheDocument();

    for (let index = 0; index < 10; index += 1) {
      const nextButton =
        screen.queryByRole("button", { name: /next step/i }) ?? screen.queryByRole("button", { name: /i am here/i });
      if (!nextButton) {
        break;
      }
      await user.click(nextButton);
    }

    expect(screen.getByRole("heading", { name: /you have arrived/i })).toBeInTheDocument();
    expect(screen.getAllByText(/gate a1/i).length).toBeGreaterThan(0);
  });

  it("starts the GSP executive walkthrough from a clean route summary", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /gsp executive walkthrough/i }));

    expect(screen.getByRole("heading", { name: /your route is ready/i })).toBeInTheDocument();
    expect(screen.getByText(/gsp stakeholder demonstration/i)).toBeInTheDocument();
    expect(screen.getAllByText(/main entrance/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/gate a12/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/calm and simple route/i)).toBeInTheDocument();
    expect(screen.getByText(/delta 1842/i)).toBeInTheDocument();
    expect(screen.getAllByText(/tsa precheck/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /begin navigation/i }));

    expect(screen.getByRole("heading", { name: /gate a12/i })).toBeInTheDocument();
    expect(screen.getByText(/step 1 of 7/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what you will see/i)).toBeInTheDocument();
    expect(screen.getAllByText(/delta air lines check in/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /view map/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /assistance/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next step/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next step/i }));

    expect(await screen.findByText(/a quieter route is ready/i)).toBeInTheDocument();
  });

  it("submits a simulated assistance request", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: /request assistance/i })[0]);
    await user.click(screen.getByRole("button", { name: /request airport staff/i }));

    expect(screen.getByText(/your assistance request has been received/i)).toBeInTheDocument();
    expect(screen.getByText(/no real calls are made/i)).toBeInTheDocument();
  });

  it("creates an administrative alert", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /demo admin/i }));
    expect(screen.getByRole("heading", { name: /visual review/i })).toBeInTheDocument();
    expect(screen.getAllByText(/service animal relief area/i).length).toBeGreaterThan(0);
    const alertsSection = screen.getByRole("heading", { name: /manage alerts/i }).closest("section");
    expect(alertsSection).not.toBeNull();
    const alerts = within(alertsSection as HTMLElement);

    await user.type(alerts.getByLabelText(/alert title/i), "Alternate route recommended");
    await user.type(alerts.getByLabelText(/alert message/i), "Use the quieter hallway near Gate B1.");
    await user.selectOptions(alerts.getByLabelText(/location/i), "alternate-hallway");
    await user.click(alerts.getByRole("button", { name: /create alert/i }));

    expect(alerts.getByText(/alternate route recommended/i)).toBeInTheDocument();
  });
});
