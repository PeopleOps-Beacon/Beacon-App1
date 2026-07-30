import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { UserRoleProvider } from "./UserRoleContext";
import { useUserRole } from "../hooks/useUserRole";

function RoleProbe() {
  const { role, roleLabel, setRole } = useUserRole();

  return (
    <div>
      <span>{role}</span>
      <strong>{roleLabel}</strong>
      <button onClick={() => setRole("airport-operations")} type="button">Switch role</button>
    </div>
  );
}

describe("UserRoleContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to demo mode and supports role switching", async () => {
    const user = userEvent.setup();
    render(
      <UserRoleProvider>
        <RoleProbe />
      </UserRoleProvider>
    );

    expect(screen.getByText("demo-mode")).toBeInTheDocument();
    expect(screen.getByText("Demo Mode")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /switch role/i }));

    expect(screen.getByText("airport-operations")).toBeInTheDocument();
    expect(screen.getByText("Airport Operations")).toBeInTheDocument();
  });
});
