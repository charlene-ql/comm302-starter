import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, Trophy, Flame } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const Toasts: React.FC = () => {
  const { toasts, removeToast } = useGame();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl border text-xs backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-white/95 dark:bg-[#1E222D]/95 border-emerald-300 dark:border-emerald-700 text-[#131722] dark:text-white'
              : toast.type === 'badge'
              ? 'bg-white/95 dark:bg-[#1E222D]/95 border-amber-300 dark:border-amber-700 text-[#131722] dark:text-white'
              : toast.type === 'error'
              ? 'bg-white/95 dark:bg-[#1E222D]/95 border-red-300 dark:border-red-700 text-[#131722] dark:text-white'
              : 'bg-white/95 dark:bg-[#1E222D]/95 border-[#E0E3EB] dark:border-[#2A2E39] text-[#131722] dark:text-white'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            {toast.type === 'badge' && <Trophy className="w-4 h-4 text-amber-500 animate-bounce" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#2962FF]" />}
          </div>

          <div className="flex-1">
            <h5 className="font-bold text-xs leading-snug">{toast.title}</h5>
            <p className="text-[#787B86] dark:text-[#868993] text-[11px] mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#787B86] hover:text-[#131722] dark:hover:text-white shrink-0 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
