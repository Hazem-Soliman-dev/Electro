import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../lib/schema";

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
    
    console.log("Fetching first menu item...");
    const items = await db.select().from(schema.menuItems);
    if (items.length === 0) {
      console.log("No menu items found in Neon database to update.");
      return;
    }
    
    const targetItem = items[0];
    console.log("Target item to update:", targetItem.id, targetItem.nameEn, "Image URL:", targetItem.imageUrl);
    
    const testImageUrl = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&test=${Date.now()}`;
    console.log("Attempting to update image URL to:", testImageUrl);
    
    const results = await db.update(schema.menuItems)
      .set({
        imageUrl: testImageUrl,
      })
      .where(eq(schema.menuItems.id, targetItem.id))
      .returning();
      
    console.log("Update result count:", results.length);
    if (results.length > 0) {
      console.log("Updated item image URL successfully in Neon database:", results[0].imageUrl);
    } else {
      console.log("No item was updated.");
    }
  } catch (err) {
    console.error("Database update failed with error:", err);
  }
}

run();
