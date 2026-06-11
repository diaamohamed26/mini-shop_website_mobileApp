import { getProductsApi } from "../api/product.api";

export const getProductsService = async () => {
  const res = await getProductsApi();
  return res.data;
};