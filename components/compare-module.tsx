"use client";

import { useState } from "react";

const MOCK_A = { address: "0xa1b2...f8e2", pnl: "+42.8%", winRate: "63%", trades: "184", bestTrade: "+312%" };
const MOCK_B = { address: "0xc3d4...9a1b", pnl: "+28.1%", winRate: "58%", trades: "312", bestTrade: "+189%" };

function StatRow({ label, a, b }: { label: string; a: string; b: string }) {
  return (
    <div className="grid grid-cols-3 items-center py-3 border-b border-border-subtle">
      <div className="font-mono text-sm text-fg text-center">{a}</div>
      <div className="text-muted text-[10px] uppercase tracking-widest text-center">{label}</div>
      <div className="font-mono text-sm text-fg text-center">{b}</div>
    </div>
  );
}

export function CompareModule() {
  const [addressA, setAddressA] = useState("");
  const [addressB, setAddressB] = useState("");
  const [showResult, setShowResult] = useState(true);

  return (
    <div>
      {/* Inputs */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          value={addressA}
          onChange={(e) => setAddressA(e.target.value)}
          placeholder="Wallet A (0x...)"
          className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 font-mono text-xs text-fg placeholder:text-muted/60 focus:outline-none focus:border-accent/40 transition-colors"
        />
        <span className="text-muted font-bold text-sm shrink-0">VS</span>
        <input
          type="text"
          value={addressB}
          onChange={(e) => setAddressB(e.target.value)}
          placeholder="Wallet B (0x...)"
          className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 font-mono text-xs text-fg placeholder:text-muted/60 focus:outline-none focus:border-accent/40 transition-colors"
        />
      </div>

      {/* Mock result */}
      {showResult && (
        <div className="glass rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 items-center py-3 px-4 border-b border-border">
            <div className="font-mono text-accent text-sm text-center">{MOCK_A.address}</div>
            <div />
            <div className="font-mono text-accent text-sm text-center">{MOCK_B.address}</div>
          </div>
          <div className="px-4">
            <StatRow label="PnL (30d)" a={MOCK_A.pnl} b={MOCK_B.pnl} />
            <StatRow label="Win Rate" a={MOCK_A.winRate} b={MOCK_B.winRate} />
            <StatRow label="Trades" a={MOCK_A.trades} b={MOCK_B.trades} />
            <div className="grid grid-cols-3 items-center py-3">
              <div className="font-mono text-sm text-green text-center">{MOCK_A.bestTrade}</div>
              <div className="text-muted text-[10px] uppercase tracking-widest text-center">Best Trade</div>
              <div className="font-mono text-sm text-green text-center">{MOCK_B.bestTrade}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
