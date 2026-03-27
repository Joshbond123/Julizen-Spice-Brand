import { Router } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { requireAuth } from "../middleware/auth";
import { IMAGES_DIR } from "../lib/contentStore";

const router = Router();

router.post("/upload", requireAuth, (req, res) => {
  try {
    const { imageData, filename } = req.body as {
      imageData?: string;
      filename?: string;
    };

    if (!imageData || !filename) {
      res.status(400).json({ error: "imageData and filename are required" });
      return;
    }

    const matches = imageData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches) {
      res.status(400).json({ error: "Invalid image data format (must be base64 data URL)" });
      return;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const allowedTypes: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };

    const ext = allowedTypes[mimeType];
    if (!ext) {
      res.status(400).json({ error: "Only JPEG, PNG, WebP, and GIF images are allowed" });
      return;
    }

    const safeName = path
      .basename(filename)
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/\.[^.]+$/, "");

    const unique = crypto.randomBytes(6).toString("hex");
    const finalName = `${safeName}-${unique}.${ext}`;
    const filePath = path.join(IMAGES_DIR, finalName);

    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(filePath, buffer);

    res.json({ url: `/api/images/${finalName}` });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
