import { FastifyInstance } from "fastify";

import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
} from "../controllers/adminOrder.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const preHandler = [authMiddleware, adminMiddleware];

export async function adminOrdersRoutes(app: FastifyInstance) {
  app.get("/", { preHandler }, getAllOrdersAdmin);

  app.put("/:id", { preHandler }, updateOrderStatusAdmin);

  app.delete("/:id", { preHandler }, deleteOrderAdmin);
}