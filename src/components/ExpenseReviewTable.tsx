export function ExpenseReviewTable() {
  return (
    <section style={{ background: "white", borderRadius: 14, padding: 20, marginTop: 16 }}>
      <h2>Expense Review</h2>
      <p>Approve or correct extracted expense drafts before export.</p>
      <table width="100%">
        <thead>
          <tr>
            <th align="left">Vendor</th>
            <th align="left">Amount</th>
            <th align="left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sample Vendor</td>
            <td>$42.50</td>
            <td>Draft</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
