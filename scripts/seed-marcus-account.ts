/**
 * Create the Marcus Chen / Cascade Creek demo account on a Supabase project.
 *
 * Usage (production keys from .env.local):
 *   npm run seed:marcus
 *
 * Optional env:
 *   MARCUS_DEMO_PASSWORD  — login password (default: CascadeCreek2025!)
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();
import {
  ensureMarcusDemoAccount,
  MARCUS_DEMO_ACCOUNT,
} from "../lib/seed/marcus-demo-account";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const password =
  process.env.MARCUS_DEMO_PASSWORD ?? "CascadeCreek2025!";

async function main() {
  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Load .env.local or export vars."
    );
    process.exit(1);
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const result = await ensureMarcusDemoAccount(admin, password);

  if (!result.ok) {
    console.error("Failed:", result.error);
    process.exit(1);
  }

  console.log(result.message);
  console.log("");
  console.log("Production demo login:");
  console.log(`  Email:    ${MARCUS_DEMO_ACCOUNT.email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Org:      ${MARCUS_DEMO_ACCOUNT.orgName}`);
  if (result.organizationId) {
    console.log(`  Org ID:   ${result.organizationId}`);
  }
}

main();
