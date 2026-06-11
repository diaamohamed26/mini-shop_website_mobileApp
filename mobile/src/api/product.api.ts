import API from "./client";

export const getProductsApi = () => {
  return API.get("/products");
};