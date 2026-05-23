import { OrderItem } from "./schema";

export interface MenuItem {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: string; // matches numeric schema type as string
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  totalPrice: string;
  paymentMethod: "polar" | "cod";
  paymentStatus: "pending" | "paid" | "failed";
  polarCheckoutId?: string | null;
  status: "pending" | "preparing" | "out_for_delivery" | "delivered";
  deliveryAddress: string;
  deliveryPhone: string;
  createdAt: Date;
}

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: "menu-1",
    nameEn: "Margherita Pizza",
    nameAr: "بيتزا مارغريتا",
    descriptionEn: "Classic tomato sauce, fresh mozzarella, fresh basil, and extra virgin olive oil.",
    descriptionAr: "صلصة طماطم كلاسيكية، موزاريللا طازجة، ريحان طازج، وزيت زيتون بكر ممتاز.",
    price: "12.99",
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80",
    category: "pizzas",
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: "menu-2",
    nameEn: "Double Cheeseburger",
    nameAr: "دبل تشيز برجر",
    descriptionEn: "Two flame-grilled beef patties, double cheddar cheese, lettuce, tomatoes, and house sauce.",
    descriptionAr: "شريحتان من لحم البقر المشوي على اللهب، جبنة شيدر مزدوجة، خس، طماطم، وصلصة الدار الخاصة.",
    price: "9.99",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    category: "burgers",
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: "menu-3",
    nameEn: "Crispy French Fries",
    nameAr: "بطاطس مقلية مقرمشة",
    descriptionEn: "Golden crispy french fries, lightly salted and served with ketchup.",
    descriptionAr: "بطاطس مقلية مقرمشة ذهبية، مملحة خفيفاً وتقدم مع الكاتشب.",
    price: "3.49",
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    category: "sides",
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: "menu-4",
    nameEn: "Garlic Parmesan Bread",
    nameAr: "خبز الثوم والبارميزان",
    descriptionEn: "Toasted baguette slices brushed with garlic butter, topped with melted mozzarella and parmesan.",
    descriptionAr: "شرائح باجيت محمصة ومدهونة بزبدة الثوم، مغطاة بجبنة الموزاريلا والبارميزان الذائبة.",
    price: "4.99",
    imageUrl: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=600&auto=format&fit=crop&q=80",
    category: "sides",
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: "menu-5",
    nameEn: "Warm Chocolate Fudge Brownie",
    nameAr: "براوني الشوكولاتة الدافئة",
    descriptionEn: "Rich chocolate brownie served warm with dark chocolate chips.",
    descriptionAr: "براوني شوكولاتة غنية تقدم دافئة مع رقائق الشوكولاتة الداكنة.",
    price: "5.49",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
    category: "desserts",
    isAvailable: true,
    createdAt: new Date(),
  },
  {
    id: "menu-6",
    nameEn: "Ice-Cold Soft Drink",
    nameAr: "مشروب غازي بارد",
    descriptionEn: "Refreshing carbonated beverage served ice-cold.",
    descriptionAr: "مشروب غازي منعش يقدم بارداً جداً.",
    price: "1.99",
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
    category: "drinks",
    isAvailable: true,
    createdAt: new Date(),
  }
];

const globalForMockDb = globalThis as unknown as {
  mockMenuItems: MenuItem[];
  mockOrders: Order[];
};

if (!globalForMockDb.mockMenuItems) {
  globalForMockDb.mockMenuItems = DEFAULT_MENU_ITEMS;
}

if (!globalForMockDb.mockOrders) {
  globalForMockDb.mockOrders = [];
}

export const mockDb = {
  // Menu items CRUD
  getMenuItems: async (): Promise<MenuItem[]> => {
    return globalForMockDb.mockMenuItems;
  },
  getMenuItemById: async (id: string): Promise<MenuItem | undefined> => {
    return globalForMockDb.mockMenuItems.find((item) => item.id === id);
  },
  createMenuItem: async (item: Omit<MenuItem, "id" | "createdAt">): Promise<MenuItem> => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
      createdAt: new Date(),
    };
    globalForMockDb.mockMenuItems.push(newItem);
    return newItem;
  },
  updateMenuItem: async (id: string, updates: Partial<Omit<MenuItem, "id" | "createdAt">>): Promise<MenuItem | undefined> => {
    const idx = globalForMockDb.mockMenuItems.findIndex((item) => item.id === id);
    if (idx === -1) return undefined;
    globalForMockDb.mockMenuItems[idx] = {
      ...globalForMockDb.mockMenuItems[idx],
      ...updates,
    };
    return globalForMockDb.mockMenuItems[idx];
  },
  deleteMenuItem: async (id: string): Promise<boolean> => {
    const initialLen = globalForMockDb.mockMenuItems.length;
    globalForMockDb.mockMenuItems = globalForMockDb.mockMenuItems.filter((item) => item.id !== id);
    return globalForMockDb.mockMenuItems.length < initialLen;
  },

  // Orders CRUD
  getOrders: async (): Promise<Order[]> => {
    return globalForMockDb.mockOrders;
  },
  getOrdersByUserId: async (userId: string): Promise<Order[]> => {
    return globalForMockDb.mockOrders.filter((order) => order.userId === userId);
  },
  getOrderById: async (id: string): Promise<Order | undefined> => {
    return globalForMockDb.mockOrders.find((order) => order.id === id);
  },
  createOrder: async (order: Omit<Order, "id" | "createdAt" | "status" | "paymentStatus">): Promise<Order> => {
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      paymentStatus: order.paymentMethod === "polar" ? "pending" : "pending",
      createdAt: new Date(),
    };
    globalForMockDb.mockOrders.push(newOrder);
    return newOrder;
  },
  updateOrderStatus: async (id: string, status: Order["status"]): Promise<Order | undefined> => {
    const idx = globalForMockDb.mockOrders.findIndex((order) => order.id === id);
    if (idx === -1) return undefined;
    globalForMockDb.mockOrders[idx].status = status;
    return globalForMockDb.mockOrders[idx];
  },
  updateOrderPaymentStatus: async (id: string, paymentStatus: Order["paymentStatus"]): Promise<Order | undefined> => {
    const idx = globalForMockDb.mockOrders.findIndex((order) => order.id === id);
    if (idx === -1) return undefined;
    globalForMockDb.mockOrders[idx].paymentStatus = paymentStatus;
    // Auto-advance status to preparing if paid
    if (paymentStatus === "paid" && globalForMockDb.mockOrders[idx].status === "pending") {
      globalForMockDb.mockOrders[idx].status = "preparing";
    }
    return globalForMockDb.mockOrders[idx];
  }
};
