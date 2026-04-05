import type {
  ClearinghouseState,
  Fill,
  Portfolio,
  PortfolioPerformance,
  LeaderboardRow,
  TraderStats,
} from "./types";

const API_URL = "https://api.hyperliquid.xyz/info";

async function hlPost<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`HL API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getClearinghouseState(
  address: string
): Promise<ClearinghouseState> {
  return hlPost({ type: "clearinghouseState", user: address });
}

export async function getPortfolio(address: string): Promise<Portfolio> {
  const raw = await hlPost<[string, PortfolioPerformance][]>({
    type: "portfolio",
    user: address,
  });
  // API returns array of [key, value] pairs — convert to object
  const portfolio: Record<string, PortfolioPerformance> = {};
  for (const [key, val] of raw) {
    portfolio[key] = val;
  }
  return portfolio as unknown as Portfolio;
}

export async function getUserFills(
  address: string,
  startTime?: number
): Promise<Fill[]> {
  if (startTime) {
    return hlPost({
      type: "userFillsByTime",
      user: address,
      startTime,
      aggregateByTime: true,
    });
  }
  return hlPost({ type: "userFills", user: address });
}

export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  const res = await fetch("https://stats-data.hyperliquid.xyz/Mainnet/leaderboard", {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Leaderboard API error: ${res.status}`);
  const data = await res.json();
  return data.leaderboardRows;
}

export interface ParsedLeaderboardRow {
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
}

function parsePerf(
  row: LeaderboardRow,
  window: string
): { pnl: number; roi: number; vlm: number } {
  const wp = row.windowPerformances.find((w) => w[0] === window);
  if (!wp) return { pnl: 0, roi: 0, vlm: 0 };
  return {
    pnl: parseFloat(wp[1].pnl),
    roi: parseFloat(wp[1].roi) * 100,
    vlm: parseFloat(wp[1].vlm),
  };
}

export function parseLeaderboard(rows: LeaderboardRow[]): ParsedLeaderboardRow[] {
  return rows.map((row, i) => {
    const day = parsePerf(row, "day");
    const week = parsePerf(row, "week");
    const month = parsePerf(row, "month");
    const allTime = parsePerf(row, "allTime");
    return {
      rank: i + 1,
      address: row.ethAddress,
      displayName: row.displayName,
      accountValue: parseFloat(row.accountValue),
      dayPnl: day.pnl,
      dayRoi: day.roi,
      weekPnl: week.pnl,
      weekRoi: week.roi,
      monthPnl: month.pnl,
      monthRoi: month.roi,
      allTimePnl: allTime.pnl,
      allTimeRoi: allTime.roi,
      allTimeVolume: allTime.vlm,
    };
  });
}

function computeWinRate(fills: Fill[]): {
  winRate: number;
  totalTrades: number;
  bestTrade: number;
  worstTrade: number;
} {
  const closingFills = fills.filter((f) => parseFloat(f.closedPnl) !== 0);
  if (closingFills.length === 0) {
    return { winRate: 0, totalTrades: 0, bestTrade: 0, worstTrade: 0 };
  }
  const wins = closingFills.filter((f) => parseFloat(f.closedPnl) > 0).length;
  const pnls = closingFills.map((f) => parseFloat(f.closedPnl));
  return {
    winRate: (wins / closingFills.length) * 100,
    totalTrades: closingFills.length,
    bestTrade: Math.max(...pnls),
    worstTrade: Math.min(...pnls),
  };
}

export async function getTraderStats(address: string): Promise<TraderStats> {
  const [clearinghouse, portfolio, fills] = await Promise.all([
    getClearinghouseState(address),
    getPortfolio(address),
    getUserFills(address),
  ]);

  const accountValue = parseFloat(clearinghouse.marginSummary.accountValue);
  const positions = clearinghouse.assetPositions
    .map((a) => a.position)
    .filter((p) => parseFloat(p.szi) !== 0);

  const allTime = portfolio.allTime;
  const totalPnl = allTime.pnlHistory.length
    ? parseFloat(allTime.pnlHistory[allTime.pnlHistory.length - 1][1])
    : 0;
  const totalVolume = parseFloat(allTime.vlm || "0");

  const equityCurve: [number, number][] = allTime.accountValueHistory.map(
    ([ts, val]) => [ts, parseFloat(val)]
  );
  const pnlCurve: [number, number][] = allTime.pnlHistory.map(([ts, val]) => [
    ts,
    parseFloat(val),
  ]);

  const { winRate, totalTrades, bestTrade, worstTrade } = computeWinRate(fills);

  const avgTradeSize =
    fills.length > 0
      ? fills.reduce((sum, f) => sum + parseFloat(f.sz) * parseFloat(f.px), 0) /
        fills.length
      : 0;

  const dayPnl = portfolio.day.pnlHistory.length
    ? parseFloat(
        portfolio.day.pnlHistory[portfolio.day.pnlHistory.length - 1][1]
      )
    : 0;
  const weekPnl = portfolio.week.pnlHistory.length
    ? parseFloat(
        portfolio.week.pnlHistory[portfolio.week.pnlHistory.length - 1][1]
      )
    : 0;
  const monthPnl = portfolio.month.pnlHistory.length
    ? parseFloat(
        portfolio.month.pnlHistory[portfolio.month.pnlHistory.length - 1][1]
      )
    : 0;

  return {
    address,
    accountValue,
    totalPnl,
    totalVolume,
    winRate,
    totalTrades,
    avgTradeSize,
    bestTrade,
    worstTrade,
    positions,
    equityCurve,
    pnlCurve,
    recentFills: fills.slice(0, 50),
    dayPnl,
    weekPnl,
    monthPnl,
  };
}
