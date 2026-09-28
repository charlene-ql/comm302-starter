import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Globe,
  User,
  Moon,
  Sun,
  Flame,
  Briefcase,
  Trophy,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const Header: React.FC = () => {
  const {
    isDark,
    toggleTheme,
    paperCash,
    portfolioValue,
    unrealizedPnL,
    xp,
    level,
    rankTitle,
    streak,
    openPositions,
    setIsPortfolioOpen,
    setIsLeaderboardOpen,
    setIsSearchModalOpen,
    resetPortfolio
  } = useGame();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchModalOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#131722]/95 backdrop-blur border-b border-[#E0E3EB] dark:border-[#2A2E39] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-[64px] flex items-center justify-between gap-3">
        {/* Brand & Search Bar Left Section */}
        <div className="flex items-center gap-5 lg:gap-6">
          {/* TradingView Stylized Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="TradingView Home"
            className="flex items-center gap-2 group focus:outline-none"
          >
            <svg
              className="w-8 h-8 fill-black dark:fill-white transition-colors"
              viewBox="0 0 36 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 4h6.8l7.2 16.5L25.2 4H32L21.4 28h-6.8L4 4z" />
              <rect height="24" rx="2" width="4" x="0" y="4" />
            </svg>
          </button>

          {/* Global Search Bar with Hotkey Hint */}
          <div
            onClick={() => setIsSearchModalOpen(true)}
            className="relative hidden sm:flex items-center w-52 md:w-64 lg:w-72 bg-[#F0F3FA] dark:bg-[#1E222D] hover:bg-[#E5E9F0] dark:hover:bg-[#2A2E39] rounded-full px-3.5 py-2 cursor-pointer transition-colors border border-transparent dark:border-[#2A2E39]"
          >
            <Search className="w-4 h-4 text-[#787B86] dark:text-[#868993] mr-2 shrink-0" />
            <span className="text-sm text-[#787B86] dark:text-[#868993] select-none truncate">Search (Ctrl+K)</span>
            <kbd className="hidden lg:inline-block ml-auto text-[10px] font-mono bg-white dark:bg-[#131722] text-[#787B86] dark:text-[#868993] px-1.5 py-0.5 rounded border border-[#E0E3EB] dark:border-[#2A2E39]">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Navigation Category Links */}
        <nav className="hidden xl:flex items-center space-x-7 text-sm font-semibold">
          <a
            href="#products"
            onClick={(e) => { e.preventDefault(); setIsLeaderboardOpen(true); }}
            className="text-[#131722] dark:text-[#D1D4DC] hover:text-[#2962FF] dark:hover:text-[#2962FF] transition-colors"
          >
            Products
          </a>
          <a
            href="#community"
            onClick={(e) => { e.preventDefault(); setIsLeaderboardOpen(true); }}
            className="text-[#131722] dark:text-[#D1D4DC] hover:text-[#2962FF] dark:hover:text-[#2962FF] transition-colors"
          >
            Community
          </a>
          <a
            href="#markets"
            className="text-[#2962FF] font-semibold border-b-2 border-[#2962FF] py-5"
          >
            Markets
          </a>
          <a
            href="#brokers"
            onClick={(e) => { e.preventDefault(); setIsPortfolioOpen(true); }}
            className="text-[#131722] dark:text-[#D1D4DC] hover:text-[#2962FF] dark:hover:text-[#2962FF] transition-colors"
          >
            Brokers
          </a>
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="text-[#131722] dark:text-[#D1D4DC] hover:text-[#2962FF] dark:hover:text-[#2962FF] transition-colors flex items-center gap-1"
          >
            <span>Arena</span>
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
          </button>
        </nav>

        {/* Right Action Controls: Gamified Stats + Theme + Portfolio */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Win Streak Indicator */}
          {streak > 0 && (
            <div
              onClick={() => setIsLeaderboardOpen(true)}
              title={`${streak}-Prediction Win Streak`}
              className="hidden sm:flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-bounce" />
              <span>{streak}x Streak</span>
            </div>
          )}

          {/* Level / XP Pill */}
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            title={`Trader Level ${level}: ${rankTitle} (${xp} XP)`}
            className="hidden md:flex items-center gap-1.5 bg-[#F0F3FA] dark:bg-[#1E222D] hover:bg-[#E5E9F0] dark:hover:bg-[#2A2E39] border border-[#E0E3EB] dark:border-[#2A2E39] px-2.5 py-1.5 rounded-full text-xs transition"
          >
            <div className="w-4 h-4 rounded-full bg-[#2962FF] text-white flex items-center justify-center font-black text-[10px]">
              {level}
            </div>
            <span className="font-semibold text-[#131722] dark:text-[#D1D4DC]">{rankTitle}</span>
            <span className="text-[#787B86] dark:text-[#868993] font-mono tabular-nums text-[11px]">{xp} XP</span>
          </button>

          {/* Quests & Leaderboard Trigger */}
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            aria-label="Daily Quests & Leaderboard"
            className="p-2 text-[#131722] dark:text-[#D1D4DC] hover:bg-[#F0F3FA] dark:hover:bg-[#1E222D] rounded-full transition-colors relative"
            title="Quests & Achievements"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-[#131722] dark:text-[#D1D4DC] hover:bg-[#F0F3FA] dark:hover:bg-[#1E222D] rounded-full transition-colors"
            title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Selector */}
          <button
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#131722] dark:text-[#D1D4DC] hover:text-[#2962FF] py-1.5 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#1E222D] transition-colors"
            title="Language: English"
          >
            <Globe className="w-4 h-4" />
            <span className="font-bold text-xs uppercase ml-1">EN</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-label="User Account"
              className="p-2 text-[#131722] dark:text-[#D1D4DC] hover:bg-gray-100 dark:hover:bg-[#1E222D] rounded-full transition-colors flex items-center"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2962FF] to-[#6A11CB] text-white flex items-center justify-center font-bold text-xs">
                U
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1E222D] rounded-xl shadow-xl border border-[#E0E3EB] dark:border-[#2A2E39] py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
                  <div>
                    <div className="font-bold text-sm text-[#131722] dark:text-white">Paper Trader</div>
                    <div className="text-xs text-[#787B86] dark:text-[#868993]">Level {level} · {rankTitle}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-[#2962FF]">{xp} XP</div>
                    <div className="text-[10px] text-[#787B86]">Streak: {streak}🔥</div>
                  </div>
                </div>

                <div className="py-2 space-y-1 text-xs">
                  <div className="flex justify-between py-1 text-[#787B86] dark:text-[#868993]">
                    <span>Paper Equity:</span>
                    <span className="font-bold text-[#131722] dark:text-white font-mono tabular-nums">
                      ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-[#787B86] dark:text-[#868993]">
                    <span>Cash Available:</span>
                    <span className="font-bold text-[#131722] dark:text-white font-mono tabular-nums">
                      ${paperCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-[#787B86] dark:text-[#868993]">
                    <span>Open Positions:</span>
                    <span className="font-bold text-[#131722] dark:text-white">{openPositions.length} active</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E0E3EB] dark:border-[#2A2E39] flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsPortfolioOpen(true);
                    }}
                    className="w-full text-left text-xs font-semibold py-1.5 px-2 rounded hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] text-[#2962FF] flex items-center justify-between"
                  >
                    <span>View Portfolio & Positions</span>
                    <Briefcase className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsLeaderboardOpen(true);
                    }}
                    className="w-full text-left text-xs font-semibold py-1.5 px-2 rounded hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] text-[#131722] dark:text-white flex items-center justify-between"
                  >
                    <span>Quests & Leaderboard</span>
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (confirm('Reset paper balance to $100,000.00 and clear active trades?')) {
                        resetPortfolio();
                      }
                    }}
                    className="w-full text-left text-xs font-medium py-1.5 px-2 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-between"
                  >
                    <span>Reset Paper Balance</span>
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Paper Trading Button / Get Started with Live Equity Display */}
          <button
            onClick={() => setIsPortfolioOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#2962FF] to-[#6A11CB] hover:from-[#1E53E5] hover:to-[#5B0EB8] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition duration-200 shadow-sm active:scale-95 shrink-0"
          >
            <Briefcase className="w-3.5 h-3.5 hidden sm:inline-block" />
            <span>${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            <span className="hidden md:inline text-[11px] font-normal opacity-90">Paper</span>
          </button>
        </div>
      </div>
    </header>
  );
};
