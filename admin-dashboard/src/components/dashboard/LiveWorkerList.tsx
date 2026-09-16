import React from 'react';
import { ChevronRight, MapPin } from 'lucide-react';

interface WorkerItem {
  id: string;
  name: string;
  location: string;
  status: 'Online' | 'In Training' | 'Offline';
  module: string;
  avatarUrl?: string;
}

interface LiveWorkerListProps {
  onViewAll?: () => void;
  onSelectWorker?: (workerName: string) => void;
}

export const LiveWorkerList: React.FC<LiveWorkerListProps> = ({ onViewAll, onSelectWorker }) => {
  const workers: WorkerItem[] = [
    {
      id: 'w1',
      name: 'Ravi Kumar',
      location: 'Kusunda Mine',
      status: 'Online',
      module: 'Fire Safety Training',
      avatarUrl: '/avatar_ravi.png',
    },
    {
      id: 'w2',
      name: 'Sita Devi',
      location: 'Dhanbad Site',
      status: 'Online',
      module: 'Equipment Safety',
      avatarUrl: '/avatar_sita.svg',
    },
    {
      id: 'w3',
      name: 'Aman Toppo',
      location: 'Ranchi Plant',
      status: 'In Training',
      module: 'First Aid Module',
      avatarUrl: '/avatar_aman.svg',
    },
    {
      id: 'w4',
      name: 'Birsa Munda',
      location: 'Jamshedpur Unit',
      status: 'Offline',
      module: 'Last seen 2 hrs ago',
      avatarUrl: '/avatar_birsa.svg',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900">Live Worker Monitoring</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Workers Rows */}
      <div className="space-y-3 my-auto">
        {workers.map((w) => (
          <div
            key={w.id}
            onClick={() => onSelectWorker && onSelectWorker(w.name)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/60 transition-all cursor-pointer group"
          >
            {/* Left: Avatar + Name + Location */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 overflow-hidden shrink-0 shadow-2xs">
                <img
                  src={w.avatarUrl || '/raju_avatar.png'}
                  alt={w.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
                  {w.name}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5 truncate">
                  <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  <span>{w.location}</span>
                </div>
              </div>
            </div>

            {/* Middle: Online Status */}
            <div className="flex items-center space-x-1.5 px-2">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  w.status === 'Online'
                    ? 'bg-emerald-500'
                    : w.status === 'In Training'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
              <span
                className={`text-[11px] font-semibold whitespace-nowrap ${
                  w.status === 'Online'
                    ? 'text-slate-700'
                    : w.status === 'In Training'
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {w.status}
              </span>
            </div>

            {/* Right: Current Module & Chevron */}
            <div className="flex items-center space-x-2 text-right">
              <span className="text-[11px] text-slate-500 font-medium truncate max-w-[120px]">
                {w.module}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
