import { FastifyReply, FastifyRequest } from "fastify";

export const adminMiddleware = async (req: FastifyRequest, reply: FastifyReply) => {
  const user = (req as any).user;

  if (!user) {
    return reply.code(401).send({ message: "Unauthorized" });
  }

  if (user.role !== "admin") {
    return reply.code(403).send({ message: "Admins only" });
  }
};