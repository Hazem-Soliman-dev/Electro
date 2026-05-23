import type { Metadata } from "next";
import { Outfit, Cairo, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/components/CartProvider";
import "@uploadthing/react/styles.css";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Electro Pi - Online Food Ordering",
  description: "Experience premium hot food ordered online and delivered straight to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${outfit.variable} ${cairo.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col font-sans antialiased text-foreground bg-background">
          <LanguageProvider>
            <ThemeProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </ThemeProvider>
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
