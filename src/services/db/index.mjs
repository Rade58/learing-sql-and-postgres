import pg from "pg";

export const pool = new pg.Pool({
  user: "postgres",
  password: "lol",
  host: "localhost",
  port: 5432,
  database: "recipeguru",
});
