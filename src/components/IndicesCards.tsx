import React from 'react';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { MarketAsset } from '../types/market';

export const IndicesCards: React.FC = () => {
  const { assets, setSelectedAsset, createPrediction, setSelectedCategory } = useGame();

  // Filter indices: sp500, ndx, dji, rut
  const indices = assets.filter((a) => a.category === 'indices');

  // Render SVG sparkline curve
  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 80;
    const height = 30;

    const pathData = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * (width - 4) + 2;
        const y = height - ((val - min) / range) * (height - 8) - 4;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor = isPositive ? '#089981' : '#F23645';

    return (
      <svg className="w-16 h-7 shrink-0" fill="none" stroke={strokeColor} strokeWidth="2" viewBox="0 0 80 30">
        <path d={pathData} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-6 py-4" data-purpose="indices-quick-view">
      {/* Section Header Link */}
      <button
        onClick={() => setSelectedCategory('indices')}
        className="inline-flex items-center text-2xl font-bold text-[#131722] dark:text-white hover:text-[#2962FF] dark:hover:text-[#2962FF] group mb-4 transition"
      >
        <span>Indices</span>
        <ChevronRight className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform stroke-[2.5]" />
      </button>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {indices.map((asset) => {
          const isPositive = asset.changePercent >= 0;
          return (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="group relative bg-[#F0F3FA] dark:bg-[#1E222D] hover:bg-[#E5E9F0] dark:hover:bg-[#2A2E39] p-4 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between h-[132px] border border-transparent hover:border-[#E0E3EB] dark:hover:border-[#363A45] shadow-xs"
            >
              {/* Card Header: Badge + Symbol + Sparkline */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs"
                    style={{
                      backgroundColor: asset.badgeBg || '#2962FF',
                      color: asset.badgeTextColor || '#FFFFFF'
                    }}
                  >
                    {asset.badgeText || asset.symbol.slice(0, 3)}
                  </span>
                  <div>
                    <span className="font-bold text-[15px] text-[#131722] dark:text-white block group-hover:text-[#2962FF] transition-colors">
                      {asset.symbol}
                    </span>
                    <span className="text-[11px] text-[#787B86] dark:text-[#868993] line-clamp-1">
                      {asset.name}
                    </span>
                  </div>
                </div>

                {/* Sparkline Mini Graph */}
                {renderSparkline(asset.sparkline, isPositive)}
              </div>

              {/* Bottom Values & Quick Action overlay on hover */}
              <div className="flex items-baseline justify-between mt-auto pt-2">
                <span className="text-xl font-bold text-[#131722] dark:text-white font-mono tabular-nums">
                  {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded font-mono tabular-nums ${
                    isPositive
                      ? 'text-[#089981] bg-[#089981]/10'
                      : 'text-[#F23645] bg-[#F23645]/10'
                  }`}
                >
                  {isPositive ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}
                </span>
              </div>

              {/* Quick Gamified Bull / Bear buttons on hover */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-x-2 bottom-2 bg-white/95 dark:bg-[#131722]/95 backdrop-blur rounded-xl p-1 shadow-md border border-[#E0E3EB] dark:border-[#2A2E39] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between gap-1 pointer-events-none group-hover:pointer-events-auto"
              >
                <button
                  onClick={() => createPrediction(asset.symbol, 'BULL')}
                  className="flex-1 text-[11px] font-bold text-[#089981] hover:bg-[#089981]/15 py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition active:scale-95"
                  title="Predict Index Closes Higher in 30s"
                >
                  <TrendingUp className="w-3 h-3" />
                  <span>Bull 🐂</span>
                </button>
                <button
                  onClick={() => createPrediction(asset.symbol, 'BEAR')}
                  className="flex-1 text-[11px] font-bold text-[#F23645] hover:bg-[#F23645]/15 py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition active:scale-95"
                  title="Predict Index Closes Lower in 30s"
                >
                  <TrendingDown className="w-3 h-3" />
                  <span>Bear 🐻</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
