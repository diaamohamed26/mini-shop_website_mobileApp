import { useEffect, useState } from "react";
import { getProductsService } from "../services/product.service";

export const useProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsService().then(setProducts);
  }, []);

  return { products };
};