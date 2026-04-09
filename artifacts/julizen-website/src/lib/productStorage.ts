export type SizeKey = "10g" | "100g" | "400g";

export interface AdminProductSize {
  packLabel: string;
  packDetail: string;
  frontImage: string;
  backImage: string;
  whatsappMessage: string;
  sizeEnabled: boolean;
}

export interface AdminProduct {
  id: string;
  name: string;
  tagline: string;
  fullDescription: string;
  cookingTips: string[];
  foodImage: string;
  foodCaption: string;
  accentColor: string;
  enabled: boolean;
  sizes: Record<SizeKey, AdminProductSize>;
}

export const PRODUCTS_UPDATE_EVENT = "julizen:products:updated";

export const DEFAULT_PRODUCTS: AdminProduct[] = [
  {
    id: "chicken",
    name: "Chicken Flavour",
    tagline: "Deep savory richness for soups, stews & everyday cooking.",
    fullDescription:
      "Julizen Chicken Flavour Seasoning Powder is carefully blended to bring out the full, natural depth of chicken in every dish.",
    cookingTips: [
      "Add one teaspoonful to 400ml of boiling water for soups and gravies.",
      "Rub directly onto chicken before grilling or frying for deeper flavour.",
    ],
    foodImage: "/images/food-egusi-semo-party.webp",
    foodCaption: "Rich egusi soup — cooked with Julizen Chicken Flavour",
    accentColor: "#D97706",
    enabled: true,
    sizes: {
      "10g": {
        packLabel: "Sachet",
        packDetail: "10g × 10 × 42 rolls (carton)",
        frontImage: "/images/product-chicken-new-front.webp",
        backImage: "/images/product-chicken-new-back.webp",
        whatsappMessage:
          "Hello, I want to order Julizen Chicken Flavour 10g × 42 rolls. Please send me the details.",
        sizeEnabled: true,
      },
      "100g": {
        packLabel: "Pouch",
        packDetail: "100g × 5 × 60 sachets (carton)",
        frontImage: "/images/product-chicken-new-front.webp",
        backImage: "/images/product-chicken-new-back.webp",
        whatsappMessage:
          "Hello, I want to order Julizen Chicken Flavour 100g × 60 sachets. Please send me the details.",
        sizeEnabled: true,
      },
      "400g": {
        packLabel: "Value Pack",
        packDetail: "400g × 20 sachets (carton)",
        frontImage: "/images/product-chicken-new-front.webp",
        backImage: "/images/product-chicken-new-back.webp",
        whatsappMessage:
          "Hello, I want to order Julizen Chicken Flavour 400g × 20 sachets. Please send me the details.",
        sizeEnabled: true,
      },
    },
  },
  {
    id: "crayfish",
    name: "Crayfish Flavour",
    tagline: "Authentic crayfish depth for traditional soups & native dishes.",
    fullDescription:
      "Julizen Crayfish Flavour Seasoning Powder delivers the bold, unmistakable taste of crayfish that Nigerians know and love.",
    cookingTips: [
      "Dissolve one teaspoonful in soup stock before adding your main ingredients.",
      "Use in egusi or okra soup to amplify the crayfish flavour naturally.",
    ],
    foodImage: "/images/food-okro-fufu-party.webp",
    foodCaption: "Thick okro soup — made with Julizen Crayfish Flavour",
    accentColor: "#B45309",
    enabled: true,
    sizes: {
      "10g": {
        packLabel: "Sachet",
        packDetail: "10g × 10 × 42 rolls (carton)",
        frontImage: "/images/product-crayfish-new-front.webp",
        backImage: "/images/product-crayfish-new-back.webp",
        whatsappMessage:
          "Hello, I want to order Julizen Crayfish Flavour 10g × 42 rolls. Please send me the details.",
        sizeEnabled: true,
      },
      "100g": {
        packLabel: "Pouch",
        packDetail: "100g × 5 × 60 sachets (carton)",
        frontImage: "/images/product-crayfish-new-front.webp",
        backImage: "/images/product-crayfish-new-back.webp",
        whatsappMessage:
          "Hello, I want to order Julizen Crayfish Flavour 100g × 60 sachets. Please send me the details.",
        sizeEnabled: true,
      },
      "400g": {
        packLabel: "Value Pack",
        packDetail: "400g × 20 sachets (carton)",
        frontImage: "/images/product-crayfish-new-front.webp",
        backImage: "/images/product-crayfish-new-back.webp",
        whatsappMessage:
          "Hello, I want to order Julizen Crayfish Flavour 400g × 20 sachets. Please send me the details.",
        sizeEnabled: true,
      },
    },
  },
  {
    id: "fried-rice",
    name: "Fried Rice",
    tagline: "Golden, aromatic fried rice with every spoonful.",
    fullDescription:
      "Julizen Fried Rice Seasoning Powder is precisely blended for Nigerian-style fried rice.",
    cookingTips: [
      "Add one teaspoonful to 400ml of cooking water before adding your rice.",
      "Stir into the vegetables while stir-frying for deeper colour and flavour.",
    ],
    foodImage: "/images/food-fried-rice-party.webp",
    foodCaption: "Nigerian party fried rice — made with Julizen Fried Rice",
    accentColor: "#CA8A04",
    enabled: true,
    sizes: {
      "10g": {
        packLabel: "Sachet",
        packDetail: "10g × 10 × 42 rolls (carton)",
        frontImage: "/images/product-fried-rice-new-front.webp",
        backImage: "/images/product-fried-rice-new-back.webp",
        whatsappMessage:
          "Hello, I want to order Julizen Fried Rice Seasoning 10g × 42 rolls. Please send me the details.",
        sizeEnabled: true,
      },
      "100g": {
        packLabel: "Pouch",
        packDetail: "100g × 5 × 60 sachets (carton)",
        frontImage: "/images/product-fried-rice-new-front.webp",
        backImage: "/images/product-fried-rice-new-back.webp",
        whatsappMessage:
          "Hello, I want to order Julizen Fried Rice Seasoning 100g × 60 sachets. Please send me the details.",
        sizeEnabled: true,
      },
      "400g": {
        packLabel: "Value Pack",
        packDetail: "400g × 20 sachets (carton)",
        frontImage: "/images/product-fried-rice-new-front.webp",
        backImage: "/images/product-fried-rice-new-back.webp",
        whatsappMessage:
          "Hello, I want to order Julizen Fried Rice Seasoning 400g × 20 sachets. Please send me the details.",
        sizeEnabled: true,
      },
    },
  },
  {
    id: "stew-jollof",
    name: "Stew & Jollof",
    tagline: "Smoky party jollof taste in every pot, every time.",
    fullDescription:
      "Julizen Stew & Jollof Seasoning Powder is the secret behind that deep, smoky, party-jollof flavour everyone loves.",
    cookingTips: [
      "Add to your tomato-pepper blended base while frying the stew.",
      "Stir one teaspoonful into your jollof rice pot after adding the tomato sauce.",
    ],
    foodImage: "/images/food-jollof-party.webp",
    foodCaption: "Smoky Nigerian party jollof — made with Julizen Stew & Jollof",
    accentColor: "#DC2626",
    enabled: true,
    sizes: {
      "10g": {
        packLabel: "Sachet",
        packDetail: "10g × 10 × 42 rolls (carton)",
        frontImage: "/images/product-stew-jollof-new-front.webp",
        backImage: "/images/product-stew-jollof-new-back.webp",
        whatsappMessage:
          "Hello, I want to order Julizen Stew & Jollof Seasoning 10g × 42 rolls. Please send me the details.",
        sizeEnabled: true,
      },
      "100g": {
        packLabel: "Pouch",
        packDetail: "100g × 5 × 60 sachets (carton)",
        frontImage: "/images/product-stew-jollof-new-front.webp",
        backImage: "/images/product-stew-jollof-new-back.webp",
        whatsappMessage:
          "Hello, I want to order Julizen Stew & Jollof Seasoning 100g × 60 sachets. Please send me the details.",
        sizeEnabled: true,
      },
      "400g": {
        packLabel: "Value Pack",
        packDetail: "400g × 20 sachets (carton)",
        frontImage: "/images/product-stew-jollof-new-front.webp",
        backImage: "/images/product-stew-jollof-new-back.webp",
        whatsappMessage:
          "Hello, I want to order Julizen Stew & Jollof Seasoning 400g × 20 sachets. Please send me the details.",
        sizeEnabled: true,
      },
    },
  },
];
