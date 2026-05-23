import { pgTable, text, numeric, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const menuItems = pgTable("menu_items", {
  id: text("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // 'pizzas' | 'burgers' | 'sides' | 'drinks' | 'desserts'
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export interface OrderItem {
  menuItemId: string;
  nameEn: string;
  nameAr: string;
  price: number;
  quantity: number;
}

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  userEmail: text("user_email").notNull(),
  userName: text("user_name").notNull(),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").$type<"polar" | "cod">().notNull(), // 'polar' | 'cod'
  paymentStatus: text("payment_status").$type<"pending" | "paid" | "failed">().default("pending").notNull(),
  polarCheckoutId: text("polar_checkout_id"),
  status: text("status").$type<"pending" | "preparing" | "out_for_delivery" | "delivered">().default("pending").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryPhone: text("delivery_phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
