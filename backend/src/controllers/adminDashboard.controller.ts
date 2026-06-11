import { FastifyReply, FastifyRequest } from "fastify";
import { supabase } from "../config/supabase.js";

export const getAdminDashboard = async (_: FastifyRequest, reply: FastifyReply) => {
  try {
    /* USERS */
    const { count: users } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    /* PRODUCTS */
    const { count: products } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    /* ORDERS */
    const { data: orders } = await supabase
      .from("orders")
      .select("total_price, status");

    const totalOrders = orders?.length || 0;

    const revenue =
      orders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0;

    const statusBreakdown =
      orders?.reduce((acc: any, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      }, {}) || {};

    return reply.send({
      success: true,
      data: {
        users,
        products,
        orders: totalOrders,
        revenue,
        statusBreakdown,
      },
    });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      message: err.message,
    });
  }
};