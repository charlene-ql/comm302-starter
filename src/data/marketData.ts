import { MarketAsset, DailyQuest, TraderBadge, LeaderboardUser } from '../types/market';

// Helper to generate simulated candlestick data around a base price
export function generateCandles(basePrice: number, count = 30, volatility = 0.015) {
  const candles = [];
  let current = basePrice * (1 - volatility * count * 0.3);
  const now = Date.now();
  const step = 60 * 1000; // 1 min intervals for simulated intraday

  for (let i = 0; i < count; i++) {
    const time = new Date(now - (count - i) * step).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const change = (Math.random() - 0.48) * (current * volatility);
    const open = current;
    const close = Math.max(0.01, open + change);
    const high = Math.max(open, close) + Math.random() * (current * volatility * 0.6);
    const low = Math.min(open, close) - Math.random() * (current * volatility * 0.6);
    const volume = Math.floor(1000 + Math.random() * 50000);

    candles.push({ time, open, high, low, close, volume });
    current = close;
  }
  return candles;
}

export const INITIAL_INDICES: MarketAsset[] = [
  {
    id: 'sp500',
    symbol: 'S&P 500',
    name: 'S&P 500 Index',
    category: 'indices',
    price: 5864.67,
    change: 23.90,
    changePercent: 0.41,
    high: 5878.10,
    low: 5845.20,
    volume: '2.84B',
    sparkline: [5840, 5846, 5842, 5855, 5850, 5860, 5858, 5864.67],
    candles: generateCandles(5864.67, 30, 0.004),
    badgeText: '500',
    badgeBg: '#E91E63',
    badgeTextColor: '#FFFFFF',
    exchange: 'INDEX',
    currency: 'USD',
    description: 'The standard gauge of large-cap US equities performance.'
  },
  {
    id: 'ndx',
    symbol: 'Nasdaq 100',
    name: 'Nasdaq 100',
    category: 'indices',
    price: 20890.12,
    change: 135.20,
    changePercent: 0.65,
    high: 20945.50,
    low: 20780.00,
    volume: '1.42B',
    sparkline: [20750, 20790, 20785, 20840, 20820, 20880, 20860, 20890.12],
    candles: generateCandles(20890.12, 30, 0.006),
    badgeText: '100',
    badgeBg: '#00897B',
    badgeTextColor: '#FFFFFF',
    exchange: 'INDEX',
    currency: 'USD',
    description: 'Leading index of top non-financial innovative technology companies.'
  },
  {
    id: 'dji',
    symbol: 'Dow 30',
    name: 'Dow Jones Industrial Average',
    category: 'indices',
    price: 43400.50,
    change: 65.10,
    changePercent: 0.15,
    high: 43490.00,
    low: 43310.20,
    volume: '380M',
    sparkline: [43320, 43350, 43330, 43380, 43370, 43410, 43390, 43400.50],
    candles: generateCandles(43400.50, 30, 0.003),
    badgeText: '30',
    badgeBg: '#00BCD4',
    badgeTextColor: '#FFFFFF',
    exchange: 'INDEX',
    currency: 'USD',
    description: 'Price-weighted index tracking 30 blue-chip American powerhouses.'
  },
  {
    id: 'rut',
    symbol: 'US 2000',
    name: 'Russell 2000 Index',
    category: 'indices',
    price: 2274.80,
    change: -5.48,
    changePercent: -0.24,
    high: 2289.40,
    low: 2268.10,
    volume: '950M',
    sparkline: [2288, 2284, 2286, 2279, 2281, 2273, 2276, 2274.80],
    candles: generateCandles(2274.80, 30, 0.005),
    badgeText: '2K',
    badgeBg: '#FF9800',
    badgeTextColor: '#FFFFFF',
    exchange: 'INDEX',
    currency: 'USD',
    description: 'The definitive benchmark for small-cap US equities.'
  }
];

export const INITIAL_US_STOCKS: MarketAsset[] = [
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    category: 'us_stocks',
    price: 138.25,
    change: 4.18,
    changePercent: 3.12,
    high: 139.80,
    low: 134.50,
    volume: '54.2M',
    marketCap: '$3.38T',
    sparkline: [134.1, 135.0, 134.8, 136.5, 137.2, 136.9, 138.25],
    candles: generateCandles(138.25, 30, 0.012),
    badgeText: 'N',
    badgeBg: '#76B900',
    badgeTextColor: '#FFFFFF',
    exchange: 'NASDAQ',
    currency: 'USD',
    peRatio: '58.4',
    description: 'World leader in artificial intelligence and GPU accelerated computing architecture.'
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    category: 'us_stocks',
    price: 269.19,
    change: -3.88,
    changePercent: -1.42,
    high: 274.60,
    low: 267.30,
    volume: '48.9M',
    marketCap: '$858B',
    sparkline: [273.5, 272.0, 274.0, 270.5, 271.2, 268.8, 269.19],
    candles: generateCandles(269.19, 30, 0.015),
    badgeText: 'T',
    badgeBg: '#E82127',
    badgeTextColor: '#FFFFFF',
    exchange: 'NASDAQ',
    currency: 'USD',
    peRatio: '64.2',
    description: 'Pioneer of electric vehicles, energy storage, and autonomous robotics technology.'
  },
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc',
    category: 'us_stocks',
    price: 231.41,
    change: 1.95,
    changePercent: 0.85,
    high: 232.80,
    low: 229.60,
    volume: '42.1M',
    marketCap: '$3.52T',
    sparkline: [229.5, 230.1, 230.0, 230.9, 231.5, 231.0, 231.41],
    candles: generateCandles(231.41, 30, 0.007),
    badgeText: '',
    badgeBg: '#131722',
    badgeTextColor: '#FFFFFF',
    exchange: 'NASDAQ',
    currency: 'USD',
    peRatio: '34.8',
    description: 'Global consumer electronics titan with an unmatched ecosystem of hardware and software.'
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon.com Inc',
    category: 'us_stocks',
    price: 186.40,
    change: 2.17,
    changePercent: 1.18,
    high: 187.90,
    low: 184.20,
    volume: '36.8M',
    marketCap: '$1.94T',
    sparkline: [184.2, 185.0, 184.7, 185.9, 186.2, 185.8, 186.40],
    candles: generateCandles(186.40, 30, 0.009),
    badgeText: 'a',
    badgeBg: '#FF9900',
    badgeTextColor: '#000000',
    exchange: 'NASDAQ',
    currency: 'USD',
    peRatio: '42.1',
    description: 'Global leader in e-commerce infrastructure, cloud computing (AWS), and digital streaming.'
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corp',
    category: 'us_stocks',
    price: 428.15,
    change: 3.06,
    changePercent: 0.72,
    high: 430.50,
    low: 425.20,
    volume: '22.4M',
    marketCap: '$3.18T',
    sparkline: [425.0, 426.2, 425.8, 427.1, 428.0, 427.4, 428.15],
    candles: generateCandles(428.15, 30, 0.006),
    badgeText: 'M',
    badgeBg: '#00A4EF',
    badgeTextColor: '#FFFFFF',
    exchange: 'NASDAQ',
    currency: 'USD',
    peRatio: '35.6',
    description: 'Dominant enterprise software, cloud infrastructure (Azure), and Copilot AI systems.'
  },
  {
    id: 'meta',
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    category: 'us_stocks',
    price: 582.40,
    change: 11.12,
    changePercent: 1.95,
    high: 586.20,
    low: 573.10,
    volume: '18.7M',
    marketCap: '$1.47T',
    sparkline: [571.2, 574.5, 573.8, 579.0, 581.2, 580.4, 582.40],
    candles: generateCandles(582.40, 30, 0.011),
    badgeText: 'M',
    badgeBg: '#0668E1',
    badgeTextColor: '#FFFFFF',
    exchange: 'NASDAQ',
    currency: 'USD',
    peRatio: '28.4',
    description: 'World-connecting social network conglomerate, Llama open source AI pioneer, and metaverse lab.'
  }
];

export const INITIAL_WORLD_INDICES: MarketAsset[] = [
  {
    id: 'dax',
    symbol: 'DAX',
    name: 'Germany 40',
    category: 'world_stocks',
    price: 19462.80,
    change: 71.60,
    changePercent: 0.37,
    high: 19520.00,
    low: 19390.40,
    volume: '85M',
    sparkline: [19390, 19410, 19400, 19445, 19430, 19462.80],
    candles: generateCandles(19462.80, 30, 0.004),
    flag: '🇩🇪',
    exchange: 'XETRA',
    currency: 'EUR',
    description: 'Premier German benchmark tracking 40 major blue-chip equities traded on the Frankfurt Stock Exchange.'
  },
  {
    id: 'ftse',
    symbol: 'FTSE 100',
    name: 'UK 100 Index',
    category: 'world_stocks',
    price: 8247.16,
    change: -11.54,
    changePercent: -0.14,
    high: 8275.40,
    low: 8230.10,
    volume: '620M',
    sparkline: [8265, 8258, 8262, 8250, 8253, 8247.16],
    candles: generateCandles(8247.16, 30, 0.003),
    flag: '🇬🇧',
    exchange: 'LSE',
    currency: 'GBP',
    description: 'Benchmark share index of the 100 highest market capitalization companies on the London Stock Exchange.'
  },
  {
    id: 'n225',
    symbol: 'Nikkei 225',
    name: 'Japan 225',
    category: 'world_stocks',
    price: 38981.75,
    change: 549.60,
    changePercent: 1.43,
    high: 39120.00,
    low: 38500.00,
    volume: '1.2B',
    sparkline: [38450, 38620, 38580, 38890, 38920, 38981.75],
    candles: generateCandles(38981.75, 30, 0.008),
    flag: '🇯🇵',
    exchange: 'JPX',
    currency: 'JPY',
    description: 'Price-weighted stock market index for the Tokyo Stock Exchange.'
  },
  {
    id: 'hsi',
    symbol: 'HSI',
    name: 'Hang Seng Index',
    category: 'world_stocks',
    price: 20590.15,
    change: 100.40,
    changePercent: 0.49,
    high: 20740.00,
    low: 20450.00,
    volume: '1.8B',
    sparkline: [20480, 20540, 20510, 20570, 20550, 20590.15],
    candles: generateCandles(20590.15, 30, 0.007),
    flag: '🇭🇰',
    exchange: 'HKEX',
    currency: 'HKD',
    description: 'Freefloat-adjusted market-capitalization-weighted stock-market index in Hong Kong.'
  },
  {
    id: 'cac40',
    symbol: 'CAC 40',
    name: 'France 40 Index',
    category: 'world_stocks',
    price: 7542.20,
    change: 21.10,
    changePercent: 0.28,
    high: 7568.00,
    low: 7515.00,
    volume: '110M',
    sparkline: [7520, 7530, 7525, 7545, 7538, 7542.20],
    candles: generateCandles(7542.20, 30, 0.004),
    flag: '🇫🇷',
    exchange: 'EURONEXT',
    currency: 'EUR',
    description: 'Benchmark French stock market index representing the Euronext Paris.'
  }
];

export const INITIAL_CRYPTO: MarketAsset[] = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    category: 'crypto',
    price: 68430.10,
    change: 1565.40,
    changePercent: 2.34,
    high: 68980.00,
    low: 66820.00,
    volume: '$38.2B',
    marketCap: '$1.35T',
    sparkline: [66800, 67200, 67100, 67950, 68100, 68430.10],
    candles: generateCandles(68430.10, 30, 0.015),
    icon: '₿',
    badgeBg: '#F7931A',
    badgeTextColor: '#FFFFFF',
    exchange: 'CRYPTO',
    currency: 'USD',
    description: 'The premier decentralized digital currency and global store of value.'
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    category: 'crypto',
    price: 2642.50,
    change: 30.10,
    changePercent: 1.15,
    high: 2680.00,
    low: 2605.00,
    volume: '$19.4B',
    marketCap: '$318B',
    sparkline: [2610, 2625, 2618, 2638, 2635, 2642.50],
    candles: generateCandles(2642.50, 30, 0.014),
    icon: 'Ξ',
    badgeBg: '#627EEA',
    badgeTextColor: '#FFFFFF',
    exchange: 'CRYPTO',
    currency: 'USD',
    description: 'Decentralized open-source blockchain with smart contract and rollups functionality.'
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    category: 'crypto',
    price: 165.70,
    change: 7.62,
    changePercent: 4.82,
    high: 168.40,
    low: 157.20,
    volume: '$5.8B',
    marketCap: '$77.8B',
    sparkline: [157.5, 160.2, 159.0, 163.5, 164.1, 165.70],
    candles: generateCandles(165.70, 30, 0.022),
    icon: '◎',
    badgeBg: '#000000',
    badgeTextColor: '#14F195',
    exchange: 'CRYPTO',
    currency: 'USD',
    description: 'Ultra-fast Layer-1 blockchain engineered for high-throughput consumer dApps and finance.'
  },
  {
    id: 'xrp',
    symbol: 'XRP',
    name: 'XRP',
    category: 'crypto',
    price: 0.5420,
    change: -0.0042,
    changePercent: -0.78,
    high: 0.5510,
    low: 0.5380,
    volume: '$1.4B',
    marketCap: '$30.7B',
    sparkline: [0.550, 0.548, 0.549, 0.544, 0.545, 0.5420],
    candles: generateCandles(0.5420, 30, 0.01),
    icon: '✕',
    badgeBg: '#23292F',
    badgeTextColor: '#FFFFFF',
    exchange: 'CRYPTO',
    currency: 'USD',
    description: 'Digital asset created for global cross-border payments and remittance settlement.'
  }
];

export const INITIAL_FUTURES_COMMODITIES: MarketAsset[] = [
  {
    id: 'gold',
    symbol: 'GOLD',
    name: 'Gold Spot / US Dollar',
    category: 'futures',
    price: 2658.40,
    change: 13.80,
    changePercent: 0.52,
    high: 2664.20,
    low: 2642.00,
    volume: '210K',
    sparkline: [2645, 2649, 2652, 2655, 2658.40],
    candles: generateCandles(2658.40, 30, 0.004),
    badgeText: 'Au',
    badgeBg: '#D4AF37',
    badgeTextColor: '#000000',
    exchange: 'COMMODITIES',
    currency: 'USD',
    description: 'Global physical precious metal benchmark and monetary haven.'
  },
  {
    id: 'crude',
    symbol: 'OIL_CRUDE',
    name: 'WTI Crude Oil',
    category: 'futures',
    price: 71.25,
    change: -0.83,
    changePercent: -1.15,
    high: 72.40,
    low: 70.80,
    volume: '480K',
    sparkline: [72.3, 72.0, 71.8, 71.5, 71.25],
    candles: generateCandles(71.25, 30, 0.012),
    badgeText: '🛢️',
    badgeBg: '#333333',
    badgeTextColor: '#FFFFFF',
    exchange: 'NYMEX',
    currency: 'USD',
    description: 'Light sweet crude oil contract traded on the New York Mercantile Exchange.'
  },
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'forex',
    price: 1.0852,
    change: 0.0013,
    changePercent: 0.12,
    high: 1.0870,
    low: 1.0835,
    volume: '1.2M',
    sparkline: [1.0840, 1.0845, 1.0848, 1.0850, 1.0852],
    candles: generateCandles(1.0852, 30, 0.002),
    badgeText: '€/$',
    badgeBg: '#0A3B7C',
    badgeTextColor: '#FFFFFF',
    exchange: 'FX',
    currency: 'USD',
    description: 'The highest-volume foreign exchange currency pair in global financial markets.'
  },
  {
    id: 'us10y',
    symbol: 'US10Y',
    name: 'US 10-Year Treasury Yield',
    category: 'bonds',
    price: 4.08,
    change: 0.02,
    changePercent: 0.49,
    high: 4.11,
    low: 4.04,
    volume: 'Gov',
    sparkline: [4.05, 4.06, 4.07, 4.06, 4.08],
    candles: generateCandles(4.08, 30, 0.005),
    badgeText: '10Y',
    badgeBg: '#1B5E20',
    badgeTextColor: '#FFFFFF',
    exchange: 'BOND',
    currency: '%',
    description: 'The global risk-free rate benchmark for fixed-income yields and cost of capital.'
  }
];

export const ALL_ASSETS: MarketAsset[] = [
  ...INITIAL_INDICES,
  ...INITIAL_US_STOCKS,
  ...INITIAL_WORLD_INDICES,
  ...INITIAL_CRYPTO,
  ...INITIAL_FUTURES_COMMODITIES
];

export const INITIAL_QUESTS: DailyQuest[] = [
  {
    id: 'quest_inspect_charts',
    title: 'Chart Inspector',
    description: 'Open and inspect 3 different asset charts to uncover trend setups.',
    rewardXP: 100,
    rewardCash: 500,
    progress: 0,
    target: 3,
    completed: false,
    claimed: false
  },
  {
    id: 'quest_first_trade',
    title: 'Paper Pioneer',
    description: 'Execute at least 1 paper trading Buy or Sell position.',
    rewardXP: 150,
    rewardCash: 1000,
    progress: 0,
    target: 1,
    completed: false,
    claimed: false
  },
  {
    id: 'quest_predict_trend',
    title: 'Trend Oracle',
    description: 'Place 1 Bull or Bear rapid prediction on any stock or crypto.',
    rewardXP: 200,
    rewardCash: 750,
    progress: 0,
    target: 1,
    completed: false,
    claimed: false
  },
  {
    id: 'quest_world_macro',
    title: 'Global Macro View',
    description: 'Filter or inspect assets across 3 different market categories.',
    rewardXP: 120,
    rewardCash: 600,
    progress: 0,
    target: 3,
    completed: false,
    claimed: false
  }
];

export const INITIAL_BADGES: TraderBadge[] = [
  {
    id: 'badge_first_trade',
    name: 'Market Debutant',
    description: 'Executed your first paper trade order.',
    icon: '🎯',
    unlocked: false
  },
  {
    id: 'badge_streak_2',
    name: 'Hot Hands',
    description: 'Achieved a consecutive 2-win streak in rapid market predictions.',
    icon: '🔥',
    unlocked: false
  },
  {
    id: 'badge_diamond_hands',
    name: 'Diamond Hands',
    description: 'Realized a green profitable trade with +$1,000 or more in P&L.',
    icon: '💎',
    unlocked: false
  },
  {
    id: 'badge_crypto_degen',
    name: 'Crypto Sage',
    description: 'Traded or predicted Bitcoin or Solana market moves.',
    icon: '⚡',
    unlocked: false
  },
  {
    id: 'badge_master_chartist',
    name: 'Master Chartist',
    description: 'Reached Trader Level 3 and reviewed over 10 asset candles.',
    icon: '🏆',
    unlocked: false
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'SatoshiScalper',
    avatar: '🦊',
    title: 'Alpha Wizard',
    portfolioValue: 148920.50,
    weeklyReturnPercent: 48.9,
    winStreak: 7,
    level: 12
  },
  {
    rank: 2,
    name: 'BullishWhale_99',
    avatar: '🐋',
    title: 'Macro Titan',
    portfolioValue: 132450.00,
    weeklyReturnPercent: 32.4,
    winStreak: 5,
    level: 9
  },
  {
    rank: 3,
    name: 'DeltaHedger',
    avatar: '🦅',
    title: 'Quant Master',
    portfolioValue: 124800.20,
    weeklyReturnPercent: 24.8,
    winStreak: 4,
    level: 8
  },
  {
    rank: 4,
    name: 'You (Paper Trader)',
    avatar: '⭐',
    title: 'Novice Chartist',
    portfolioValue: 100000.00,
    weeklyReturnPercent: 0.0,
    winStreak: 0,
    level: 1,
    isCurrentUser: true
  },
  {
    rank: 5,
    name: 'CandleSniper',
    avatar: '🎯',
    title: 'Tape Reader',
    portfolioValue: 98400.00,
    weeklyReturnPercent: -1.6,
    winStreak: 2,
    level: 6
  }
];
