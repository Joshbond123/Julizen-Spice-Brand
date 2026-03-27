import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface Product {
  id: string;
  slug?: string;
  size?: "10g" | "100g" | "400g";
  name: string;
  category: string;
  price: number;
  description: string;
  packagingDetails?: string;
  image: string;
  imageFront?: string;
  imageBack?: string;
  foodImage?: string;
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
    id: "chicken-flavour-seasoning-powder-100g",
    slug: "chicken-flavour-seasoning-powder",
    size: "100g",
    name: "Julizen Chicken Flavour Seasoning Powder 100G",
    category: "Chicken Flavour",
    price: 1500,
    description: "Prepared for chicken dishes and everyday meals where a fuller savory taste is needed.",
    packagingDetails: "Laminated sachet with secure top seal.",
    image: "/images/product-chicken.webp",
    imageFront: "/images/product-chicken.webp",
    imageBack: "/images/product-chicken.webp",
    foodImage: "/images/product-chicken.webp",
    status: "available",
  },
  {
    id: "crayfish-flavour-seasoning-powder-100g",
    slug: "crayfish-flavour-seasoning-powder",
    size: "100g",
    name: "Julizen Crayfish Flavour Seasoning Powder 100G",
    category: "Crayfish Flavour",
    price: 1500,
    description: "Suitable for soups, sauces, and traditional dishes where crayfish flavor adds depth.",
    packagingDetails: "Laminated sachet with secure top seal.",
    image: "/images/product-crayfish.webp",
    imageFront: "/images/product-crayfish.webp",
    imageBack: "/images/product-crayfish.webp",
    foodImage: "/images/product-crayfish.webp",
    status: "available",
  },
  {
    id: "fried-rice-seasoning-powder-100g",
    slug: "fried-rice-seasoning-powder",
    size: "100g",
    name: "Julizen Fried Rice Seasoning Powder 100G",
    category: "Fried Rice",
    price: 1500,
    description: "Made for fried rice meals with a balanced taste and satisfying result.",
    packagingDetails: "Laminated sachet with secure top seal.",
    image: "/images/product-fried-rice.webp",
    imageFront: "/images/product-fried-rice.webp",
    imageBack: "/images/product-fried-rice.webp",
    foodImage: "/images/product-fried-rice.webp",
    status: "available",
  },
  {
    id: "stew-jollof-seasoning-powder-100g",
    slug: "stew-jollof-seasoning-powder",
    size: "100g",
    name: "Julizen Stew & Jollof Seasoning Powder 100G",
    category: "Stew & Jollof",
    price: 1500,
    description: "Designed for stew and jollof dishes to support a richer and more consistent cooking result.",
    packagingDetails: "Laminated sachet with secure top seal.",
    image: "/images/food-jollof-rice.webp",
    imageFront: "/images/food-jollof-rice.webp",
    imageBack: "/images/food-jollof-rice.webp",
    foodImage: "/images/food-jollof-rice.webp",
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
      const [productsRes, settingsRes] = await Promise.all([fetch("/api/products"), fetch("/api/settings/public")]);
      if (productsRes.ok) {
        const data = (await productsRes.json()) as Product[];
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map((item) => ({
            ...item,
            image: item.foodImage || item.imageFront || item.image,
          }));
          setProducts(normalized);
        }
      }
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch {
      // fall back to defaults when API is not available.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <AppContext.Provider value={{ products, settings, loading, refetch: fetchData }}>{children}</AppContext.Provider>;
}
