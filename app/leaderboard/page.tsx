import Link from "next/link";
import {
  getLeaderboard,
  parseLeaderboard,
} from "@/lib/hyperliquid";
import type { ParsedLeaderboardRow } from "@/lib/hyperliquid";
import {
  formatUsd,
  formatPnl,
  shortenAddress,
  computeHyperScore,
} from "@/lib/utils";
import { HyperScore } from "@/components/hyper-score";
import { Nav } from "@/components/nav";
import { LeaderboardFilters } from "@/components/leaderboard-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard — HyperScore",
  description:
    "Top Hyperliquid traders ranked by verified on-chain performance",
};

export default async function LeaderboardPage() {
  let rows: ParsedLeaderboardRow[] = [];
  try {
    const raw = await getLeaderboard();
    rows = parseLeaderboard(raw);
  } catch {
    return (
      <div className="min-h-full bg-bg flex items-center justify-center">
        <p className="text-muted">
          Failed to load leaderboard. Try again later.
        </p>
      </div>
    );
  }

  // Serialize for client component
  const serialized = rows.map((r) => ({
    ...r,
    hyperScore: computeHyperScore(r.allTimeRoi, 65),
  }));

  return (
    <div className="min-h-full bg-bg bg-grid">
      <Nav active="leaderboard" />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="text-muted text-[10px] uppercase tracking-[0.2em] mb-2">
            Rankings
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Leaderboard
          </h1>
          <p className="text-muted text-sm">
            Top Hyperliquid traders ranked by verified on-chain performance.
            Every number is real.
          </p>
        </div>

        <LeaderboardFilters rows={serialized} />
      </main>
    </div>
  );
}
