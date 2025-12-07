import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import type { ActivityStats } from "@/shared/types";

interface CategoryChartProps {
  stats: ActivityStats[];
}

const COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#14b8a6", // teal
  "#f97316", // orange
  "#84cc16", // lime
];

export default function CategoryChart({ stats }: CategoryChartProps) {
  // Aggregate by category
  const categoryData = stats.reduce((acc, stat) => {
    const existing = acc.find(item => item.category === stat.category);
    if (existing) {
      existing.minutes += stat.total_minutes;
    } else {
      acc.push({
        category: stat.category,
        minutes: stat.total_minutes,
      });
    }
    return acc;
  }, [] as { category: string; minutes: number }[]);

  const chartData = categoryData.map(item => ({
    name: item.category,
    value: item.minutes,
    hours: (item.minutes / 60).toFixed(1),
  }));

  return (
    <div className="glass-card p-6 rounded-2xl group hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center neon-glow">
          <PieChartIcon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl heading-font text-slate-800 dark:text-white">
          Time by Category
        </h3>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `${(value / 60).toFixed(1)} hours`}
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.95)', 
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              color: '#f1f5f9',
              boxShadow: '0 8px 32px rgba(79, 70, 229, 0.3)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 group/item">
            <div
              className="w-4 h-4 rounded-full shadow-lg"
              style={{ 
                backgroundColor: COLORS[index % COLORS.length],
                boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}40`
              }}
            />
            <span className="text-sm text-slate-700 dark:text-slate-200 group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors">
              {item.name}: <span className="font-bold">{item.hours}h</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
