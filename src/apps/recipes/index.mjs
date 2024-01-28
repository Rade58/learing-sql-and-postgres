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
  const recipeId = req.query.id ? req.query.id : 1;

  const promiseone = db.query(
    /* sql */ `
    SELECT
      i.image AS ingredient_image,
      i.type AS ingredient_type,
      i.title AS ingredient_title
    FROM
      recipe_ingredients ri
    INNER JOIN
      ingredients i
    ON
      ri.recipe_id = $1;

  `,
    [recipeId],
  );

  const promisetwo = db.query(
    /* sql */ `
      SELECT
        r.title,
        r.body,
        COALESCE(rp.url, 'default.jpg') AS photo_url
      FROM
        recipes r
      LEFT JOIN
        recipes_photos rp
      ON
        rp.recipe_id = r.recipe_id
      WHERE
        r.recipe_id = $1;

    `,
    [recipeId],
  );

  return res.status(200).json(
    (await Promise.all([promiseone, promisetwo])).map((i, j) => ({
      photos: i.rows,
      ingredients: j.rows,
    })),
  );
});

export default router;
