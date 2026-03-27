import { Router } from "express";
import { getProducts, updateProduct } from "../lib/contentStore";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/products", (_req, res) => {
  try {
    const products = getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.put("/products/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    if (!update || typeof update !== "object") {
      res.status(400).json({ error: "Invalid product data" });
      return;
    }
    const updated = updateProduct(id, update);
    if (!updated) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

export default router;
