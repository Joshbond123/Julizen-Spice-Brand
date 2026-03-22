import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, insertProductSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/products", async (_req, res) => {
  try {
    const products = await db.select().from(productsTable).orderBy(productsTable.id);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/products", requireAuth, async (req, res) => {
  try {
    const parsed = insertProductSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid product data", details: parsed.error });
      return;
    }
    const [created] = await db.insert(productsTable).values(parsed.data).returning();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/products/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const parsed = insertProductSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid product data" });
      return;
    }
    const [updated] = await db
      .update(productsTable)
      .set(parsed.data)
      .where(eq(productsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/products/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const [deleted] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
