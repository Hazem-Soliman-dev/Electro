import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc } from "drizzle-orm";
import * as schema from "./schema";
import { mockDb, MenuItem, Order } from "./mockDb";

// Setup database connection with safety checks
const isDatabaseConfigured = !!process.env.DATABASE_URL;

let dbClient: any = null;
if (isDatabaseConfigured) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    dbClient = drizzle(sql, { schema });
  } catch (err) {
    console.error("Failed to initialize Neon Database client:", err);
  }
}

export const db = dbClient;

// Helper to determine if we should use fallback
const useFallback = () => {
  return !db || !isDatabaseConfigured;
};

// Abstracted Database Interface to handle direct DB queries or Mock DB fallback
export const dbActions = {
  // Menu items CRUD
  getMenuItems: async (): Promise<MenuItem[]> => {
    if (useFallback()) {
      return await mockDb.getMenuItems();
    }
    try {
      let items = await db.select().from(schema.menuItems).orderBy(desc(schema.menuItems.createdAt));
      
      // Auto seed if database is empty
      if (items.length === 0) {
        console.log("Neon database menu_items table is empty. Seeding default items...");
        const { DEFAULT_MENU_ITEMS } = require("./mockDb");
        for (const item of DEFAULT_MENU_ITEMS) {
          try {
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
          } catch (insertErr) {
            console.error("Failed to seed item:", item.id, insertErr);
          }
        }
        items = await db.select().from(schema.menuItems).orderBy(desc(schema.menuItems.createdAt));
      }

      return items.map((item: any) => ({
        ...item,
        price: item.price.toString(),
      }));
    } catch (err) {
      console.warn("DB query failed, falling back to mock storage:", err);
      return await mockDb.getMenuItems();
    }
  },

  getMenuItemById: async (id: string): Promise<MenuItem | undefined> => {
    if (useFallback()) {
      return await mockDb.getMenuItemById(id);
    }
    try {
      const results = await db.select().from(schema.menuItems).where(eq(schema.menuItems.id, id));
      if (results.length === 0) return undefined;
      const item = results[0];
      return {
        ...item,
        price: item.price.toString(),
      };
    } catch (err) {
      console.warn("DB query failed, falling back to mock storage:", err);
      return await mockDb.getMenuItemById(id);
    }
  },

  createMenuItem: async (item: Omit<MenuItem, "id" | "createdAt">): Promise<MenuItem> => {
    const id = `menu-${Date.now()}`;
    if (useFallback()) {
      return await mockDb.createMenuItem(item);
    }
    try {
      const results = await db.insert(schema.menuItems).values({
        id,
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        descriptionEn: item.descriptionEn,
        descriptionAr: item.descriptionAr,
        price: item.price,
        imageUrl: item.imageUrl,
        category: item.category,
        isAvailable: item.isAvailable,
      }).returning();
      const created = results[0];
      return {
        ...created,
        price: created.price.toString(),
      };
    } catch (err) {
      console.warn("DB insert failed, falling back to mock storage:", err);
      return await mockDb.createMenuItem(item);
    }
  },

  updateMenuItem: async (id: string, updates: Partial<Omit<MenuItem, "id" | "createdAt">>): Promise<MenuItem | undefined> => {
    if (useFallback()) {
      return await mockDb.updateMenuItem(id, updates);
    }
    try {
      const results = await db.update(schema.menuItems)
        .set(updates)
        .where(eq(schema.menuItems.id, id))
        .returning();
      if (results.length === 0) return undefined;
      const updated = results[0];
      return {
        ...updated,
        price: updated.price.toString(),
      };
    } catch (err) {
      console.warn("DB update failed, falling back to mock storage:", err);
      return await mockDb.updateMenuItem(id, updates);
    }
  },

  deleteMenuItem: async (id: string): Promise<boolean> => {
    if (useFallback()) {
      return await mockDb.deleteMenuItem(id);
    }
    try {
      const results = await db.delete(schema.menuItems)
        .where(eq(schema.menuItems.id, id))
        .returning();
      return results.length > 0;
    } catch (err) {
      console.warn("DB delete failed, falling back to mock storage:", err);
      return await mockDb.deleteMenuItem(id);
    }
  },

  // Orders CRUD
  getOrders: async (): Promise<Order[]> => {
    if (useFallback()) {
      return await mockDb.getOrders();
    }
    try {
      const results = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
      return results.map((order: any) => ({
        ...order,
        price: order.totalPrice.toString(), // adapt numeric total_price
        totalPrice: order.totalPrice.toString(),
      }));
    } catch (err) {
      console.warn("DB query failed, falling back to mock storage:", err);
      if (!useFallback()) {
        throw err;
      }
      return await mockDb.getOrders();
    }
  },

  getOrdersByUserId: async (userId: string): Promise<Order[]> => {
    if (useFallback()) {
      return await mockDb.getOrdersByUserId(userId);
    }
    try {
      const results = await db.select().from(schema.orders)
        .where(eq(schema.orders.userId, userId))
        .orderBy(desc(schema.orders.createdAt));
      return results.map((order: any) => ({
        ...order,
        totalPrice: order.totalPrice.toString(),
      }));
    } catch (err) {
      console.warn("DB query failed, falling back to mock storage:", err);
      if (!useFallback()) {
        throw err;
      }
      return await mockDb.getOrdersByUserId(userId);
    }
  },

  getOrderById: async (id: string): Promise<Order | undefined> => {
    if (useFallback()) {
      return await mockDb.getOrderById(id);
    }
    try {
      const results = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
      if (results.length === 0) return undefined;
      const order = results[0];
      return {
        ...order,
        totalPrice: order.totalPrice.toString(),
      };
    } catch (err) {
      console.warn("DB query failed, falling back to mock storage:", err);
      if (!useFallback()) {
        throw err;
      }
      return await mockDb.getOrderById(id);
    }
  },

  createOrder: async (order: Omit<Order, "id" | "createdAt" | "status" | "paymentStatus">): Promise<Order> => {
    const id = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    if (useFallback()) {
      return await mockDb.createOrder(order);
    }
    try {
      const results = await db.insert(schema.orders).values({
        id,
        userId: order.userId,
        userEmail: order.userEmail,
        userName: order.userName,
        items: order.items,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        paymentStatus: "pending",
        polarCheckoutId: order.polarCheckoutId || null,
        status: "pending",
        deliveryAddress: order.deliveryAddress,
        deliveryPhone: order.deliveryPhone,
      }).returning();
      const created = results[0];
      return {
        ...created,
        totalPrice: created.totalPrice.toString(),
      };
    } catch (err) {
      console.warn("DB insert order failed, falling back to mock storage:", err);
      if (!useFallback()) {
        throw err;
      }
      return await mockDb.createOrder(order);
    }
  },

  updateOrderStatus: async (id: string, status: Order["status"]): Promise<Order | undefined> => {
    if (useFallback()) {
      return await mockDb.updateOrderStatus(id, status);
    }
    try {
      const results = await db.update(schema.orders)
        .set({ status })
        .where(eq(schema.orders.id, id))
        .returning();
      if (results.length === 0) return undefined;
      const updated = results[0];
      return {
        ...updated,
        totalPrice: updated.totalPrice.toString(),
      };
    } catch (err) {
      console.warn("DB update status failed, falling back to mock storage:", err);
      if (!useFallback()) {
        throw err;
      }
      return await mockDb.updateOrderStatus(id, status);
    }
  },

  updateOrderPaymentStatus: async (id: string, paymentStatus: Order["paymentStatus"]): Promise<Order | undefined> => {
    if (useFallback()) {
      return await mockDb.updateOrderPaymentStatus(id, paymentStatus);
    }
    try {
      const updates: any = { paymentStatus };
      if (paymentStatus === "paid") {
        updates.status = "preparing"; // automatically advance status if paid
      }
      const results = await db.update(schema.orders)
        .set(updates)
        .where(eq(schema.orders.id, id))
        .returning();
      if (results.length === 0) return undefined;
      const updated = results[0];
      return {
        ...updated,
        totalPrice: updated.totalPrice.toString(),
      };
    } catch (err) {
      console.warn("DB update payment status failed, falling back to mock storage:", err);
      if (!useFallback()) {
        throw err;
      }
      return await mockDb.updateOrderPaymentStatus(id, paymentStatus);
    }
  }
};
