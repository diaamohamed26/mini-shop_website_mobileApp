import { FastifyInstance } from "fastify";

import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

export async function authRoutes(
  fastify: FastifyInstance
) {
  fastify.post("/register", register);

  fastify.post("/login", login);

  fastify.get(
    "/me",
    { preHandler: [authMiddleware] },
    getMe
  );

  fastify.put(
    "/profile",
    { preHandler: [authMiddleware] },
    updateProfile
  );

  fastify.put(
    "/change-password",
    { preHandler: [authMiddleware] },
    changePassword
  );
}