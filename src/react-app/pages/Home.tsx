import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { Clock, BarChart3, TrendingUp, Zap, Brain, Target, Sparkles, Moon, Sun } from "lucide-react";
import { useTheme } from "@/react-app/context/ThemeContext";

export default function Home() {
  const navigate = useNavigate();
  const { user, isPending, redirectToLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse-slow"></div>
          <Clock className="relative w-16 h-16 text-blue-600 dark:text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 glass-card rounded-xl hover:scale-110 transition-all duration-300"
        >
          {theme === "light" ? (
            <Moon className="w-6 h-6 text-slate-600" />
          ) : (
            <Sun className="w-6 h-6 text-slate-300" />
          )}
        </button>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-8 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-slow"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center neon-glow transform group-hover:scale-110 transition-all duration-500">
              <Clock className="w-14 h-14 text-white" />
            </div>
          </div>
          
          <h1 className="text-7xl md:text-8xl heading-font mb-6 relative">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-pulse-slow">
              Timegenious
            </span>
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400 animate-pulse" />
            <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">
              The Future of Time Tracking
            </p>
            <Sparkles className="w-5 h-5 text-blue-500 dark:text-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Experience intelligent time tracking with beautiful analytics, 
            futuristic design, and insights that transform your productivity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          <div className="glass-card p-8 rounded-3xl group hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 neon-glow-hover transform group-hover:rotate-6 transition-all duration-500">
                <Brain className="w-9 h-9 text-white" />
              </div>
              <h3 className="text-2xl heading-font text-slate-800 dark:text-slate-100 mb-4">
                Intelligent Tracking
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Smart activity logging with automatic validation ensuring you never exceed 24 hours per day.
              </p>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl group hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 neon-glow-hover transform group-hover:rotate-6 transition-all duration-500">
                <BarChart3 className="w-9 h-9 text-white" />
              </div>
              <h3 className="text-2xl heading-font text-slate-800 dark:text-slate-100 mb-4">
                Futuristic Analytics
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Beautiful visualizations with neon-accented charts revealing your productivity patterns.
              </p>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl group hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 neon-glow-hover transform group-hover:rotate-6 transition-all duration-500">
                <Target className="w-9 h-9 text-white" />
              </div>
              <h3 className="text-2xl heading-font text-slate-800 dark:text-slate-100 mb-4">
                Goal-Oriented Design
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Track trends, optimize schedules, and achieve peak productivity with actionable insights.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button
            onClick={redirectToLogin}
            className="group relative inline-flex items-center gap-3 px-12 py-5 text-xl font-semibold text-white rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 neon-glow-hover"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-transform duration-500 group-hover:scale-110"></div>
            <Zap className="relative w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative heading-font">Launch Into the Future</span>
            <TrendingUp className="relative w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <p className="mt-6 text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Free forever • No credit card required • Secure with Google
          </p>
        </div>
      </div>
    </div>
  );
}
