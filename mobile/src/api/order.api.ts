import API from "./client";

export const createOrderApi = async (items: any[]) => {
  const res = await API.post("/orders", {
    items,
  });

  return res.data;
};