import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { MarketAsset } from '../types/market';

export const MarketTablesSection: React.FC = () => {
  const { assets, setSelectedAsset, createPrediction, executeTrade, setSelectedCategory } = useGame();
  const [showAllStocks, setShowAllStocks] = useState(false);
  const [showAllWorld, setShowAllWorld] = useState(false);

  const usStocks = assets.filter((a) => a.category === 'us_stocks');
  const worldIndices = assets.filter((a) => a.category === 'world_stocks');

  const visibleStocks = showAllStocks ? usStocks : usStocks.slice(0, 4);
  const visibleWorld = showAllWorld ? worldIndices : worldIndices.slice(0, 4);

  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 60;
    const height = 20;

    const pathData = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * (width - 4) + 2;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor = isPositive ? '#089981' : '#F23645';

    return (
      <svg className="w-16 h-5 ml-auto shrink-0" fill="none" stroke={strokeColor} strokeWidth="2" viewBox="0 0 60 20">
        <path d={pathData} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-6 py-6" data-purpose="market-tables-overview">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Most Active US Stocks Table */}
        <div
          className="bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl p-5 shadow-xs transition-colors"
          data-purpose="table-active-stocks"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#131722] dark:text-white">Most Active Stocks</h2>
              <p className="text-xs text-[#787B86] dark:text-[#868993]">Highest traded volume today in US markets</p>
            </div>
            <button
              onClick={() => setShowAllStocks((prev) => !prev)}
              className="text-xs font-semibold text-[#2962FF] hover:underline"
            >
              {showAllStocks ? 'Show less' : 'View all'}
            </button>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-[#787B86] dark:text-[#868993] border-b border-[#E0E3EB] dark:border-[#2A2E39]">
                  <th className="py-2.5 font-medium">Symbol</th>
                  <th className="py-2.5 font-medium text-right">Price</th>
                  <th className="py-2.5 font-medium text-right">Change %</th>
                  <th className="py-2.5 font-medium text-right hidden sm:table-cell">Trend</th>
                  <th className="py-2.5 font-medium text-right sm:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F3FA] dark:divide-[#2A2E39]">
                {visibleStocks.map((stock) => {
                  const isPositive = stock.changePercent >= 0;
                  return (
                    <tr
                      key={stock.id}
                      onClick={() => setSelectedAsset(stock)}
                      className="group hover:bg-[#F0F3FA]/70 dark:hover:bg-[#2A2E39]/60 transition-colors cursor-pointer"
                    >
                      {/* Symbol & Name */}
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                            style={{
                              backgroundColor: stock.badgeBg || '#131722',
                              color: stock.badgeTextColor || '#FFFFFF'
                            }}
                          >
                            {stock.badgeText || stock.symbol.slice(0, 1)}
                          </div>
                          <div>
                            <div className="font-bold text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors flex items-center gap-1.5">
                              <span>{stock.symbol}</span>
                              <ArrowUpRight className="w-3 h-3 text-[#787B86] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-xs text-[#787B86] dark:text-[#868993] truncate max-w-[120px] sm:max-w-[160px]">
                              {stock.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 text-right font-semibold text-[#131722] dark:text-white font-mono tabular-nums">
                        ${stock.price.toFixed(2)}
                      </td>

                      {/* Change % */}
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block text-xs font-bold px-2 py-0.5 rounded font-mono tabular-nums ${
                            isPositive
                              ? 'text-[#089981] bg-[#089981]/10'
                              : 'text-[#F23645] bg-[#F23645]/10'
                          }`}
                        >
                          {isPositive ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                        </span>
                      </td>

                      {/* Trend Sparkline + Quick Actions on Desktop */}
                      <td className="py-3 text-right hidden sm:table-cell">
                        <div className="flex items-center justify-end gap-2">
                          <div className="group-hover:hidden transition-all">
                            {renderSparkline(stock.sparkline, isPositive)}
                          </div>
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="hidden group-hover:flex items-center justify-end gap-1.5"
                          >
                            <button
                              onClick={() => createPrediction(stock.symbol, 'BULL')}
                              className="text-[11px] font-bold text-[#089981] bg-[#089981]/10 hover:bg-[#089981]/20 px-2 py-1 rounded transition"
                              title="30s Bull Prediction"
                            >
                              Bull 🐂
                            </button>
                            <button
                              onClick={() => createPrediction(stock.symbol, 'BEAR')}
                              className="text-[11px] font-bold text-[#F23645] bg-[#F23645]/10 hover:bg-[#F23645]/20 px-2 py-1 rounded transition"
                              title="30s Bear Prediction"
                            >
                              Bear 🐻
                            </button>
                            <button
                              onClick={() => executeTrade(stock.symbol, 'BUY', 5)}
                              className="text-[11px] font-bold text-white bg-[#2962FF] hover:bg-[#1E53E5] px-2 py-1 rounded transition"
                              title="Quick Paper Buy 5 Shares"
                            >
                              Buy
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Action for Mobile */}
                      <td className="py-3 text-right sm:hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAsset(stock);
                          }}
                          className="text-xs font-bold text-[#2962FF] px-2 py-1 bg-[#2962FF]/10 rounded"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* World Indices Table */}
        <div
          className="bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl p-5 shadow-xs transition-colors"
          data-purpose="table-world-indices"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#131722] dark:text-white">World Indices</h2>
              <p className="text-xs text-[#787B86] dark:text-[#868993]">Global benchmark market performance</p>
            </div>
            <button
              onClick={() => setShowAllWorld((prev) => !prev)}
              className="text-xs font-semibold text-[#2962FF] hover:underline"
            >
              {showAllWorld ? 'Show less' : 'View all'}
            </button>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-[#787B86] dark:text-[#868993] border-b border-[#E0E3EB] dark:border-[#2A2E39]">
                  <th className="py-2.5 font-medium">Index</th>
                  <th className="py-2.5 font-medium text-right">Value</th>
                  <th className="py-2.5 font-medium text-right">Change %</th>
                  <th className="py-2.5 font-medium text-right hidden sm:table-cell">Trend</th>
                  <th className="py-2.5 font-medium text-right sm:hidden">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F3FA] dark:divide-[#2A2E39]">
                {visibleWorld.map((indexItem) => {
                  const isPositive = indexItem.changePercent >= 0;
                  return (
                    <tr
                      key={indexItem.id}
                      onClick={() => setSelectedAsset(indexItem)}
                      className="group hover:bg-[#F0F3FA]/70 dark:hover:bg-[#2A2E39]/60 transition-colors cursor-pointer"
                    >
                      {/* Flag & Name */}
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl shrink-0">{indexItem.flag || '🌐'}</span>
                          <div>
                            <div className="font-bold text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors flex items-center gap-1.5">
                              <span>{indexItem.symbol}</span>
                              <ArrowUpRight className="w-3 h-3 text-[#787B86] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-xs text-[#787B86] dark:text-[#868993] truncate max-w-[120px] sm:max-w-[160px]">
                              {indexItem.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Value */}
                      <td className="py-3 text-right font-semibold text-[#131722] dark:text-white font-mono tabular-nums">
                        {indexItem.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Change % */}
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block text-xs font-bold px-2 py-0.5 rounded font-mono tabular-nums ${
                            isPositive
                              ? 'text-[#089981] bg-[#089981]/10'
                              : 'text-[#F23645] bg-[#F23645]/10'
                          }`}
                        >
                          {isPositive ? `+${indexItem.changePercent.toFixed(2)}%` : `${indexItem.changePercent.toFixed(2)}%`}
                        </span>
                      </td>

                      {/* Trend Sparkline + Quick Actions on hover */}
                      <td className="py-3 text-right hidden sm:table-cell">
                        <div className="flex items-center justify-end gap-2">
                          <div className="group-hover:hidden transition-all">
                            {renderSparkline(indexItem.sparkline, isPositive)}
                          </div>
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="hidden group-hover:flex items-center justify-end gap-1.5"
                          >
                            <button
                              onClick={() => createPrediction(indexItem.symbol, 'BULL')}
                              className="text-[11px] font-bold text-[#089981] bg-[#089981]/10 hover:bg-[#089981]/20 px-2 py-1 rounded transition"
                              title="30s Bull Prediction"
                            >
                              Bull 🐂
                            </button>
                            <button
                              onClick={() => createPrediction(indexItem.symbol, 'BEAR')}
                              className="text-[11px] font-bold text-[#F23645] bg-[#F23645]/10 hover:bg-[#F23645]/20 px-2 py-1 rounded transition"
                              title="30s Bear Prediction"
                            >
                              Bear 🐻
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Mobile view trigger */}
                      <td className="py-3 text-right sm:hidden">
                        <span className="text-xs text-[#2962FF] font-medium">Chart</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
