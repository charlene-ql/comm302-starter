import React from 'react';
import { X, Briefcase, TrendingUp, TrendingDown, RotateCcw, CheckCircle2, History } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const PortfolioDrawer: React.FC = () => {
  const {
    isPortfolioOpen,
    setIsPortfolioOpen,
    paperCash,
    portfolioValue,
    unrealizedPnL,
    realizedPnL,
    openPositions,
    closedTrades,
    closePosition,
    resetPortfolio,
    setSelectedAsset,
    assets
  } = useGame();

  if (!isPortfolioOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E222D] w-full max-w-md h-full shadow-2xl border-l border-[#E0E3EB] dark:border-[#2A2E39] flex flex-col justify-between text-[#131722] dark:text-[#D1D4DC]">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E0E3EB] dark:border-[#2A2E39] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2962FF]/10 text-[#2962FF] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#131722] dark:text-white">Paper Trading Portfolio</h3>
              <p className="text-xs text-[#787B86] dark:text-[#868993]">Virtual simulation environment</p>
            </div>
          </div>
          <button
            onClick={() => setIsPortfolioOpen(false)}
            className="p-1.5 text-[#787B86] hover:text-[#131722] dark:hover:text-white rounded-lg hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portfolio Balance Summary */}
        <div className="p-5 bg-[#F0F3FA]/70 dark:bg-[#131722]/60 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
          <div className="text-xs text-[#787B86] dark:text-[#868993] mb-1">Total Account Equity</div>
          <div className="text-2xl font-extrabold text-[#131722] dark:text-white font-mono tabular-nums mb-3">
            ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white dark:bg-[#1E222D] p-2.5 rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39]">
              <span className="text-[10px] text-[#787B86] block">Cash</span>
              <span className="font-bold font-mono text-[#131722] dark:text-white">
                ${paperCash.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="bg-white dark:bg-[#1E222D] p-2.5 rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39]">
              <span className="text-[10px] text-[#787B86] block">Unrealized P&L</span>
              <span
                className={`font-bold font-mono ${
                  unrealizedPnL >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {unrealizedPnL >= 0 ? `+$${unrealizedPnL.toFixed(2)}` : `-$${Math.abs(unrealizedPnL).toFixed(2)}`}
              </span>
            </div>
            <div className="bg-white dark:bg-[#1E222D] p-2.5 rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39]">
              <span className="text-[10px] text-[#787B86] block">Realized P&L</span>
              <span
                className={`font-bold font-mono ${
                  realizedPnL >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {realizedPnL >= 0 ? `+$${realizedPnL.toFixed(2)}` : `-$${Math.abs(realizedPnL).toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Positions and Trades */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Active Positions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-[#131722] dark:text-white">
                Open Positions ({openPositions.length})
              </h4>
              <span className="text-xs text-[#787B86]">Real-time tick updates</span>
            </div>

            {openPositions.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl">
                <Briefcase className="w-8 h-8 text-[#787B86] mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-[#131722] dark:text-white">No active positions</p>
                <p className="text-xs text-[#787B86] mt-1 mb-4">
                  Select any stock, index, or crypto from the dashboard to execute your first paper trade.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {openPositions.map((pos) => {
                  const diff = pos.side === 'BUY' ? pos.currentPrice - pos.entryPrice : pos.entryPrice - pos.currentPrice;
                  const posPnL = diff * pos.shares;
                  const posPnLPct = (diff / pos.entryPrice) * 100;
                  const isPosGreen = posPnL >= 0;

                  return (
                    <div
                      key={pos.id}
                      className="bg-[#F8FAFD] dark:bg-[#171A24] p-3 rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] hover:border-[#2962FF] transition"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                              pos.side === 'BUY'
                                ? 'bg-[#089981]/15 text-[#089981]'
                                : 'bg-[#F23645]/15 text-[#F23645]'
                            }`}
                          >
                            {pos.side}
                          </span>
                          <span className="font-bold text-sm text-[#131722] dark:text-white">
                            {pos.symbol}
                          </span>
                          <span className="text-xs text-[#787B86]">
                            {pos.shares} shs
                          </span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`font-mono font-bold text-xs ${
                              isPosGreen ? 'text-[#089981]' : 'text-[#F23645]'
                            }`}
                          >
                            {isPosGreen ? `+$${posPnL.toFixed(2)}` : `-$${Math.abs(posPnL).toFixed(2)}`} ({posPnLPct.toFixed(2)}%)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#787B86] dark:text-[#868993] mb-2.5 font-mono">
                        <span>Entry: ${pos.entryPrice.toFixed(2)}</span>
                        <span>Now: ${pos.currentPrice.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const asset = assets.find((a) => a.symbol === pos.symbol);
                            if (asset) {
                              setIsPortfolioOpen(false);
                              setSelectedAsset(asset);
                            }
                          }}
                          className="flex-1 py-1 text-xs font-semibold rounded bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] text-[#131722] dark:text-white transition"
                        >
                          View Chart
                        </button>
                        <button
                          onClick={() => closePosition(pos.id)}
                          className="flex-1 py-1 text-xs font-bold rounded bg-[#2962FF] hover:bg-[#1E53E5] text-white transition active:scale-95"
                        >
                          Close Position
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Closed Trades History */}
          {closedTrades.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-3 font-bold text-sm text-[#131722] dark:text-white">
                <History className="w-4 h-4 text-[#787B86]" />
                <span>Recent History</span>
              </div>
              <div className="space-y-2">
                {closedTrades.slice(0, 5).map((trade) => (
                  <div
                    key={trade.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#171A24] border border-[#E0E3EB] dark:border-[#2A2E39] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#131722] dark:text-white">
                        {trade.side} {trade.shares} {trade.symbol}
                      </div>
                      <div className="text-[10px] text-[#787B86]">
                        {new Date(trade.closeTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div
                      className={`font-bold font-mono tabular-nums ${
                        trade.pnl >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {trade.pnl >= 0 ? `+$${trade.pnl.toFixed(2)}` : `-$${Math.abs(trade.pnl).toFixed(2)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Bottom Controls */}
        <div className="p-4 border-t border-[#E0E3EB] dark:border-[#2A2E39] bg-[#F0F3FA]/50 dark:bg-[#131722]/50">
          <button
            onClick={() => {
              if (confirm('Reset paper portfolio balance to $100,000.00?')) {
                resetPortfolio();
              }
            }}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200 dark:border-red-900/40 flex items-center justify-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to $100k Starting Balance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
