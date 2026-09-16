import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  colorScheme: 'blue' | 'emerald' | 'purple' | 'orange' | 'amber';
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
    blue: {
      iconBg: 'bg-blue-100/70 text-blue-600',
    },
    emerald: {
      iconBg: 'bg-emerald-100/70 text-emerald-600',
    },
    purple: {
      iconBg: 'bg-purple-100/70 text-purple-600',
    },
    orange: {
      iconBg: 'bg-orange-100/70 text-orange-600',
    },
    amber: {
      iconBg: 'bg-amber-100/70 text-amber-600',
    },
  };

  const theme = colorMap[colorScheme] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3.5 hover:shadow-sm transition-shadow">
      {/* Icon in Rounded Box */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg}`}>
        <Icon className="w-5 h-5 stroke-[2]" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-slate-600 truncate">{title}</div>
        <div className="flex items-baseline space-x-2 mt-0.5">
          <span className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {value}
          </span>
          {change && (
            <span
              className={`text-xs font-bold ${
                isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {change}
            </span>
          )}
        </div>
        {subtitle && (
          <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
