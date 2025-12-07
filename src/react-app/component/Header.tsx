import { useAuth } from "@getmocha/users-service/react";
import { Clock, LogOut, BarChart3, Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "@/react-app/context/ThemeContext";

interface HeaderProps {
  onAnalyticsClick: () => void;
}

export default function Header({ onAnalyticsClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-blue-500/20 dark:border-purple-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center neon-glow-hover transition-all duration-300 group-hover:scale-110">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl heading-font bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Timegenious
              </h1>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Sparkles className="w-3 h-3" />
                <span>Future of Time Tracking</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAnalyticsClick}
              className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl text-slate-700 dark:text-slate-100 hover:bg-blue-500/10 dark:hover:bg-purple-500/10 hover:scale-105 transition-all duration-300"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Analytics</span>
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-300/30 dark:border-slate-600/30">
              {user?.google_user_data?.picture && (
                <img
                  src={user.google_user_data.picture}
                  alt={user.google_user_data.name || "User"}
                  className="w-10 h-10 rounded-full border-2 border-blue-400/50 dark:border-purple-400/50 hover:border-blue-500 dark:hover:border-purple-500 transition-all duration-300 hover:scale-110"
                />
              )}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl text-slate-700 dark:text-slate-100 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:scale-105 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">Logout</span>
              </button>
              <button
                onClick={toggleTheme}
                className="p-2.5 glass-card rounded-xl text-slate-600 dark:text-slate-100 hover:bg-blue-500/10 dark:hover:bg-purple-500/10 hover:scale-110 transition-all duration-300 border border-slate-300/30 dark:border-purple-500/30"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
