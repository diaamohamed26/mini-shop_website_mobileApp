import "dotenv/config";
import app from "./app";

/* ================= ENV ================= */
const PORT = Number(process.env.PORT) || 5001;

const requiredEnv = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`❌ Missing ENV: ${key}`);
  }
}

/* ================= START SERVER ================= */
const start = async () => {
  try {
    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log("====================================");
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("====================================");
  } catch (err) {
    console.error("❌ Failed to start server:");
    console.error(err);
    process.exit(1);
  }
};

start();

/* ================= GRACEFUL SHUTDOWN ================= */
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  await app.close();
  process.exit(0);
});