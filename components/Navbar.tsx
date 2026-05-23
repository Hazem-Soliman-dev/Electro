"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { useTheme } from "./ThemeProvider";
import { useCart } from "./CartProvider";
import { SignInButton, Show, UserButton, useUser } from "@clerk/nextjs";
import { Home, ShoppingBag, ReceiptText, ShieldCheck, Sun, Moon, Languages } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();
  const { locale, t, toggleLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Helper to check active routes
  const isActive = (path: string) => pathname === path;

  // Let anyone who is signed in view admin button for prototype review, but we'll flag it
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Desktop & Mobile Header (Top) */}
      <header className="sticky top-0 z-40 w-full glass-effect shadow-xs border-b border-zinc-200/50 dark:border-zinc-800/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="hidden sm:flex items-center gap-2 group">
            <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 bg-clip-text text-transparent group-hover:scale-102 transition-transform duration-200">
              {t("brand")}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="sm:flex  items-center gap-8 font-medium">
            <Link
              href="/"
              className={`transition-colors duration-200 hover:text-orange-500 text-sm ${
                isActive("/") ? "text-orange-500 font-bold" : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {t("home")}
            </Link>
            <Link
              href="/cart"
              className={`relative transition-colors duration-200 hover:text-orange-500 text-sm flex items-center gap-1.5 ${
                isActive("/cart") ? "text-orange-500 font-bold" : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {t("cart")}
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-3 px-1.5 py-0.5 text-[10px] font-black rounded-full bg-orange-500 text-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/orders"
              className={`transition-colors duration-200 hover:text-orange-500 text-sm ${
                isActive("/orders") ? "text-orange-500 font-bold" : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {t("orders")}
            </Link>
            <Link
              href="/admin"
              className={`transition-colors duration-200 hover:text-orange-500 text-sm flex items-center gap-1 ${
                isActive("/admin") ? "text-orange-500 font-bold" : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <ShieldCheck size={15} />
              {t("admin")}
            </Link>
          </nav>

          {/* Settings & Auth Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="p-2 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 transition-all duration-200 active:scale-95"
              aria-label="Toggle Language"
            >
              <span className="text-xs font-black uppercase flex items-center gap-1 select-none">
                <Languages size={16} />
                {locale === "en" ? "AR" : "EN"}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 transition-all duration-200 active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* User Auth Info */}
            <div className="border-l border-zinc-200/50 dark:border-zinc-800/50 pl-3 sm:pl-4 flex items-center">
              <Show when="signed-in">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8 sm:h-9 sm:w-9 border border-zinc-200 dark:border-zinc-800",
                    },
                  }}
                />
              </Show>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md transition-all active:scale-95 select-none cursor-pointer">
                    {t("login")}
                  </button>
                </SignInButton>
              </Show>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
          <nav
            id="mobile-nav"
            className="max-w-7xl mx-auto px-4 pb-4 pt-2 flex flex-col gap-1 text-sm font-medium"
          >
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`flex items-center justify-between rounded-md px-3 py-2 transition-colors ${
                isActive("/")
                  ? "bg-orange-50/70 text-orange-600 dark:bg-orange-500/10"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <Home size={16} />
                {t("home")}
              </span>
            </Link>
            <Link
              href="/cart"
              onClick={closeMobileMenu}
              className={`flex items-center justify-between rounded-md px-3 py-2 transition-colors ${
                isActive("/cart")
                  ? "bg-orange-50/70 text-orange-600 dark:bg-orange-500/10"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <ShoppingBag size={16} />
                {t("cart")}
              </span>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-orange-500 text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/orders"
              onClick={closeMobileMenu}
              className={`flex items-center justify-between rounded-md px-3 py-2 transition-colors ${
                isActive("/orders")
                  ? "bg-orange-50/70 text-orange-600 dark:bg-orange-500/10"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <ReceiptText size={16} />
                {t("orders")}
              </span>
            </Link>
            <Link
              href="/admin"
              onClick={closeMobileMenu}
              className={`flex items-center justify-between rounded-md px-3 py-2 transition-colors ${
                isActive("/admin")
                  ? "bg-orange-50/70 text-orange-600 dark:bg-orange-500/10"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} />
                {t("admin")}
              </span>
            </Link>
          </nav>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-zinc-200/50 dark:border-zinc-800/50 transition-colors pb-safe">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {/* Home Link */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 h-full select-none ${
              isActive("/") ? "text-orange-500" : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            <Home size={20} className="mb-0.5" />
            <span className="text-[10px] font-semibold">{t("home")}</span>
          </Link>

          {/* Cart Link */}
          <Link
            href="/cart"
            className={`relative flex flex-col items-center justify-center flex-1 h-full select-none ${
              isActive("/cart") ? "text-orange-500" : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            <ShoppingBag size={20} className="mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute top-2.5 right-6 px-1.5 py-0.5 text-[8px] font-black rounded-full bg-orange-500 text-white">
                {cartCount}
              </span>
            )}
            <span className="text-[10px] font-semibold">{t("cart")}</span>
          </Link>

          {/* Orders Link */}
          <Link
            href="/orders"
            className={`flex flex-col items-center justify-center flex-1 h-full select-none ${
              isActive("/orders") ? "text-orange-500" : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            <ReceiptText size={20} className="mb-0.5" />
            <span className="text-[10px] font-semibold">{t("orders")}</span>
          </Link>

          {/* Admin Link */}
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center flex-1 h-full select-none ${
              isActive("/admin") ? "text-orange-500" : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            <ShieldCheck size={20} className="mb-0.5" />
            <span className="text-[10px] font-semibold">{t("admin")}</span>
          </Link>
        </div>
      </div>
    </>
  );
};
