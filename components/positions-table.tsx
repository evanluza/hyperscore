import type { Position } from "@/lib/types";
import { formatUsd, formatPnl, formatPercent } from "@/lib/utils";

interface PositionsTableProps {
  positions: Position[];
}

export function PositionsTable({ positions }: PositionsTableProps) {
  if (positions.length === 0) {
    return (
      <div className="text-muted text-sm py-8 text-center">
        No open positions
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted text-xs uppercase tracking-wider border-b border-border">
            <th className="text-left py-3 px-2">Market</th>
            <th className="text-right py-3 px-2">Side</th>
            <th className="text-right py-3 px-2">Size</th>
            <th className="text-right py-3 px-2">Entry</th>
            <th className="text-right py-3 px-2">Leverage</th>
            <th className="text-right py-3 px-2">uPnL</th>
            <th className="text-right py-3 px-2">ROE</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos) => {
            const size = parseFloat(pos.szi);
            const isLong = size > 0;
            const upnl = parseFloat(pos.unrealizedPnl);
            const roe = parseFloat(pos.returnOnEquity) * 100;

            return (
              <tr
                key={pos.coin}
                className="border-b border-border/50 hover:bg-surface-hover transition-colors"
              >
                <td className="py-3 px-2 font-mono font-medium">
                  {pos.coin}
                </td>
                <td
                  className={`text-right py-3 px-2 font-mono ${isLong ? "text-green" : "text-red"}`}
                >
                  {isLong ? "LONG" : "SHORT"}
                </td>
                <td className="text-right py-3 px-2 font-mono">
                  {formatUsd(parseFloat(pos.positionValue))}
                </td>
                <td className="text-right py-3 px-2 font-mono">
                  ${parseFloat(pos.entryPx).toLocaleString()}
                </td>
                <td className="text-right py-3 px-2 font-mono">
                  {pos.leverage.value}x
                </td>
                <td
                  className={`text-right py-3 px-2 font-mono ${upnl >= 0 ? "text-green" : "text-red"}`}
                >
                  {formatPnl(upnl)}
                </td>
                <td
                  className={`text-right py-3 px-2 font-mono ${roe >= 0 ? "text-green" : "text-red"}`}
                >
                  {formatPercent(roe)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
