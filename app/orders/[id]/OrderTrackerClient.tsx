"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageProvider";
import { Order } from "@/lib/mockDb";
import { Clock, ChefHat, Truck, CheckCircle2, MapPin, Phone, CreditCard, Calendar, Receipt, RefreshCw } from "lucide-react";

interface OrderTrackerClientProps {
  initialOrder: Order;
}

export const OrderTrackerClient: React.FC<OrderTrackerClientProps> = ({ initialOrder }) => {
  const { locale, t } = useLanguage();
  const [order, setOrder] = useState<Order>(initialOrder);
  const [loading, setLoading] = useState(false);

  // Poll order status every 5 seconds to show live updates
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        const data = await res.json();
        if (res.ok && data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Failed to poll order status:", err);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [order.id]);

  const steps: { key: Order["status"]; icon: any; titleKey: any; descKey: any }[] = [
    {
      key: "pending",
      icon: Clock,
      titleKey: "statusPending",
      descKey: "statusPendingDesc",
    },
    {
      key: "preparing",
      icon: ChefHat,
      titleKey: "statusPreparing",
      descKey: "statusPreparingDesc",
    },
    {
      key: "out_for_delivery",
      icon: Truck,
      titleKey: "statusOutForDelivery",
      descKey: "statusOutForDeliveryDesc",
    },
    {
      key: "delivered",
      icon: CheckCircle2,
      titleKey: "statusDelivered",
      descKey: "statusDeliveredDesc",
    },
  ];

  // Helper to determine step status
  const getStepIndex = (status: Order["status"]) => {
    switch (status) {
      case "pending": return 0;
      case "preparing": return 1;
      case "out_for_delivery": return 2;
      case "delivered": return 3;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
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
        
        {/* Main Header card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                {t("orderId")}: {order.id.slice(-8).toUpperCase()}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 mt-1">
                {t("orderStatus")}
              </h1>
            </div>

            {/* Manual refresh */}
            <button
              onClick={async () => {
                setLoading(true);
                const res = await fetch(`/api/orders/${order.id}`);
                const data = await res.json();
                if (res.ok && data.order) setOrder(data.order);
                setLoading(false);
              }}
              className="p-2 sm:px-4 sm:py-2 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-500 hover:text-orange-500 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stepper Tracking Visualizer Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs p-8 sm:p-12 mb-8">
          {/* Stepper Line/Points */}
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 w-full">
            
            {/* Horizontal Line for Desktop */}
            <div className="hidden md:block absolute left-[5%] right-[5%] top-6 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0">
              <div
                className="h-full bg-orange-500 transition-all duration-500 ease-out"
                style={{ width: `${(currentStepIdx / 3) * 100}%` }}
              ></div>
            </div>

            {/* Vertical Line for Mobile */}
            <div className="md:hidden absolute left-6 top-8 bottom-8 w-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0">
              <div
                className="w-full bg-orange-500 transition-all duration-500 ease-out"
                style={{ height: `${(currentStepIdx / 3) * 100}%` }}
              ></div>
            </div>

            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = idx < currentStepIdx;
              const isActive = idx === currentStepIdx;
              const isUpcoming = idx > currentStepIdx;

              return (
                <div
                  key={step.key}
                  className="relative z-10 flex md:flex-col items-center md:text-center gap-4 md:gap-3 w-full md:w-1/4 group"
                >
                  {/* Circle Indicator */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20 scale-110 ring-4 ring-orange-500/10 animate-pulse"
                        : isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    <StepIcon size={20} />
                  </div>

                  {/* Text descriptions */}
                  <div className="text-left md:text-center flex-1">
                    <h3
                      className={`text-sm sm:text-base font-bold transition-colors ${
                        isActive
                          ? "text-orange-500"
                          : isCompleted
                          ? "text-zinc-800 dark:text-zinc-200"
                          : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 leading-relaxed hidden sm:block">
                      {t(step.descKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          {/* Order Summary (7 cols) */}
          <div className="md:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs p-6">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
              <Receipt size={18} className="text-zinc-400" />
              {t("itemsOrdered")}
            </h2>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm font-medium">
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">
                      {locale === "ar" ? item.nameAr : item.nameEn}
                    </span>
                    <span className="text-zinc-400 text-xs font-semibold ml-2 dark:text-zinc-500">
                      {locale === "ar" ? "الكمية" : "Qty"} {item.quantity} × {parseFloat(item.price as any).toFixed(2)} {t("currency")}
                    </span>
                  </div>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {(item.quantity * parseFloat(item.price as any)).toFixed(2)} {t("currency")}
                  </span>
                </div>
              ))}
              
              <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-4 space-y-2 text-xs font-semibold text-zinc-500">
                <div className="flex justify-between">
                  <span>{t("shipping")}</span>
                  <span>3.00 {t("currency")}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold border-t border-zinc-100 dark:border-zinc-800/20 pt-2 text-zinc-950 dark:text-zinc-50">
                  <span>{t("totalPaid")}</span>
                  <span className="text-lg font-black text-orange-500">
                    {parseFloat(order.totalPrice).toFixed(2)} {t("currency")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Payment details (5 cols) */}
          <div className="md:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs p-6 space-y-6">
            {/* Delivery address details */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <MapPin size={16} />
                {t("checkoutDetails")}
              </h2>
              <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                <p>{order.userName}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
                  <Phone size={12} />
                  {order.deliveryPhone}
                </p>
                <p className="mt-2 text-xs font-medium bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/50 p-2.5 rounded-lg text-zinc-600 dark:text-zinc-400">
                  {order.deliveryAddress}
                </p>
              </div>
            </div>

            {/* Payment status info */}
            <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <CreditCard size={16} />
                {t("paymentStatus")}
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-500">{t("paymentMethod")}</span>
                  <span className="text-zinc-800 dark:text-zinc-200 uppercase">{t(order.paymentMethod as any)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-500">{t("paymentStatus")}</span>
                  <span
                    className={`px-2 py-0.5 rounded-sm border ${
                      order.paymentStatus === "paid"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {t(`payment${order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}` as any)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Date */}
            <div className="text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-800/80 pt-4 flex items-center gap-1">
              <Calendar size={12} />
              <span>{t("orderDate")}: {formatDate(order.createdAt)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
