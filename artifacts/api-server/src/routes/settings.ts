import { Router } from "express";
import { getSettings } from "../lib/contentStore";

const router = Router();

router.get("/settings/public", (_req, res) => {
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

export default router;
