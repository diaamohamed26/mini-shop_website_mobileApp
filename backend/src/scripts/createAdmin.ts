import bcrypt from "bcryptjs";
import { supabase } from "../config/supabase.js";

const createAdmin = async () => {
  const email = "diaamazize98@gmail.com";
  const password = "admin123";

  // 🔐 hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 👇 insert admin
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name: "Admin",
        email,
        password: hashedPassword,
        role: "admin",
      },
    ])
    .select()
    .single();

  if (error) {
    console.log("❌ Error:", error.message);
    return;
  }

  console.log("✅ Admin Created:", data);
};

createAdmin();