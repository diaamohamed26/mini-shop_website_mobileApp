import jwt from "jsonwebtoken";

export const authMiddleware = async (req: any, reply: any) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return reply.code(401).send({ message: "No token provided" });
    }

    if (!header.startsWith("Bearer ")) {
      return reply.code(401).send({ message: "Invalid token format" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // 🔥 IMPORTANT FIX
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

  } catch (err) {
    return reply.code(401).send({
      message: "Invalid or expired token",
    });
  }
};