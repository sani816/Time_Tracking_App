import { useState } from "react";
import { Plus, Loader2, Sparkles } from "lucide-react";
import type { Activity } from "@/shared/types";

interface ActivityFormProps {
  selectedDate: string;
  onActivityAdded: (activity: Activity) => void;
  remainingMinutes: number;
}

const CATEGORIES = [
  "Work",
  "Exercise",
  "Learning",
  "Sleep",
  "Meals",
  "Commute",
  "Entertainment",
  "Social",
  "Chores",
  "Other",
];

export default function ActivityForm({ selectedDate, onActivityAdded, remainingMinutes }: ActivityFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [minutes, setMinutes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const minutesNum = parseInt(minutes);
    if (isNaN(minutesNum) || minutesNum < 1) {
      setError("Please enter valid minutes");
      return;
    }

    if (minutesNum > remainingMinutes) {
      setError(`Cannot exceed remaining ${remainingMinutes} minutes for this day`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          minutes: minutesNum,
          activity_date: selectedDate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add activity");
      }

      const activity = await response.json();
      onActivityAdded(activity);
      
      setName("");
      setMinutes("");
      setCategory(CATEGORIES[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl group hover:scale-[1.02] transition-all duration-300">
      <h3 className="text-xl heading-font text-slate-800 dark:text-white mb-5 flex items-center gap-2">
        Add Activity
        <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400" />
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-100 mb-2">
            Activity Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Morning workout"
            className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-100 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all text-slate-800 dark:text-slate-100"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-100 mb-2">
            Minutes
          </label>
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="60"
            min="1"
            max={remainingMinutes}
            className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group/btn relative w-full flex items-center justify-center gap-2 px-4 py-4 text-white rounded-xl font-semibold overflow-hidden transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-transform duration-500 group-hover/btn:scale-110"></div>
          {isSubmitting ? (
            <>
              <Loader2 className="relative w-5 h-5 animate-spin" />
              <span className="relative">Adding...</span>
            </>
          ) : (
            <>
              <Plus className="relative w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
              <span className="relative">Add Activity</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
