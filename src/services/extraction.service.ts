export async function createExpenseDraftFromDocument(input: Record<string, unknown>) {
  const vendor = String(input.vendor ?? "Unknown Vendor");
  const amount = Number(input.amount ?? 0);
  return {
    id: `exp_${Date.now()}`,
    vendor,
    amount,
    currency: "USD",
    status: "draft",
    source: "chatgpt-mini0-batch",
  };
}
