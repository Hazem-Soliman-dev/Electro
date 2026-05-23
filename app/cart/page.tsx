"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useCart, CartItem } from "@/components/CartProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Truck } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount, clearCart } = useCart();
  const { locale, t } = useLanguage();
  const { user } = useUser();

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "polar">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const deliveryFee = cartCount > 0 ? 3.0 : 0;
  const grandTotal = cartTotal + deliveryFee;

  // Pre-fill user name on sign-in
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
    }
  }, [user]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!fullName || !phone || !address) {
      setFormError(t("validationErrorFields"));
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            menuItemId: item.id,
            nameEn: item.nameEn,
            nameAr: item.nameAr,
            price: parseFloat(item.price),
            quantity: item.quantity,
          })),
          totalPrice: grandTotal.toFixed(2),
          paymentMethod,
          deliveryAddress: address,
          deliveryPhone: phone,
          userName: fullName,
          userEmail: user?.primaryEmailAddress?.emailAddress || "guest@electro.pi",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      // Order created successfully
      clearCart();

      if (paymentMethod === "polar" && data.checkoutUrl) {
        // Redirect to Polar checkout URL (which might be our local simulator URL)
        router.push(data.checkoutUrl);
      } else {
        // COD order redirect directly to status page
        router.push(`/orders/${data.order.id}`);
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || t("validationErrorSubmit"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 sm:pb-8">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-black mb-8 text-zinc-900 dark:text-zinc-50">
          {t("cartTitle")}
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-6">
              {t("cartEmpty")}
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2.5 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 shadow-md cursor-pointer select-none"
            >
              {t("backToMenu")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs items-center"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={locale === "ar" ? item.nameAr : item.nameEn}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">
                      {locale === "ar" ? item.nameAr : item.nameEn}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-orange-500 mt-1">
                      {parseFloat(item.price).toFixed(2)} {t("currency")}
                    </p>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    {/* Controls */}
                    <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 bg-zinc-50 dark:bg-zinc-950">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-zinc-500 hover:text-orange-500 rounded-md transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-zinc-500 hover:text-orange-500 rounded-md transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout & Summary Sidebar (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Order Summary */}
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs">
                <h2 className="text-lg font-black mb-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                  {t("summary")}
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                    <span>{t("subtotal")}</span>
                    <span>{cartTotal.toFixed(2)} {t("currency")}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                    <span>{t("deliveryFee")}</span>
                    <span>{deliveryFee.toFixed(2)} {t("currency")}</span>
                  </div>
                  <div className="flex justify-between text-base font-black border-t border-zinc-100 dark:border-zinc-800/80 pt-3 text-zinc-950 dark:text-zinc-50">
                    <span>{t("total")}</span>
                    <span>{grandTotal.toFixed(2)} {t("currency")}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs">
                <h2 className="text-lg font-black mb-4">
                  {t("checkoutDetails")}
                </h2>

                <form onSubmit={handleCheckout} className="space-y-4">
                  {/* Delivery Name */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                      {t("fullName")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("placeholderFullName")}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all dark:text-white ${
                        locale === "ar" ? "text-right" : "text-left"
                      }`}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                      {t("phoneNumber")} *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={t("placeholderPhone")}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all dark:text-white ${
                        locale === "ar" ? "text-right" : "text-left"
                      }`}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                      {t("address")} *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder={t("placeholderAddress")}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all dark:text-white ${
                        locale === "ar" ? "text-right" : "text-left"
                      }`}
                    />
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                      {t("paymentMethod")}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* COD */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                          paymentMethod === "cod"
                            ? "border-orange-500 bg-orange-500/5 text-orange-500 font-bold"
                            : "border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        <Truck size={18} />
                        <span className="text-xs">{t("cod")}</span>
                      </button>

                      {/* Polar */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("polar")}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                          paymentMethod === "polar"
                            ? "border-orange-500 bg-orange-500/5 text-orange-500 font-bold"
                            : "border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        <CreditCard size={18} />
                        <span className="text-xs">{t("onlinePayment")}</span>
                      </button>
                    </div>
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">
                      {formError}
                    </div>
                  )}

                  {/* Submit checkout buttons */}
                  <div className="pt-2">
                    {user ? (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 active:scale-95 text-sm flex items-center justify-center gap-2 cursor-pointer select-none"
                      >
                        {isSubmitting ? t("placingOrder") : t("placeOrder")}
                      </button>
                    ) : (
                      <SignInButton mode="modal">
                        <button
                          type="button"
                          className="w-full py-3 px-4 rounded-xl font-bold bg-zinc-950 dark:bg-zinc-800 text-white shadow-md transition-all duration-200 active:scale-95 text-sm flex items-center justify-center gap-2 cursor-pointer select-none"
                        >
                          {t("signInToComplete")}
                        </button>
                      </SignInButton>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
