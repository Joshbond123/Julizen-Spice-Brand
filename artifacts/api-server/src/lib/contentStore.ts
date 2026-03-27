import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export type ProductSize = "10g" | "100g" | "400g";

export interface ManagedProduct {
  id: string;
  slug: string;
  size: ProductSize;
  name: string;
  category: string;
  price: number;
  description: string;
  packagingDetails: string;
  imageFront: string;
  imageBack: string;
  foodImage: string;
  image: string;
  status: "available" | "coming_soon";
}

export interface ContentStore {
  adminPasswordHash: string;
  settings: {
    whatsapp_number: string;
    contact_email: string;
    contact_phone: string;
  };
  products: ManagedProduct[];
}

const DATA_PATH = path.resolve(import.meta.dirname, "..", "..", "data", "content-store.json");
const DEFAULT_PASSWORD = "julizen2024";

function buildDefaultProducts(): ManagedProduct[] {
  const base = [
    {
      slug: "chicken-flavour-seasoning-powder",
      category: "Chicken Flavour",
      baseName: "Julizen Chicken Flavour Seasoning Powder",
      description:
        "Prepared for chicken dishes and everyday meals where a fuller savory taste is needed.",
      packagingDetails: "High-barrier laminated sachet with front and back seal, suitable for shelf display.",
      foodImage: "/images/product-chicken.webp",
    },
    {
      slug: "crayfish-flavour-seasoning-powder",
      category: "Crayfish Flavour",
      baseName: "Julizen Crayfish Flavour Seasoning Powder",
      description:
        "Suitable for soups, sauces, and traditional dishes where crayfish flavor adds depth.",
      packagingDetails: "Durable moisture-resistant sachet with clear flavor labeling for retail and wholesale.",
      foodImage: "/images/product-crayfish.webp",
    },
    {
      slug: "fried-rice-seasoning-powder",
      category: "Fried Rice",
      baseName: "Julizen Fried Rice Seasoning Powder",
      description:
        "Made for fried rice meals with a balanced taste and satisfying result.",
      packagingDetails: "Retail-ready printed sachet with strong seal integrity and clear cooking identity.",
      foodImage: "/images/product-fried-rice.webp",
    },
    {
      slug: "stew-jollof-seasoning-powder",
      category: "Stew & Jollof",
      baseName: "Julizen Stew & Jollof Seasoning Powder",
      description:
        "Designed for stew and jollof dishes to support a richer and more consistent cooking result.",
      packagingDetails: "Heat-sealed food-grade sachet designed for flavor retention and easy stocking.",
      foodImage: "/images/food-jollof-rice.webp",
    },
  ] as const;

  const sizes: ProductSize[] = ["10g", "100g", "400g"];
  const sizePrice: Record<ProductSize, number> = {
    "10g": 300,
    "100g": 1500,
    "400g": 5000,
  };

  return base.flatMap((item) =>
    sizes.map((size) => ({
      id: `${item.slug}-${size}`,
      slug: item.slug,
      size,
      name: `${item.baseName} ${size.toUpperCase()}`,
      category: item.category,
      price: sizePrice[size],
      description: item.description,
      packagingDetails: item.packagingDetails,
      imageFront: item.foodImage,
      imageBack: item.foodImage,
      foodImage: item.foodImage,
      image: item.foodImage,
      status: "available" as const,
    })),
  );
}

async function createDefaultStore(): Promise<ContentStore> {
  const adminPasswordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  return {
    adminPasswordHash,
    settings: {
      whatsapp_number: "2348000000000",
      contact_email: "info@julizen.com",
      contact_phone: "+234 800 000 0000",
    },
    products: buildDefaultProducts(),
  };
}

let writeQueue = Promise.resolve();

export async function ensureStoreFile(): Promise<void> {
  try {
    await fs.access(DATA_PATH);
  } catch {
    const defaultStore = await createDefaultStore();
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, `${JSON.stringify(defaultStore, null, 2)}\n`, "utf8");
  }
}

export async function readStore(): Promise<ContentStore> {
  await ensureStoreFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as ContentStore;
}

export async function writeStore(nextStore: ContentStore): Promise<void> {
  await ensureStoreFile();
  writeQueue = writeQueue.then(async () => {
    await fs.writeFile(DATA_PATH, `${JSON.stringify(nextStore, null, 2)}\n`, "utf8");
  });
  await writeQueue;
}

export async function updateStore(
  updater: (current: ContentStore) => ContentStore | Promise<ContentStore>,
): Promise<ContentStore> {
  const current = await readStore();
  const next = await updater(current);
  await writeStore(next);
  return next;
}

export const storeFilePath = DATA_PATH;
