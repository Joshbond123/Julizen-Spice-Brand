import { Router } from "express";
import bcrypt from "bcryptjs";
import { signToken, requireAuth } from "../middleware/auth";
import {
  getAdminPasswordHash,
  setAdminPasswordHash,
  getSettings,
  updateSettings,
} from "../lib/contentStore";

const router = Router();

router.post("/admin/login", async (req, res) => {
  try {
    const { password } = req.body as { password?: string };
    if (!password) {
      res.status(400).json({ error: "Password required" });
      return;
    }
    const hash = getAdminPasswordHash();
    if (!hash) {
      res.status(500).json({ error: "Admin not initialized" });
      return;
    }
    const valid = await bcrypt.compare(password, hash);
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
    const hash = getAdminPasswordHash();
    if (!hash) {
      res.status(500).json({ error: "Admin not initialized" });
      return;
    }
    const valid = await bcrypt.compare(currentPassword, hash);
    if (!valid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    setAdminPasswordHash(newHash);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update password" });
  }
});

router.get("/admin/settings", requireAuth, (_req, res) => {
  try {
    const s = getSettings();
    res.json({
      whatsapp_number: s.whatsapp_number,
      contact_email: s.contact_email,
      contact_phone: s.contact_phone,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.put("/admin/settings", requireAuth, (req, res) => {
  try {
    const { whatsapp_number, contact_email, contact_phone } = req.body as {
      whatsapp_number?: string;
      contact_email?: string;
      contact_phone?: string;
    };
    const partial: Record<string, string> = {};
    if (whatsapp_number !== undefined) partial.whatsapp_number = whatsapp_number;
    if (contact_email !== undefined) partial.contact_email = contact_email;
    if (contact_phone !== undefined) partial.contact_phone = contact_phone;
    updateSettings(partial);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
