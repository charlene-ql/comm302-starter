import React from 'react';
import { Flame, Clock, Trophy, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const GamificationBar: React.FC = () => {
  const {
    predictions,
    quests,
    streak,
    setIsLeaderboardOpen,
    createPrediction,
    setSelectedAsset,
    assets
  } = useGame();

  const activePredictions = predictions.filter((p) => p.status === 'PENDING');
  const completedUnclaimedQuests = quests.filter((q) => q.completed && !q.claimed).length;
  const completedTotalQuests = quests.filter((q) => q.completed).length;

  const nvdaAsset = assets.find((a) => a.symbol === 'NVDA');

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-2">
      <div className="bg-[#F0F3FA]/70 dark:bg-[#1E222D]/70 border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl p-3 sm:px-4 sm:py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Active Prediction Banner OR Call to Action */}
        {activePredictions.length > 0 ? (
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
            {activePredictions.map((pred) => {
              const elapsed = Math.floor((Date.now() - pred.startTime) / 1000);
              const remaining = Math.max(0, pred.durationSeconds - elapsed);
              const isBull = pred.direction === 'BULL';
              const isWinning = isBull
                ? pred.currentPrice >= pred.startPrice
                : pred.currentPrice <= pred.startPrice;

              return (
                <div
                  key={pred.id}
                  className="flex items-center gap-2 bg-white dark:bg-[#131722] px-3 py-1.5 rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] shrink-0"
                >
                  <div className="flex items-center gap-1 font-bold">
                    {isBull ? (
                      <TrendingUp className="w-3.5 h-3.5 text-[#089981]" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-[#F23645]" />
                    )}
                    <span className="text-[#131722] dark:text-white">{pred.symbol}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        isBull
                          ? 'bg-[#089981]/10 text-[#089981]'
                          : 'bg-[#F23645]/10 text-[#F23645]'
                      }`}
                    >
                      {pred.direction}
                    </span>
                  </div>

                  <span className="text-[#787B86] dark:text-[#868993] font-mono tabular-nums">
                    ${pred.currentPrice.toFixed(2)}
                  </span>

                  <span
                    className={`text-[11px] font-bold ${
                      isWinning ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isWinning ? '✓ Winning' : '✗ Trailing'}
                  </span>

                  <div className="flex items-center gap-1 text-[#787B86] dark:text-[#868993] font-mono text-[11px]">
                    <Clock className="w-3 h-3 animate-spin" />
                    <span>{remaining}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[#434651] dark:text-[#D1D4DC]">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-ping"></span>
            <span className="font-semibold text-[#131722] dark:text-white">Rapid Prediction Arena:</span>
            <span className="hidden sm:inline text-[#787B86] dark:text-[#868993]">
              Test your market intuition in 30 seconds for XP & paper bonuses.
            </span>
            {nvdaAsset && (
              <div className="flex items-center gap-1.5 ml-1">
                <button
                  onClick={() => createPrediction('NVDA', 'BULL')}
                  className="bg-[#089981]/10 hover:bg-[#089981]/20 text-[#089981] font-bold px-2 py-0.5 rounded text-[11px] transition active:scale-95"
                >
                  NVDA Bull 🐂
                </button>
                <button
                  onClick={() => createPrediction('NVDA', 'BEAR')}
                  className="bg-[#F23645]/10 hover:bg-[#F23645]/20 text-[#F23645] font-bold px-2 py-0.5 rounded text-[11px] transition active:scale-95"
                >
                  NVDA Bear 🐻
                </button>
              </div>
            )}
          </div>
        )}

        {/* Right Info: Daily Quests & Leaderboard Trigger */}
        <div className="flex items-center gap-3 ml-auto shrink-0">
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="flex items-center gap-1.5 text-[#131722] dark:text-white hover:text-[#2962FF] dark:hover:text-[#2962FF] font-medium transition"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>
              Daily Quests: {completedTotalQuests}/{quests.length}
            </span>
            {completedUnclaimedQuests > 0 && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-bounce">
                {completedUnclaimedQuests} claimable
              </span>
            )}
            <ArrowRight className="w-3 h-3 text-[#787B86]" />
          </button>
        </div>
      </div>
    </div>
  );
};
