"use client";

import { useState } from "react";
import Link from "next/link";
import { HyperScore } from "./hyper-score";
import {
  formatUsd,
  formatPnl,
  shortenAddress,
} from "@/lib/utils";

interface Row {
  rank: number;
  address: string;
  displayName: string | null;
  accountValue: number;
  dayPnl: number;
  dayRoi: number;
  weekPnl: number;
  weekRoi: number;
  monthPnl: number;
  monthRoi: number;
  allTimePnl: number;
  allTimeRoi: number;
  allTimeVolume: number;
  hyperScore: number;
}

type Timeframe = "24h" | "7d" | "30d" | "all-time";
type SortBy = "pnl" | "score" | "consistency";

function getPnl(r: Row, tf: Timeframe) {
  if (tf === "24h") return r.dayPnl;
  if (tf === "7d") return r.weekPnl;
  if (tf === "30d") return r.monthPnl;
  return r.allTimePnl;
}

function getRoi(r: Row, tf: Timeframe) {
  if (tf === "24h") return r.dayRoi;
  if (tf === "7d") return r.weekRoi;
  if (tf === "30d") return r.monthRoi;
  return r.allTimeRoi;
}

export function LeaderboardFilters({ rows }: { rows: Row[] }) {
  const [tf, setTf] = useState<Timeframe>("all-time");
  const [sortBy, setSortBy] = useState<SortBy>("pnl");

  const sorted = [...rows]
    .sort((a, b) => {
      if (sortBy === "score") return b.hyperScore - a.hyperScore;
      if (sortBy === "consistency") return b.allTimeRoi - a.allTimeRoi;
      return getPnl(b, tf) - getPnl(a, tf);
    })
    .slice(0, 100)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  const timeframes: Timeframe[] = ["24h", "7d", "30d", "all-time"];
  const sorts: { key: SortBy; label: string }[] = [
    { key: "pnl", label: "PnL" },
    { key: "score", label: "HyperScore" },
    { key: "consistency", label: "Consistency" },
  ];

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-1 bg-surface rounded-lg p-1">
          {timeframes.map((t) => (
            <button
              key={t}
              onClick={() => setTf(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                tf === t ? "bg-accent text-bg" : "text-muted hover:text-fg"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-surface rounded-lg p-1">
          {sorts.map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                sortBy === s.key
                  ? "bg-surface-raised text-fg"
                  : "text-muted hover:text-fg"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-[10px] uppercase tracking-widest border-b border-border">
                <th className="text-left py-4 px-4 sm:px-6">#</th>
                <th className="text-left py-4 px-4 sm:px-6">Trader</th>
                <th className="text-right py-4 px-4 sm:px-6">PnL</th>
                <th className="text-right py-4 px-4 sm:px-6 hidden sm:table-cell">
                  ROI
                </th>
                <th className="text-right py-4 px-4 sm:px-6 hidden md:table-cell">
                  Account
                </th>
                <th className="text-right py-4 px-4 sm:px-6">Score</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const pnl = getPnl(row, tf);
                const roi = getRoi(row, tf);
                return (
                  <tr
                    key={row.address}
                    className="border-b border-border-subtle hover:bg-surface-hover transition-colors group"
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
                        className="font-mono text-sm text-fg group-hover:text-accent transition-colors"
                      >
                        {row.displayName || shortenAddress(row.address)}
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
                    <td className="text-right py-4 px-4 sm:px-6 font-mono text-sm text-muted hidden md:table-cell">
                      {formatUsd(row.accountValue)}
                    </td>
                    <td className="text-right py-4 px-4 sm:px-6">
                      <div className="flex justify-end">
                        <HyperScore
                          score={row.hyperScore}
                          size="sm"
                          showLabel={false}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
