import { Router } from "express";
import { readStore } from "../lib/contentStore";

const router = Router();

router.get("/settings/public", async (_req, res) => {
  try {
    const store = await readStore();
    res.json(store.settings);
  } catch {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

export default router;
