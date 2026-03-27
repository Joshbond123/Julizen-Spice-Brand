import { useState, useEffect } from "react";
import {
  AdminProduct,
  getProducts,
  PRODUCTS_UPDATE_EVENT,
} from "@/lib/productStorage";

export function useProducts(): AdminProduct[] {
  const [products, setProducts] = useState<AdminProduct[]>(() => getProducts());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent<AdminProduct[]>).detail;
      if (Array.isArray(detail)) {
        setProducts(detail);
      } else {
        setProducts(getProducts());
      }
    };

    window.addEventListener(PRODUCTS_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(PRODUCTS_UPDATE_EVENT, handleUpdate);
  }, []);

  return products;
}
