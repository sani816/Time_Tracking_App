import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { LogOut, Calendar, BarChart3, Clock, TrendingUp } from "lucide-react";
import { useActivitiesByDate } from "@/react-app/hooks/useActivities";
import ActivityForm from "@/react-app/components/ActivityForm";
import ActivityList from "@/react-app/components/ActivityList";

export default function Dashboard() {
  const { user, isPending, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { activities, loading, refetch } = useActivitiesByDate(selectedDate);

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/");
    }
  }, [user, isPending, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isPending || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-600 border-t-transparent"></div>
      </div>
    );
  }

  const totalMinutes = activities.reduce((sum, act) => sum + act.minutes, 0);
  const remainingMinutes = 1440 - totalMinutes;
  const percentageUsed = (totalMinutes / 1440) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900 shadow-sm border-b border-cyan-500 neon-border-cyan">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center neon-glow-cyan">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold neon-text-cyan animate-neon-pulse">
              TimeGenious
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <img
                src={user.google_user_data.picture || ""}
                alt={user.google_user_data.name || "User"}
                className="w-8 h-8 rounded-full ring-2 ring-cyan-400 neon-glow-cyan"
              />
              <span className="text-sm font-medium text-gray-700">
                {user.google_user_data.name || user.email}
              </span>
            </div>
            <button
              onClick={() => navigate("/analytics")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 neon-glow-cyan transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Date Selector Card */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 neon-border-cyan">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <h2 className="font-semibold text-cyan-300">Select Date</h2>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={format(new Date(), "yyyy-MM-dd")}
              className="w-full px-4 py-2 bg-gray-700 border border-cyan-500 text-cyan-100 rounded-lg focus:ring-2 focus:ring-cyan-500 neon-glow-cyan transition-all"
            />
            <p className="text-sm text-gray-400 mt-2">
              {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
            </p>
          </div>

          {/* Time Stats Card */}
          <div className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white neon-glow-pink">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" />
              <h2 className="font-semibold">Time Used</h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{totalMinutes}</span>
                <span className="text-purple-200">/ 1440 min</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-400 h-full rounded-full transition-all duration-500 neon-glow-cyan"
                  style={{ width: `${percentageUsed}%` }}
                ></div>
              </div>
              <p className="text-sm text-purple-100">
                {activities.length} {activities.length === 1 ? "activity" : "activities"} logged
              </p>
            </div>
          </div>

          {/* Remaining Time Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white neon-glow-green">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" />
              <h2 className="font-semibold">Time Remaining</h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{remainingMinutes}</span>
                <span className="text-green-100">minutes</span>
              </div>
              <p className="text-sm text-green-100">
                {((remainingMinutes / 60).toFixed(1))} hours available
              </p>
            </div>
          </div>
        </div>

        

        {/* Activity Management */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <ActivityForm
              date={selectedDate}
              onSuccess={refetch}
              remainingMinutes={remainingMinutes}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Activities for {format(new Date(selectedDate), "MMM d, yyyy")}
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-violet-600 border-t-transparent"></div>
              </div>
            ) : (
              <ActivityList
                activities={activities}
                onUpdate={refetch}
                onDelete={refetch}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
