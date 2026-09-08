import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  colorScheme: 'amber' | 'emerald' | 'blue' | 'purple' | 'cyan' | 'rose';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  colorScheme,
}) => {
  const colorMap = {
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      glow: 'group-hover:shadow-amber-500/10',
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      glow: 'group-hover:shadow-emerald-500/10',
    },
    blue: {
      border: 'hover:border-blue-500/40',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
      glow: 'group-hover:shadow-blue-500/10',
    },
    purple: {
      border: 'hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      glow: 'group-hover:shadow-purple-500/10',
    },
    cyan: {
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      glow: 'group-hover:shadow-cyan-500/10',
    },
    rose: {
      border: 'hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      glow: 'group-hover:shadow-rose-500/10',
    },
  };

  const currentTheme = colorMap[colorScheme];

  return (
    <div
      className={`glass-card rounded-2xl p-5 border border-slate-800/80 transition-all duration-300 group hover:translate-y-[-2px] hover:shadow-xl ${currentTheme.border} ${currentTheme.glow}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mt-1.5 tracking-tight font-['JetBrains_Mono',monospace]">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl border ${currentTheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
        {change && (
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span className={isPositive ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {change}
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        )}
        {subtitle && <span className="text-slate-400 font-medium">{subtitle}</span>}
      </div>
    </div>
  );
};
