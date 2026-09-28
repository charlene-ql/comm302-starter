import React, { useState, useMemo } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  BarChart2,
  LineChart,
  Sliders,
  DollarSign,
  ShieldAlert,
  Target,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { MarketAsset } from '../types/market';

export const InteractiveChartModal: React.FC = () => {
  const {
    selectedAsset,
    setSelectedAsset,
    paperCash,
    executeTrade,
    createPrediction,
    predictions,
    openPositions
  } = useGame();

  const [chartType, setChartType] = useState<'candles' | 'area'>('candles');
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '1Y'>('1D');
  const [showIndicators, setShowIndicators] = useState(true);

  // Trading form state
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [shares, setShares] = useState<number>(10);
  const [useSLTP, setUseSLTP] = useState(false);
  const [takeProfit, setTakeProfit] = useState<number | undefined>();
  const [stopLoss, setStopLoss] = useState<number | undefined>();

  if (!selectedAsset) return null;

  const isPositive = selectedAsset.changePercent >= 0;
  const totalCost = +(selectedAsset.price * shares).toFixed(2);
  const canAfford = orderSide === 'SELL' || totalCost <= paperCash;

  // Active prediction for this asset
  const activePred = predictions.find((p) => p.symbol === selectedAsset.symbol && p.status === 'PENDING');
  // Existing open position for this asset
  const existingPosition = openPositions.find((p) => p.symbol === selectedAsset.symbol);

  // Chart rendering geometry
  const candles = selectedAsset.candles || [];
  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const chartWidth = 640;
  const chartHeight = 240;
  const candleWidth = Math.max(4, Math.floor((chartWidth - 40) / candles.length) - 3);

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shares <= 0) return;
    executeTrade(selectedAsset.symbol, orderSide, shares, useSLTP ? takeProfit : undefined, useSLTP ? stopLoss : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E222D] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E0E3EB] dark:border-[#2A2E39] text-[#131722] dark:text-[#D1D4DC]">
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#1E222D]/95 backdrop-blur px-5 py-4 border-b border-[#E0E3EB] dark:border-[#2A2E39] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-xs"
              style={{
                backgroundColor: selectedAsset.badgeBg || '#2962FF',
                color: selectedAsset.badgeTextColor || '#FFFFFF'
              }}
            >
              {selectedAsset.icon || selectedAsset.badgeText || selectedAsset.symbol.slice(0, 2)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-[#131722] dark:text-white">
                  {selectedAsset.symbol}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-[#F0F3FA] dark:bg-[#2A2E39] text-[#787B86] dark:text-[#868993] font-semibold">
                  {selectedAsset.exchange || 'INDEX'}
                </span>
                <span className="text-xs text-[#787B86] dark:text-[#868993] hidden sm:inline">
                  {selectedAsset.name}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-bold text-[#131722] dark:text-white font-mono tabular-nums">
                  ${selectedAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded font-mono tabular-nums ${
                    isPositive ? 'text-[#089981] bg-[#089981]/10' : 'text-[#F23645] bg-[#F23645]/10'
                  }`}
                >
                  {isPositive ? `+${selectedAsset.change.toFixed(2)} (+${selectedAsset.changePercent.toFixed(2)}%)` : `${selectedAsset.change.toFixed(2)} (${selectedAsset.changePercent.toFixed(2)}%)`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedAsset(null)}
              className="p-2 text-[#787B86] hover:text-[#131722] dark:hover:text-white hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: Left Chart + Right Paper Trading & Prediction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Interactive TradingView Chart */}
          <div className="lg:col-span-7 p-5 border-b lg:border-b-0 lg:border-r border-[#E0E3EB] dark:border-[#2A2E39]">
            {/* Chart Controls Bar */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1 bg-[#F0F3FA] dark:bg-[#131722] p-1 rounded-lg">
                {(['1D', '5D', '1M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded font-semibold transition ${
                      timeframe === tf
                        ? 'bg-white dark:bg-[#2A2E39] text-[#2962FF] shadow-xs'
                        : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setChartType('candles')}
                  className={`p-1.5 rounded transition ${
                    chartType === 'candles'
                      ? 'bg-[#2962FF]/10 text-[#2962FF]'
                      : 'text-[#787B86] hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39]'
                  }`}
                  title="Candlestick Chart"
                >
                  <BarChart2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartType('area')}
                  className={`p-1.5 rounded transition ${
                    chartType === 'area'
                      ? 'bg-[#2962FF]/10 text-[#2962FF]'
                      : 'text-[#787B86] hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39]'
                  }`}
                  title="Area / Line Chart"
                >
                  <LineChart className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowIndicators((prev) => !prev)}
                  className={`p-1.5 rounded transition ${
                    showIndicators
                      ? 'bg-[#2962FF]/10 text-[#2962FF]'
                      : 'text-[#787B86] hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39]'
                  }`}
                  title="Toggle Indicators (SMA 20/50 & Vol)"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SVG Chart Display */}
            <div className="relative w-full h-[260px] bg-[#F8FAFD] dark:bg-[#131722] rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] p-3 overflow-hidden flex flex-col justify-between">
              {/* Background grid lines */}
              <div className="absolute inset-0 grid grid-rows-4 pointer-events-none opacity-20 dark:opacity-10">
                <div className="border-b border-[#787B86]"></div>
                <div className="border-b border-[#787B86]"></div>
                <div className="border-b border-[#787B86]"></div>
                <div></div>
              </div>

              {/* Technical Indicator Labels */}
              {showIndicators && (
                <div className="absolute top-2 left-3 z-10 flex items-center gap-3 text-[10px] font-mono text-[#787B86] pointer-events-none">
                  <span className="text-amber-500">SMA 20: ${(selectedAsset.price * 0.995).toFixed(2)}</span>
                  <span className="text-indigo-400">SMA 50: ${(selectedAsset.price * 0.988).toFixed(2)}</span>
                  <span>RSI(14): 58.4</span>
                </div>
              )}

              {/* Chart SVG Canvas */}
              <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                {/* Horizontal reference price line */}
                <line
                  x1="0"
                  y1={chartHeight / 2}
                  x2={chartWidth}
                  y2={chartHeight / 2}
                  stroke="#787B86"
                  strokeDasharray="3 3"
                  strokeOpacity="0.4"
                />

                {chartType === 'candles' ? (
                  // Candlesticks
                  candles.map((candle, idx) => {
                    const x = idx * (candleWidth + 3) + 20;
                    const isGreen = candle.close >= candle.open;
                    const highY = chartHeight - ((candle.high - minPrice) / priceRange) * (chartHeight - 30) - 15;
                    const lowY = chartHeight - ((candle.low - minPrice) / priceRange) * (chartHeight - 30) - 15;
                    const openY = chartHeight - ((candle.open - minPrice) / priceRange) * (chartHeight - 30) - 15;
                    const closeY = chartHeight - ((candle.close - minPrice) / priceRange) * (chartHeight - 30) - 15;

                    const bodyTop = Math.min(openY, closeY);
                    const bodyHeight = Math.max(2, Math.abs(openY - closeY));
                    const color = isGreen ? '#089981' : '#F23645';

                    return (
                      <g key={idx} className="cursor-pointer">
                        {/* Wick */}
                        <line x1={x + candleWidth / 2} y1={highY} x2={x + candleWidth / 2} y2={lowY} stroke={color} strokeWidth="1.5" />
                        {/* Body */}
                        <rect
                          x={x}
                          y={bodyTop}
                          width={candleWidth}
                          height={bodyHeight}
                          fill={color}
                          rx="1"
                        />
                      </g>
                    );
                  })
                ) : (
                  // Smooth Area / Line
                  <g>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2962FF" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2962FF" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={
                        candles
                          .map((c, idx) => {
                            const x = (idx / (candles.length - 1)) * (chartWidth - 40) + 20;
                            const y = chartHeight - ((c.close - minPrice) / priceRange) * (chartHeight - 30) - 15;
                            return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                          })
                          .join(' ')
                      }
                      fill="none"
                      stroke="#2962FF"
                      strokeWidth="2.5"
                    />
                  </g>
                )}
              </svg>

              {/* Price Scale Right */}
              <div className="absolute right-2 top-2 bottom-2 flex flex-col justify-between text-[10px] font-mono text-[#787B86] pointer-events-none">
                <span>${maxPrice.toFixed(2)}</span>
                <span>${((maxPrice + minPrice) / 2).toFixed(2)}</span>
                <span>${minPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
              <div className="bg-[#F0F3FA] dark:bg-[#131722] p-2 rounded-xl">
                <span className="text-[#787B86] block text-[10px]">24h High</span>
                <span className="font-bold font-mono text-[#131722] dark:text-white">${selectedAsset.high.toFixed(2)}</span>
              </div>
              <div className="bg-[#F0F3FA] dark:bg-[#131722] p-2 rounded-xl">
                <span className="text-[#787B86] block text-[10px]">24h Low</span>
                <span className="font-bold font-mono text-[#131722] dark:text-white">${selectedAsset.low.toFixed(2)}</span>
              </div>
              <div className="bg-[#F0F3FA] dark:bg-[#131722] p-2 rounded-xl">
                <span className="text-[#787B86] block text-[10px]">Volume</span>
                <span className="font-bold font-mono text-[#131722] dark:text-white">{selectedAsset.volume}</span>
              </div>
              <div className="bg-[#F0F3FA] dark:bg-[#131722] p-2 rounded-xl">
                <span className="text-[#787B86] block text-[10px]">Mkt Cap</span>
                <span className="font-bold font-mono text-[#131722] dark:text-white">{selectedAsset.marketCap || 'N/A'}</span>
              </div>
            </div>

            {/* Asset description */}
            {selectedAsset.description && (
              <p className="mt-3 text-xs text-[#787B86] dark:text-[#868993] leading-relaxed">
                {selectedAsset.description}
              </p>
            )}
          </div>

          {/* Right Column: Gamified Paper Trading & Rapid Prediction */}
          <div className="lg:col-span-5 p-5 bg-[#FAFAFC] dark:bg-[#171A24] flex flex-col justify-between">
            <div>
              {/* Prediction Arena Header */}
              <div className="mb-4 bg-white dark:bg-[#1E222D] p-3 rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#131722] dark:text-white">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Rapid 30s Prediction</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#089981] bg-[#089981]/10 px-2 py-0.5 rounded">
                    Win +150 XP & $500
                  </span>
                </div>
                <p className="text-[11px] text-[#787B86] dark:text-[#868993] mb-3">
                  Predict if {selectedAsset.symbol} will tick higher or lower in the next 30 seconds.
                </p>

                {activePred ? (
                  <div className="bg-[#F0F3FA] dark:bg-[#131722] p-2.5 rounded-lg text-xs font-medium text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#089981] animate-ping"></span>
                      <span>
                        Countdown Active: {activePred.direction} call on {activePred.symbol}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => createPrediction(selectedAsset.symbol, 'BULL')}
                      className="bg-[#089981]/15 hover:bg-[#089981]/25 text-[#089981] font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Call Bull 🐂</span>
                    </button>
                    <button
                      onClick={() => createPrediction(selectedAsset.symbol, 'BEAR')}
                      className="bg-[#F23645]/15 hover:bg-[#F23645]/25 text-[#F23645] font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <TrendingDown className="w-4 h-4" />
                      <span>Call Bear 🐻</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Paper Trading Panel */}
              <div className="bg-white dark:bg-[#1E222D] p-4 rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-[#131722] dark:text-white">Paper Order</h4>
                  <div className="text-[11px] text-[#787B86] dark:text-[#868993]">
                    Cash: <span className="font-bold font-mono text-[#131722] dark:text-white">${paperCash.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                {/* Buy / Sell Toggle Tabs */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#F0F3FA] dark:bg-[#131722] rounded-xl mb-3">
                  <button
                    onClick={() => setOrderSide('BUY')}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      orderSide === 'BUY'
                        ? 'bg-[#089981] text-white shadow-xs'
                        : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
                    }`}
                  >
                    Buy / Long
                  </button>
                  <button
                    onClick={() => setOrderSide('SELL')}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      orderSide === 'SELL'
                        ? 'bg-[#F23645] text-white shadow-xs'
                        : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
                    }`}
                  >
                    Sell / Short
                  </button>
                </div>

                {/* Shares / Size Input */}
                <form onSubmit={handleTradeSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#787B86] dark:text-[#868993] mb-1">
                      Quantity (Shares/Units)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={shares}
                        onChange={(e) => setShares(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-full bg-[#F0F3FA] dark:bg-[#131722] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-xl px-3 py-2 text-sm font-mono font-bold text-[#131722] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2962FF]"
                      />
                    </div>
                    {/* Quick share quantity pills */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {[1, 5, 10, 25, 50].map((qty) => (
                        <button
                          key={qty}
                          type="button"
                          onClick={() => setShares(qty)}
                          className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded transition ${
                            shares === qty
                              ? 'bg-[#2962FF] text-white'
                              : 'bg-[#F0F3FA] dark:bg-[#2A2E39] text-[#787B86] hover:text-[#131722]'
                          }`}
                        >
                          {qty}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculated Order Cost */}
                  <div className="bg-[#F0F3FA] dark:bg-[#131722] p-2.5 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between text-[#787B86]">
                      <span>Order Value:</span>
                      <span className="font-bold text-[#131722] dark:text-white font-mono tabular-nums">
                        ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#787B86]">
                      <span>Execution:</span>
                      <span className="text-[#089981] font-semibold">Instant Market Order</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!canAfford}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white shadow-sm transition active:scale-98 ${
                      !canAfford
                        ? 'bg-gray-400 cursor-not-allowed'
                        : orderSide === 'BUY'
                        ? 'bg-[#089981] hover:bg-[#077d6a]'
                        : 'bg-[#F23645] hover:bg-[#d42d3b]'
                    }`}
                  >
                    {!canAfford ? 'Insufficient Paper Cash' : `Execute ${orderSide} (${shares} ${selectedAsset.symbol})`}
                  </button>
                </form>
              </div>
            </div>

            {/* Existing position indicator if already trading this asset */}
            {existingPosition && (
              <div className="mt-3 p-2.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#2962FF]">Active Position:</span>{' '}
                  <span>
                    {existingPosition.side} {existingPosition.shares} @ ${existingPosition.entryPrice.toFixed(2)}
                  </span>
                </div>
                <span className="font-mono font-bold text-[#089981]">
                  P&L: ${(existingPosition.shares * (selectedAsset.price - existingPosition.entryPrice)).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
