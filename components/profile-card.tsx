import { HyperScore } from "./hyper-score";
import { shortenAddress, formatPnl, formatUsd } from "@/lib/utils";

interface ProfileCardProps {
  address: string;
  displayName?: string | null;
  pnl30d: number;
  pnlAmount30d: number;
  winRate: number;
  trades: number;
  accountValue: number;
  rank: number;
  hyperScore: number;
}

export function ProfileCard({
  address,
  displayName,
  pnl30d,
  pnlAmount30d,
  winRate,
  trades,
  accountValue,
  rank,
  hyperScore,
}: ProfileCardProps) {
  const pnlColor = pnl30d >= 0 ? "text-green" : "text-red";
  const pnlSign = pnl30d >= 0 ? "+" : "";

  return (
    <div className="glass glass-hover rounded-2xl p-6 sm:p-8 transition-all duration-300 animate-pulse-glow">
      {/* Top row: address + score */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-muted text-xs uppercase tracking-widest mb-1">
            Trader Profile
          </div>
          <div className="font-mono text-lg text-fg">
            {displayName || shortenAddress(address)}
          </div>
          {displayName && (
            <div className="font-mono text-xs text-muted mt-0.5">
              {shortenAddress(address)}
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-mono">
              Rank #{rank}
            </span>
            <span className="text-xs bg-surface-raised text-muted px-2 py-0.5 rounded-full font-mono">
              {formatUsd(accountValue)}
            </span>
          </div>
        </div>
        <HyperScore score={hyperScore} size="md" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <div className="text-muted text-[10px] uppercase tracking-widest mb-1">
            PnL (30d)
          </div>
          <div className={`font-mono font-bold text-lg ${pnlColor}`}>
            {pnlSign}{pnl30d.toFixed(1)}%
          </div>
          <div className={`font-mono text-xs ${pnlColor}`}>
            {formatPnl(pnlAmount30d)}
          </div>
        </div>
        <div>
          <div className="text-muted text-[10px] uppercase tracking-widest mb-1">
            Win Rate
          </div>
          <div className="font-mono font-bold text-lg text-fg">
            {winRate}%
          </div>
        </div>
        <div>
          <div className="text-muted text-[10px] uppercase tracking-widest mb-1">
            Trades
          </div>
          <div className="font-mono font-bold text-lg text-fg">{trades}</div>
        </div>
        <div>
          <div className="text-muted text-[10px] uppercase tracking-widest mb-1">
            All-Time PnL
          </div>
          <div className="font-mono font-bold text-lg text-green">
            {formatPnl(pnlAmount30d * (100 / Math.max(Math.abs(pnl30d), 1)))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <a
          href={`/trader/${address}`}
          className="flex-1 bg-accent text-bg font-semibold py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity text-center"
        >
          View Full Profile
        </a>
        <button className="flex-1 border border-border text-muted font-semibold py-2.5 rounded-lg text-sm hover:text-fg hover:border-accent/30 transition-all">
          Share
        </button>
      </div>
    </div>
  );
}
