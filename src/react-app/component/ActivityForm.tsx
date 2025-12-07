import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { CreateActivityInput } from "@/shared/types";

interface ActivityFormProps {
  date: string;
  onSuccess: () => void;
  remainingMinutes: number;
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

export default function ActivityForm({ date, onSuccess, remainingMinutes }: ActivityFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CreateActivityInput>({
    date,
    name: "",
    category: "Work",
    minutes: 30,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create activity");
      }

      setFormData({ date, name: "", category: "Work", minutes: 30 });
      setIsOpen(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl neon-glow-cyan transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
      >
        <Plus className="w-5 h-5" />
        Add Activity
      </button>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 neon-border-pink">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-pink-300">New Activity</h3>
        <button
          onClick={() => {
            setIsOpen(false);
            setError(null);
          }}
          className="text-gray-400 hover:text-pink-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Activity Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-pink-500 text-pink-100 rounded-lg focus:ring-2 focus:ring-pink-500 neon-glow-pink transition-all"
            placeholder="e.g., Team Meeting"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-pink-500 text-pink-100 rounded-lg focus:ring-2 focus:ring-pink-500 transition-all"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={formData.minutes}
            onChange={(e) => setFormData({ ...formData, minutes: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 bg-gray-700 border border-pink-500 text-pink-100 rounded-lg focus:ring-2 focus:ring-pink-500 neon-glow-pink transition-all"
            min="1"
            max={remainingMinutes}
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Remaining today: {remainingMinutes} minutes
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium neon-glow-pink hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Activity"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setError(null);
            }}
            className="px-4 py-2 border border-pink-500 text-pink-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
