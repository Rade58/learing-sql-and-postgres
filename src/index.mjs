import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

// import testQueryServer from "./apps/test_query/index.mjs";
import ingredientsRouter from "./apps/ingredients/index.mjs";

import { seed } from "./seed/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.SEED) {
  seed();
} else {
  const app = express();

  app.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));

  app.use("/ingredients", ingredientsRouter);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT);

  console.log(`app is on: http://localhost:${PORT}`);

  // if (process.env.TEST_QUERY_SERVER === "true") testQueryServer();
}
