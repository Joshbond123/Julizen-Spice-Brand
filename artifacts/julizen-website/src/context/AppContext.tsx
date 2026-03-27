import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  status: "available" | "coming_soon";
}

export interface PublicSettings {
  whatsapp_number: string;
  contact_email: string;
  contact_phone: string;
}

interface AppContextValue {
  products: Product[];
  settings: PublicSettings;
  loading: boolean;
  refetch: () => void;
}

const DEFAULT_SETTINGS: PublicSettings = {
  whatsapp_number: "2348000000000",
  contact_email: "info@julizen.com",
  contact_phone: "+234 800 000 0000",
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "chicken-seasoning",
    name: "Julizen Chicken Seasoning Powder",
    category: "Chicken",
    price: 1500,
    description: "A well-balanced seasoning blend crafted to bring out the full depth of flavor in every chicken dish — grilled, stewed, or roasted.",
    image: "/images/product-chicken.webp",
    status: "available",
  },
  {
    id: "fried-rice-seasoning",
    name: "Julizen Fried Rice Seasoning Powder",
    category: "Fried Rice",
    price: 1500,
    description: "A carefully measured blend of spices designed specifically for fried rice — giving each grain a savory, aromatic finish.",
    image: "/images/product-fried-rice.webp",
    status: "available",
  },
  {
    id: "crayfish-seasoning",
    name: "Julizen Crayfish Seasoning Powder",
    category: "Crayfish",
    price: 1500,
    description: "A rich, smoky crayfish-infused blend perfect for soups, stews, and traditional Nigerian dishes that call for depth and body.",
    image: "/images/product-crayfish.webp",
    status: "available",
  },
];

const AppContext = createContext<AppContextValue>({
  products: DEFAULT_PRODUCTS,
  settings: DEFAULT_SETTINGS,
  loading: false,
  refetch: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function generateWhatsAppLink(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [settings, setSettings] = useState<PublicSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [productsRes, settingsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/settings/public"),
      ]);
      if (productsRes.ok) {
        const data = await productsRes.json();
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      }
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch {
      // silently fall back to defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AppContext.Provider value={{ products, settings, loading, refetch: fetchData }}>
      {children}
    </AppContext.Provider>
  );
}
