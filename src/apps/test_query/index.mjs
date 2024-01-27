import http from "http";

import { pool } from "../../services/db/index.mjs";

export default function testQueryServer() {
  const server = new http.Server(async (req, res) => {
    const { rows } = await pool.query(`
      SELECT * FROM ingredients;
    `);

    res.statusCode = 200;

    res.write(JSON.stringify({ rows }));

    return res.end();
  });

  server.listen(3001, () => {
    console.log("http://localhost:3001");
  });
}
