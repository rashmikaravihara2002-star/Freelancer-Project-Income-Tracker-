import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = {
  'In Progress': '#2563eb', // Blue
  Pending: '#f59e0b',     // Amber
  Completed: '#10b981',   // Emerald
  Cancelled: '#f43f5e',   // Rose
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-100 bg-white/95 p-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: COLORS[data.name] || '#94a3b8' }}
          />
          <span className="font-semibold text-slate-800">{data.name}:</span>
          <span className="text-slate-600">
            {data.value} projects ({data.percentage}%)
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const ProjectStatusChart = ({ data = [], total = 0 }) => {
  const activeItems = data.filter((item) => item.value > 0);

  if (!activeItems.length) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-slate-400">
        No active projects to display breakdown.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={activeItems}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {activeItems.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || '#94a3b8'}
                  stroke="none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{total}</span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Projects
          </span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="mt-2 grid grid-cols-2 gap-2 w-full px-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50 border border-slate-100/80">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[item.name] || '#94a3b8' }}
              />
              <span className="text-slate-600 truncate">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-900 ml-1">
              {item.value} <span className="text-[10px] text-slate-400 font-normal">({item.percentage}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStatusChart;
