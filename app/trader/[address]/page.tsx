import { notFound } from "next/navigation";
import { getTraderStats } from "@/lib/hyperliquid";
import {
  isValidAddress,
  shortenAddress,
  formatUsd,
  formatPnl,
  formatPercent,
} from "@/lib/utils";
import { StatCard } from "@/components/stat-card";
import { EquityChart } from "@/components/equity-chart";
import { PositionsTable } from "@/components/positions-table";
import { RecentTrades } from "@/components/recent-trades";
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

export default async function TraderPage({ params }: Props) {
  const { address } = await params;

  if (!isValidAddress(address)) {
    notFound();
  }

  let stats;
  try {
    stats = await getTraderStats(address);
  } catch {
    notFound();
  }

  const pnlColor = (v: number) => (v >= 0 ? ("green" as const) : ("red" as const));

  return (
    <div className="min-h-full bg-bg bg-grid">
      {/* Header */}
      <header className="border-b border-border-subtle sticky top-0 z-50 bg-bg/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-accent font-bold text-xl font-mono tracking-tight"
          >
            HyperScore
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/leaderboard"
              className="text-muted hover:text-fg text-sm transition-colors"
            >
              Leaderboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Address header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-mono font-bold text-sm">
              {address.slice(2, 4).toUpperCase()}
            </div>
            <div>
              <h1 className="font-mono text-xl font-semibold">
                {shortenAddress(address)}
              </h1>
              <p className="text-muted text-xs font-mono">{address}</p>
            </div>
          </div>
        </div>

        {/* PnL summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Account Value"
            value={formatUsd(stats.accountValue)}
          />
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

        {/* Equity curve */}
        <div className="glass rounded-xl p-5 mb-6">
          <h2 className="text-[10px] text-muted uppercase tracking-widest mb-4">
            Equity Curve
          </h2>
          <EquityChart data={stats.equityCurve} height={240} />
        </div>

        {/* PnL curve */}
        <div className="glass rounded-xl p-5 mb-6">
          <h2 className="text-[10px] text-muted uppercase tracking-widest mb-4">
            Cumulative PnL
          </h2>
          <EquityChart data={stats.pnlCurve} height={200} />
        </div>

        {/* Trade stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Volume" value={formatUsd(stats.totalVolume)} />
          <StatCard label="Avg Trade" value={formatUsd(stats.avgTradeSize)} />
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
      </main>
    </div>
  );
}
