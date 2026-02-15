import { createApp } from "./app";

const port = Number(process.env.PORT ?? 4000);
const app = createApp();

app.listen(port, () => {
  // Startup log kept concise to help local diagnostics.
  console.log(`Expense automation API listening on ${port}`);
});
