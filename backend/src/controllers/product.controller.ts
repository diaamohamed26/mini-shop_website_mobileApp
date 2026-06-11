import { FastifyReply, FastifyRequest } from "fastify";
import { supabase } from "../config/supabase.js";

/* ================= GET PRODUCTS (PUBLIC) ================= */
export const getProductsController = async (
  req: FastifyRequest<{
    Querystring: {
      page?: string;
      limit?: string;
      category?: string;
      minPrice?: string;
      maxPrice?: string;
      search?: string;
      sort?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const {
      page = "1",
      limit = "10",
      category,
      minPrice,
      maxPrice,
      search,
      sort,
    } = req.query;

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 100);

    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    let query = supabase
      .from("products")
      .select(
        "id,title,description,price,image,category,created_at",
        { count: "exact" }
      );

    /* ================= FILTERS ================= */
    if (category) query = query.eq("category", category);

    if (minPrice && !isNaN(Number(minPrice))) {
      query = query.gte("price", Number(minPrice));
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      query = query.lte("price", Number(maxPrice));
    }

    if (search?.trim()) {
      query = query.ilike("title", `%${search.trim()}%`);
    }

    /* ================= SORTING ================= */
    switch (sort) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;

      case "price_desc":
        query = query.order("price", { ascending: false });
        break;

      default:
        query = query.order("created_at", { ascending: false });
    }

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return reply.code(500).send({
        success: false,
        message: error.message,
      });
    }

    return reply.send({
      success: true,
      products: data ?? [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      message: err.message || "Server error",
    });
  }
};

/* ================= GET SINGLE PRODUCT (PUBLIC) ================= */
export const getProductByIdController = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return reply.code(404).send({
        success: false,
        message: "Product not found",
      });
    }

    return reply.send({
      success: true,
      product: data,
    });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      message: err.message || "Server error",
    });
  }
};