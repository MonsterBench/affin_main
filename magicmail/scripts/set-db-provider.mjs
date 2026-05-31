// Sets the Prisma datasource provider to match DATABASE_URL before generate/push.
//   postgres:// or postgresql://  -> postgresql
//   anything else (file:...)      -> sqlite
// This lets the same repo deploy to Postgres (Railway/prod) or SQLite (local)
// with no manual schema edits. Idempotent; safe to run repeatedly.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const provider = url.startsWith("postgres") ? "postgresql" : "sqlite";

const schemaPath = fileURLToPath(new URL("../prisma/schema.prisma", import.meta.url));
const current = readFileSync(schemaPath, "utf8");

// Only the datasource uses sqlite/postgresql; the generator is "prisma-client".
const updated = current.replace(/provider = "(?:sqlite|postgresql)"/, `provider = "${provider}"`);

if (updated !== current) {
  writeFileSync(schemaPath, updated);
  console.log(`[db] schema provider set to "${provider}"`);
} else {
  console.log(`[db] schema provider already "${provider}"`);
}
