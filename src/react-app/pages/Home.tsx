import { useAuth } from "@getmocha/users-service/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Clock, BarChart3, Calendar, Zap } from "lucide-react";

export default function Home() {
  const { user, isPending, redirectToLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-float neon-glow-cyan"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-float neon-glow-pink" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-float neon-glow-purple" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-900 rounded-3xl shadow-2xl neon-border-cyan neon-glow-cyan flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <Clock className="w-12 h-12 text-cyan-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full shadow-lg animate-pulse neon-glow-pink"></div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            <span className="neon-text-cyan">Time</span><span className="neon-text-pink">Genious</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light">
            Smart time tracking made simple. Track your activities, analyze patterns, and master your day.
          </p>

          {/* CTA Button */}
          <button
            onClick={redirectToLogin}
            className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full shadow-2xl neon-glow-cyan hover:neon-glow-pink transform hover:scale-105 transition-all duration-300"
          >
            <span>Get Started with Google</span>
            <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="glass-effect rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 neon-border-cyan">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto neon-glow-cyan">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-cyan-300 font-semibold text-lg mb-2">Daily Tracking</h3>
              <p className="text-gray-300 text-sm">Log activities with categories and duration. Maximum 1440 minutes per day.</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 neon-border-pink">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto neon-glow-pink">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-pink-300 font-semibold text-lg mb-2">Visual Analytics</h3>
              <p className="text-gray-300 text-sm">Beautiful charts and insights to understand how you spend your time.</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 neon-border-green">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto neon-glow-green">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-green-300 font-semibold text-lg mb-2">Time Remaining</h3>
              <p className="text-gray-300 text-sm">See how many minutes you have left in your day at a glance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
