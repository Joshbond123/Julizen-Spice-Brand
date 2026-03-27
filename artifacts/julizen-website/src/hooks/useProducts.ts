import { useState, useEffect, useCallback } from "react";
import { AdminProduct, DEFAULT_PRODUCTS, PRODUCTS_UPDATE_EVENT } from "@/lib/productStorage";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchProductsFromServer(): Promise<AdminProduct[]> {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return DEFAULT_PRODUCTS;
  return data as AdminProduct[];
}

export function useProducts(): AdminProduct[] {
  const [products, setProducts] = useState<AdminProduct[]>(DEFAULT_PRODUCTS);

  const load = useCallback(async () => {
    try {
      const data = await fetchProductsFromServer();
      setProducts(data);
    } catch {
      setProducts(DEFAULT_PRODUCTS);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const handleUpdate = () => {
      load();
    };
    window.addEventListener(PRODUCTS_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(PRODUCTS_UPDATE_EVENT, handleUpdate);
  }, [load]);

  return products;
}
