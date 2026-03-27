import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { readStore, updateStore, type ManagedProduct, type ProductSize } from "../lib/contentStore";

const router = Router();

const allowedSizes: ProductSize[] = ["10g", "100g", "400g"];

function normalizeProduct(payload: Partial<ManagedProduct>, current?: ManagedProduct): ManagedProduct {
  const base = current ?? {
    id: "",
    slug: "",
    size: "100g" as ProductSize,
    name: "",
    category: "",
    price: 1500,
    description: "",
    packagingDetails: "",
    imageFront: "",
    imageBack: "",
    foodImage: "",
    image: "",
    status: "available" as const,
  };

  const size = (payload.size ?? base.size).toLowerCase() as ProductSize;
  if (!allowedSizes.includes(size)) {
    throw new Error("Invalid size. Allowed sizes: 10g, 100g, 400g");
  }

  const imageFront = payload.imageFront ?? base.imageFront;
  const imageBack = payload.imageBack ?? base.imageBack;
  const foodImage = payload.foodImage ?? base.foodImage;

  return {
    ...base,
    ...payload,
    size,
    imageFront,
    imageBack,
    foodImage,
    image: foodImage || imageFront || base.image,
    status: payload.status ?? base.status,
  };
}

router.get("/products", async (_req, res) => {
  try {
    const store = await readStore();
    res.json(store.products);
  } catch {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/products", requireAuth, async (req, res) => {
  try {
    const payload = req.body as Partial<ManagedProduct>;
    if (!payload.id || !payload.slug || !payload.name || !payload.description || !payload.size) {
      res.status(400).json({ error: "id, slug, size, name and description are required" });
      return;
    }

    let created: ManagedProduct | null = null;
    await updateStore((store) => {
      if (store.products.some((product) => product.id === payload.id)) {
        throw new Error("Product with this id already exists");
      }
      created = normalizeProduct(payload);
      return { ...store, products: [...store.products, created!] };
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create product" });
  }
});

router.put("/products/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body as Partial<ManagedProduct>;

    let updated: ManagedProduct | null = null;
    await updateStore((store) => {
      const index = store.products.findIndex((product) => product.id === id);
      if (index === -1) {
        throw new Error("Product not found");
      }
      const current = store.products[index];
      updated = normalizeProduct(payload, current);
      const products = [...store.products];
      products[index] = updated!;
      return { ...store, products };
    });

    res.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    res.status(message === "Product not found" ? 404 : 400).json({ error: message });
  }
});

router.delete("/products/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await updateStore((store) => {
      const nextProducts = store.products.filter((product) => product.id !== id);
      if (nextProducts.length === store.products.length) {
        throw new Error("Product not found");
      }
      return { ...store, products: nextProducts };
    });

    res.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete product";
    res.status(message === "Product not found" ? 404 : 400).json({ error: message });
  }
});

export default router;
