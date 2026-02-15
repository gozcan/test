import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("defaults to button type to avoid accidental form submission", () => {
    render(<Button>Create</Button>);

    expect(screen.getByRole("button", { name: "Create" })).toHaveAttribute("type", "button");
  });

  it("applies variant and size classes", () => {
    render(
      <Button variant="secondary" size="lg">
        Configure
      </Button>
    );

    const button = screen.getByRole("button", { name: "Configure" });
    expect(button.className).toContain("btn-secondary");
    expect(button.className).toContain("btn-lg");
  });
});
