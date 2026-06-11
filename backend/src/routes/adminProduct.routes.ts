import { FastifyInstance } from "fastify";

import {
  getAllProductsAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
} from "../controllers/adminProduct.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const preHandler = [authMiddleware, adminMiddleware];

export async function adminProductRoutes(app: FastifyInstance) {
  app.get("/", { preHandler }, getAllProductsAdmin);

  app.post("/", { preHandler }, createProductAdmin);

  app.put("/:id", { preHandler }, updateProductAdmin);

  app.delete("/:id", { preHandler }, deleteProductAdmin);
}