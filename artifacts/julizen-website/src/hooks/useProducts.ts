import { useState, useEffect, useCallback } from "react";
  import { AdminProduct, DEFAULT_PRODUCTS } from "@/lib/productStorage";

  export const PRODUCTS_UPDATE_EVENT = "julizen:products:updated";

  const STORE_URL = import.meta.env.BASE_URL + "data/store.json";

  export async function fetchProductsFromStore(): Promise<AdminProduct[]> {
    const res = await fetch(STORE_URL, {
      cache: "force-cache",
    });
    if (!res.ok) throw new Error("Could not load store.json");
    const data = await res.json();
    const products = data?.products;
    if (!Array.isArray(products) || products.length === 0) return DEFAULT_PRODUCTS;
    return products as AdminProduct[];
  }

  // Pre-fetch products eagerly at module load so the first render can resolve faster
  let _preloaded: Promise<AdminProduct[]> | null = null;
  function preload() {
    if (!_preloaded) _preloaded = fetchProductsFromStore().catch(() => DEFAULT_PRODUCTS);
    return _preloaded;
  }
  preload();

  export function useProducts(): AdminProduct[] {
    const [products, setProducts] = useState<AdminProduct[]>(DEFAULT_PRODUCTS);

    const load = useCallback(async () => {
      try {
        const data = await preload();
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
        _preloaded = null;
        load();
      };
      window.addEventListener(PRODUCTS_UPDATE_EVENT, handleUpdate);
      return () => window.removeEventListener(PRODUCTS_UPDATE_EVENT, handleUpdate);
    }, [load]);

    return products;
  }
  