import { FastifyReply, FastifyRequest } from "fastify";
import { supabase } from "../config/supabase.js";

/* =========================================================
   GET ORDERS (USER / ADMIN)
========================================================= */
export const getOrdersController = async (req: any, reply: any) => {
  try {
    const user = req.user;

    if (!user) {
      return reply.code(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (user.role !== "admin") {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      return reply.code(500).send({
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

/* =========================================================
   CREATE ORDER
========================================================= */
export const createOrderController = async (req: any, reply: any) => {
  try {
    const user = req.user;

    const { items, total, address, phone } = req.body;

    if (!items?.length) {
      return reply.code(400).send({
        success: false,
        message: "Cart is empty",
      });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        items,
        total_price: total,
        address,
        phone,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return reply.code(400).send({
        success: false,
        message: error.message,
      });
    }

    return reply.code(201).send({
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