import { FastifyInstance } from "fastify";

import {
  getAllUsersAdmin,
  deleteUserAdmin,
} from "../controllers/adminUsers.controller";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const preHandler = [authMiddleware, adminMiddleware];

export async function adminUsersRoutes(app: FastifyInstance) {
  /* ================= GET ALL USERS ================= */
  app.get("/", {
    preHandler,
  }, getAllUsersAdmin);

  /* ================= DELETE USER ================= */
  app.delete("/:id", {
    preHandler,
  }, deleteUserAdmin);
}