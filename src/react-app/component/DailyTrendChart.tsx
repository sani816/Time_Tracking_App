import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { TrendingUp } from "lucide-react";
import type { ActivityStats } from "@/shared/types";

interface DailyTrendChartProps {
  stats: ActivityStats[];
}

export default function DailyTrendChart({ stats }: DailyTrendChartProps) {
  // Aggregate by date
  const dailyData = stats.reduce((acc, stat) => {
    const existing = acc.find(item => item.date === stat.activity_date);
    if (existing) {
      existing.minutes += stat.total_minutes;
    } else {
      acc.push({
        date: stat.activity_date,
        minutes: stat.total_minutes,
      });
    }
    return acc;
  }, [] as { date: string; minutes: number }[]);

  // Sort by date and take last 14 days
  const chartData = dailyData
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14)
    .map(item => ({
      date: format(parseISO(item.date), "MMM d"),
      hours: Number((item.minutes / 60).toFixed(1)),
      minutes: item.minutes,
    }));

  return (
    <div className="glass-card p-6 rounded-2xl group hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center neon-glow">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl heading-font text-slate-800 dark:text-white">
          Daily Activity Trend
        </h3>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
            stroke="rgba(148, 163, 184, 0.3)"
          />
          <YAxis 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={{ 
              value: 'Hours', 
              angle: -90, 
              position: 'insideLeft', 
              fill: '#94a3b8',
              style: { fontWeight: 600 }
            }}
            stroke="rgba(148, 163, 184, 0.3)"
          />
          <Tooltip 
            formatter={(value: number) => [`${value} hours`, 'Time Tracked']}
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.95)', 
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              color: '#f1f5f9',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
            }}
          />
          <Bar 
            dataKey="hours" 
            fill="url(#barGradient)"
            radius={[8, 8, 0, 0]}
            className="hover:opacity-80 transition-opacity duration-300"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
