import { Router } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db/schema";
import { inArray } from "drizzle-orm";

const router = Router();

const PUBLIC_KEYS = ["whatsapp_number", "contact_email", "contact_phone"];

router.get("/settings/public", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(settingsTable)
      .where(inArray(settingsTable.key, PUBLIC_KEYS));
    const settings: Record<string, string> = {
      whatsapp_number: "2348000000000",
      contact_email: "info@julizen.com",
      contact_phone: "+234 800 000 0000",
    };
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

export default router;
