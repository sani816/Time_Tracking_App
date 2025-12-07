import { Clock, Zap } from "lucide-react";

interface DayProgressProps {
  totalMinutes: number;
}

export default function DayProgress({ totalMinutes }: DayProgressProps) {
  const percentage = (totalMinutes / 1440) * 100;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const remainingMinutes = 1440 - totalMinutes;
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;

  return (
    <div className="glass-card p-6 rounded-2xl group hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl heading-font text-slate-800 dark:text-white">
          Day Progress
        </h3>
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center neon-glow">
          <Zap className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="relative h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-5">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full transition-all duration-500 neon-glow"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Tracked:
          </span>
          <span className="heading-font text-lg text-slate-800 dark:text-white">
            {hours}h {minutes}m
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600 dark:text-slate-400">Remaining:</span>
          <span className="heading-font text-lg text-purple-600 dark:text-purple-400">
            {remainingHours}h {remainingMins}m
          </span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-300/30 dark:border-slate-600/30">
          <span className="text-slate-600 dark:text-slate-400">Total Day:</span>
          <span className="heading-font text-lg text-slate-800 dark:text-white">24h 0m</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 dark:border-purple-500/20">
        <p className="text-xs text-center text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            {percentage.toFixed(1)}%
          </span> of your day tracked
        </p>
      </div>
    </div>
  );
}
