import { supabase } from "../config/supabase.js";
import { FastifyReply } from "fastify";

/* ================= GET ALL USERS ================= */
export const getAllUsersAdmin = async (_: any, reply: FastifyReply) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        name,
        email,
        role,
        phone,
        address
      `)
      .order("name", { ascending: true });

    if (error) {
      return reply.code(500).send({
        success: false,
        message: error.message,
      });
    }

    return reply.send({
      success: true,
      data: data ?? [],
    });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET SINGLE USER ================= */
export const getUserByIdAdmin = async (req: any, reply: FastifyReply) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, phone, address")
      .eq("id", id)
      .single();

    if (error) {
      return reply.code(404).send({
        success: false,
        message: "User not found",
      });
    }

    return reply.send({
      success: true,
      data,
    });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      message: err.message,
    });
  }
};

/* ================= UPDATE USER ================= */
export const updateUserAdmin = async (req: any, reply: FastifyReply) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, role } = req.body;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      return reply.code(400).send({
        success: false,
        message: "No valid fields to update",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select("id, name, email, role, phone, address")
      .single();

    if (error) {
      return reply.code(400).send({
        success: false,
        message: error.message,
      });
    }

    return reply.send({
      success: true,
      message: "User updated successfully",
      data,
    });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      message: err.message,
    });
  }
};

/* ================= DELETE USER ================= */
export const deleteUserAdmin = async (req: any, reply: FastifyReply) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      return reply.code(400).send({
        success: false,
        message: error.message,
      });
    }

    return reply.send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      message: err.message,
    });
  }
};