import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

/* ================= ROUTES ================= */
import { authRoutes } from "./routes/auth.routes.js";
import { productRoutes } from "./routes/product.routes.js";
import { orderRoutes } from "./routes/order.routes.js";

/* ADMIN */
import { adminRoutes } from "./routes/adminDashboard.routes.js";
import { adminProductRoutes } from "./routes/adminProduct.routes.js";
import { adminOrdersRoutes } from "./routes/adminOrder.routes.js";
import { adminUsersRoutes } from "./routes/adminUsers.routes.js";

const app = Fastify({
  logger: true,
});

/* ================= CORS (🔥 FIXED FOR MOBILE) ================= */
await app.register(cors, {
  origin: true, // ✅ يسمح للموبايل + web
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

/* ================= MULTIPART ================= */
await app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/* ================= HEALTH CHECK ================= */
app.get("/", async () => {
  return {
    success: true,
    message: "Mini Shop API is running 🚀",
  };
});

/* ================= MOBILE TEST ENDPOINT ================= */
app.get("/api/ping", async () => {
  return {
    success: true,
    message: "API is working fine 🚀",
  };
});

/* ===================================================
   PUBLIC ROUTES
=================================================== */
await app.register(authRoutes, {
  prefix: "/api/auth",
});

await app.register(productRoutes, {
  prefix: "/api/products",
});

await app.register(orderRoutes, {
  prefix: "/api/orders",
});

/* ===================================================
   ADMIN ROUTES
=================================================== */
await app.register(adminRoutes, {
  prefix: "/api/admin",
});

await app.register(adminProductRoutes, {
  prefix: "/api/admin/products",
});

await app.register(adminOrdersRoutes, {
  prefix: "/api/admin/orders",
});

await app.register(adminUsersRoutes, {
  prefix: "/api/admin/users",
});

/* ================= 404 HANDLER ================= */
app.setNotFoundHandler((req, reply) => {
  reply.status(404).send({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});

/* ================= ERROR HANDLER ================= */
app.setErrorHandler((error: any, req, reply) => {
  app.log.error(error);

  reply.status(error.statusCode || 500).send({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

/* ================= START SERVER ================= */
const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT) || 5001,
      host: "0.0.0.0", // 🔥 مهم جدًا للموبايل
    });

    console.log("\n====================================");
    console.log("🚀 SERVER RUNNING");
    console.log("====================================");
    console.log(`📱 Mobile URL: http://192.168.1.10:5001`);
    console.log(`🌐 Local URL: http://localhost:5001`);
    console.log("====================================\n");
  } catch (err) {
    app.log.error(err);
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

export default app;