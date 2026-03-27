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

const STORAGE_KEY = "julizen_products_v2";
export const PRODUCTS_UPDATE_EVENT = "julizen:products:updated";

export const DEFAULT_PRODUCTS: AdminProduct[] = [
  {
    id: "chicken",
    name: "Chicken Flavour",
    tagline: "Deep savory richness for soups, stews & everyday cooking.",
    fullDescription:
      "Julizen Chicken Flavour Seasoning Powder is carefully blended to bring out the full, natural depth of chicken in every dish. It enhances soups, gravies, vegetable stews and jollof rice with a warm, savory roundness that makes food taste like it was cooked for hours. Made with quality spices and balanced seasoning — no overpowering aftertaste, just clean, rich flavour that keeps the family coming back for seconds.",
    cookingTips: [
      "Add one teaspoonful to 400ml of boiling water for soups and gravies.",
      "Rub directly onto chicken before grilling or frying for deeper flavour.",
      "Stir into fried rice while cooking for a fuller, savory base.",
      "Add to your stew pot 10 minutes before serving for best results.",
    ],
    foodImage: "/images/food-egusi-semo-party.webp",
    foodCaption: "Rich egusi soup with semo & assorted meat — cooked with Julizen Chicken Flavour",
    accentColor: "#D97706",
    enabled: true,
    sizes: {
      "10g": {
        packLabel: "Sachet",
        packDetail: "10g × 10 × 42 rolls (carton)",
        frontImage: "/images/product-chicken-10g-front.webp",
        backImage: "/images/product-chicken-10g-back.webp",
        whatsappMessage: "Hello, I want to order Julizen Chicken Flavour Seasoning Powder 10g × 42 rolls (carton). Please send me the details and price.",
        sizeEnabled: true,
      },
      "100g": {
        packLabel: "Pouch",
        packDetail: "100g × 5 × 60 sachets (carton)",
        frontImage: "/images/product-chicken-100g-front.webp",
        backImage: "/images/product-chicken-100g-back.webp",
        whatsappMessage: "Hello, I want to order Julizen Chicken Flavour Seasoning Powder 100g × 60 sachets. Please send me the details and price.",
        sizeEnabled: true,
      },
      "400g": {
        packLabel: "Value Pack",
        packDetail: "400g × 20 sachets (carton)",
        frontImage: "/images/product-chicken-400g-front.webp",
        backImage: "/images/product-chicken-400g-back.webp",
        whatsappMessage: "Hello, I want to order Julizen Chicken Flavour Seasoning Powder 400g × 20 sachets (carton). Please send me the details and price.",
        sizeEnabled: true,
      },
    },
  },
  {
    id: "crayfish",
    name: "Crayfish Flavour",
    tagline: "Authentic crayfish depth for traditional soups & native dishes.",
    fullDescription:
      "Julizen Crayfish Flavour Seasoning Powder delivers the bold, unmistakable taste of crayfish that Nigerians know and love — without the mess. It brings deep umami richness to egusi soup, oha, bitterleaf, okra, and any traditional dish that calls for real crayfish flavour. Each sachet is concentrated to give your soup that thick, flavorful base that makes people ask \"what did you put in this?\"",
    cookingTips: [
      "Dissolve one teaspoonful in soup stock before adding your main ingredients.",
      "Use in egusi or okra soup to amplify the crayfish flavour naturally.",
      "Combine with fresh pepper and palm oil for an authentic pepper soup base.",
      "Add to ofe onugbu or bitterleaf soup for traditional depth.",
    ],
    foodImage: "/images/food-okro-fufu-party.webp",
    foodCaption: "Thick okro soup with fufu, assorted meat & crayfish — made with Julizen Crayfish Flavour",
    accentColor: "#B45309",
    enabled: true,
    sizes: {
      "10g": {
        packLabel: "Sachet",
        packDetail: "10g × 10 × 42 rolls (carton)",
        frontImage: "/images/product-crayfish-10g-front.webp",
        backImage: "/images/product-crayfish-10g-back.webp",
        whatsappMessage: "Hello, I want to order Julizen Crayfish Flavour Seasoning Powder 10g × 42 rolls (carton). Please send me the details and price.",
        sizeEnabled: true,
      },
      "100g": {
        packLabel: "Pouch",
        packDetail: "100g × 5 × 60 sachets (carton)",
        frontImage: "/images/product-crayfish-100g-front.webp",
        backImage: "/images/product-crayfish-100g-back.webp",
        whatsappMessage: "Hello, I want to order Julizen Crayfish Flavour Seasoning Powder 100g × 60 sachets. Please send me the details and price.",
        sizeEnabled: true,
      },
      "400g": {
        packLabel: "Value Pack",
        packDetail: "400g × 20 sachets (carton)",
        frontImage: "/images/product-crayfish-400g-front.webp",
        backImage: "/images/product-crayfish-400g-back.webp",
        whatsappMessage: "Hello, I want to order Julizen Crayfish Flavour Seasoning Powder 400g × 20 sachets (carton). Please send me the details and price.",
        sizeEnabled: true,
      },
    },
  },
  {
    id: "fried-rice",
    name: "Fried Rice",
    tagline: "Golden, aromatic fried rice with every spoonful.",
    fullDescription:
      "Julizen Fried Rice Seasoning Powder is precisely blended for Nigerian-style fried rice — delivering that vibrant golden color, warm spice aroma, and satisfying savory taste that makes fried rice the star of any party or family meal. It balances turmeric, seasoning spices, and natural flavouring to produce perfectly seasoned rice without the guesswork. One sachet, perfect rice — every single time.",
    cookingTips: [
      "Add one teaspoonful to 400ml of cooking water before adding your rice.",
      "Stir into the vegetables while stir-frying for deeper colour and flavour.",
      "Mix with a splash of oil before adding stock for more even distribution.",
      "Use half a teaspoon to season your chicken liver and gizzards.",
    ],
    foodImage: "/images/food-fried-rice-party.webp",
    foodCaption: "Vibrant Nigerian party fried rice with prawns & vegetables — made with Julizen Fried Rice",
    accentColor: "#CA8A04",
    enabled: true,
    sizes: {
      "10g": {
        packLabel: "Sachet",
        packDetail: "10g × 10 × 42 rolls (carton)",
        frontImage: "/images/product-fried-rice-10g-front.webp",
        backImage: "/images/product-fried-rice-10g-back.webp",
        whatsappMessage: "Hello, I want to order Julizen Fried Rice Seasoning Powder 10g × 42 rolls (carton). Please send me the details and price.",
        sizeEnabled: true,
      },
      "100g": {
        packLabel: "Pouch",
        packDetail: "100g × 5 × 60 sachets (carton)",
        frontImage: "/images/product-fried-rice-100g-front.webp",
        backImage: "/images/product-fried-rice-100g-back.webp",
        whatsappMessage: "Hello, I want to order Julizen Fried Rice Seasoning Powder 100g × 60 sachets. Please send me the details and price.",
        sizeEnabled: true,
      },
      "400g": {
        packLabel: "Value Pack",
        packDetail: "400g × 20 sachets (carton)",
        frontImage: "/images/product-fried-rice-100g-front.webp",
        backImage: "/images/product-fried-rice-100g-back.webp",
        whatsappMessage: "Hello, I want to order Julizen Fried Rice Seasoning Powder 400g × 20 sachets (carton). Please send me the details and price.",
        sizeEnabled: true,
      },
    },
  },
  {
    id: "stew-jollof",
    name: "Stew & Jollof",
    tagline: "Smoky party jollof taste in every pot, every time.",
    fullDescription:
      "Julizen Stew & Jollof Seasoning Powder is the secret behind that deep, smoky, party-jollof flavour that everyone keeps asking about. Crafted with a balanced blend of tomato, onion, basil, garlic, and warm spices, it brings consistency and depth to your jollof rice and meat stew — whether you're cooking for four or forty. Rich colour, bold flavour, and the kind of finish that has guests serving themselves a second plate.",
    cookingTips: [
      "Add to your tomato-pepper blended base while frying the stew.",
      "Stir one teaspoonful into your jollof rice pot after adding the tomato sauce.",
      "Use when browning meat for stew to build a flavourful, deeply seasoned base.",
      "Combine with stock and seasoning to create a concentrated sauce for rice dishes.",
    ],
    foodImage: "/images/food-jollof-party.webp",
    foodCaption: "Smoky Nigerian party jollof rice with grilled chicken & plantain — made with Julizen Stew & Jollof",
    accentColor: "#DC2626",
    enabled: true,
    sizes: {
      "10g": {
        packLabel: "Sachet",
        packDetail: "10g × 10 × 42 rolls (carton)",
        frontImage: "/images/product-stew-jollof-10g-front.webp",
        backImage: "/images/product-stew-jollof-10g-back.webp",
        whatsappMessage: "Hello, I want to order Julizen Stew & Jollof Seasoning Powder 10g × 42 rolls (carton). Please send me the details and price.",
        sizeEnabled: true,
      },
      "100g": {
        packLabel: "Pouch",
        packDetail: "100g × 5 × 60 sachets (carton)",
        frontImage: "/images/product-stew-jollof-100g-front.webp",
        backImage: "/images/product-stew-jollof-100g-back.webp",
        whatsappMessage: "Hello, I want to order Julizen Stew & Jollof Seasoning Powder 100g × 60 sachets. Please send me the details and price.",
        sizeEnabled: true,
      },
      "400g": {
        packLabel: "Value Pack",
        packDetail: "400g × 20 sachets (carton)",
        frontImage: "/images/product-stew-jollof-100g-front.webp",
        backImage: "/images/product-stew-jollof-100g-back.webp",
        whatsappMessage: "Hello, I want to order Julizen Stew & Jollof Seasoning Powder 400g × 20 sachets (carton). Please send me the details and price.",
        sizeEnabled: true,
      },
    },
  },
];

function migrateProduct(p: AdminProduct): AdminProduct {
  const sizes = { ...p.sizes } as Record<SizeKey, AdminProductSize>;
  for (const sz of ["10g", "100g", "400g"] as SizeKey[]) {
    if (sizes[sz] && typeof sizes[sz].sizeEnabled === "undefined") {
      sizes[sz] = { ...sizes[sz], sizeEnabled: true };
    }
  }
  return { ...p, sizes };
}

export function getProducts(): AdminProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PRODUCTS.map(p => JSON.parse(JSON.stringify(p)));
    const parsed = JSON.parse(raw) as AdminProduct[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(migrateProduct);
    }
    return DEFAULT_PRODUCTS.map(p => JSON.parse(JSON.stringify(p)));
  } catch {
    return DEFAULT_PRODUCTS.map(p => JSON.parse(JSON.stringify(p)));
  }
}

export function saveProducts(products: AdminProduct[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATE_EVENT, { detail: products }));
}

export function resetToDefaults(): AdminProduct[] {
  const fresh = DEFAULT_PRODUCTS.map(p => JSON.parse(JSON.stringify(p)));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATE_EVENT, { detail: fresh }));
  return fresh;
}

const ADMIN_SESSION_KEY = "julizen_admin_session";
const ADMIN_PASSWORD = "joshbond";
const SESSION_DURATION_MS = 30 * 60 * 1000;

export function checkAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function createAdminSession(): void {
  sessionStorage.setItem(ADMIN_SESSION_KEY, String(Date.now()));
}

export function isAdminSessionValid(): boolean {
  const ts = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!ts) return false;
  return Date.now() - Number(ts) < SESSION_DURATION_MS;
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
