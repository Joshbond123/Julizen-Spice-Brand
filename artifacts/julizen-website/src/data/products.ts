export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  status: "available" | "coming_soon";
}

export const products: Product[] = [
  {
    id: "chicken-seasoning",
    name: "Julizen Chicken Seasoning",
    category: "Chicken",
    price: 1500,
    description: "A well-balanced seasoning blend crafted to bring out the full depth of flavor in every chicken dish — grilled, stewed, or roasted.",
    image: "/images/product-chicken.png",
    status: "available"
  },
  {
    id: "fried-rice-seasoning",
    name: "Julizen Fried Rice Seasoning",
    category: "Fried Rice",
    price: 1500,
    description: "A carefully measured blend of spices designed specifically for fried rice — giving each grain a savory, aromatic finish.",
    image: "/images/product-fried-rice.png",
    status: "available"
  },
  {
    id: "crayfish-seasoning",
    name: "Julizen Crayfish Seasoning",
    category: "Crayfish",
    price: 1500,
    description: "A rich, smoky crayfish-infused blend perfect for soups, stews, and traditional Nigerian dishes that call for depth and body.",
    image: "/images/product-crayfish.png",
    status: "available"
  }
];

export const formatNaira = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};
