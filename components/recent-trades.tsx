import type { Fill } from "@/lib/types";
import { formatUsd, formatPnl, timeAgo } from "@/lib/utils";

interface RecentTradesProps {
  fills: Fill[];
}

export function RecentTrades({ fills }: RecentTradesProps) {
  if (fills.length === 0) {
    return (
      <div className="text-muted text-sm py-8 text-center">
        No recent trades
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted text-xs uppercase tracking-wider border-b border-border">
            <th className="text-left py-3 px-2">Time</th>
            <th className="text-left py-3 px-2">Market</th>
            <th className="text-right py-3 px-2">Direction</th>
            <th className="text-right py-3 px-2">Price</th>
            <th className="text-right py-3 px-2">Size</th>
            <th className="text-right py-3 px-2">PnL</th>
          </tr>
        </thead>
        <tbody>
          {fills.map((fill) => {
            const pnl = parseFloat(fill.closedPnl);
            const hasPnl = pnl !== 0;

            return (
              <tr
                key={fill.tid}
                className="border-b border-border/50 hover:bg-surface-hover transition-colors"
              >
                <td className="py-3 px-2 text-muted">{timeAgo(fill.time)}</td>
                <td className="py-3 px-2 font-mono font-medium">
                  {fill.coin}
                </td>
                <td className="text-right py-3 px-2">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded ${
                      fill.side === "B"
                        ? "bg-green-dim text-green"
                        : "bg-red-dim text-red"
                    }`}
                  >
                    {fill.dir}
                  </span>
                </td>
                <td className="text-right py-3 px-2 font-mono">
                  ${parseFloat(fill.px).toLocaleString()}
                </td>
                <td className="text-right py-3 px-2 font-mono">
                  {formatUsd(parseFloat(fill.sz) * parseFloat(fill.px))}
                </td>
                <td
                  className={`text-right py-3 px-2 font-mono ${
                    hasPnl
                      ? pnl >= 0
                        ? "text-green"
                        : "text-red"
                      : "text-muted"
                  }`}
                >
                  {hasPnl ? formatPnl(pnl) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
