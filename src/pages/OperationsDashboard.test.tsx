import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserRoleProvider } from "../context/UserRoleContext";
import { airports } from "../data/airports";
import { OperationsDashboard } from "./OperationsDashboard";

describe("OperationsDashboard", () => {
  it("renders enterprise operations widgets and child dashboards", () => {
    render(
      <UserRoleProvider>
        <OperationsDashboard airport={airports[0]} />
      </UserRoleProvider>
    );

    expect(screen.getByRole("heading", { name: /operations dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/current travelers/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /crowd density/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /incident center/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /airport analytics/i })).toBeInTheDocument();
  });
});
