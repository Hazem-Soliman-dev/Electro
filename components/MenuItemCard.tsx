"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MenuItem } from "@/lib/mockDb";
import { useLanguage } from "./LanguageProvider";
import { useCart } from "./CartProvider";
import { ShoppingCart, Check } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { locale, t } = useLanguage();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const name = locale === "ar" ? item.nameAr : item.nameEn;
  const description = locale === "ar" ? item.descriptionAr : item.descriptionEn;

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      nameEn: item.nameEn,
      nameAr: item.nameAr,
      price: item.price,
      imageUrl: item.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Food Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={item.imageUrl}
          alt={name}
          fill
          sizes="(max-w-7xl) 33vw, (max-w-md) 50vw, 100vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          priority={false}
        />
        {/* Category Tag */}
        <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 shadow-sm border border-zinc-200/20">
          {t(item.category as any)}
        </span>
        {/* Price Badge */}
        <span className="absolute bottom-3 right-3 px-3 py-1 text-sm font-black rounded-lg bg-orange-500 text-white shadow-md">
          {parseFloat(item.price).toFixed(2)} {t("currency")}
        </span>
      </div>

      {/* Info Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-orange-500 transition-colors line-clamp-1">
          {name}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed flex-1">
          {description}
        </p>

        {/* Action Button */}
        <div className="mt-4 sm:mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          {item.isAvailable ? (
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                added
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10 scale-[0.98]"
                  : "bg-zinc-900 hover:bg-orange-500 text-white dark:bg-zinc-800 dark:hover:bg-orange-500 shadow-md shadow-zinc-900/5 hover:shadow-orange-500/20 active:scale-95"
              }`}
            >
              {added ? (
                <>
                  <Check size={16} className="animate-bounce" />
                  {t("addedToCart")}
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  {t("addToCart")}
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed text-center"
            >
              {t("outOfStock")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
