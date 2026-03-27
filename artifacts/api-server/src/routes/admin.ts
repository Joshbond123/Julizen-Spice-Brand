import { Router } from "express";
import { db } from "@workspace/db";
import { settingsTable, productsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken, requireAuth } from "../middleware/auth";

const router = Router();

const DEFAULT_PASSWORD = "julizen2024";
const DEFAULT_SETTINGS = [
  { key: "whatsapp_number", value: "2348000000000" },
  { key: "contact_email", value: "info@julizen.com" },
  { key: "contact_phone", value: "+234 800 000 0000" },
];
const DEFAULT_PRODUCTS = [
  {
    id: "chicken-seasoning",
    name: "Julizen Chicken Seasoning Powder",
    category: "Chicken",
    price: 1500,
    description: "A well-balanced seasoning blend crafted to bring out the full depth of flavor in every chicken dish — grilled, stewed, or roasted.",
    image: "/images/product-chicken.png",
    status: "available",
  },
  {
    id: "fried-rice-seasoning",
    name: "Julizen Fried Rice Seasoning Powder",
    category: "Fried Rice",
    price: 1500,
    description: "A carefully measured blend of spices designed specifically for fried rice — giving each grain a savory, aromatic finish.",
    image: "/images/product-fried-rice.png",
    status: "available",
  },
  {
    id: "crayfish-seasoning",
    name: "Julizen Crayfish Seasoning Powder",
    category: "Crayfish",
    price: 1500,
    description: "A rich, smoky crayfish-infused blend perfect for soups, stews, and traditional Nigerian dishes that call for depth and body.",
    image: "/images/product-crayfish.png",
    status: "available",
  },
];

router.post("/admin/init", async (_req, res) => {
  try {
    const existing = await db.select().from(settingsTable).where(eq(settingsTable.key, "admin_password_hash"));
    if (existing.length === 0) {
      const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
      await db.insert(settingsTable).values([
        { key: "admin_password_hash", value: hash },
        ...DEFAULT_SETTINGS,
      ]).onConflictDoNothing();
    }
    const existingProducts = await db.select().from(productsTable);
    if (existingProducts.length === 0) {
      await db.insert(productsTable).values(DEFAULT_PRODUCTS as any).onConflictDoNothing();
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Init failed" });
  }
});

router.post("/admin/login", async (req, res) => {
  try {
    const { password } = req.body as { password?: string };
    if (!password) {
      res.status(400).json({ error: "Password required" });
      return;
    }
    const [row] = await db
      .select()
      .from(settingsTable)
      .where(eq(settingsTable.key, "admin_password_hash"));
    if (!row) {
      res.status(500).json({ error: "Admin not initialized" });
      return;
    }
    const valid = await bcrypt.compare(password, row.value);
    if (!valid) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }
    const token = signToken({ role: "admin" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.put("/admin/password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "currentPassword and newPassword required" });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters" });
      return;
    }
    const [row] = await db
      .select()
      .from(settingsTable)
      .where(eq(settingsTable.key, "admin_password_hash"));
    if (!row) {
      res.status(500).json({ error: "Admin not initialized" });
      return;
    }
    const valid = await bcrypt.compare(currentPassword, row.value);
    if (!valid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await db
      .update(settingsTable)
      .set({ value: hash })
      .where(eq(settingsTable.key, "admin_password_hash"));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update password" });
  }
});

router.get("/admin/settings", requireAuth, async (_req, res) => {
  try {
    const rows = await db.select().from(settingsTable);
    const settings: Record<string, string> = {};
    for (const row of rows) {
      if (row.key !== "admin_password_hash") {
        settings[row.key] = row.value;
      }
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.put("/admin/settings", requireAuth, async (req, res) => {
  try {
    const { whatsapp_number, contact_email, contact_phone } = req.body as {
      whatsapp_number?: string;
      contact_email?: string;
      contact_phone?: string;
    };
    const updates: Array<{ key: string; value: string }> = [];
    if (whatsapp_number !== undefined) updates.push({ key: "whatsapp_number", value: whatsapp_number });
    if (contact_email !== undefined) updates.push({ key: "contact_email", value: contact_email });
    if (contact_phone !== undefined) updates.push({ key: "contact_phone", value: contact_phone });
    for (const update of updates) {
      await db
        .insert(settingsTable)
        .values(update)
        .onConflictDoUpdate({ target: settingsTable.key, set: { value: update.value } });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
