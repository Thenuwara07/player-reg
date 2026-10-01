
// Must be the first import: modules read process.env when they are loaded
import "dotenv/config";
import app from "./app";
import { startActivityLogRetention } from "./lib/activityLog";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  // Auto-delete activity logs older than 1 month
  startActivityLogRetention();
});
