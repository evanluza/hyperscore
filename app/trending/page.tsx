import Link from "next/link";
import { getLeaderboard, parseLeaderboard } from "@/lib/hyperliquid";
import type { ParsedLeaderboardRow } from "@/lib/hyperliquid";
import {
  formatPnl,
  formatUsd,
  shortenAddress,
  computeHyperScore,
} from "@/lib/utils";
import { HyperScore } from "@/components/hyper-score";
import { Nav } from "@/components/nav";
import { NextActions } from "@/components/next-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending — HyperScore",
  description: "Biggest winners, biggest losers, and trending wallets on Hyperliquid",
};

function TrendCard({
  title,
  rows,
  getPnl,
  showLoss,
}: {
  title: string;
  rows: ParsedLeaderboardRow[];
  getPnl: (r: ParsedLeaderboardRow) => number;
  showLoss?: boolean;
}) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border-subtle">
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div>
        {rows.map((row, i) => {
          const pnl = getPnl(row);
          return (
            <Link
              key={row.address}
              href={`/trader/${row.address}`}
              className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle last:border-0 hover:bg-surface-hover transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`font-mono font-bold text-sm w-6 ${
                    i === 0
                      ? "text-gold"
                      : i === 1
                        ? "text-silver"
                        : i === 2
                          ? "text-bronze"
                          : "text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="font-mono text-sm group-hover:text-accent transition-colors">
                  {row.displayName || shortenAddress(row.address)}
                </span>
              </div>
              <span
                className={`font-mono font-semibold text-sm ${
                  showLoss ? "text-red" : pnl >= 0 ? "text-green" : "text-red"
                }`}
              >
                {formatPnl(pnl)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default async function TrendingPage() {
  let rows: ParsedLeaderboardRow[] = [];
  try {
    const raw = await getLeaderboard();
    rows = parseLeaderboard(raw);
  } catch {
    return (
      <div className="min-h-full bg-bg flex items-center justify-center">
        <p className="text-muted">Failed to load data.</p>
      </div>
    );
  }

  const biggestWinners24h = [...rows]
    .sort((a, b) => b.dayPnl - a.dayPnl)
    .slice(0, 10);
  const biggestLosers24h = [...rows]
    .sort((a, b) => a.dayPnl - b.dayPnl)
    .filter((r) => r.dayPnl < 0)
    .slice(0, 10);
  const topWeek = [...rows]
    .sort((a, b) => b.weekPnl - a.weekPnl)
    .slice(0, 10);
  const mostConsistent = [...rows]
    .filter((r) => r.allTimeVolume > 1_000_000)
    .sort((a, b) => b.allTimeRoi - a.allTimeRoi)
    .slice(0, 10);

  return (
    <div className="min-h-full bg-bg bg-grid">
      <Nav active="trending" />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="text-muted text-[10px] uppercase tracking-[0.2em] mb-2">
            What&apos;s happening
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Trending
          </h1>
          <p className="text-muted text-sm">
            Biggest winners, biggest losers, and the most consistent traders
            right now.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendCard
            title="Biggest Winners (24h)"
            rows={biggestWinners24h}
            getPnl={(r) => r.dayPnl}
          />
          <TrendCard
            title="Biggest Losers (24h)"
            rows={biggestLosers24h}
            getPnl={(r) => r.dayPnl}
            showLoss
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendCard
            title="Top Performers (7d)"
            rows={topWeek}
            getPnl={(r) => r.weekPnl}
          />
          <TrendCard
            title="Most Consistent (All-Time ROI)"
            rows={mostConsistent}
            getPnl={(r) => r.allTimePnl}
          />
        </div>

        <div>
          <h2 className="text-[10px] text-muted uppercase tracking-widest mb-4">
            Keep Exploring
          </h2>
          <NextActions exclude={["trending"]} />
        </div>
      </main>
    </div>
  );
}
