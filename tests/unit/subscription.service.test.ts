import { describe, expect, it } from "vitest";
import { getSubscriptionSnapshot } from "../../src/services/subscription.service";

describe("subscription service", () => {
  it("returns starter plan defaults with included tokens and seats", () => {
    const snapshot = getSubscriptionSnapshot();

    expect(snapshot.plan).toBe("starter");
    expect(snapshot.included_tokens_monthly).toBe(100000);
    expect(snapshot.tokens_used).toBe(0);
    expect(snapshot.included_seats).toBe(3);
    expect(snapshot.seats_used).toBe(1);
  });

  it("marks token and seat add-ons as purchasable", () => {
    const snapshot = getSubscriptionSnapshot();

    expect(snapshot.can_purchase_extra_tokens).toBe(true);
    expect(snapshot.can_purchase_extra_seats).toBe(true);
  });
});
