import { FastifyInstance } from "fastify";

import {
  getProductsController,
  getProductByIdController,
} from "../controllers/product.controller.js";

export async function productRoutes(app: FastifyInstance) {
  // ================= GET ALL PRODUCTS =================
  app.get("/", getProductsController);

  // ================= GET SINGLE PRODUCT =================
  app.get("/:id", getProductByIdController);
}