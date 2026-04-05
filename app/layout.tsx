import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hyperboard.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "HyperScore — Verified Trading Reputation on Hyperliquid",
    template: "%s | HyperScore",
  },
  description:
    "Your verified trading identity on Hyperliquid. On-chain PnL, win rate, HyperScore, and full trading profiles — pulled from the order book. No fakes.",
  metadataBase: new URL(siteUrl),
  keywords: [
    "Hyperliquid",
    "HyperScore",
    "trading reputation",
    "on-chain PnL",
    "perps trading",
    "leaderboard",
    "crypto trading",
    "verified PnL",
    "trading identity",
    "DeFi",
  ],
  openGraph: {
    title: "HyperScore — Verified Trading Reputation on Hyperliquid",
    description:
      "Every trade, every win, every loss — pulled directly from the Hyperliquid order book. No edits. No fake PnL.",
    siteName: "HyperScore",
    url: siteUrl,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HyperScore — Your Trading Reputation. Proven.",
    description:
      "Verified on-chain trading profiles on Hyperliquid. Find your HyperScore.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
