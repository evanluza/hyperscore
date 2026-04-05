import { HyperScore } from "./hyper-score";

export function ShareCardPreview() {
  return (
    <div className="relative">
      {/* The card itself */}
      <div className="glass glow-green rounded-2xl p-6 sm:p-8 max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-accent font-mono font-bold text-sm">HyperScore</span>
          <span className="text-muted text-[10px] uppercase tracking-widest">30 Day Report</span>
        </div>

        {/* Wallet */}
        <div className="font-mono text-fg text-sm mb-1">@HyperWhale</div>
        <div className="font-mono text-muted text-xs mb-5">0xa1b2...f8e2</div>

        {/* PnL hero */}
        <div className="mb-6">
          <div className="text-muted text-[10px] uppercase tracking-widest mb-1">PnL</div>
          <div className="font-mono text-green text-3xl font-bold">+$324.1K</div>
          <div className="font-mono text-green text-sm">+42.8%</div>
        </div>

        {/* Stats + Score */}
        <div className="flex items-end justify-between">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <div className="text-muted text-[9px] uppercase tracking-widest">Win Rate</div>
              <div className="font-mono text-fg text-sm font-semibold">63%</div>
            </div>
            <div>
              <div className="text-muted text-[9px] uppercase tracking-widest">Trades</div>
              <div className="font-mono text-fg text-sm font-semibold">184</div>
            </div>
            <div>
              <div className="text-muted text-[9px] uppercase tracking-widest">Rank</div>
              <div className="font-mono text-fg text-sm font-semibold">#12</div>
            </div>
            <div>
              <div className="text-muted text-[9px] uppercase tracking-widest">Sharpe</div>
              <div className="font-mono text-fg text-sm font-semibold">1.9</div>
            </div>
          </div>
          <HyperScore score={87} size="lg" />
        </div>
      </div>

      {/* Share button */}
      <div className="text-center mt-6">
        <button className="bg-accent text-bg font-semibold px-8 py-3 rounded-lg text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share to X
        </button>
      </div>
    </div>
  );
}
