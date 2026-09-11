// Load environment variables before anything else is imported, so that
// modules which read process.env at import time (e.g. lib/env.ts) see them.
import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
