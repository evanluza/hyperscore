import Link from "next/link";
import { getLeaderboard } from "@/lib/hyperliquid";
import { formatUsd, formatPnl, shortenAddress } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard — HyperScore",
  description:
    "Top Hyperliquid traders ranked by verified on-chain performance",
};

export default async function LeaderboardPage() {
  let rows;
  try {
    rows = await getLeaderboard();
  } catch {
    return (
      <div className="min-h-full bg-bg flex items-center justify-center">
        <p className="text-muted">
          Failed to load leaderboard. Try again later.
        </p>
      </div>
    );
  }

  const sorted = rows
    .map((row) => {
      const allTime = row.windowPerformances.find((w) => w[0] === "allTime");
      const day = row.windowPerformances.find((w) => w[0] === "day");
      return {
        ...row,
        allTimePnl: allTime ? parseFloat(allTime[1].pnl) : 0,
        allTimeRoi: allTime ? parseFloat(allTime[1].roi) * 100 : 0,
        dayPnl: day ? parseFloat(day[1].pnl) : 0,
        volume: allTime ? parseFloat(allTime[1].vlm) : 0,
      };
    })
    .sort((a, b) => b.allTimePnl - a.allTimePnl)
    .slice(0, 100);

  return (
    <div className="min-h-full bg-bg bg-grid">
      <header className="border-b border-border-subtle sticky top-0 z-50 bg-bg/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-accent font-bold text-xl font-mono tracking-tight"
          >
            HyperScore
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/leaderboard" className="text-fg text-sm font-medium">
              Leaderboard
            </Link>
            <span
              className="text-muted/40 text-sm cursor-default"
              title="Coming soon"
            >
              Claim Profile
            </span>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Leaderboard
          </h1>
          <p className="text-muted text-sm">
            Top 100 Hyperliquid traders by all-time verified PnL
          </p>
        </div>

        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted text-[10px] uppercase tracking-widest border-b border-border">
                  <th className="text-left py-4 px-6">#</th>
                  <th className="text-left py-4 px-6">Trader</th>
                  <th className="text-right py-4 px-6">Account Value</th>
                  <th className="text-right py-4 px-6">All-Time PnL</th>
                  <th className="text-right py-4 px-6">ROI</th>
                  <th className="text-right py-4 px-6">24h PnL</th>
                  <th className="text-right py-4 px-6 hidden sm:table-cell">
                    Volume
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((row, i) => (
                  <tr
                    key={row.ethAddress}
                    className="border-b border-border-subtle hover:bg-surface-hover transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span
                        className={`font-mono font-bold text-sm ${
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
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        href={`/trader/${row.ethAddress}`}
                        className="font-mono text-sm text-fg group-hover:text-accent transition-colors"
                      >
                        {row.displayName || shortenAddress(row.ethAddress)}
                      </Link>
                    </td>
                    <td className="text-right py-4 px-6 font-mono text-sm">
                      {formatUsd(parseFloat(row.accountValue))}
                    </td>
                    <td
                      className={`text-right py-4 px-6 font-mono font-semibold text-sm ${
                        row.allTimePnl >= 0 ? "text-green" : "text-red"
                      }`}
                    >
                      {formatPnl(row.allTimePnl)}
                    </td>
                    <td
                      className={`text-right py-4 px-6 font-mono text-sm ${
                        row.allTimeRoi >= 0 ? "text-green" : "text-red"
                      }`}
                    >
                      {row.allTimeRoi >= 0 ? "+" : ""}
                      {row.allTimeRoi.toFixed(1)}%
                    </td>
                    <td
                      className={`text-right py-4 px-6 font-mono text-sm ${
                        row.dayPnl >= 0 ? "text-green" : "text-red"
                      }`}
                    >
                      {formatPnl(row.dayPnl)}
                    </td>
                    <td className="text-right py-4 px-6 font-mono text-sm text-muted hidden sm:table-cell">
                      {formatUsd(row.volume)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
