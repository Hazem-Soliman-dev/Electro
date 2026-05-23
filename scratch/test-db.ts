import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/schema";
import { DEFAULT_MENU_ITEMS } from "../lib/mockDb";


async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set");
    return;
  }
  console.log("Connecting to:", url);
  try {
    const sql = neon(url);
    const db = drizzle(sql, { schema });
    
    console.log("Querying menu_items...");
    const items = await db.select().from(schema.menuItems);
    console.log("Current item count in Neon:", items.length);
    
    if (items.length === 0) {
      console.log("Seeding default items into Neon database...");
      for (const item of DEFAULT_MENU_ITEMS) {
        await db.insert(schema.menuItems).values({
          id: item.id,
          nameEn: item.nameEn,
          nameAr: item.nameAr,
          descriptionEn: item.descriptionEn,
          descriptionAr: item.descriptionAr,
          price: item.price,
          imageUrl: item.imageUrl,
          category: item.category,
          isAvailable: item.isAvailable,
        });
        console.log(`Seeded: ${item.nameEn}`);
      }
      const newItems = await db.select().from(schema.menuItems);
      console.log("Seeding completed! New item count in Neon:", newItems.length);
    } else {
      console.log("Neon database is already seeded.");
    }
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

run();
