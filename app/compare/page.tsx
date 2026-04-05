import { Suspense } from "react";
import { Nav } from "@/components/nav";
import { ComparePage } from "@/components/compare-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Traders — HyperScore",
  description: "Head-to-head trader comparison on Hyperliquid",
};

export default function Compare() {
  return (
    <div className="min-h-full bg-bg bg-grid">
      <Nav active="compare" />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="text-muted text-[10px] uppercase tracking-[0.2em] mb-2">
            Head to Head
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Who&apos;s the better trader?
          </h1>
          <p className="text-muted text-sm">
            Paste two wallets. Get verified stats. Settle it on-chain.
          </p>
        </div>
        <Suspense fallback={<div className="text-muted text-center py-8">Loading...</div>}>
          <ComparePage />
        </Suspense>
      </main>
    </div>
  );
}
