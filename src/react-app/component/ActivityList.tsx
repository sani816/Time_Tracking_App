import { useState } from "react";
import { Pencil, Trash2, Clock } from "lucide-react";
import type { Activity, UpdateActivityInput } from "@/shared/types";

interface ActivityListProps {
  activities: Activity[];
  onUpdate: () => void;
  onDelete: () => void;
}

const CATEGORIES = [
  "Work",
  "Exercise",
  "Learning",
  "Social",
  "Entertainment",
  "Sleep",
  "Meals",
  "Commute",
  "Chores",
  "Other",
];

export default function ActivityList({ activities, onUpdate, onDelete }: ActivityListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<UpdateActivityInput>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setEditForm({
      name: activity.name,
      category: activity.category,
      minutes: activity.minutes,
    });
    setError(null);
  };

  const handleUpdate = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update activity");
      }

      setEditingId(null);
      setEditForm({});
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete activity");
      }

      onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Work: "bg-blue-100 text-blue-700",
      Exercise: "bg-green-100 text-green-700",
      Learning: "bg-purple-100 text-purple-700",
      Social: "bg-pink-100 text-pink-700",
      Entertainment: "bg-yellow-100 text-yellow-700",
      Sleep: "bg-indigo-100 text-indigo-700",
      Meals: "bg-orange-100 text-orange-700",
      Commute: "bg-gray-100 text-gray-700",
      Chores: "bg-teal-100 text-teal-700",
      Other: "bg-slate-100 text-slate-700",
    };
    return colors[category] || colors.Other;
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl neon-border-purple">
        <Clock className="w-16 h-16 text-purple-400 mx-auto mb-4 neon-glow-purple" />
        <p className="text-purple-300 text-lg font-medium">No activities yet</p>
        <p className="text-gray-400 text-sm mt-2">Add your first activity to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 neon-border-purple overflow-hidden"
        >
          {editingId === activity.id ? (
            <div className="p-4 space-y-3">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-purple-500 text-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Activity name"
              />
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-purple-500 text-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={editForm.minutes}
                onChange={(e) => setEditForm({ ...editForm, minutes: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-700 border border-purple-500 text-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500"
                min="1"
                max="1440"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(activity.id)}
                  disabled={loading}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 neon-glow-purple transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditForm({});
                    setError(null);
                  }}
                  className="px-4 py-2 border border-purple-500 text-purple-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-cyan-300">{activity.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                    {activity.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{activity.minutes} minutes</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(activity)}
                  className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-900 rounded-lg transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(activity.id)}
                  className="p-2 text-gray-400 hover:text-pink-400 hover:bg-pink-900 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
