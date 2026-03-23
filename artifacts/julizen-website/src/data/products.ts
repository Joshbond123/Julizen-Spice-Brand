export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  imageFallback: string;
  weight: string;
  whatsappMessage: string;
  status: "available" | "coming_soon";
}

export const products: Product[] = [
  {
    id: "chicken-flavour-seasoning-powder",
    name: "Julizen Chicken Flavour Seasoning Powder",
    category: "Chicken Flavour",
    price: 1500,
    description:
      "Prepared for chicken dishes and everyday meals where a fuller savory taste is needed.",
    image: "/images/product-chicken-real.webp",
    imageFallback: "/images/product-chicken-real.jpg",
    weight: "100G",
    whatsappMessage:
      "Hello, I want to order Julizen Chicken Flavour Seasoning Powder 100G. Please send me the details.",
    status: "available",
  },
  {
    id: "crayfish-flavour-seasoning-powder",
    name: "Julizen Crayfish Flavour Seasoning Powder",
    category: "Crayfish Flavour",
    price: 1500,
    description:
      "Suitable for soups, sauces, and traditional dishes where crayfish flavor adds depth.",
    image: "/images/product-crayfish-real.webp",
    imageFallback: "/images/product-crayfish-real.jpg",
    weight: "100G",
    whatsappMessage:
      "Hello, I want to order Julizen Crayfish Flavour Seasoning Powder 100G. Please send me the details.",
    status: "available",
  },
  {
    id: "fried-rice-seasoning-powder",
    name: "Julizen Fried Rice Seasoning Powder",
    category: "Fried Rice",
    price: 1500,
    description:
      "Made for fried rice meals with a balanced taste and satisfying result.",
    image: "/images/product-fried-rice-real.webp",
    imageFallback: "/images/product-fried-rice-real.jpg",
    weight: "100G",
    whatsappMessage:
      "Hello, I want to order Julizen Fried Rice Seasoning Powder 100G. Please send me the details.",
    status: "available",
  },
  {
    id: "stew-jollof-seasoning-powder",
    name: "Julizen Stew & Jollof Seasoning Powder",
    category: "Stew & Jollof",
    price: 1500,
    description:
      "Designed for stew and jollof dishes to support a richer and more consistent cooking result.",
    image: "/images/product-stew-jollof-real.webp",
    imageFallback: "/images/product-stew-jollof-real.jpg",
    weight: "100G",
    whatsappMessage:
      "Hello, I want to order Julizen Stew & Jollof Seasoning Powder 100G. Please send me the details.",
    status: "available",
  },
];

export const formatNaira = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};
