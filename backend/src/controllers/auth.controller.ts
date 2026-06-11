import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing");
}

/* ================= UTIL ================= */
const safeError = (reply: any, message: string, code = 500) => {
  return reply.code(code).send({
    success: false,
    message,
  });
};

/* ================= REGISTER ================= */
export const register = async (req: any, reply: any) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    if (!email || !password || !name) {
      return safeError(reply, "Missing required fields", 400);
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return safeError(reply, "User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
        phone: phone || null,
        address: address || null,
      })
      .select("id, name, email, role, phone, address")
      .single();

    if (error) {
      return safeError(reply, error.message);
    }

    return reply.code(201).send({
      success: true,
      user: data,
    });
  } catch {
    return safeError(reply, "Register failed");
  }
};

/* ================= LOGIN ================= */
export const login = async (req: any, reply: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return safeError(reply, "Email and password required", 400);
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error || !user) {
      return safeError(reply, "Invalid credentials", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return safeError(reply, "Invalid credentials", 400);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return reply.send({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch {
    return safeError(reply, "Login failed");
  }
};

/* ================= GET ME ================= */
export const getMe = async (req: any, reply: any) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return safeError(reply, "Unauthorized", 401);
    }

    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, phone, address")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      return safeError(reply, "User not found", 404);
    }

    return reply.send({
      success: true,
      user: data,
    });
  } catch {
    return safeError(reply, "Failed to fetch user");
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req: any, reply: any) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return safeError(reply, "Unauthorized", 401);
    }

    const { name, phone, address, email } = req.body;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    if (email) {
      const { data: exists } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .neq("id", userId)
        .maybeSingle();

      if (exists) {
        return safeError(reply, "Email already in use", 400);
      }

      updateData.email = email;
    }

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select("id, name, email, role, phone, address")
      .single();

    if (error) {
      return safeError(reply, error.message, 400);
    }

    return reply.send({
      success: true,
      message: "Profile updated successfully",
      user: data,
    });
  } catch {
    return safeError(reply, "Update failed");
  }
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req: any, reply: any) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return safeError(reply, "Unauthorized", 401);
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return safeError(reply, "Missing fields", 400);
    }

    const { data: user } = await supabase
      .from("users")
      .select("password")
      .eq("id", userId)
      .single();

    if (!user) {
      return safeError(reply, "User not found", 404);
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return safeError(reply, "Wrong current password", 400);
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    const { error } = await supabase
      .from("users")
      .update({ password: hashed })
      .eq("id", userId);

    if (error) {
      return safeError(reply, error.message, 400);
    }

    return reply.send({
      success: true,
      message: "Password updated successfully",
    });
  } catch {
    return safeError(reply, "Password update failed");
  }
};