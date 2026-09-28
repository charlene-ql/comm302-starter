export type MarketCategory =
  | 'us_stocks'
  | 'world_stocks'
  | 'crypto'
  | 'futures'
  | 'forex'
  | 'indices'
  | 'bonds'
  | 'etfs'
  | 'economy';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
  marketCap?: string;
  sparkline: number[];
  candles: CandleData[];
  badgeText?: string;
  badgeBg?: string;
  badgeTextColor?: string;
  flag?: string;
  icon?: string;
  exchange?: string;
  currency?: string;
  peRatio?: string;
  description?: string;
}

export interface PaperPosition {
  id: string;
  symbol: string;
  name: string;
  side: 'BUY' | 'SELL';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  openTime: number;
  takeProfit?: number;
  stopLoss?: number;
}

export interface ClosedTrade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  shares: number;
  entryPrice: number;
  closePrice: number;
  pnl: number;
  pnlPercent: number;
  closeTime: number;
}

export interface Prediction {
  id: string;
  symbol: string;
  name: string;
  direction: 'BULL' | 'BEAR';
  startPrice: number;
  currentPrice: number;
  startTime: number;
  durationSeconds: number;
  stakeXP: number;
  potentialRewardXP: number;
  potentialRewardCash: number;
  status: 'PENDING' | 'WON' | 'LOST';
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  rewardXP: number;
  rewardCash: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
}

export interface TraderBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  title: string;
  portfolioValue: number;
  weeklyReturnPercent: number;
  winStreak: number;
  level: number;
  isCurrentUser?: boolean;
}
