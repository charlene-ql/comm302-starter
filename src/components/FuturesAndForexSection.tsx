import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const FuturesAndForexSection: React.FC = () => {
  const { assets, setSelectedAsset, createPrediction, selectedCategory } = useGame();

  const futuresAndForex = assets.filter(
    (a) =>
      a.category === 'futures' ||
      a.category === 'forex' ||
      a.category === 'bonds' ||
      a.category === 'etfs' ||
      a.category === 'economy'
  );

  // Show if 'all' or if one of these categories is explicitly selected
  const isRelevant =
    selectedCategory === 'all' ||
    selectedCategory === 'futures' ||
    selectedCategory === 'forex' ||
    selectedCategory === 'bonds' ||
    selectedCategory === 'etfs' ||
    selectedCategory === 'economy';

  if (!isRelevant || futuresAndForex.length === 0) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-6 pb-12" data-purpose="futures-forex-spotlight">
      <div className="bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#131722] dark:text-white">
              Commodities, Forex & Treasury Yields
            </h2>
            <p className="text-xs text-[#787B86] dark:text-[#868993]">
              Global macro indicators, spot metals, crude energy, and benchmark yields
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {futuresAndForex.map((item) => {
            const isPos = item.changePercent >= 0;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedAsset(item)}
                className="group relative p-3.5 rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] hover:border-[#2962FF] dark:hover:border-[#2962FF] hover:bg-[#F0F3FA]/40 dark:hover:bg-[#2A2E39]/40 transition duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                      style={{
                        backgroundColor: item.badgeBg || '#131722',
                        color: item.badgeTextColor || '#FFFFFF'
                      }}
                    >
                      {item.badgeText || item.symbol.slice(0, 2)}
                    </span>
                    <div>
                      <span className="font-bold text-sm block text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors">
                        {item.symbol}
                      </span>
                      <span className="text-[11px] text-[#787B86] dark:text-[#868993] line-clamp-1">
                        {item.name}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded font-mono tabular-nums ${
                      isPos ? 'text-[#089981] bg-[#089981]/10' : 'text-[#F23645] bg-[#F23645]/10'
                    }`}
                  >
                    {isPos ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-[#131722] dark:text-white font-mono tabular-nums">
                    {item.price < 5 ? item.price.toFixed(4) : `$${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                  <span className="text-[10px] text-[#787B86] dark:text-[#868993]">
                    {item.exchange}
                  </span>
                </div>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 pt-2 border-t border-[#E0E3EB]/60 dark:border-[#2A2E39]/60 flex items-center justify-between gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    onClick={() => createPrediction(item.symbol, 'BULL')}
                    className="flex-1 py-1 text-[10px] font-bold rounded text-[#089981] hover:bg-[#089981]/15 flex items-center justify-center gap-1 transition"
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>Bull</span>
                  </button>
                  <button
                    onClick={() => createPrediction(item.symbol, 'BEAR')}
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
