import API from "./client";

export const getCartApi = () => API.get("/cart");

export const addToCartApi = (data: any) =>
  API.post("/cart", data);

export const removeFromCartApi = (id: string) =>
  API.delete(`/cart/${id}`);

export const updateCartApi = (id: string, qty: number) =>
  API.patch(`/cart/${id}`, { quantity: qty });