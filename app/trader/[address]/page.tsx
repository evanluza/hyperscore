import { notFound } from "next/navigation";
import { getTraderStats } from "@/lib/hyperliquid";
import {
  isValidAddress,
  shortenAddress,
  formatUsd,
  formatPnl,
  formatPercent,
  computeHyperScore,
} from "@/lib/utils";
import { HyperScore } from "@/components/hyper-score";
import { StatCard } from "@/components/stat-card";
import { EquityChart } from "@/components/equity-chart";
import { PositionsTable } from "@/components/positions-table";
import { RecentTrades } from "@/components/recent-trades";
import { NextActions } from "@/components/next-actions";
import { Nav } from "@/components/nav";
import { HL_REFERRAL_URL } from "@/lib/constants";
import Link from "next/link";

interface Props {
  params: Promise<{ address: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { address } = await params;
  const short = shortenAddress(address);
  return {
    title: `${short} — HyperScore`,
    description: `Verified trading profile for ${short} on Hyperliquid`,
  };
}

function deriveStrategy(stats: {
  winRate: number;
  totalTrades: number;
  avgTradeSize: number;
  bestTrade: number;
  worstTrade: number;
  positions: { coin: string }[];
  recentFills: { coin: string; dir: string }[];
}) {
  const hints: string[] = [];

  if (stats.winRate > 65) hints.push("High win-rate trader — selective entries");
  else if (stats.winRate > 50) hints.push("Balanced approach — moderate selectivity");
  else hints.push("High-risk style — relies on outsized winners");

  if (stats.totalTrades > 500) hints.push("Very active — likely scalping or day trading");
  else if (stats.totalTrades > 100) hints.push("Moderately active — swing or positional");
  else hints.push("Low frequency — conviction-based entries");

  const coins = stats.recentFills.map((f) => f.coin);
  const unique = new Set(coins);
  if (unique.size > 10) hints.push("Diversified — trades many markets");
  else if (unique.size > 3) hints.push("Focused — trades a handful of markets");
  else hints.push("Concentrated — specialist in " + (coins[0] || "select markets"));

  const longs = stats.recentFills.filter(
    (f) => f.dir === "Open Long" || f.dir === "Buy"
  ).length;
  const shorts = stats.recentFills.filter(
    (f) => f.dir === "Open Short" || f.dir === "Sell"
  ).length;
  if (longs > shorts * 2) hints.push("Long-biased — bullish positioning");
  else if (shorts > longs * 2) hints.push("Short-biased — bearish or hedging");
  else hints.push("Directionally balanced — plays both sides");

  return hints;
}

export default async function TraderPage({ params }: Props) {
  const { address } = await params;

  if (!isValidAddress(address)) notFound();

  let stats;
  try {
    stats = await getTraderStats(address);
  } catch {
    notFound();
  }

  const pnlColor = (v: number) =>
    v >= 0 ? ("green" as const) : ("red" as const);
  const hyperScore = computeHyperScore(
    stats.totalPnl > 0 ? (stats.totalPnl / Math.max(stats.accountValue, 1)) * 100 : -10,
    stats.winRate
  );
  const strategyHints = deriveStrategy(stats);

  return (
    <div className="min-h-full bg-bg bg-grid">
      <Nav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Profile hero */}
        <div className="glass glow-green rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Left: identity */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-mono font-bold text-lg">
                {address.slice(2, 4).toUpperCase()}
              </div>
              <div>
                <h1 className="font-mono text-xl font-semibold">
                  {shortenAddress(address)}
                </h1>
                <p className="text-muted text-xs font-mono mt-0.5 break-all max-w-xs sm:max-w-md">
                  {address}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                    {formatUsd(stats.accountValue)} Account
                  </span>
                </div>
              </div>
            </div>

            {/* Right: HyperScore */}
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <div className="text-muted text-[10px] uppercase tracking-widest mb-1">
                  All-Time PnL
                </div>
                <div
                  className={`font-mono font-bold text-2xl ${stats.totalPnl >= 0 ? "text-green" : "text-red"}`}
                >
                  {formatPnl(stats.totalPnl)}
                </div>
              </div>
              <HyperScore score={hyperScore} size="lg" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6 border-t border-border-subtle pt-6">
            <button
              className="bg-accent text-bg font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
              onClick={undefined}
            >
              Share Profile
            </button>
            <Link
              href={`/compare?a=${address}`}
              className="border border-border text-muted font-semibold px-5 py-2.5 rounded-lg text-sm hover:text-fg hover:border-accent/30 transition-all"
            >
              Compare
            </Link>
            <span className="border border-border text-muted/40 font-semibold px-5 py-2.5 rounded-lg text-sm cursor-default hidden sm:inline-block">
              Follow (soon)
            </span>
          </div>
        </div>

        {/* PnL summary — visible on mobile too */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="All-Time PnL"
            value={formatPnl(stats.totalPnl)}
            color={pnlColor(stats.totalPnl)}
          />
          <StatCard
            label="Win Rate"
            value={formatPercent(stats.winRate).replace("+", "")}
          />
          <StatCard
            label="Total Trades"
            value={stats.totalTrades.toLocaleString()}
          />
          <StatCard
            label="Volume"
            value={formatUsd(stats.totalVolume)}
          />
        </div>

        {/* Timeframe PnL */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard
            label="24h PnL"
            value={formatPnl(stats.dayPnl)}
            color={pnlColor(stats.dayPnl)}
          />
          <StatCard
            label="7d PnL"
            value={formatPnl(stats.weekPnl)}
            color={pnlColor(stats.weekPnl)}
          />
          <StatCard
            label="30d PnL"
            value={formatPnl(stats.monthPnl)}
            color={pnlColor(stats.monthPnl)}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="glass rounded-xl p-5">
            <h2 className="text-[10px] text-muted uppercase tracking-widest mb-4">
              Equity Curve
            </h2>
            <EquityChart data={stats.equityCurve} height={220} />
          </div>
          <div className="glass rounded-xl p-5">
            <h2 className="text-[10px] text-muted uppercase tracking-widest mb-4">
              Cumulative PnL
            </h2>
            <EquityChart data={stats.pnlCurve} height={220} />
          </div>
        </div>

        {/* Best/worst */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard
            label="Avg Trade"
            value={formatUsd(stats.avgTradeSize)}
          />
          <StatCard
            label="Best Trade"
            value={formatPnl(stats.bestTrade)}
            color="green"
          />
          <StatCard
            label="Worst Trade"
            value={formatPnl(stats.worstTrade)}
            color="red"
          />
          <StatCard
            label="HyperScore"
            value={`${hyperScore}/100`}
            color={hyperScore >= 60 ? "green" : "red"}
          />
        </div>

        {/* Strategy hints */}
        <div className="glass rounded-xl p-5 mb-6">
          <h2 className="text-[10px] text-muted uppercase tracking-widest mb-4">
            Strategy Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {strategyHints.map((hint, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-accent font-mono text-xs mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-muted">{hint}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="glass rounded-xl p-5 mb-6">
          <h2 className="text-[10px] text-muted uppercase tracking-widest mb-4">
            Open Positions ({stats.positions.length})
          </h2>
          <PositionsTable positions={stats.positions} />
        </div>

        {/* Recent Trades */}
        <div className="glass rounded-xl p-5 mb-8">
          <h2 className="text-[10px] text-muted uppercase tracking-widest mb-4">
            Recent Trades
          </h2>
          <RecentTrades fills={stats.recentFills} />
        </div>

        {/* Next actions — kill dead ends */}
        <div className="mb-8">
          <h2 className="text-[10px] text-muted uppercase tracking-widest mb-4">
            Keep Exploring
          </h2>
          <NextActions currentAddress={address} />
        </div>

        {/* Referral CTA */}
        <div className="glass rounded-xl p-6 text-center mb-8">
          <p className="text-muted text-sm mb-3">
            Want to trade like the top performers on Hyperliquid?
          </p>
          <a
            href={HL_REFERRAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-bg font-semibold px-6 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            Start Trading on Hyperliquid
            <span className="text-bg/60 text-xs">(4% fee discount)</span>
          </a>
        </div>
      </main>
    </div>
  );
}
