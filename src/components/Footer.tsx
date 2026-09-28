import React from 'react';
import { useGame } from '../context/GameContext';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setIsPortfolioOpen, setIsLeaderboardOpen } = useGame();

  return (
    <footer className="border-t border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#131722] py-10 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
          <div className="flex items-center gap-3">
            {/* TradingView Icon */}
            <svg
              className="w-7 h-7 fill-black dark:fill-white"
              viewBox="0 0 36 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 4h6.8l7.2 16.5L25.2 4H32L21.4 28h-6.8L4 4z" />
              <rect height="24" rx="2" width="4" x="0" y="4" />
            </svg>
            <span className="font-extrabold text-sm tracking-tight text-[#131722] dark:text-white">
              TradingView Arena
            </span>
            <span className="text-xs text-[#787B86] dark:text-[#868993] hidden sm:inline">
              · Track all markets everywhere with gamified trading
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-[#787B86] dark:text-[#868993]">
            <button
              onClick={() => setSelectedCategory('us_stocks')}
              className="hover:text-[#2962FF] transition"
            >
              US Stocks
            </button>
            <button
              onClick={() => setSelectedCategory('indices')}
              className="hover:text-[#2962FF] transition"
            >
              Indices
            </button>
            <button
              onClick={() => setSelectedCategory('crypto')}
              className="hover:text-[#2962FF] transition"
            >
              Crypto
            </button>
            <button
              onClick={() => setSelectedCategory('world_stocks')}
              className="hover:text-[#2962FF] transition"
            >
              World Indices
            </button>
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="hover:text-[#2962FF] transition"
            >
              Quests & Leaderboard
            </button>
            <button
              onClick={() => setIsPortfolioOpen(true)}
              className="hover:text-[#2962FF] transition text-[#2962FF]"
            >
              Paper Portfolio ($100k)
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#787B86] dark:text-[#868993]">
          <p>
            © {new Date().getFullYear()} TradingView Replica & Gamified Simulation Arena. All simulated market prices and paper trading data are for educational and entertainment purposes.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
