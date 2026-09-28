import React from 'react';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { MarketAsset } from '../types/market';

export const CryptoSection: React.FC = () => {
  const { assets, setSelectedAsset, createPrediction, setSelectedCategory } = useGame();

  const cryptos = assets.filter((a) => a.category === 'crypto');

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-6 pb-12" data-purpose="crypto-market-spotlight">
      <div className="bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#131722] dark:text-white">Top Cryptocurrencies</h2>
            <p className="text-xs text-[#787B86] dark:text-[#868993]">
              Real-time crypto asset market caps and trading changes
            </p>
          </div>
          <button
            onClick={() => setSelectedCategory('crypto')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2962FF] hover:underline"
          >
            <span>Explore Crypto</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cryptos.map((crypto) => {
            const isPositive = crypto.changePercent >= 0;
            return (
              <div
                key={crypto.id}
                onClick={() => setSelectedAsset(crypto)}
                className="group relative p-3.5 rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] hover:border-[#2962FF] dark:hover:border-[#2962FF] hover:bg-[#F0F3FA]/40 dark:hover:bg-[#2A2E39]/40 transition duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                      style={{
                        backgroundColor: crypto.badgeBg || '#131722',
                        color: crypto.badgeTextColor || '#FFFFFF'
                      }}
                    >
                      {crypto.icon || crypto.symbol.slice(0, 1)}
                    </span>
                    <div>
                      <span className="font-bold text-sm block text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors">
                        {crypto.symbol}
                      </span>
                      <span className="text-[11px] text-[#787B86] dark:text-[#868993]">
                        {crypto.name}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded font-mono tabular-nums ${
                      isPositive
                        ? 'text-[#089981] bg-[#089981]/10'
                        : 'text-[#F23645] bg-[#F23645]/10'
                    }`}
                  >
                    {isPositive ? `+${crypto.changePercent.toFixed(2)}%` : `${crypto.changePercent.toFixed(2)}%`}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-[#131722] dark:text-white font-mono tabular-nums">
                    ${crypto.price >= 1 ? crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : crypto.price.toFixed(4)}
                  </span>
                  <span className="text-[10px] text-[#787B86] dark:text-[#868993]">
                    Vol {crypto.volume}
                  </span>
                </div>

                {/* Quick Bull/Bear hover prompt */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 pt-2 border-t border-[#E0E3EB]/60 dark:border-[#2A2E39]/60 flex items-center justify-between gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    onClick={() => createPrediction(crypto.symbol, 'BULL')}
                    className="flex-1 py-1 text-[10px] font-bold rounded text-[#089981] hover:bg-[#089981]/15 flex items-center justify-center gap-1 transition"
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>Bull</span>
                  </button>
                  <button
                    onClick={() => createPrediction(crypto.symbol, 'BEAR')}
                    className="flex-1 py-1 text-[10px] font-bold rounded text-[#F23645] hover:bg-[#F23645]/15 flex items-center justify-center gap-1 transition"
                  >
                    <TrendingDown className="w-3 h-3" />
                    <span>Bear</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
