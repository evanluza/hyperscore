"use client";

import { useState } from "react";
import Link from "next/link";
import { HyperScore } from "./hyper-score";
import { computeHyperScore, shortenAddress, formatPnl } from "@/lib/utils";
import type { ParsedLeaderboardRow } from "@/lib/hyperliquid";

interface Props {
  rows: ParsedLeaderboardRow[];
}

const tabs = ["24H", "7D", "30D"] as const;
type Tab = (typeof tabs)[number];

function sortByTab(rows: ParsedLeaderboardRow[], tab: Tab) {
  const sorted = [...rows].sort((a, b) => {
    if (tab === "24H") return b.dayPnl - a.dayPnl;
    if (tab === "7D") return b.weekPnl - a.weekPnl;
    return b.monthPnl - a.monthPnl;
  });
  return sorted.slice(0, 5).map((r, i) => ({ ...r, rank: i + 1 }));
}

function getPnl(row: ParsedLeaderboardRow, tab: Tab) {
  if (tab === "24H") return row.dayPnl;
  if (tab === "7D") return row.weekPnl;
  return row.monthPnl;
}

function getRoi(row: ParsedLeaderboardRow, tab: Tab) {
  if (tab === "24H") return row.dayRoi;
  if (tab === "7D") return row.weekRoi;
  return row.monthRoi;
}

export function LeaderboardPreview({ rows }: Props) {
  const [active, setActive] = useState<Tab>("24H");
  const displayed = sortByTab(rows, active);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              active === tab
                ? "bg-accent text-bg"
                : "text-muted hover:text-fg"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-[10px] uppercase tracking-widest border-b border-border">
              <th className="text-left py-3 px-4 sm:px-6">#</th>
              <th className="text-left py-3 px-4 sm:px-6">Trader</th>
              <th className="text-right py-3 px-4 sm:px-6">PnL</th>
              <th className="text-right py-3 px-4 sm:px-6 hidden sm:table-cell">
                ROI
              </th>
              <th className="text-right py-3 px-4 sm:px-6">Score</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((row) => {
              const pnl = getPnl(row, active);
              const roi = getRoi(row, active);
              const score = computeHyperScore(row.allTimeRoi, 65);

              return (
                <tr
                  key={row.address}
                  className="border-b border-border-subtle hover:bg-surface-hover transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-4 sm:px-6">
                    <span
                      className={`font-mono font-bold text-sm ${
                        row.rank === 1
                          ? "text-gold"
                          : row.rank === 2
                            ? "text-silver"
                            : row.rank === 3
                              ? "text-bronze"
                              : "text-muted"
                      }`}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <Link
                      href={`/trader/${row.address}`}
                      className="group-hover:text-accent transition-colors"
                    >
                      <span className="font-mono text-sm">
                        {row.displayName || shortenAddress(row.address)}
                      </span>
                    </Link>
                  </td>
                  <td
                    className={`text-right py-4 px-4 sm:px-6 font-mono font-semibold text-sm ${
                      pnl >= 0 ? "text-green" : "text-red"
                    }`}
                  >
                    {formatPnl(pnl)}
                  </td>
                  <td
                    className={`text-right py-4 px-4 sm:px-6 font-mono text-sm hidden sm:table-cell ${
                      roi >= 0 ? "text-green" : "text-red"
                    }`}
                  >
                    {roi >= 0 ? "+" : ""}
                    {roi.toFixed(1)}%
                  </td>
                  <td className="text-right py-4 px-4 sm:px-6">
                    <div className="flex justify-end">
                      <HyperScore score={score} size="sm" showLabel={false} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/leaderboard"
          className="text-accent text-sm hover:underline font-medium"
        >
          View full leaderboard →
        </Link>
      </div>
    </div>
  );
}
