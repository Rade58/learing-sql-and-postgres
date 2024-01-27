import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

import { pool as db } from "../../services/db/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));

router.get("/type", async (req, res) => {
  // /type?type=<>
  //

  const { type } = req.query;
  console.log({ type });

  console.log(`${type} is the type of ingredients.`);

  const { rows } = await db.query(
    /* SQL */ `SELECT * FROM ingredients WHERE type = $1;`,
    [type],
  );

  return res.json({ rows });

  // const {rows} = await
});

router.get("/search", async function (req, res) {
  //  /search?term=<>&page=<>

  let { term, page } = req.query;

  const params = [];

  const itemsonPage = 5;

  page = page ? page : 0;

  console.log(`search ingredients`, { term, page });

  let whereClause;

  if (term) {
    whereClause = `WHERE CONCAT(title, type) ILIKE $1`;
    params.push(`%${term}%`);
  }
  params.push(`${page * itemsonPage}`);

  const { rows } = await db.query(
    /* sql */ `
    SELECT *, COUNT(*) OVER ()::INTEGER AS total_count FROM ingredients 
      ${whereClause} OFFSET $2 LIMIT ${itemsonPage}`,
    params,
  );

  return res.json({ rows });
});

export default router;
