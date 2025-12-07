import { useState } from "react";
import { Clock, Edit2, Trash2, Save, X, Loader2, Activity } from "lucide-react";
import type { Activity as ActivityType } from "@/shared/types";

interface ActivityListProps {
  activities: ActivityType[];
  isLoading: boolean;
  onUpdate: (id: number, name: string, category: string, minutes: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
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

const CATEGORY_COLORS: Record<string, string> = {
  Work: "from-blue-500 to-cyan-500",
  Exercise: "from-green-500 to-emerald-500",
  Learning: "from-purple-500 to-pink-500",
  Sleep: "from-indigo-500 to-blue-500",
  Meals: "from-orange-500 to-red-500",
  Commute: "from-gray-500 to-slate-500",
  Entertainment: "from-pink-500 to-rose-500",
  Social: "from-cyan-500 to-teal-500",
  Chores: "from-amber-500 to-yellow-500",
  Other: "from-slate-500 to-gray-500",
};

export default function ActivityList({ activities, isLoading, onUpdate, onDelete }: ActivityListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editMinutes, setEditMinutes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = (activity: ActivityType) => {
    setEditingId(activity.id);
    setEditName(activity.name);
    setEditCategory(activity.category);
    setEditMinutes(activity.minutes.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCategory("");
    setEditMinutes("");
  };

  const saveEdit = async (id: number) => {
    const minutesNum = parseInt(editMinutes);
    if (isNaN(minutesNum) || minutesNum < 1) {
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(id, editName, editCategory, minutesNum);
      cancelEdit();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      await onDelete(id);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse-slow"></div>
            <Loader2 className="relative w-12 h-12 text-blue-600 dark:text-purple-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative w-28 h-28 glass-card rounded-3xl flex items-center justify-center">
              <Activity className="w-14 h-14 text-blue-600 dark:text-purple-400 animate-float" />
            </div>
          </div>
          <h3 className="text-2xl heading-font text-slate-800 dark:text-white mb-3">
            No activities yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-sm">
            Start tracking your time by adding your first activity above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-xl heading-font text-slate-800 dark:text-white mb-5">
        Today's Activities
      </h3>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="glass-card p-4 rounded-xl hover:scale-[1.02] transition-all duration-300 group/item"
          >
            {editingId === activity.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                  maxLength={100}
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={editMinutes}
                    onChange={(e) => setEditMinutes(e.target.value)}
                    min="1"
                    max="1440"
                    className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(activity.id)}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
                    {activity.name}
                  </h4>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={`px-3 py-1 bg-gradient-to-r ${CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.Other} text-white rounded-lg font-medium shadow-lg`}>
                      {activity.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4" />
                      {Math.floor(activity.minutes / 60)}h {activity.minutes % 60}m
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => startEdit(activity)}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 hover:scale-110"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
