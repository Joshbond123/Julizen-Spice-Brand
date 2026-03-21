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
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80",
    status: "available"
  },
  {
    id: "fried-rice-seasoning",
    name: "Julizen Fried Rice Seasoning",
    category: "Fried Rice",
    price: 1500,
    description: "A carefully measured blend of spices designed specifically for fried rice — giving each grain a savory, aromatic finish.",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&auto=format&fit=crop&q=80",
    status: "available"
  },
  {
    id: "crayfish-seasoning",
    name: "Julizen Crayfish Seasoning",
    category: "Crayfish",
    price: 1500,
    description: "A rich, smoky crayfish-infused blend perfect for soups, stews, and traditional Nigerian dishes that call for depth and body.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
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
