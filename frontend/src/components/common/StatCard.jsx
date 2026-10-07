import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend, trendLabel }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-600',
      border: 'border-blue-100',
      accent: 'from-blue-500 to-indigo-600',
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-600',
      border: 'border-purple-100',
      accent: 'from-purple-500 to-pink-600',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      accent: 'from-emerald-500 to-teal-600',
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-600',
      border: 'border-amber-100',
      accent: 'from-amber-500 to-orange-600',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-card border border-slate-100/80 transition-all duration-200 hover:shadow-card-hover hover:border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className="mt-2 flex items-center text-xs">
              <span
                className={`font-semibold ${
                  trend >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {trend >= 0 ? `+${trend}%` : `${trend}%`}
              </span>
              {trendLabel && <span className="ml-1.5 text-slate-400">{trendLabel}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${scheme.accent} opacity-80`} />
    </div>
  );
};

export default StatCard;
