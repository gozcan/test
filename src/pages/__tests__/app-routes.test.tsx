import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../../App";

describe("app routes", () => {
  it("renders dashboard route by default", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 2, name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
  });

  it("renders expenses route", () => {
    render(
      <MemoryRouter initialEntries={["/expenses"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 2, name: "Expenses" })).toBeInTheDocument();
  });
});
