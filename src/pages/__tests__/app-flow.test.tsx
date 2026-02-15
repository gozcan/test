import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../../App";

describe("app flow", () => {
  it("renders the dashboard by default and navigates between pages", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Expenses" }));
    expect(screen.getByRole("heading", { name: "Expenses" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Settings" }));
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
  });

  it("shows API base fallback configuration", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("/api")).toBeInTheDocument();
  });
});
