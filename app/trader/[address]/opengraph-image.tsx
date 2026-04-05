import { ImageResponse } from "next/og";
import { getTraderStats } from "@/lib/hyperliquid";
import {
  shortenAddress,
  formatUsd,
  formatPnl,
  formatPercent,
} from "@/lib/utils";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;

  let stats;
  try {
    stats = await getTraderStats(address);
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            background: "#080a0e",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#e4e8ed",
            fontSize: 48,
            fontFamily: "monospace",
          }}
        >
          HyperScore
        </div>
      ),
      { ...size }
    );
  }

  const pnlColor = stats.totalPnl >= 0 ? "#22d68a" : "#ef4444";
  const dayPnlColor = stats.dayPnl >= 0 ? "#22d68a" : "#ef4444";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#080a0e",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          fontFamily: "monospace",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div style={{ color: "#22d68a", fontSize: 36, fontWeight: "bold" }}>
            HyperScore
          </div>
          <div style={{ color: "#5a6a7e", fontSize: 24 }}>
            {shortenAddress(address)}
          </div>
        </div>

        {/* Main PnL */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              color: "#5a6a7e",
              fontSize: 18,
              marginBottom: "8px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            All-Time PnL
          </div>
          <div style={{ color: pnlColor, fontSize: 72, fontWeight: "bold" }}>
            {formatPnl(stats.totalPnl)}
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "60px",
            marginTop: "auto",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: "#5a6a7e",
                fontSize: 14,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Account Value
            </div>
            <div
              style={{ color: "#e4e8ed", fontSize: 28, fontWeight: "bold" }}
            >
              {formatUsd(stats.accountValue)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: "#5a6a7e",
                fontSize: 14,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Win Rate
            </div>
            <div
              style={{ color: "#e4e8ed", fontSize: 28, fontWeight: "bold" }}
            >
              {formatPercent(stats.winRate).replace("+", "")}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: "#5a6a7e",
                fontSize: 14,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              24H PnL
            </div>
            <div
              style={{ color: dayPnlColor, fontSize: 28, fontWeight: "bold" }}
            >
              {formatPnl(stats.dayPnl)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: "#5a6a7e",
                fontSize: 14,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Trades
            </div>
            <div
              style={{ color: "#e4e8ed", fontSize: 28, fontWeight: "bold" }}
            >
              {stats.totalTrades.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
