import { supabase } from "../config/supabase.js";

export const uploadImage = async (file: any) => {
  const fileName = `${Date.now()}-${file.filename}`;

  /* تحويل stream إلى buffer */
  const chunks: any[] = [];

  for await (const chunk of file.file) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    console.log("UPLOAD ERROR:", error);
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  return data.publicUrl;
};