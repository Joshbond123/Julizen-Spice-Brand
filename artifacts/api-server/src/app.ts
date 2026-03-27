import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { db } from "@workspace/db";
import { settingsTable, productsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

async function seedDefaults() {
  try {
    const [existing] = await db
      .select()
      .from(settingsTable)
      .where(eq(settingsTable.key, "admin_password_hash"));

    if (!existing) {
      const hash = await bcrypt.hash("julizen2024", 10);
      await db.insert(settingsTable).values([
        { key: "admin_password_hash", value: hash },
        { key: "whatsapp_number", value: "2348000000000" },
        { key: "contact_email", value: "info@julizen.com" },
        { key: "contact_phone", value: "+234 800 000 0000" },
      ]).onConflictDoNothing();
      logger.info("Admin defaults seeded");
    }

    const existingProducts = await db.select().from(productsTable);
    if (existingProducts.length === 0) {
      await db.insert(productsTable).values([
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
      ]).onConflictDoNothing();
      logger.info("Default products seeded");
    }
  } catch (err) {
    logger.error({ err }, "Failed to seed defaults");
  }
}

seedDefaults();

export default app;
