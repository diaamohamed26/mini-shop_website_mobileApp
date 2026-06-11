import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

/* ================= ENV CHECK ================= */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("❌ SUPABASE_URL is missing in .env");
}

if (!supabaseServiceKey) {
  throw new Error("❌ SUPABASE_SERVICE_ROLE_KEY is missing in .env");
}

/* ================= SUPABASE CLIENT ================= */
/*
  IMPORTANT:
  We use SERVICE ROLE KEY in backend ONLY
  because:
  - bypasses RLS
  - allows admin operations
  - required for server-side auth checks
*/
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});