import { Calendar, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="glass-card p-6 rounded-2xl group hover:scale-[1.02] transition-all duration-300">
      <label className="flex items-center gap-2 text-sm heading-font text-slate-700 dark:text-slate-100 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        Select Date
        <Sparkles className="w-3 h-3 text-purple-500 dark:text-purple-400 ml-auto" />
      </label>
      <input
        type="date"
        value={selectedDate}
        max={today}
        onChange={(e) => onDateChange(e.target.value)}
        className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all text-slate-800 dark:text-slate-100"
      />
    </div>
  );
}
