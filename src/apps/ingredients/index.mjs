import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

// import db from "../../services/db/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));

router.get("/type", async (req, res) => {
  // /type?type=<>
  const { type } = req.query;

  // const {rows} = await
});

export default router;
