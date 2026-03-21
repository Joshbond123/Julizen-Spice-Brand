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
    id: "jollof-seasoning",
    name: "Julizen Jollof Seasoning",
    category: "Rice Blends",
    price: 1500,
    description: "Our signature blend that makes every pot of jollof rice burst with rich, smoky flavor.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80",
    status: "available"
  },
  {
    id: "pepper-soup-spice",
    name: "Julizen Pepper Soup Spice",
    category: "Soup Spices",
    price: 1200,
    description: "A carefully balanced mix of aromatic spices perfect for authentic Nigerian pepper soup.",
    image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&auto=format&fit=crop&q=80",
    status: "available"
  },
  {
    id: "suya-blend",
    name: "Julizen Suya Blend",
    category: "Grill Blends",
    price: 1000,
    description: "The secret behind perfectly seasoned, grilled suya. Spicy, smoky, and absolutely delicious.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=80",
    status: "available"
  },
  {
    id: "all-purpose",
    name: "Julizen All-Purpose",
    category: "All-Purpose",
    price: 800,
    description: "A versatile seasoning that elevates any dish — from stews to stir-fries and roasted veggies.",
    image: "https://images.unsplash.com/photo-1626025357876-0f8bc5b46e8c?w=800&auto=format&fit=crop&q=80",
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
