"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { isValidAddress, shortenAddress, formatUsd, formatPnl, formatPercent, computeHyperScore } from "@/lib/utils";
import { HyperScore } from "./hyper-score";
import Link from "next/link";

interface TraderData {
  address: string;
  accountValue: number;
  totalPnl: number;
  winRate: number;
  totalTrades: number;
  bestTrade: number;
  worstTrade: number;
  dayPnl: number;
  weekPnl: number;
  monthPnl: number;
  totalVolume: number;
}

function StatCompare({
  label,
  a,
  b,
  format,
  higherWins = true,
}: {
  label: string;
  a: number;
  b: number;
  format: (v: number) => string;
  higherWins?: boolean;
}) {
  const aWins = higherWins ? a > b : a < b;
  const bWins = higherWins ? b > a : b < a;
  return (
    <div className="grid grid-cols-3 items-center py-3.5 border-b border-border-subtle">
      <div
        className={`font-mono text-sm text-center font-semibold ${aWins ? "text-green" : "text-fg"}`}
      >
        {format(a)}
      </div>
      <div className="text-muted text-[10px] uppercase tracking-widest text-center">
        {label}
      </div>
      <div
        className={`font-mono text-sm text-center font-semibold ${bWins ? "text-green" : "text-fg"}`}
      >
        {format(b)}
      </div>
    </div>
  );
}

export function ComparePage() {
  const searchParams = useSearchParams();
  const [addrA, setAddrA] = useState(searchParams.get("a") || "");
  const [addrB, setAddrB] = useState(searchParams.get("b") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataA, setDataA] = useState<TraderData | null>(null);
  const [dataB, setDataB] = useState<TraderData | null>(null);

  async function fetchTrader(address: string): Promise<TraderData | null> {
    const res = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "clearinghouseState", user: address }),
    });
    if (!res.ok) return null;
    const ch = await res.json();

    const res2 = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "portfolio", user: address }),
    });
    if (!res2.ok) return null;
    const portfolio = await res2.json();

    const res3 = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "userFills", user: address }),
    });
    const fills = res3.ok ? await res3.json() : [];

    const closingFills = fills.filter(
      (f: { closedPnl: string }) => parseFloat(f.closedPnl) !== 0
    );
    const wins = closingFills.filter(
      (f: { closedPnl: string }) => parseFloat(f.closedPnl) > 0
    ).length;
    const pnls = closingFills.map((f: { closedPnl: string }) =>
      parseFloat(f.closedPnl)
    );

    const getLast = (arr: [number, string][]) =>
      arr.length ? parseFloat(arr[arr.length - 1][1]) : 0;

    return {
      address,
      accountValue: parseFloat(ch.marginSummary.accountValue),
      totalPnl: getLast(portfolio.allTime?.pnlHistory || []),
      winRate: closingFills.length > 0 ? (wins / closingFills.length) * 100 : 0,
      totalTrades: closingFills.length,
      bestTrade: pnls.length ? Math.max(...pnls) : 0,
      worstTrade: pnls.length ? Math.min(...pnls) : 0,
      dayPnl: getLast(portfolio.day?.pnlHistory || []),
      weekPnl: getLast(portfolio.week?.pnlHistory || []),
      monthPnl: getLast(portfolio.month?.pnlHistory || []),
      totalVolume: parseFloat(portfolio.allTime?.vlm || "0"),
    };
  }

  async function handleCompare() {
    const a = addrA.trim();
    const b = addrB.trim();
    if (!isValidAddress(a) || !isValidAddress(b)) {
      setError("Enter two valid wallet addresses");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const [da, db] = await Promise.all([fetchTrader(a), fetchTrader(b)]);
      if (!da || !db) {
        setError("Could not load one or both wallets");
        return;
      }
      setDataA(da);
      setDataB(db);
    } catch {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }

  const scoreA = dataA
    ? computeHyperScore(
        dataA.totalPnl > 0 ? (dataA.totalPnl / Math.max(dataA.accountValue, 1)) * 100 : -10,
        dataA.winRate
      )
    : 0;
  const scoreB = dataB
    ? computeHyperScore(
        dataB.totalPnl > 0 ? (dataB.totalPnl / Math.max(dataB.accountValue, 1)) * 100 : -10,
        dataB.winRate
      )
    : 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Inputs */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          value={addrA}
          onChange={(e) => setAddrA(e.target.value)}
          placeholder="Wallet A (0x...)"
          className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 font-mono text-xs text-fg placeholder:text-muted/50 focus:outline-none focus:border-accent/40 transition-colors"
        />
        <span className="text-accent font-bold text-lg shrink-0 font-mono">
          VS
        </span>
        <input
          type="text"
          value={addrB}
          onChange={(e) => setAddrB(e.target.value)}
          placeholder="Wallet B (0x...)"
          className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 font-mono text-xs text-fg placeholder:text-muted/50 focus:outline-none focus:border-accent/40 transition-colors"
        />
      </div>
      <button
        onClick={handleCompare}
        disabled={loading}
        className="w-full bg-accent text-bg font-semibold py-3 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mb-6"
      >
        {loading ? "Loading..." : "Compare"}
      </button>
      {error && <p className="text-red text-xs mb-4 text-center">{error}</p>}

      {/* Results */}
      {dataA && dataB && (
        <div className="glass rounded-xl overflow-hidden">
          {/* Headers */}
          <div className="grid grid-cols-3 items-center py-4 px-4 border-b border-border">
            <div className="flex flex-col items-center gap-2">
              <Link
                href={`/trader/${dataA.address}`}
                className="font-mono text-accent text-sm hover:underline"
              >
                {shortenAddress(dataA.address)}
              </Link>
              <HyperScore score={scoreA} size="sm" />
            </div>
            <div className="text-center text-muted text-xs uppercase tracking-widest">
              vs
            </div>
            <div className="flex flex-col items-center gap-2">
              <Link
                href={`/trader/${dataB.address}`}
                className="font-mono text-accent text-sm hover:underline"
              >
                {shortenAddress(dataB.address)}
              </Link>
              <HyperScore score={scoreB} size="sm" />
            </div>
          </div>

          <div className="px-4">
            <StatCompare
              label="All-Time PnL"
              a={dataA.totalPnl}
              b={dataB.totalPnl}
              format={formatPnl}
            />
            <StatCompare
              label="30d PnL"
              a={dataA.monthPnl}
              b={dataB.monthPnl}
              format={formatPnl}
            />
            <StatCompare
              label="Win Rate"
              a={dataA.winRate}
              b={dataB.winRate}
              format={(v) => formatPercent(v).replace("+", "")}
            />
            <StatCompare
              label="Trades"
              a={dataA.totalTrades}
              b={dataB.totalTrades}
              format={(v) => v.toLocaleString()}
            />
            <StatCompare
              label="Best Trade"
              a={dataA.bestTrade}
              b={dataB.bestTrade}
              format={formatPnl}
            />
            <StatCompare
              label="Account"
              a={dataA.accountValue}
              b={dataB.accountValue}
              format={formatUsd}
            />
            <div className="grid grid-cols-3 items-center py-3.5">
              <div
                className={`font-mono text-sm text-center font-bold ${scoreA > scoreB ? "text-green" : "text-fg"}`}
              >
                {scoreA}
              </div>
              <div className="text-muted text-[10px] uppercase tracking-widest text-center">
                HyperScore
              </div>
              <div
                className={`font-mono text-sm text-center font-bold ${scoreB > scoreA ? "text-green" : "text-fg"}`}
              >
                {scoreB}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
