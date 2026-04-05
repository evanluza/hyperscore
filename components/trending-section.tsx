import Link from "next/link";
import { shortenAddress, formatPnl } from "@/lib/utils";
import type { ParsedLeaderboardRow } from "@/lib/hyperliquid";

interface Props {
  rows: ParsedLeaderboardRow[];
}

export function TrendingSection({ rows }: Props) {
  // Biggest 24h winner
  const biggestWin = [...rows].sort((a, b) => b.dayPnl - a.dayPnl)[0];
  // Most consistent (highest all-time ROI with significant volume)
  const mostConsistent = [...rows]
    .filter((r) => r.allTimeVolume > 1_000_000)
    .sort((a, b) => b.allTimeRoi - a.allTimeRoi)[0];
  // Trending: biggest 7d PnL
  const trending = [...rows].sort((a, b) => b.weekPnl - a.weekPnl)[0];

  const items = [
    biggestWin && {
      label: "Biggest Win Today",
      name: biggestWin.displayName || shortenAddress(biggestWin.address),
      value: formatPnl(biggestWin.dayPnl),
      detail: "24h PnL",
      color: biggestWin.dayPnl >= 0 ? "text-green" : "text-red",
      address: biggestWin.address,
    },
    mostConsistent && {
      label: "Most Consistent",
      name: mostConsistent.displayName || shortenAddress(mostConsistent.address),
      value: `+${mostConsistent.allTimeRoi.toFixed(0)}% ROI`,
      detail: "All-time",
      color: "text-accent",
      address: mostConsistent.address,
    },
    trending && {
      label: "Trending This Week",
      name: trending.displayName || shortenAddress(trending.address),
      value: formatPnl(trending.weekPnl),
      detail: "7d PnL",
      color: trending.weekPnl >= 0 ? "text-green" : "text-red",
      address: trending.address,
    },
  ].filter(Boolean) as {
    label: string;
    name: string;
    value: string;
    detail: string;
    color: string;
    address: string;
  }[];

  if (items.length === 0) {
    return (
      <div className="text-muted text-sm text-center py-8">
        Loading trending data...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <Link
          key={item.label}
          href={`/trader/${item.address}`}
          className="glass glass-hover rounded-xl p-5 cursor-pointer transition-all duration-300 block"
        >
          <div className="text-muted text-[10px] uppercase tracking-widest mb-3">
            {item.label}
          </div>
          <div className="font-mono text-fg text-sm font-medium mb-1">
            {item.name}
          </div>
          <div className={`font-mono font-bold text-lg ${item.color}`}>
            {item.value}
          </div>
          <div className="text-muted text-xs mt-1">{item.detail}</div>
        </Link>
      ))}
    </div>
  );
}
