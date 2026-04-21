import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { songs } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
});

const db = drizzle(pool);

async function extractSongs() {
  try {
    const result = await db.select().from(songs).limit(500);
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

extractSongs();
