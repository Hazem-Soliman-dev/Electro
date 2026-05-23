"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageProvider";
import { Order } from "@/lib/mockDb";
import { Calendar, ReceiptText, ChevronRight, CheckCircle2, Clock, Truck, ChefHat } from "lucide-react";

interface OrdersClientProps {
  initialOrders: Order[];
}

export const OrdersClient: React.FC<OrdersClientProps> = ({ initialOrders }) => {
  const { locale, t } = useLanguage();

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock size={16} className="text-amber-500 animate-pulse" />;
      case "preparing":
        return <ChefHat size={16} className="text-indigo-500" />;
      case "out_for_delivery":
        return <Truck size={16} className="text-cyan-500" />;
      case "delivered":
        return <CheckCircle2 size={16} className="text-emerald-500" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400";
      case "preparing":
        return "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400";
      case "out_for_delivery":
        return "bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400";
      case "delivered":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400";
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 sm:pb-8">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-black mb-8 text-zinc-900 dark:text-zinc-50">
          {t("orders")}
        </h1>

        {initialOrders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <ReceiptText size={28} />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-2">
              {t("noOrders")}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {initialOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs p-5 sm:p-6 transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-4 mb-4">
                  {/* Left Metadata */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                      {t("orderId")}: {order.id.slice(-8).toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                      <Calendar size={14} />
                      <time>{formatDate(order.createdAt)}</time>
                    </div>
                  </div>

                  {/* Status pill */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {t(`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}` as any)}
                    </span>
                  </div>
                </div>

                {/* Body details */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                      {t("itemsOrdered")}
                    </span>
                    <div className="line-clamp-1 max-w-md">
                      {order.items.map((item, idx) => (
                        <span key={idx}>
                          {item.quantity}x {locale === "ar" ? item.nameAr : item.nameEn}
                          {idx < order.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price and Link */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800/20">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        {t("total")}
                      </span>
                      <span className="text-lg font-black text-orange-500">
                        {parseFloat(order.totalPrice).toFixed(2)} {t("currency")}
                      </span>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-zinc-100 hover:bg-orange-500 hover:text-white dark:bg-zinc-800 dark:hover:bg-orange-500 text-zinc-700 dark:text-zinc-300 transition-all flex items-center gap-1 select-none active:scale-95"
                    >
                      {t("trackOrder")}
                      <ChevronRight size={14} className={locale === "ar" ? "rotate-180" : ""} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
