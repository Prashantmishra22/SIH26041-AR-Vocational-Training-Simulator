import React from 'react';
import {
  CheckCircle2,
  UserPlus,
  PlayCircle,
  Award,
  BatteryWarning
} from 'lucide-react';

interface RecentActivityListProps {
  onViewAll?: () => void;
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ onViewAll }) => {
  const activities = [
    {
      id: 'a1',
      icon: CheckCircle2,
      iconColor: 'bg-emerald-50 text-emerald-600',
      title: (
        <>
          <span className="font-bold text-slate-900">Ravi Kumar</span>{' '}
          <span className="text-slate-500 font-normal">completed</span>{' '}
          <span className="font-semibold text-slate-700">Fire Safety Training</span>
        </>
      ),
      time: '2 mins ago',
    },
    {
      id: 'a2',
      icon: UserPlus,
      iconColor: 'bg-blue-50 text-blue-600',
      title: (
        <>
          <span className="font-bold text-slate-900">New worker registered</span>
          <br />
          <span className="text-slate-500 font-medium">Sita Devi</span>
        </>
      ),
      time: '15 mins ago',
    },
    {
      id: 'a3',
      icon: PlayCircle,
      iconColor: 'bg-rose-50 text-rose-600',
      title: (
        <>
          <span className="font-bold text-slate-900">Aman Toppo</span>{' '}
          <span className="text-slate-500 font-normal">started</span>{' '}
          <span className="font-semibold text-slate-700">Equipment Safety</span>
        </>
      ),
      time: '28 mins ago',
    },
    {
      id: 'a4',
      icon: Award,
      iconColor: 'bg-amber-50 text-amber-600',
      title: (
        <>
          <span className="font-bold text-slate-900">Certificate issued</span>
          <br />
          <span className="text-slate-500 font-medium">(CT-2025-0842)</span>
        </>
      ),
      time: '45 mins ago',
    },
    {
      id: 'a5',
      icon: BatteryWarning,
      iconColor: 'bg-rose-50 text-rose-600',
      title: (
        <>
          <span className="font-bold text-slate-900">Low device battery</span>
          <br />
          <span className="text-slate-500 font-medium">Device: JH1024</span>
        </>
      ),
      time: '1 hour ago',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-3.5 my-auto">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="flex items-start justify-between space-x-3">
              <div className="flex items-start space-x-3 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${act.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs leading-relaxed min-w-0">{act.title}</div>
              </div>
              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap shrink-0 pt-0.5">
                {act.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
