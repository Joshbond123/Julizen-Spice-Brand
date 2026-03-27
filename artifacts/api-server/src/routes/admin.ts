import { Router } from "express";
import bcrypt from "bcryptjs";
import { requireAuth, signToken } from "../middleware/auth";
import { readStore, updateStore, type ManagedProduct } from "../lib/contentStore";

const router = Router();

router.post("/admin/init", async (_req, res) => {
  try {
    await readStore();
    res.json({ success: true });
  } catch {
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

    const store = await readStore();
    const valid = await bcrypt.compare(password, store.adminPasswordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const token = signToken({ role: "admin" });
    res.json({ token });
  } catch {
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

    const store = await readStore();
    const valid = await bcrypt.compare(currentPassword, store.adminPasswordHash);
    if (!valid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await updateStore((current) => ({ ...current, adminPasswordHash: hash }));

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to update password" });
  }
});

router.get("/admin/settings", requireAuth, async (_req, res) => {
  try {
    const store = await readStore();
    res.json(store.settings);
  } catch {
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

    await updateStore((store) => ({
      ...store,
      settings: {
        whatsapp_number: whatsapp_number ?? store.settings.whatsapp_number,
        contact_email: contact_email ?? store.settings.contact_email,
        contact_phone: contact_phone ?? store.settings.contact_phone,
      },
    }));

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

router.get("/admin/products", requireAuth, async (_req, res) => {
  try {
    const store = await readStore();
    res.json(store.products);
  } catch {
    res.status(500).json({ error: "Failed to fetch admin products" });
  }
});

router.put("/admin/products/:id", requireAuth, async (req, res) => {
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
      updated = {
        ...current,
        ...payload,
        imageFront: payload.imageFront ?? current.imageFront,
        imageBack: payload.imageBack ?? current.imageBack,
        foodImage: payload.foodImage ?? current.foodImage,
      };
      updated.image = updated.foodImage || updated.imageFront || current.image;
      const products = [...store.products];
      products[index] = updated;
      return { ...store, products };
    });

    res.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    res.status(message === "Product not found" ? 404 : 400).json({ error: message });
  }
});

export default router;
