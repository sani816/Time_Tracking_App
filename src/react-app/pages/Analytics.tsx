import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { ArrowLeft, PieChart, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { useActivities } from "@/react-app/hooks/useActivities";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";

const CATEGORY_COLORS: Record<string, string> = {
  Work: "#3b82f6",
  Exercise: "#10b981",
  Learning: "#8b5cf6",
  Social: "#ec4899",
  Entertainment: "#eab308",
  Sleep: "#6366f1",
  Meals: "#f97316",
  Commute: "#6b7280",
  Chores: "#14b8a6",
  Other: "#64748b",
};

export default function Analytics() {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();
  const { activities, loading } = useActivities();

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/");
    }
  }, [user, isPending, navigate]);

  if (isPending || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-600 border-t-transparent"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <header className="bg-gray-900 shadow-sm border-b border-cyan-500 neon-border-cyan">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-12 h-12 text-violet-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">No Data Available</h1>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                Start tracking your activities to see beautiful insights and analytics about how you spend your time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <PieChart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-900">Category Distribution</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-900">Daily Breakdown</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6">
                <TrendingUp className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-pink-900">Trends Over Time</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              Start Tracking Activities
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Calculate analytics data
  const categoryData: Record<string, number> = {};
  const dailyData: Record<string, number> = {};
  
  activities.forEach((activity) => {
    categoryData[activity.category] = (categoryData[activity.category] || 0) + activity.minutes;
    dailyData[activity.date] = (dailyData[activity.date] || 0) + activity.minutes;
  });

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
    hours: (value / 60).toFixed(1),
  }));

  const barData = Object.entries(dailyData)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 14)
    .reverse()
    .map(([date, minutes]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      minutes,
      hours: (minutes / 60).toFixed(1),
    }));

  const totalMinutes = activities.reduce((sum, act) => sum + act.minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const avgMinutesPerDay = dailyData ? totalMinutes / Object.keys(dailyData).length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-xl font-bold neon-text-cyan animate-neon-pulse">
            Analytics Dashboard
          </h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 neon-border-cyan">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center neon-glow-cyan">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-cyan-300">Total Tracked</h3>
            </div>
            <p className="text-3xl font-bold text-cyan-400">{totalHours}h</p>
            <p className="text-sm text-gray-400 mt-1">{activities.length} activities</p>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 neon-border-pink">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center neon-glow-pink">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-pink-300">Days Tracked</h3>
            </div>
            <p className="text-3xl font-bold text-pink-400">{Object.keys(dailyData).length}</p>
            <p className="text-sm text-gray-400 mt-1">Unique dates</p>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 neon-border-purple">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center neon-glow-purple">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-purple-300">Daily Average</h3>
            </div>
            <p className="text-3xl font-bold text-purple-400">{(avgMinutesPerDay / 60).toFixed(1)}h</p>
            <p className="text-sm text-gray-400 mt-1">{avgMinutesPerDay.toFixed(0)} minutes/day</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 neon-border-cyan">
            <h2 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-cyan-400" />
              Time by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || "#64748b"} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} min (${(value / 60).toFixed(1)}h)`, 'Time']}
                />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[item.name] || "#64748b" }}
                  ></div>
                  <span className="text-xs text-gray-300">
                    {item.name}: {item.hours}h
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 neon-border-pink">
            <h2 className="text-lg font-semibold text-pink-300 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-pink-400" />
              Daily Time Tracking
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value} min (${(value / 60).toFixed(1)}h)`, 'Time']}
                />
                <Bar dataKey="minutes" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Line Chart */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 neon-border-purple">
          <h2 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Time Tracking Trend
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [`${value} min (${(value / 60).toFixed(1)}h)`, 'Time']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
