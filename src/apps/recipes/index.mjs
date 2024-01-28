import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

import { pool as db } from "../../services/db/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));

router.get("/search", async (req, res) => {
  try {
    const { rows } = await db.query(/* sql */ `
      SELECT DISTINCT ON (r.recipe_id)
        r.recipe_id,
        r.title,
        COALESCE(rp.url, 'default.png') AS photo
      FROM
        recipes r
      LEFT JOIN
        recipes_photos rp
      ON
        r.recipe_id = rp.recipe_id;
    `);

    console.log({ rows });

    return res.status(200).json({ rows });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
});

router.get("/get", async function (req, res) {
  //  /search?term=<>&page=<>

  return res.status(200).json({ rows: [] });
});

export default router;
