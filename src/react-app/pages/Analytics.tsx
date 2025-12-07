import { useNavigate } from "react-router";
import { ArrowLeft, TrendingUp, PieChart, BarChart3, Sparkles, Brain } from "lucide-react";
import Header from "@/react-app/components/Header";
import { useActivityStats } from "@/react-app/hooks/useActivityStats";
import CategoryChart from "@/react-app/components/CategoryChart";
import DailyTrendChart from "@/react-app/components/DailyTrendChart";

export default function Analytics() {
  const navigate = useNavigate();
  const { stats, isLoading } = useActivityStats();

  const hasData = stats.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Header onAnalyticsClick={() => navigate("/analytics")} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-3 glass-card rounded-xl hover:bg-blue-500/10 dark:hover:bg-purple-500/10 hover:scale-110 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-4xl heading-font text-slate-800 dark:text-white mb-2 flex items-center gap-3">
              Analytics Dashboard
              <Brain className="w-8 h-8 text-purple-500 dark:text-purple-400" />
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Visualize patterns, track trends, and unlock productivity insights
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse-slow"></div>
              <TrendingUp className="relative w-16 h-16 text-blue-600 dark:text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative w-40 h-40 glass-card rounded-3xl flex items-center justify-center neon-glow">
                <BarChart3 className="w-20 h-20 text-blue-600 dark:text-purple-400 animate-float" />
              </div>
            </div>
            <h2 className="text-3xl heading-font text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              No Data Available Yet
              <Sparkles className="w-6 h-6 text-purple-500 dark:text-purple-400 animate-pulse" />
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md text-center">
              Start tracking your activities to unlock beautiful charts and intelligent insights about your time usage.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 neon-glow-hover"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-transform duration-500 group-hover:scale-110"></div>
              <span className="relative heading-font">Start Tracking</span>
              <TrendingUp className="relative w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-2xl group hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center neon-glow">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm heading-font text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Total Days
                    </h3>
                  </div>
                  <p className="text-4xl heading-font text-slate-800 dark:text-white">
                    {new Set(stats.map(s => s.activity_date)).size}
                  </p>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl group hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center neon-glow">
                      <PieChart className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm heading-font text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Categories
                    </h3>
                  </div>
                  <p className="text-4xl heading-font text-slate-800 dark:text-white">
                    {new Set(stats.map(s => s.category)).size}
                  </p>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl group hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center neon-glow">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm heading-font text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Total Hours
                    </h3>
                  </div>
                  <p className="text-4xl heading-font text-slate-800 dark:text-white">
                    {Math.round(stats.reduce((sum, s) => sum + s.total_minutes, 0) / 60)}
                  </p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              <CategoryChart stats={stats} />
              <DailyTrendChart stats={stats} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
