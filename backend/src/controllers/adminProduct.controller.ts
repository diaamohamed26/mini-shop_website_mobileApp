import { supabase } from "../config/supabase.js";
import { FastifyReply } from "fastify";
import { uploadImage } from "../utils/uploadImage.js";

/* ================= GET ALL PRODUCTS ================= */
export const getAllProductsAdmin = async (_: any, reply: FastifyReply) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

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

/* ================= CREATE PRODUCT ================= */
export const createProductAdmin = async (req: any, reply: FastifyReply) => {
  try {
    let title = "";
    let price = 0;
    let category = "";
    let stock = 0;
    let imageUrl = "";

    /* ================= MULTIPART ================= */
    if (req.isMultipart && req.isMultipart()) {
      const parts = req.parts();

      for await (const part of parts) {
        if (part.type === "file") {
          imageUrl = await uploadImage(part);
        } else {
          const value = part.value;

          switch (part.fieldname) {
            case "title":
              title = value;
              break;

            case "price":
              price = Number(value);
              break;

            case "category":
              category = value;
              break;

            case "stock":
              stock = Number(value);
              break;
          }
        }
      }
    } else {
      const body = req.body;

      title = body?.title || "";
      price = Number(body?.price || 0);
      category = body?.category || "";
      stock = Number(body?.stock || 0);
      imageUrl = body?.image || "";
    }

    /* ================= VALIDATION ================= */
    if (!title.trim()) {
      return reply.code(400).send({
        success: false,
        message: "Title is required",
      });
    }

    if (!price || isNaN(price)) {
      return reply.code(400).send({
        success: false,
        message: "Valid price is required",
      });
    }

    /* ================= INSERT ================= */
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          title,
          price,
          category,
          stock,
          image: imageUrl,
        },
      ])
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
      message: "Product created successfully",
      data,
    });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      message: err.message,
    });
  }
};

/* ================= UPDATE PRODUCT ================= */
export const updateProductAdmin = async (req: any, reply: FastifyReply) => {
  try {
    const { id } = req.params;

    let updateData: any = {};

    const body = req.body;

    if (body.title !== undefined) updateData.title = body.title;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.category !== undefined) updateData.category = body.category;
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.image !== undefined) updateData.image = body.image;

    if (Object.keys(updateData).length === 0) {
      return reply.code(400).send({
        success: false,
        message: "No valid fields provided",
      });
    }

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
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
      message: "Product updated successfully",
      data,
    });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      message: err.message,
    });
  }
};

/* ================= DELETE PRODUCT ================= */
export const deleteProductAdmin = async (req: any, reply: FastifyReply) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("products")
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
      message: "Product deleted successfully",
    });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      message: err.message,
    });
  }
};