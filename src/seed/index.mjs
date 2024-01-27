import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function seed() {
  const client = new pg.Client({
    connectionString: "postgres://postgres:lol@localhost:5432",
  });

  client
    .connect()
    .then(() => {
      return client.query(/* sql */ `CREATE DATABASE recipeguru;`);
    })
    .then(() => {
      client.end();
    })
    .then(() => {
      const clientAgain = new pg.Client({
        connectionString: "postgres://postgres:lol@localhost:5432/recipeguru",
      });

      clientAgain.connect();

      return clientAgain;
    })

    .then(async (clientAgain) => {
      const joined = path.join(__dirname, "../seed.sql");

      const sqlContent = fs.readFileSync(joined).toString();

      // console.log({ sqlContent });

      await clientAgain.query(`${sqlContent}`);

      return clientAgain;
    })
    .then((cl) => cl.end())
    .catch((error) => console.error(error));
}
