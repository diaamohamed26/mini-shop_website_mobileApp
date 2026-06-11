import { FastifyInstance } from "fastify";
import { getAdminDashboard } from "../controllers/adminDashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

export async function adminRoutes(app: FastifyInstance) {
  app.get(
    "/dashboard",
    {
      preHandler: [authMiddleware, adminMiddleware],
    },
    getAdminDashboard
  );
}