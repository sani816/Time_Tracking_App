import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { format } from "date-fns";
import { Sparkles } from "lucide-react";
import Header from "@/react-app/components/Header";
import DateSelector from "@/react-app/components/DateSelector";
import ActivityForm from "@/react-app/components/ActivityForm";
import ActivityList from "@/react-app/components/ActivityList";
import DayProgress from "@/react-app/components/DayProgress";
import { useActivities } from "@/react-app/hooks/useActivities";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { activities, totalMinutes, isLoading, addActivity, updateActivity, deleteActivity } = useActivities(selectedDate);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <Header onAnalyticsClick={() => navigate("/analytics")} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl heading-font text-slate-800 dark:text-white mb-3 flex items-center gap-3">
            Welcome back, {user?.google_user_data?.given_name || "User"}
            <Sparkles className="w-7 h-7 text-purple-500 dark:text-purple-400 animate-pulse" />
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Track your activities and optimize your time with intelligent insights
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <DayProgress totalMinutes={totalMinutes} />
            <ActivityForm 
              selectedDate={selectedDate} 
              onActivityAdded={addActivity}
              remainingMinutes={1440 - totalMinutes}
            />
          </div>

          {/* Right column - Activity list */}
          <div className="lg:col-span-2">
            <ActivityList
              activities={activities}
              isLoading={isLoading}
              onUpdate={updateActivity}
              onDelete={deleteActivity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
