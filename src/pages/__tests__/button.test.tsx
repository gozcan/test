import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../../lib/ui/button";

describe("button", () => {
  it("fires click handlers", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Save Policy</Button>);

    await user.click(screen.getByRole("button", { name: "Save Policy" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
