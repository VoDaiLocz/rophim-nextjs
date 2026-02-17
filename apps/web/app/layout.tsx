import type { Metadata } from "next";
import React, { ReactNode } from "react";
import Script from "next/script";
import { Be_Vietnam_Pro, Oswald } from "next/font/google";
import "./globals.css";
// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

const oswald = Oswald({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HideDevBadge } from "@/components/hide-dev-badge";
import { ScrollToTop } from "@/components/scroll-to-top";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "RoPhim - Xem phim chất lượng cao",
  description: "Clone Project Rophim.com.mx",
  verification: {
    google: "1Uk4kBlg_7_euGY9J1Irc0qfh8rwNNNkChREUVxnja8",
  },
  other: {
    "google-adsense-account": "ca-pub-8210200852004651",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8210200852004651"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${beVietnamPro.variable} ${oswald.variable} antialiased bg-black text-white font-sans`}>
        <NextTopLoader color="#ffd875" showSpinner={false} />
        <HideDevBadge />
        <Navbar />
        {children}
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}
