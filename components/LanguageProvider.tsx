"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Locale = "en" | "ar";

const translations = {
  en: {
    // General
    brand: "Electro Pi",
    currency: "EGP",
    home: "Home",
    cart: "Cart",
    orders: "My Orders",
    profile: "Profile",
    admin: "Admin",
    logout: "Log Out",
    login: "Log In",
    signup: "Sign Up",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    loading: "Loading...",
    success: "Success!",
    error: "An error occurred",

    // Home / Menu
    heroTitle: "Sizzling Hot Electro Bites",
    heroSubtitle: "Delicious food, prepared instantly and delivered directly to your doorstep. Satisfy your cravings today!",
    searchPlaceholder: "Search delicious dishes...",
    all: "All",
    pizzas: "Pizzas",
    burgers: "Burgers",
    sides: "Sides",
    drinks: "Drinks",
    desserts: "Desserts",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    addedToCart: "Added!",

    // hero
    heroBadge: "Electro Pi Prototype",
    premiumQuality: "Premium Quality",
    hotFastDelivery: "Hot & Fast Delivery",

    // Cart & Checkout
    cartTitle: "Your Cart",
    cartEmpty: "Your cart is empty. Start adding some delicious items!",
    summary: "Order Summary",
    subtotal: "Subtotal",
    deliveryFee: "Delivery Fee",
    total: "Total",
    checkoutDetails: "Delivery Details",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    address: "Delivery Address",
    paymentMethod: "Payment Method",
    cod: "Cash on Delivery",
    onlinePayment: "Online Payment (Polar)",
    placeOrder: "Place Order",
    placingOrder: "Placing Order...",
    backToMenu: "Back to Menu",

    // Order Tracking
    trackOrder: "Track Order",
    orderStatus: "Order Status",
    orderId: "Order ID",
    statusPending: "Pending Approval",
    statusPreparing: "Preparing Food",
    statusOutForDelivery: "Out for Delivery",
    statusDelivered: "Delivered",
    statusPendingDesc: "We've received your order and are confirming it.",
    statusPreparingDesc: "Our chefs are cooking your fresh hot meal.",
    statusOutForDeliveryDesc: "Your rider is on the way to your address.",
    statusDeliveredDesc: "Enjoy your food! Thank you for ordering.",
    paymentStatus: "Payment Status",
    paymentPending: "Unpaid (Pending)",
    paymentPaid: "Paid",
    paymentFailed: "Payment Failed",
    noOrders: "You have not placed any orders yet.",
    orderDate: "Date",
    itemsOrdered: "Items Ordered",
    addressPhone: "Contact & Address",
    simulatorTitle: "Admin Simulation Tool",
    simulatorDesc: "Since this is a prototype, use this panel to advance the order status locally to test tracking animation:",

    // Admin Dashboard
    adminTitle: "Admin Control Center",
    menuManager: "Menu Items Manager",
    ordersQueue: "Active Orders Queue",
    addItem: "Add New Menu Item",
    editItemTitle: "Edit Menu Item",
    itemNameEn: "Item Name (English)",
    itemNameAr: "Item Name (Arabic)",
    itemDescEn: "Description (English)",
    itemDescAr: "Description (Arabic)",
    itemPrice: "Price (EGP)",
    itemCategory: "Category",
    itemImage: "Food Image",
    uploadSuccess: "Image uploaded successfully!",
    uploading: "Uploading image...",
    savingItem: "Saving menu item...",
    deletingItem: "Deleting...",
    updateStatus: "Update Status",
    updatePayment: "Update Payment Status",
    orderTotal: "Order Total",
    customer: "Customer",
    placeholderFullName: "e.g. John Doe",
    placeholderPhone: "e.g. +201234567890",
    placeholderAddress: "e.g. Al-Jalaa St, Cairo",
    placeholderImageFallback: "Or use upload dropzone below",
    fieldImageFallback: "Image URL (Optional Fallback)",
    shipping: "Shipping",
    totalPaid: "Total Paid",
    confirmDelete: "Are you sure you want to delete this menu item?",
    dashboardDisclaimer: "Full dashboard access granted for demo verification. Changes reflect in real-time.",
    noActiveOrders: "No active orders in the queue.",
    paymentUnpaid: "Unpaid",
    signInToComplete: "Sign In to Complete Order",
    validationErrorFields: "Please fill in all required fields.",
    validationErrorSubmit: "Failed to place order. Try again.",
  },
  ar: {
    // General
    brand: "إلكترو باي",
    currency: "ج.م.",
    home: "الرئيسية",
    cart: "السلة",
    orders: "طلباتي",
    profile: "الملف الشخصي",
    admin: "لوحة التحكم",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    cancel: "إلغاء",
    save: "حفظ",
    delete: "حذف",
    edit: "تعديل",
    back: "رجوع",
    loading: "جاري التحميل...",
    success: "تم بنجاح!",
    error: "حدث خطأ ما",

    // Home / Menu
    heroTitle: "أشهى المأكولات الساخنة من إلكترو",
    heroSubtitle: "طعام لذيذ، يُحضّر فوراً ويوصل مباشرة إلى عتبة دارك. أشبع رغباتك اليوم!",
    searchPlaceholder: "ابحث عن أطباق لذيذة...",
    all: "الكل",
    pizzas: "بيتزا",
    burgers: "برجر",
    sides: "المقبلات",
    drinks: "المشروبات",
    desserts: "الحلويات",
    addToCart: "إضافة إلى السلة",
    outOfStock: "نفذت الكمية",
    addedToCart: "تمت الإضافة!",

    // hero
    heroBadge: "إلكترو باي - نموذج أولي",
    premiumQuality: "جودة عالية",
    hotFastDelivery: "توصيل سريع وساخن",

    // Cart & Checkout
    cartTitle: "سلتك",
    cartEmpty: "سلتك فارغة. ابدأ بإضافة بعض الأطباق اللذيذة!",
    summary: "ملخص الطلب",
    subtotal: "المجموع الفرعي",
    deliveryFee: "رسوم التوصيل",
    total: "الإجمالي",
    checkoutDetails: "تفاصيل التوصيل",
    fullName: "الاسم الكامل",
    phoneNumber: "رقم الهاتف",
    address: "عنوان التوصيل",
    paymentMethod: "طريقة الدفع",
    cod: "الدفع عند الاستلام",
    onlinePayment: "الدفع الإلكتروني (بولار)",
    placeOrder: "إرسال الطلب",
    placingOrder: "جاري إرسال الطلب...",
    backToMenu: "العودة إلى القائمة",

    // Order Tracking
    trackOrder: "تتبع الطلب",
    orderStatus: "حالة الطلب",
    orderId: "رقم الطلب",
    statusPending: "في انتظار الموافقة",
    statusPreparing: "جاري التحضير",
    statusOutForDelivery: "خرج للتوصيل",
    statusDelivered: "تم التوصيل",
    statusPendingDesc: "لقد تلقينا طلبك ونقوم بتأكيده الآن.",
    statusPreparingDesc: "طهاةنا يقومون بإعداد وجبتك الساخنة الطازجة.",
    statusOutForDeliveryDesc: "السائق في طريقه إلى عنوانك.",
    statusDeliveredDesc: "بالهناء والشفاء! شكراً لطلبك.",
    paymentStatus: "حالة الدفع",
    paymentPending: "غير مدفوع (معلق)",
    paymentPaid: "مدفوع",
    paymentFailed: "فشل الدفع",
    noOrders: "لم تقم بأي طلبات بعد.",
    orderDate: "التاريخ",
    itemsOrdered: "الأصناف المطلوبة",
    addressPhone: "الاتصال والعنوان",
    simulatorTitle: "أداة محاكاة المشرف",
    simulatorDesc: "بما أن هذا نموذج أولي، استخدم هذه اللوحة لتعديل حالة الطلب محلياً لاختبار حركة التتبع:",

    // Admin Dashboard
    adminTitle: "مركز إدارة النظام",
    menuManager: "إدارة قائمة الطعام",
    ordersQueue: "قائمة الطلبات النشطة",
    addItem: "إضافة صنف جديد",
    editItemTitle: "تعديل صنف القائمة",
    itemNameEn: "اسم الصنف (إنجليزي)",
    itemNameAr: "اسم الصنف (عربي)",
    itemDescEn: "الوصف (إنجليزي)",
    itemDescAr: "الوصف (عربي)",
    itemPrice: "السعر (ج.م.)",
    itemCategory: "الفئة",
    itemImage: "صورة الطعام",
    uploadSuccess: "تم رفع الصورة بنجاح!",
    uploading: "جاري رفع الصورة...",
    savingItem: "جاري حفظ الصنف...",
    deletingItem: "جاري الحذف...",
    updateStatus: "تحديث الحالة",
    updatePayment: "تحديث حالة الدفع",
    orderTotal: "إجمالي الطلب",
    customer: "الزبون",
    placeholderFullName: "مثال: أحمد سليمان",
    placeholderPhone: "مثال: +٢٠١٢٣٤٥٦٧٨٩٠",
    placeholderAddress: "مثال: شارع الجلاء، القاهرة",
    placeholderImageFallback: "أو استخدم منطقة الرفع أدناه",
    fieldImageFallback: "رابط الصورة (اختياري)",
    shipping: "التوصيل",
    totalPaid: "إجمالي المدفوع",
    confirmDelete: "هل أنت متأكد أنك تريد حذف هذا العنصر؟",
    dashboardDisclaimer: "تم منح حق الوصول الكامل إلى لوحة التحكم للتحقق من النموذج الأولي. تنعكس التغييرات في الوقت الفعلي.",
    noActiveOrders: "لا توجد طلبات نشطة في قائمة الانتظار.",
    paymentUnpaid: "غير مدفوع",
    signInToComplete: "سجل الدخول لإتمام الطلب",
    validationErrorFields: "يرجى ملء جميع الحقول المطلوبة",
    validationErrorSubmit: "فشل تقديم الطلب. حاول مرة أخرى.",
  },
};

type LanguageContextType = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: (key: keyof typeof translations["en"]) => string;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>("en");

  // Load language from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("electro-locale") as Locale;
    if (saved === "en" || saved === "ar") {
      setLocale(saved);
    }
  }, []);

  // Update HTML tag attributes on change
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    localStorage.setItem("electro-locale", locale);
  }, [locale]);

  const toggleLocale = () => {
    setLocale((prev) => (prev === "en" ? "ar" : "en"));
  };

  const t = (key: keyof typeof translations["en"]) => {
    return translations[locale][key] || translations["en"][key] || String(key);
  };

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ locale, dir, t, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
