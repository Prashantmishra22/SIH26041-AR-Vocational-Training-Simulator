import React from 'react';
import { Flame, ShieldAlert, Cross, HardHat } from 'lucide-react';

interface TrainingModulesProgressListProps {
  onViewAll?: () => void;
}

export const TrainingModulesProgressList: React.FC<TrainingModulesProgressListProps> = ({ onViewAll }) => {
  const modules = [
    {
      id: 'm1',
      title: 'Fire Safety',
      completed: '245/320 completed',
      percent: 76,
      icon: Flame,
      iconBg: 'bg-orange-50 text-orange-600',
    },
    {
      id: 'm2',
      title: 'Mine Equipment Safety',
      completed: '180/320 completed',
      percent: 56,
      icon: HardHat,
      iconBg: 'bg-rose-50 text-rose-600',
    },
    {
      id: 'm3',
      title: 'Emergency Response',
      completed: '210/320 completed',
      percent: 66,
      icon: ShieldAlert,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'm4',
      title: 'First Aid',
      completed: '300/320 completed',
      percent: 94,
      icon: Cross,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900">Training Modules</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Modules List */}
      <div className="space-y-4 my-auto">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.id} className="flex items-center justify-between gap-3">
              {/* Left: Icon + Title + Completed */}
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate">{m.title}</div>
                  <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{m.completed}</div>
                </div>
              </div>

              {/* Right: Inline Progress Bar + Percentage */}
              <div className="flex items-center space-x-3 shrink-0">
                <div className="w-16 sm:w-20 md:w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${m.percent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 min-w-[32px] text-right">
                  {m.percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
