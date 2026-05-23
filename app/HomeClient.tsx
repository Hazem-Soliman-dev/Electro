"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MenuItemCard } from "@/components/MenuItemCard";
import { useLanguage } from "@/components/LanguageProvider";
import { MenuItem } from "@/lib/mockDb";
import { Search, Flame, Award, Clock } from "lucide-react";

interface HomeClientProps {
  initialItems: MenuItem[];
}

export const HomeClient: React.FC<HomeClientProps> = ({ initialItems }) => {
  const { locale, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["all", "pizzas", "burgers", "sides", "desserts", "drinks"];

  // Filter items based on category and search query
  const filteredItems = initialItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const itemName = locale === "ar" ? item.nameAr : item.nameEn;
    const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen pb-20 sm:pb-8">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Modern Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 text-white p-8 sm:p-12 lg:p-16 shadow-xl mb-12">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
              <Flame size={12} className="text-amber-300 animate-pulse" />
              <span>{t("heroBadge")}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-md">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-orange-100/90 leading-relaxed font-medium">
              {t("heroSubtitle")}
            </p>

            {/* Quick Badges */}
            <div className="mt-8 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-orange-50">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-amber-300" />
                <span>{t("premiumQuality")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-300" />
                <span>{t("hotFastDelivery")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Search Bar Container */}
        <section className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Category Filter Pills (Horizontal Scrollable on Mobile) */}
          <div className="flex overflow-x-auto pb-2 -mb-2 lg:pb-0 lg:mb-0 gap-2.5 scrollbar-thin select-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 border ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10"
                    : "bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                {t(cat as any)}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-md w-full">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm shadow-xs transition-all dark:text-white ${
                locale === "ar" ? "text-right" : "text-left"
              }`}
            />
          </div>
        </section>

        {/* Menu Items Grid */}
        <section>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                No items match your search.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Elegant Footer */}
      <footer className="mt-auto border-t border-zinc-200/50 dark:border-zinc-800/50 py-8 text-center text-xs text-zinc-400 dark:text-zinc-500 select-none">
        <p>© {new Date().getFullYear()} {t("brand")}. All rights reserved.</p>
      </footer>
    </div>
  );
};
