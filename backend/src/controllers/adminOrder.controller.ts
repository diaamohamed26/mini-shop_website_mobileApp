import { supabase } from "../config/supabase.js";
import { FastifyReply } from "fastify";

/* ================= GET ALL ORDERS ================= */
export const getAllOrdersAdmin = async (_: any, reply: FastifyReply) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        items,
        total_price,
        status,
        created_at,
        address,
        phone,
        user_id
      `)
      .order("created_at", { ascending: false });

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

/* ================= UPDATE ORDER STATUS ================= */
export const updateOrderStatusAdmin = async (req: any, reply: FastifyReply) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return reply.code(400).send({
        success: false,
        message: error.message,
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

/* ================= DELETE ORDER ================= */
export const deleteOrderAdmin = async (req: any, reply: FastifyReply) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("orders")
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
      message: "Order deleted",
    });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      message: err.message,
    });
  }
};