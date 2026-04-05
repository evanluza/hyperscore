export interface Position {
  coin: string;
  szi: string;
  entryPx: string;
  positionValue: string;
  unrealizedPnl: string;
  returnOnEquity: string;
  leverage: { type: string; value: number };
  liquidationPx: string | null;
}

export interface MarginSummary {
  accountValue: string;
  totalNtlPos: string;
  totalRawUsd: string;
  totalMarginUsed: string;
}

export interface ClearinghouseState {
  marginSummary: MarginSummary;
  crossMarginSummary: MarginSummary;
  assetPositions: { type: string; position: Position }[];
}

export interface Fill {
  coin: string;
  px: string;
  sz: string;
  side: string;
  time: number;
  closedPnl: string;
  dir: string;
  crossed: boolean;
  fee: string;
  hash: string;
  tid: number;
}

export interface PortfolioPerformance {
  accountValueHistory: [number, string][];
  pnlHistory: [number, string][];
  vlm: string;
}

export interface Portfolio {
  day: PortfolioPerformance;
  week: PortfolioPerformance;
  month: PortfolioPerformance;
  allTime: PortfolioPerformance;
  perpDay: PortfolioPerformance;
  perpWeek: PortfolioPerformance;
  perpMonth: PortfolioPerformance;
  perpAllTime: PortfolioPerformance;
}

export interface LeaderboardRow {
  ethAddress: string;
  accountValue: string;
  displayName: string | null;
  windowPerformances: [
    string,
    { pnl: string; roi: string; vlm: string }
  ][];
  prize: number;
}

export interface TraderStats {
  address: string;
  accountValue: number;
  totalPnl: number;
  totalVolume: number;
  winRate: number;
  totalTrades: number;
  avgTradeSize: number;
  bestTrade: number;
  worstTrade: number;
  positions: Position[];
  equityCurve: [number, number][];
  pnlCurve: [number, number][];
  recentFills: Fill[];
  dayPnl: number;
  weekPnl: number;
  monthPnl: number;
}
