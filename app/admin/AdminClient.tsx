"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageProvider";
import { MenuItem, Order } from "@/lib/mockDb";
import { UploadDropzone } from "@/lib/uploadthing";
import { Plus, Pencil, Trash2, ListOrdered, ClipboardList, Sparkles } from "lucide-react";

interface AdminClientProps {
  initialItems: MenuItem[];
  initialOrders: Order[];
  isUploadthingConfigured: boolean;
}

interface MockUploadDropzoneProps {
  onUploadBegin: () => void;
  onClientUploadComplete: (res: any) => void;
  onUploadError: (err: Error) => void;
  category: string;
}

const MockUploadDropzone: React.FC<MockUploadDropzoneProps> = ({
  onUploadBegin,
  onClientUploadComplete,
  onUploadError,
  category,
}) => {
  const { locale } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const simulateUpload = (file: File) => {
    onUploadBegin();
    setProgress(0);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 25) + 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(interval);

        // Pre-defined high-quality Unsplash image URLs based on selected category
        const categoryImages: Record<string, string> = {
          pizzas: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
          burgers: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
          sides: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
          drinks: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&q=80",
          desserts: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
        };

        const fallbackImg = categoryImages[category] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80";

        let url = fallbackImg;
        try {
          url = URL.createObjectURL(file);
        } catch (e) {
          console.error("Failed to create object URL:", e);
        }

        setTimeout(() => {
          onClientUploadComplete([{ url }]);
          setProgress(null);
        }, 300);
      } else {
        setProgress(currentProgress);
      }
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative overflow-hidden bg-white dark:bg-zinc-950/40 min-h-[160px] ${
        isDragOver
          ? "border-orange-500 bg-orange-500/5 scale-[1.01]"
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      <input
        type="file"
        id="mock-file-input"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />
      {progress !== null ? (
        <div className="w-full max-w-xs flex flex-col items-center">
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden mb-3">
            <div
              className="bg-orange-500 h-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            {locale === "ar" ? "جاري الرفع..." : "Uploading..."} {progress}%
          </span>
        </div>
      ) : (
        <div className="space-y-2.5 pointer-events-none flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {locale === "ar" ? "اضغط هنا لاختيار صورة، أو اسحبها وأفلتها" : "Click to upload, or drag and drop image"}
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold mt-1">
              {locale === "ar" ? "صيغ الصور المدعومة (حجم أقصى 4 ميجابايت)" : "PNG, JPG, WEBP up to 4MB"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminClient: React.FC<AdminClientProps> = ({
  initialItems,
  initialOrders,
  isUploadthingConfigured,
}) => {
  const { locale, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"orders" | "menu">("orders");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialItems);

  // Form states for adding/editing menu items
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("pizzas");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [useUploadSimulator, setUseUploadSimulator] = useState(!isUploadthingConfigured);

  // Status updates
  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: data.order.status } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderPayment = async (orderId: string, paymentStatus: Order["paymentStatus"]) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, paymentStatus: data.order.paymentStatus, status: data.order.status }
              : o
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Menu updates
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !nameAr || !descEn || !descAr || !price) return;

    setIsSubmitting(true);
    // If no image is uploaded, pre-fill with a placeholder food image so it works
    const finalImageUrl = imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600";

    const payload = {
      nameEn,
      nameAr,
      descriptionEn: descEn,
      descriptionAr: descAr,
      price: parseFloat(price).toFixed(2),
      category,
      imageUrl: finalImageUrl,
      isAvailable: true,
    };

    try {
      if (editingItem) {
        // Edit Mode
        const res = await fetch(`/api/menu/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.item) {
          setMenuItems((prev) => prev.map((item) => (item.id === editingItem.id ? data.item : item)));
          resetForm();
        }
      } else {
        // Create Mode
        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.item) {
          setMenuItems((prev) => [data.item, ...prev]);
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      const res = await fetch(`/api/menu/${itemId}`, { method: "DELETE" });
      if (res.ok) {
        setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setNameEn(item.nameEn);
    setNameAr(item.nameAr);
    setDescEn(item.descriptionEn);
    setDescAr(item.descriptionAr);
    setPrice(item.price);
    setCategory(item.category);
    setImageUrl(item.imageUrl);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setNameEn("");
    setNameAr("");
    setDescEn("");
    setDescAr("");
    setPrice("");
    setCategory("pizzas");
    setImageUrl("");
    setUploadError("");
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400";
      case "preparing": return "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400";
      case "out_for_delivery": return "bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400";
      case "delivered": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400";
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 sm:pb-8">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Prototype Auth Disclaimer */}
        <div className="mb-8 p-4 bg-orange-500/5 border border-orange-500/20 rounded-3xl flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div>
              <h2 className="font-black text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                {t("adminTitle")}
              </h2>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {t("dashboardDisclaimer")}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection Headers */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-8 select-none">
          <button
            onClick={() => { setActiveTab("orders"); resetForm(); }}
            className={`pb-4 px-6 font-black text-sm flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
              activeTab === "orders"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            <ClipboardList size={18} />
            {t("ordersQueue")} ({orders.length})
          </button>
          <button
            onClick={() => { setActiveTab("menu"); resetForm(); }}
            className={`pb-4 px-6 font-black text-sm flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
              activeTab === "menu"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            <ListOrdered size={18} />
            {t("menuManager")} ({menuItems.length})
          </button>
        </div>

        {/* Tab Content: ORDERS QUEUE */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60">
                <p className="text-zinc-500 dark:text-zinc-400 font-bold">{t("noActiveOrders")}</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 shadow-xs flex flex-col lg:flex-row justify-between gap-6"
                >
                  {/* Left Column: Customer details & Items */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] font-black bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 py-1 px-2.5 rounded-sm">
                        ID: {order.id.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-semibold text-zinc-400">
                        {new Date(order.createdAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
                      </span>
                    </div>

                    <div className="text-sm font-semibold">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">{t("customer")}</span>
                      <p className="text-zinc-900 dark:text-zinc-50">{order.userName} ({order.userEmail})</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{order.deliveryPhone} | {order.deliveryAddress}</p>
                    </div>

                    <div className="text-sm">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">{t("itemsOrdered")}</span>
                      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/40 rounded-xl p-3.5 space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                            <span>{item.quantity}x {locale === "ar" ? item.nameAr : item.nameEn}</span>
                            <span>{(item.quantity * item.price).toFixed(2)} {t("currency")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Admin Status actions */}
                  <div className="w-full lg:w-72 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-100 dark:border-zinc-800/80 pt-4 lg:pt-0 lg:pl-6 space-y-6">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        {t("orderTotal")}
                      </span>
                      <span className="text-xl font-black text-orange-500">
                        {parseFloat(order.totalPrice).toFixed(2)} {t("currency")}
                      </span>
                    </div>

                    {/* Order Status Controller */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {t("updateStatus")}
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-orange-500 dark:text-white"
                      >
                        <option value="pending">{t("statusPending")}</option>
                        <option value="preparing">{t("statusPreparing")}</option>
                        <option value="out_for_delivery">{t("statusOutForDelivery")}</option>
                        <option value="delivered">{t("statusDelivered")}</option>
                      </select>
                    </div>

                    {/* Payment Status controller */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {t("updatePayment")}
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateOrderPayment(order.id, "pending")}
                          className={`flex-1 py-1.5 px-2 text-[10px] font-black rounded-lg border uppercase tracking-wider cursor-pointer active:scale-95 transition-all ${
                            order.paymentStatus === "pending"
                              ? "bg-amber-500 text-zinc-950 border-amber-500 font-black"
                              : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                          }`}
                        >
                        {t("paymentUnpaid")}
                        </button>
                        <button
                          onClick={() => handleUpdateOrderPayment(order.id, "paid")}
                          className={`flex-1 py-1.5 px-2 text-[10px] font-black rounded-lg border uppercase tracking-wider cursor-pointer active:scale-95 transition-all ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-500 text-white border-emerald-500 font-black"
                              : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                          }`}
                        >
                          {t("paymentPaid")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: MENU MANAGER */}
        {activeTab === "menu" && (
          <div className="space-y-8">
            {/* Toggle Add Item form header */}
            <div className="flex justify-between items-center select-none">
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50">
                {t("menuManager")}
              </h2>
              {!showAddForm && (
                <button
                  onClick={() => { resetForm(); setShowAddForm(true); }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1 shadow-md shadow-orange-500/10 cursor-pointer active:scale-95"
                >
                  <Plus size={14} />
                  {t("addItem")}
                </button>
              )}
            </div>

            {/* Menu Item Form (Add / Edit) */}
            {showAddForm && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
                    {editingItem ? t("editItemTitle") : t("addItem")}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 uppercase tracking-wider"
                  >
                    {t("cancel")}
                  </button>
                </div>

                <form onSubmit={handleSaveMenuItem} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* English details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                          {t("itemNameEn")} *
                        </label>
                        <input
                          type="text"
                          required
                          value={nameEn}
                          onChange={(e) => setNameEn(e.target.value)}
                          placeholder="e.g. Garlic Pizza"
                          className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                          {t("itemDescEn")} *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={descEn}
                          onChange={(e) => setDescEn(e.target.value)}
                          placeholder="English description of food ingredients..."
                          className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Arabic details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 text-right">
                          * {t("itemNameAr")}
                        </label>
                        <input
                          type="text"
                          required
                          value={nameAr}
                          onChange={(e) => setNameAr(e.target.value)}
                          placeholder="مثال: بيتزا الثوم"
                          className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 dark:text-white text-right font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 text-right">
                          * {t("itemDescAr")}
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={descAr}
                          onChange={(e) => setDescAr(e.target.value)}
                          placeholder="وصف تفصيلي باللغة العربية لمكونات الوجبة..."
                          className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 dark:text-white text-right font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Price */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        {t("itemPrice")} *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="9.99"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 dark:text-white"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        {t("itemCategory")}
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 dark:text-white"
                      >
                        <option value="pizzas">{t("pizzas")}</option>
                        <option value="burgers">{t("burgers")}</option>
                        <option value="sides">{t("sides")}</option>
                        <option value="desserts">{t("desserts")}</option>
                        <option value="drinks">{t("drinks")}</option>
                      </select>
                    </div>

                    {/* Image URL fallback */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        {t("fieldImageFallback")}
                      </label>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder={t("placeholderImageFallback")}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Uploadthing Dropzone wrapper */}
                  <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/20">
                    <div className="flex justify-between items-center p-4 border-b border-zinc-200/40 dark:border-zinc-800/40">
                      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                        {locale === "ar" ? "رفع صورة الطعام" : "Food Image Upload"}
                      </label>
                      <div className="flex items-center gap-2 select-none">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm ${
                          useUploadSimulator
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {useUploadSimulator
                            ? (locale === "ar" ? "وضع المحاكاة" : "SIMULATOR MODE")
                            : (locale === "ar" ? "وضع السحابة" : "UPLOADTHING CLOUD")}
                        </span>
                        {isUploadthingConfigured && (
                          <button
                            type="button"
                            onClick={() => setUseUploadSimulator(!useUploadSimulator)}
                            className="text-[9px] font-bold text-orange-500 hover:text-orange-600 underline cursor-pointer border-none bg-transparent p-0"
                          >
                            {locale === "ar" ? "تغيير الوضع" : "Switch Mode"}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      {useUploadSimulator ? (
                        <MockUploadDropzone
                          category={category}
                          onUploadBegin={() => {
                            setIsUploading(true);
                            setUploadError("");
                          }}
                          onClientUploadComplete={(res: any) => {
                            setIsUploading(false);
                            if (res && res[0]) {
                              setImageUrl(res[0].url);
                              setUploadError("");
                              alert(t("uploadSuccess"));
                            }
                          }}
                          onUploadError={(error: Error) => {
                            setIsUploading(false);
                            setUploadError(error.message);
                          }}
                        />
                      ) : (
                        <UploadDropzone
                          endpoint="imageUploader"
                          onUploadBegin={() => {
                            setIsUploading(true);
                            setUploadError("");
                          }}
                          onClientUploadComplete={(res: any) => {
                            setIsUploading(false);
                            if (res && res[0]) {
                              setImageUrl(res[0].url);
                              setUploadError("");
                              alert(t("uploadSuccess"));
                            }
                          }}
                          onUploadError={(error: Error) => {
                            setIsUploading(false);
                            console.error("Uploadthing failed:", error);
                            setUploadError(`Upload failed: ${error.message}. If you recently added keys to your .env file, please restart your development server (npm run dev).`);
                          }}
                          appearance={{
                            container: "border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 rounded-xl py-8 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-all min-h-[160px] flex flex-col items-center justify-center",
                            label: "text-orange-500 hover:text-orange-600 text-xs sm:text-sm font-bold cursor-pointer",
                            allowedContent: "text-zinc-400 text-[10px] mt-1 font-semibold",
                            button: "bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold px-4 py-2 mt-4 cursor-pointer transition-all duration-300 active:scale-95 disabled:opacity-50",
                          }}
                        />
                      )}
                      {imageUrl && (
                        <div className="mt-4 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl">
                          <Image src={imageUrl} alt="preview" width={40} height={40} className="rounded-md object-cover w-10 h-10" />
                          <span className="text-xs font-bold truncate flex-1">{imageUrl}</span>
                        </div>
                      )}
                      {uploadError && (
                        <div className="mt-4 text-xs font-semibold text-amber-600 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center gap-1.5">
                          <Sparkles size={14} className="animate-spin" />
                          <span>{uploadError}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 select-none">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all cursor-pointer active:scale-95"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploading}
                      className="px-6 py-2.5 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white text-xs shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? t("uploading") : isSubmitting ? t("savingItem") : t("save")}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Menu Items Grid table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-4 rounded-2xl flex gap-4 items-center"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                    <Image src={item.imageUrl} alt={item.nameEn} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
                        {locale === "ar" ? item.nameAr : item.nameEn}
                      </h4>
                      <span className="text-xs font-black text-orange-500">
                        {parseFloat(item.price).toFixed(2)} {t("currency")}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {locale === "ar" ? item.descriptionAr : item.descriptionEn}
                    </p>
                  </div>
                  
                  {/* Operations */}
                  <div className="flex gap-1 select-none">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-2 text-zinc-400 hover:text-orange-500 hover:bg-orange-500/5 rounded-lg transition-colors cursor-pointer"
                      aria-label="Edit item"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                      aria-label="Delete item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
