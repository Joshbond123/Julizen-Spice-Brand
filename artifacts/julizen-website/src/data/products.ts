export interface ProductVariant {
    size: string;
    quantity: string;
    packFormat: string;
    frontImage: string;
    backImage: string;
    whatsappMessage: string;
  }

  export interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    variants: ProductVariant[];
    status: "available" | "coming_soon";
  }

  export const products: Product[] = [
    {
      id: "chicken-flavour-seasoning-powder",
      name: "Julizen Chicken Flavour Seasoning Powder",
      category: "Chicken Flavour",
      description:
        "Deep, savory chicken flavor that transforms soups, stews, and everyday meals. Rich, authentic taste in every spoonful.",
      variants: [
        {
          size: "10g",
          quantity: "10",
          packFormat: "42 rolls (carton)",
          frontImage: "/images/product-chicken-10g-front.jpg",
          backImage: "/images/product-chicken-10g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Chicken Flavour Seasoning Powder 10g × 42 rolls (carton). Please send me the details.",
        },
        {
          size: "100g",
          quantity: "5",
          packFormat: "60 sachets",
          frontImage: "/images/product-chicken-100g-front.jpg",
          backImage: "/images/product-chicken-100g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Chicken Flavour Seasoning Powder 100g × 60 sachets. Please send me the details.",
        },
        {
          size: "400g",
          quantity: "20",
          packFormat: "sachets (carton)",
          frontImage: "/images/product-chicken-400g-front.jpg",
          backImage: "/images/product-chicken-400g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Chicken Flavour Seasoning Powder 400g × 20 sachets (carton). Please send me the details.",
        },
      ],
      status: "available",
    },
    {
      id: "crayfish-flavour-seasoning-powder",
      name: "Julizen Crayfish Flavour Seasoning Powder",
      category: "Crayfish Flavour",
      description:
        "Authentic crayfish depth that elevates traditional soups, sauces, and native dishes. The secret behind richer, fuller-tasting meals.",
      variants: [
        {
          size: "10g",
          quantity: "10",
          packFormat: "42 rolls (carton)",
          frontImage: "/images/product-crayfish-10g-front.jpg",
          backImage: "/images/product-crayfish-10g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Crayfish Flavour Seasoning Powder 10g × 42 rolls (carton). Please send me the details.",
        },
        {
          size: "100g",
          quantity: "5",
          packFormat: "60 sachets",
          frontImage: "/images/product-crayfish-100g-front.jpg",
          backImage: "/images/product-crayfish-100g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Crayfish Flavour Seasoning Powder 100g × 60 sachets. Please send me the details.",
        },
        {
          size: "400g",
          quantity: "20",
          packFormat: "sachets (carton)",
          frontImage: "/images/product-crayfish-400g-front.png",
          backImage: "/images/product-crayfish-400g-back.png",
          whatsappMessage: "Hello, I want to order Julizen Crayfish Flavour Seasoning Powder 400g × 20 sachets (carton). Please send me the details.",
        },
      ],
      status: "available",
    },
    {
      id: "fried-rice-seasoning-powder",
      name: "Julizen Fried Rice Seasoning Powder",
      category: "Fried Rice",
      description:
        "Perfectly balanced blend crafted for authentic Nigerian fried rice. Golden, aromatic, and full of flavor every single time.",
      variants: [
        {
          size: "10g",
          quantity: "10",
          packFormat: "42 rolls (carton)",
          frontImage: "/images/product-fried-rice-10g-front.jpg",
          backImage: "/images/product-fried-rice-10g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Fried Rice Seasoning Powder 10g × 42 rolls (carton). Please send me the details.",
        },
        {
          size: "100g",
          quantity: "5",
          packFormat: "60 sachets",
          frontImage: "/images/product-fried-rice-100g-front.jpg",
          backImage: "/images/product-fried-rice-100g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Fried Rice Seasoning Powder 100g × 60 sachets. Please send me the details.",
        },
        {
          size: "400g",
          quantity: "20",
          packFormat: "sachets (carton)",
          frontImage: "/images/product-fried-rice-100g-front.jpg",
          backImage: "/images/product-fried-rice-100g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Fried Rice Seasoning Powder 400g × 20 sachets (carton). Please send me the details.",
        },
      ],
      status: "available",
    },
    {
      id: "stew-jollof-seasoning-powder",
      name: "Julizen Stew & Jollof Seasoning Powder",
      category: "Stew & Jollof",
      description:
        "Boldly crafted for rich Nigerian stews and jollof rice. Delivers that deep, irresistible party-jollof flavor people keep coming back for.",
      variants: [
        {
          size: "10g",
          quantity: "10",
          packFormat: "42 rolls (carton)",
          frontImage: "/images/product-stew-jollof-10g-front.jpg",
          backImage: "/images/product-stew-jollof-10g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Stew & Jollof Seasoning Powder 10g × 42 rolls (carton). Please send me the details.",
        },
        {
          size: "100g",
          quantity: "5",
          packFormat: "60 sachets",
          frontImage: "/images/product-stew-jollof-100g-front.jpg",
          backImage: "/images/product-stew-jollof-100g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Stew & Jollof Seasoning Powder 100g × 60 sachets. Please send me the details.",
        },
        {
          size: "400g",
          quantity: "20",
          packFormat: "sachets (carton)",
          frontImage: "/images/product-stew-jollof-100g-front.jpg",
          backImage: "/images/product-stew-jollof-100g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Stew & Jollof Seasoning Powder 400g × 20 sachets (carton). Please send me the details.",
        },
      ],
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
  