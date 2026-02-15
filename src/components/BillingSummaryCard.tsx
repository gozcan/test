export function BillingSummaryCard() {
  return (
    <section style={{ background: "white", borderRadius: 14, padding: 20, marginTop: 16 }}>
      <h2>Token and Seat Billing</h2>
      <ul>
        <li>Monthly plan includes base tokens.</li>
        <li>Additional tokens can be purchased on demand.</li>
        <li>Each subscription includes 3 seats; extra seats are billable.</li>
      </ul>
    </section>
  );
}
