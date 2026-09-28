import React, { useState } from 'react';
import {
  X,
  Trophy,
  CheckCircle2,
  Lock,
  Flame,
  Award,
  TrendingUp,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const QuestsAndLeaderboardModal: React.FC = () => {
  const {
    isLeaderboardOpen,
    setIsLeaderboardOpen,
    quests,
    claimQuestReward,
    badges,
    leaderboard,
    xp,
    level,
    rankTitle,
    streak
  } = useGame();

  const [activeTab, setActiveTab] = useState<'quests' | 'badges' | 'leaderboard'>('quests');

  if (!isLeaderboardOpen) return null;

  // XP Progress towards next level
  const currentLevelBaseXP = (level - 1) * 400;
  const nextLevelXP = level * 400;
  const progressInLevel = xp - currentLevelBaseXP;
  const levelPercent = Math.min(100, Math.max(0, (progressInLevel / 400) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E222D] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-[#E0E3EB] dark:border-[#2A2E39] flex flex-col text-[#131722] dark:text-[#D1D4DC]">
        {/* Header */}
        <div className="p-5 border-b border-[#E0E3EB] dark:border-[#2A2E39] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#131722] dark:text-white">Trading Arena & Quests</h3>
              <p className="text-xs text-[#787B86] dark:text-[#868993]">Complete challenges, build streaks, and climb the ranks</p>
            </div>
          </div>
          <button
            onClick={() => setIsLeaderboardOpen(false)}
            className="p-1.5 text-[#787B86] hover:text-[#131722] dark:hover:text-white rounded-lg hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Rank & XP Progress Banner */}
        <div className="px-5 py-4 bg-[#F8FAFD] dark:bg-[#171A24] border-b border-[#E0E3EB] dark:border-[#2A2E39]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#2962FF] text-white flex items-center justify-center font-bold text-xs">
                {level}
              </div>
              <div>
                <span className="font-extrabold text-sm text-[#131722] dark:text-white">{rankTitle}</span>
                <span className="text-xs text-[#787B86] ml-2">Level {level}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 font-bold text-amber-500">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>{streak}x Streak</span>
              </div>
              <span className="font-mono font-bold text-[#2962FF]">{xp} XP Total</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#E0E3EB] dark:bg-[#2A2E39] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#2962FF] to-[#00BCD4] h-full rounded-full transition-all duration-500"
              style={{ width: `${levelPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-[#787B86] dark:text-[#868993] mt-1 font-mono">
            <span>{progressInLevel} / 400 XP</span>
            <span>Next Rank: Level {level + 1}</span>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#E0E3EB] dark:border-[#2A2E39] px-5 bg-white dark:bg-[#1E222D]">
          <button
            onClick={() => setActiveTab('quests')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition ${
              activeTab === 'quests'
                ? 'border-[#2962FF] text-[#2962FF]'
                : 'border-transparent text-[#787B86] hover:text-[#131722] dark:hover:text-white'
            }`}
          >
            Daily Quests
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition ${
              activeTab === 'badges'
                ? 'border-[#2962FF] text-[#2962FF]'
                : 'border-transparent text-[#787B86] hover:text-[#131722] dark:hover:text-white'
            }`}
          >
            Trader Badges ({badges.filter((b) => b.unlocked).length}/{badges.length})
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition ${
              activeTab === 'leaderboard'
                ? 'border-[#2962FF] text-[#2962FF]'
                : 'border-transparent text-[#787B86] hover:text-[#131722] dark:hover:text-white'
            }`}
          >
            Global Leaderboard
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'quests' && (
            <div className="space-y-3">
              {quests.map((quest) => {
                const pct = Math.min(100, (quest.progress / quest.target) * 100);
                return (
                  <div
                    key={quest.id}
                    className={`p-4 rounded-xl border transition ${
                      quest.claimed
                        ? 'bg-[#F8FAFD] dark:bg-[#171A24] border-[#E0E3EB] dark:border-[#2A2E39] opacity-75'
                        : quest.completed
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-[#1E222D] border-[#E0E3EB] dark:border-[#2A2E39]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="font-bold text-sm text-[#131722] dark:text-white flex items-center gap-2">
                          <span>{quest.title}</span>
                          {quest.claimed && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#787B86] dark:text-[#868993] mt-0.5">
                          {quest.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-[#2962FF]">+{quest.rewardXP} XP</div>
                        <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                          +${quest.rewardCash} Cash
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-3">
                      <div className="flex-1">
                        <div className="w-full bg-[#E0E3EB] dark:bg-[#2A2E39] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              quest.completed ? 'bg-emerald-500' : 'bg-[#2962FF]'
                            }`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono text-[#787B86] mt-1 inline-block">
                          Progress: {quest.progress} / {quest.target}
                        </span>
                      </div>

                      {quest.completed && !quest.claimed && (
                        <button
                          onClick={() => claimQuestReward(quest.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition active:scale-95 shrink-0"
                        >
                          Claim Reward
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                    badge.unlocked
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                      : 'bg-[#F8FAFD] dark:bg-[#171A24] border-[#E0E3EB] dark:border-[#2A2E39] opacity-60'
                  }`}
                >
                  <div className="text-2xl p-2 rounded-xl bg-white dark:bg-[#1E222D] shadow-2xs shrink-0">
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#131722] dark:text-white flex items-center gap-1.5">
                      <span>{badge.name}</span>
                      {badge.unlocked && (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#787B86] dark:text-[#868993] mt-1 leading-snug">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-xs text-[#787B86] border-b border-[#E0E3EB] dark:border-[#2A2E39]">
                    <th className="py-2.5 font-medium">Rank</th>
                    <th className="py-2.5 font-medium">Trader</th>
                    <th className="py-2.5 font-medium text-right">Portfolio</th>
                    <th className="py-2.5 font-medium text-right">Return</th>
                    <th className="py-2.5 font-medium text-right">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F3FA] dark:divide-[#2A2E39]">
                  {leaderboard.map((user) => (
                    <tr
                      key={user.rank}
                      className={`${
                        user.isCurrentUser
                          ? 'bg-blue-50/70 dark:bg-blue-950/30 font-semibold'
                          : 'hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39]/40'
                      } transition`}
                    >
                      <td className="py-3 font-bold font-mono">
                        {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{user.avatar}</span>
                          <div>
                            <div className="text-[#131722] dark:text-white flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {user.isCurrentUser && (
                                <span className="text-[10px] bg-[#2962FF] text-white px-1.5 py-0.2 rounded font-bold">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#787B86]">{user.title} · Lv {user.level}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-[#131722] dark:text-white">
                        ${user.portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td
                        className={`py-3 text-right font-mono font-bold ${
                          user.weeklyReturnPercent >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {user.weeklyReturnPercent >= 0 ? `+${user.weeklyReturnPercent}%` : `${user.weeklyReturnPercent}%`}
                      </td>
                      <td className="py-3 text-right font-mono">
                        <span className="inline-flex items-center gap-0.5 text-amber-500 font-bold">
                          {user.winStreak}🔥
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
