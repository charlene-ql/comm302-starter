import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { GamificationBar } from './components/GamificationBar';
import { IndicesCards } from './components/IndicesCards';
import { MarketTablesSection } from './components/MarketTablesSection';
import { CryptoSection } from './components/CryptoSection';
import { FuturesAndForexSection } from './components/FuturesAndForexSection';
import { InteractiveChartModal } from './components/InteractiveChartModal';
import { PortfolioDrawer } from './components/PortfolioDrawer';
import { QuestsAndLeaderboardModal } from './components/QuestsAndLeaderboardModal';
import { SymbolSearchModal } from './components/SymbolSearchModal';
import { Toasts } from './components/Toasts';
import { Footer } from './components/Footer';

const MainLayout: React.FC = () => {
  const { selectedCategory } = useGame();

  const showIndices = selectedCategory === 'all' || selectedCategory === 'indices';
  const showTables =
    selectedCategory === 'all' ||
    selectedCategory === 'us_stocks' ||
    selectedCategory === 'world_stocks';
  const showCrypto = selectedCategory === 'all' || selectedCategory === 'crypto';

  return (
    <div className="min-h-screen bg-white dark:bg-[#131722] text-[#131722] dark:text-[#D1D4DC] flex flex-col transition-colors selection:bg-[#2962FF]/20 selection:text-[#2962FF]">
      {/* TradingView Global Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* "Markets, everywhere" Hero & Filter Pills */}
        <HeroSection />

        {/* Live Rapid Prediction & Daily Quests Ticker Bar */}
        <GamificationBar />

        {/* Indices Section (S&P 500, Nasdaq 100, Dow 30, US 2000) */}
        {showIndices && <IndicesCards />}

        {/* Most Active Stocks + World Indices Section */}
        {showTables && <MarketTablesSection />}

        {/* Top Cryptocurrencies Section (BTC, ETH, SOL, XRP) */}
        {showCrypto && <CryptoSection />}

        {/* Commodities, Forex & Yields (Gold, Oil, EUR/USD, 10Y Yield) */}
        <FuturesAndForexSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals, Drawers & Overlays */}
      <InteractiveChartModal />
      <PortfolioDrawer />
      <QuestsAndLeaderboardModal />
      <SymbolSearchModal />
      <Toasts />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainLayout />
    </GameProvider>
  );
}
