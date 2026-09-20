import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
mkdirSync(path.join(root, ".sites-runtime"), { recursive: true });
const config = path.join(root, ".sites-runtime/local-db.json");
writeFileSync(
  config,
  JSON.stringify(
    {
      name: "personal-wordbook-local",
      compatibility_date: "2026-05-15",
      d1_databases: [
        {
          binding: "DB",
          database_name: "site-creator-d1",
          database_id: "00000000-0000-4000-8000-000000000000",
          migrations_dir: path.join(root, "drizzle"),
        },
      ],
    },
    null,
    2,
  ),
);
const r = spawnSync(
  process.execPath,
  [
    "--import",
    path.join(root, "scripts/sites-env.mjs"),
    path.join(root, "node_modules/wrangler/bin/wrangler.js"),
    "d1",
    "migrations",
    "apply",
    "DB",
    "--local",
    "--config",
    config,
    "--persist-to",
    path.join(root, ".wrangler/state"),
  ],
  { stdio: "inherit" },
);
if (r.error) throw r.error;
process.exit(r.status ?? 1);
