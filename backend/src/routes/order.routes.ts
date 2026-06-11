import {
  getOrdersController,
  createOrderController,
} from "../controllers/order.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

export async function orderRoutes(app: any) {

  /* ================= GET ORDERS (USER) ================= */
  app.get(
    "/",
    { preHandler: authMiddleware },
    getOrdersController
  );

  /* ================= CREATE ORDER ================= */
  app.post(
    "/",
    { preHandler: authMiddleware },
    createOrderController
  );
}