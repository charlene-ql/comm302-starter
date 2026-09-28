import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { MarketAsset } from '../types/market';

export const SymbolSearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, assets, setSelectedAsset } = useGame();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'stocks' | 'crypto' | 'indices' | 'futures'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const filteredAssets = assets.filter((asset) => {
    const matchesQuery =
      asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
      asset.name.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;

    if (filterType === 'stocks') return asset.category === 'us_stocks' || asset.category === 'world_stocks';
    if (filterType === 'crypto') return asset.category === 'crypto';
    if (filterType === 'indices') return asset.category === 'indices';
    if (filterType === 'futures') return asset.category === 'futures' || asset.category === 'forex';
    return true;
  });

  const handleSelect = (asset: MarketAsset) => {
    setSelectedAsset(asset);
    setIsSearchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#1E222D] rounded-2xl w-full max-w-xl shadow-2xl border border-[#E0E3EB] dark:border-[#2A2E39] overflow-hidden text-[#131722] dark:text-[#D1D4DC]">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-[#E0E3EB] dark:border-[#2A2E39] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#787B86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, market, company or crypto (e.g. NVDA, BTC, S&P 500)..."
            className="w-full bg-transparent text-sm sm:text-base font-medium placeholder-[#787B86] focus:outline-none text-[#131722] dark:text-white"
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1 rounded-md text-[#787B86] hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter categories tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-[#F8FAFD] dark:bg-[#131722] border-b border-[#E0E3EB] dark:border-[#2A2E39] text-xs overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'stocks', label: 'Stocks' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'indices', label: 'Indices' },
            { id: 'futures', label: 'Futures & FX' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1 rounded-full font-semibold transition ${
                filterType === tab.id
                  ? 'bg-[#131722] text-white dark:bg-white dark:text-[#131722]'
                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-[#F0F3FA] dark:divide-[#2A2E39]">
          {filteredAssets.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#787B86]">
              No instruments found matching "{query}".
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const isPos = asset.changePercent >= 0;
              return (
                <div
                  key={asset.id}
                  onClick={() => handleSelect(asset)}
                  className="p-3.5 px-4 flex items-center justify-between hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39]/60 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                      style={{
                        backgroundColor: asset.badgeBg || '#131722',
                        color: asset.badgeTextColor || '#FFFFFF'
                      }}
                    >
                      {asset.icon || asset.badgeText || asset.symbol.slice(0, 2)}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#131722] dark:text-white flex items-center gap-1.5">
                        <span>{asset.symbol}</span>
                        <span className="text-[10px] font-semibold text-[#787B86] px-1.5 py-0.2 bg-[#F0F3FA] dark:bg-[#131722] rounded">
                          {asset.category.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-[#787B86] dark:text-[#868993] line-clamp-1">{asset.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-[#131722] dark:text-white">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs font-mono font-bold ${
                        isPos ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPos ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
