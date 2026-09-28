import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  MarketAsset,
  PaperPosition,
  ClosedTrade,
  Prediction,
  DailyQuest,
  TraderBadge,
  LeaderboardUser,
  MarketCategory
} from '../types/market';
import {
  ALL_ASSETS,
  INITIAL_QUESTS,
  INITIAL_BADGES,
  INITIAL_LEADERBOARD
} from '../data/marketData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error' | 'badge';
  title: string;
  message: string;
}

interface GameContextType {
  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Assets
  assets: MarketAsset[];
  selectedCategory: MarketCategory | 'all';
  setSelectedCategory: (cat: MarketCategory | 'all') => void;
  selectedAsset: MarketAsset | null;
  setSelectedAsset: (asset: MarketAsset | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Portfolio & Paper Trading
  paperCash: number;
  portfolioValue: number;
  unrealizedPnL: number;
  realizedPnL: number;
  openPositions: PaperPosition[];
  closedTrades: ClosedTrade[];
  executeTrade: (symbol: string, side: 'BUY' | 'SELL', shares: number, takeProfit?: number, stopLoss?: number) => boolean;
  closePosition: (positionId: string) => void;
  resetPortfolio: () => void;

  // Predictions (Bull vs Bear)
  predictions: Prediction[];
  createPrediction: (symbol: string, direction: 'BULL' | 'BEAR', durationSeconds?: number) => void;

  // Gamification Stats
  xp: number;
  level: number;
  rankTitle: string;
  streak: number;
  addXP: (amount: number, reason?: string) => void;
  quests: DailyQuest[];
  claimQuestReward: (questId: string) => void;
  badges: TraderBadge[];
  leaderboard: LeaderboardUser[];

  // Active Modals & Drawers
  isPortfolioOpen: boolean;
  setIsPortfolioOpen: (open: boolean) => void;
  isLeaderboardOpen: boolean;
  setIsLeaderboardOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Feedback Toasts
  toasts: Toast[];
  removeToast: (id: string) => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const RANKS = [
  { minLevel: 1, title: 'Novice Chartist' },
  { minLevel: 2, title: 'Tape Reader' },
  { minLevel: 3, title: 'Breakout Hunter' },
  { minLevel: 4, title: 'Swing Master' },
  { minLevel: 5, title: 'Macro Titan' },
  { minLevel: 6, title: 'Alpha Wizard' }
];

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('tv_theme');
    return saved ? saved === 'dark' : false; // Default to TradingView pristine light mode as requested in screenshot
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('tv_theme', next ? 'dark' : 'light');
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Market Assets with subtle live price fluctuation simulation
  const [assets, setAssets] = useState<MarketAsset[]>(() => {
    const saved = localStorage.getItem('tv_assets');
    return saved ? JSON.parse(saved) : ALL_ASSETS;
  });

  const [selectedCategory, setSelectedCategory] = useState<MarketCategory | 'all'>('all');
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Paper Trading state
  const [paperCash, setPaperCash] = useState<number>(() => {
    const saved = localStorage.getItem('tv_paper_cash');
    return saved ? parseFloat(saved) : 100000.0;
  });

  const [openPositions, setOpenPositions] = useState<PaperPosition[]>(() => {
    const saved = localStorage.getItem('tv_positions');
    return saved ? JSON.parse(saved) : [];
  });

  const [closedTrades, setClosedTrades] = useState<ClosedTrade[]>(() => {
    const saved = localStorage.getItem('tv_closed_trades');
    return saved ? JSON.parse(saved) : [];
  });

  // Predictions state
  const [predictions, setPredictions] = useState<Prediction[]>(() => {
    const saved = localStorage.getItem('tv_predictions');
    return saved ? JSON.parse(saved) : [];
  });

  // Gamification progression
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('tv_xp');
    return saved ? parseInt(saved, 10) : 150;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('tv_streak');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [quests, setQuests] = useState<DailyQuest[]>(() => {
    const saved = localStorage.getItem('tv_quests');
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  const [badges, setBadges] = useState<TraderBadge[]>(() => {
    const saved = localStorage.getItem('tv_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);

  // Modals & Drawers
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Derive level and rank
  // Formula: Level = Math.floor(xp / 400) + 1
  const level = Math.floor(xp / 400) + 1;
  const rankObj = [...RANKS].reverse().find((r) => level >= r.minLevel) || RANKS[0];
  const rankTitle = rankObj.title;

  const addXP = (amount: number, reason?: string) => {
    setXp((prev) => {
      const next = prev + amount;
      localStorage.setItem('tv_xp', next.toString());
      return next;
    });

    if (reason) {
      showToast({
        type: 'success',
        title: `+${amount} XP Earned!`,
        message: reason
      });
    }
  };

  // Unlock badge helper
  const unlockBadge = (badgeId: string) => {
    setBadges((prev) => {
      const found = prev.find((b) => b.id === badgeId);
      if (found && !found.unlocked) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
        showToast({
          type: 'badge',
          title: `Badge Unlocked: ${found.name} ${found.icon}`,
          message: found.description
        });
        addXP(250, `Unlocked Badge: ${found.name}`);
        const updated = prev.map((b) => (b.id === badgeId ? { ...b, unlocked: true, unlockedAt: Date.now() } : b));
        localStorage.setItem('tv_badges', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  // Update quests progress helper
  const updateQuestProgress = (questId: string, increment = 1) => {
    setQuests((prev) => {
      const updated = prev.map((q) => {
        if (q.id === questId && !q.completed) {
          const newProgress = Math.min(q.target, q.progress + increment);
          const completed = newProgress >= q.target;
          if (completed && !q.completed) {
            showToast({
              type: 'success',
              title: `Quest Completed: ${q.title}!`,
              message: 'Claim your XP & bonus paper funds in the Quests panel.'
            });
          }
          return { ...q, progress: newProgress, completed };
        }
        return q;
      });
      localStorage.setItem('tv_quests', JSON.stringify(updated));
      return updated;
    });
  };

  const claimQuestReward = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return;

    addXP(quest.rewardXP, `Claimed reward for ${quest.title}`);
    setPaperCash((prev) => {
      const next = prev + quest.rewardCash;
      localStorage.setItem('tv_paper_cash', next.toString());
      return next;
    });

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 }
    });

    setQuests((prev) => {
      const next = prev.map((q) => (q.id === questId ? { ...q, claimed: true } : q));
      localStorage.setItem('tv_quests', JSON.stringify(next));
      return next;
    });
  };

  // Simulated live ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) => {
        // Randomly pick 2 assets to fluctuate realistically
        const nextAssets = prevAssets.map((asset) => {
          if (Math.random() > 0.4) return asset; // only update some assets each tick

          const volatility = asset.category === 'crypto' ? 0.002 : 0.0008;
          const delta = (Math.random() - 0.49) * (asset.price * volatility);
          const newPrice = Math.max(0.01, +(asset.price + delta).toFixed(asset.price < 2 ? 4 : 2));
          const newChange = +(newPrice - (asset.price - asset.change)).toFixed(2);
          const prevBase = asset.price - asset.change;
          const newChangePercent = +((newChange / (prevBase || 1)) * 100).toFixed(2);

          // Update sparkline
          const newSparkline = [...asset.sparkline.slice(1), newPrice];

          return {
            ...asset,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            sparkline: newSparkline,
            high: Math.max(asset.high, newPrice),
            low: Math.min(asset.low, newPrice)
          };
        });

        localStorage.setItem('tv_assets', JSON.stringify(nextAssets));
        return nextAssets;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Update open positions when asset prices change
  useEffect(() => {
    setOpenPositions((prevPositions) => {
      let changed = false;
      const updated = prevPositions.map((pos) => {
        const matchingAsset = assets.find((a) => a.symbol === pos.symbol);
        if (matchingAsset && matchingAsset.price !== pos.currentPrice) {
          changed = true;
          return { ...pos, currentPrice: matchingAsset.price };
        }
        return pos;
      });

      if (changed) {
        localStorage.setItem('tv_positions', JSON.stringify(updated));
        return updated;
      }
      return prevPositions;
    });
  }, [assets]);

  // Handle active predictions countdown and resolution
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setPredictions((prevPredictions) => {
        let changed = false;
        const updated: Prediction[] = prevPredictions.map((pred): Prediction => {
          if (pred.status !== 'PENDING') return pred;

          const currentAsset = assets.find((a) => a.symbol === pred.symbol);
          const curPrice = currentAsset ? currentAsset.price : pred.startPrice;
          const elapsed = (now - pred.startTime) / 1000;

          if (elapsed >= pred.durationSeconds) {
            changed = true;
            const won =
              (pred.direction === 'BULL' && curPrice >= pred.startPrice) ||
              (pred.direction === 'BEAR' && curPrice <= pred.startPrice);

            if (won) {
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 }
              });
              setStreak((s) => {
                const nextS = s + 1;
                localStorage.setItem('tv_streak', nextS.toString());
                if (nextS >= 2) unlockBadge('badge_streak_2');
                return nextS;
              });
              addXP(pred.potentialRewardXP, `Correct ${pred.direction} call on ${pred.symbol}!`);
              setPaperCash((cash) => {
                const next = cash + pred.potentialRewardCash;
                localStorage.setItem('tv_paper_cash', next.toString());
                return next;
              });
              showToast({
                type: 'success',
                title: `Prediction WON! 🎯`,
                message: `You accurately called ${pred.symbol} ${pred.direction}. Won $${pred.potentialRewardCash} & +${pred.potentialRewardXP} XP!`
              });
            } else {
              setStreak(0);
              localStorage.setItem('tv_streak', '0');
              addXP(25, `Prediction closed on ${pred.symbol}`);
              showToast({
                type: 'error',
                title: `Prediction Ended`,
                message: `${pred.symbol} didn't move ${pred.direction}. Consolation +25 XP awarded.`
              });
            }

            return {
              ...pred,
              currentPrice: curPrice,
              status: won ? 'WON' : 'LOST'
            };
          }

          return { ...pred, currentPrice: curPrice };
        });

        if (changed) {
          localStorage.setItem('tv_predictions', JSON.stringify(updated));
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assets]);

  // Portfolio calculations
  const unrealizedPnL = openPositions.reduce((acc, pos) => {
    const diff = pos.side === 'BUY' ? pos.currentPrice - pos.entryPrice : pos.entryPrice - pos.currentPrice;
    return acc + diff * pos.shares;
  }, 0);

  const totalPositionsValue = openPositions.reduce((acc, pos) => acc + pos.currentPrice * pos.shares, 0);
  const portfolioValue = +(paperCash + totalPositionsValue + unrealizedPnL).toFixed(2);
  const realizedPnL = closedTrades.reduce((acc, trade) => acc + trade.pnl, 0);

  // Sync current user portfolio in leaderboard
  useEffect(() => {
    setLeaderboard((prev) => {
      const returnPct = +(((portfolioValue - 100000) / 100000) * 100).toFixed(1);
      return prev.map((user) => {
        if (user.isCurrentUser) {
          return {
            ...user,
            portfolioValue,
            weeklyReturnPercent: returnPct,
            winStreak: streak,
            level
          };
        }
        return user;
      });
    });
  }, [portfolioValue, streak, level]);

  // Execute paper trading order
  const executeTrade = (
    symbol: string,
    side: 'BUY' | 'SELL',
    shares: number,
    takeProfit?: number,
    stopLoss?: number
  ) => {
    const asset = assets.find((a) => a.symbol === symbol);
    if (!asset || shares <= 0) return false;

    const totalCost = asset.price * shares;
    if (side === 'BUY' && totalCost > paperCash) {
      showToast({
        type: 'error',
        title: 'Insufficient Paper Cash',
        message: `Order requires $${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}, but balance is $${paperCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`
      });
      return false;
    }

    const newPosition: PaperPosition = {
      id: Math.random().toString(36).substring(2, 9),
      symbol: asset.symbol,
      name: asset.name,
      side,
      shares,
      entryPrice: asset.price,
      currentPrice: asset.price,
      openTime: Date.now(),
      takeProfit,
      stopLoss
    };

    setPaperCash((cash) => {
      const next = side === 'BUY' ? cash - totalCost : cash;
      localStorage.setItem('tv_paper_cash', next.toString());
      return next;
    });

    setOpenPositions((prev) => {
      const next = [newPosition, ...prev];
      localStorage.setItem('tv_positions', JSON.stringify(next));
      return next;
    });

    addXP(75, `Placed ${side} order on ${asset.symbol}`);
    updateQuestProgress('quest_first_trade');
    unlockBadge('badge_first_trade');

    if (asset.symbol === 'BTC' || asset.symbol === 'SOL') {
      unlockBadge('badge_crypto_degen');
    }

    showToast({
      type: 'success',
      title: `Order Executed: ${side} ${shares} ${symbol}`,
      message: `Filled at $${asset.price.toLocaleString()} · Paper Position active.`
    });

    return true;
  };

  const closePosition = (positionId: string) => {
    const position = openPositions.find((p) => p.id === positionId);
    if (!position) return;

    const asset = assets.find((a) => a.symbol === position.symbol);
    const closePrice = asset ? asset.price : position.currentPrice;
    const diff = position.side === 'BUY' ? closePrice - position.entryPrice : position.entryPrice - closePrice;
    const pnl = +(diff * position.shares).toFixed(2);
    const pnlPercent = +((diff / position.entryPrice) * 100).toFixed(2);

    const closedTrade: ClosedTrade = {
      id: Math.random().toString(36).substring(2, 9),
      symbol: position.symbol,
      side: position.side,
      shares: position.shares,
      entryPrice: position.entryPrice,
      closePrice,
      pnl,
      pnlPercent,
      closeTime: Date.now()
    };

    // Return funds
    setPaperCash((cash) => {
      const returnedValue = position.side === 'BUY' ? closePrice * position.shares : pnl;
      const next = cash + (position.side === 'BUY' ? returnedValue : (position.entryPrice * position.shares) + pnl);
      localStorage.setItem('tv_paper_cash', next.toString());
      return next;
    });

    setOpenPositions((prev) => {
      const next = prev.filter((p) => p.id !== positionId);
      localStorage.setItem('tv_positions', JSON.stringify(next));
      return next;
    });

    setClosedTrades((prev) => {
      const next = [closedTrade, ...prev];
      localStorage.setItem('tv_closed_trades', JSON.stringify(next));
      return next;
    });

    if (pnl > 0) {
      addXP(100, `Profitable close on ${position.symbol}: +$${pnl.toFixed(2)}`);
      if (pnl >= 1000) unlockBadge('badge_diamond_hands');
      showToast({
        type: 'success',
        title: `Position Closed: +$${pnl.toLocaleString()}`,
        message: `Realized profit of +${pnlPercent}% on ${position.symbol}!`
      });
    } else {
      addXP(30, `Closed position on ${position.symbol}`);
      showToast({
        type: 'info',
        title: `Position Closed`,
        message: `Realized P&L: $${pnl.toLocaleString()} on ${position.symbol}.`
      });
    }
  };

  const resetPortfolio = () => {
    setPaperCash(100000.0);
    setOpenPositions([]);
    setClosedTrades([]);
    localStorage.setItem('tv_paper_cash', '100000');
    localStorage.setItem('tv_positions', '[]');
    localStorage.setItem('tv_closed_trades', '[]');
    showToast({
      type: 'info',
      title: 'Portfolio Reset',
      message: 'Paper trading balance restored to $100,000.00.'
    });
  };

  const createPrediction = (symbol: string, direction: 'BULL' | 'BEAR', durationSeconds = 30) => {
    const asset = assets.find((a) => a.symbol === symbol);
    if (!asset) return;

    // Check if there is already an active pending prediction for this symbol
    const existing = predictions.find((p) => p.symbol === symbol && p.status === 'PENDING');
    if (existing) {
      showToast({
        type: 'info',
        title: 'Prediction in Progress',
        message: `You already have an active countdown for ${symbol}!`
      });
      return;
    }

    const newPred: Prediction = {
      id: Math.random().toString(36).substring(2, 9),
      symbol: asset.symbol,
      name: asset.name,
      direction,
      startPrice: asset.price,
      currentPrice: asset.price,
      startTime: Date.now(),
      durationSeconds,
      stakeXP: 0,
      potentialRewardXP: 150,
      potentialRewardCash: 500,
      status: 'PENDING'
    };

    setPredictions((prev) => {
      const next = [newPred, ...prev];
      localStorage.setItem('tv_predictions', JSON.stringify(next));
      return next;
    });

    updateQuestProgress('quest_predict_trend');

    showToast({
      type: 'info',
      title: `Rapid Prediction Started! ⏱️`,
      message: `Called ${direction} on ${symbol} at $${asset.price.toLocaleString()}. 30s timer active!`
    });
  };

  return (
    <GameContext.Provider
      value={{
        isDark,
        toggleTheme,
        assets,
        selectedCategory,
        setSelectedCategory,
        selectedAsset,
        setSelectedAsset,
        searchQuery,
        setSearchQuery,
        paperCash,
        portfolioValue,
        unrealizedPnL,
        realizedPnL,
        openPositions,
        closedTrades,
        executeTrade,
        closePosition,
        resetPortfolio,
        predictions,
        createPrediction,
        xp,
        level,
        rankTitle,
        streak,
        addXP,
        quests,
        claimQuestReward,
        badges,
        leaderboard,
        isPortfolioOpen,
        setIsPortfolioOpen,
        isLeaderboardOpen,
        setIsLeaderboardOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        toasts,
        removeToast,
        showToast
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
