import React from 'react';
import { ChevronDown } from 'lucide-react';

export const TrainingProgressDonut: React.FC = () => {
  // 68% completed (green), ~22% in progress (blue), ~10% not started (gray)
  const radius = 54;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const greenOffset = circumference * (1 - 0.68);
  const blueOffset = circumference * (1 - 0.22);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header with Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900">Training Progress Overview</h3>
        <button className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
          <span>Last 30 Days</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Donut Chart and Legend */}
      <div className="flex items-center justify-between gap-4 my-auto">
        {/* Donut Chart SVG */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
            {/* Base Not Started Circle (Slate-300, 10%) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#CBD5E1"
              strokeWidth={strokeWidth}
            />
            {/* Blue Arc (In Progress + Completed up to 90%) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#2563EB"
              strokeWidth={strokeWidth}
              strokeDasharray={`${0.90 * circumference} ${circumference}`}
              strokeDashoffset="0"
            />
            {/* Green Arc (Completed 68%) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#10B981"
              strokeWidth={strokeWidth}
              strokeDasharray={`${0.68 * circumference} ${circumference}`}
              strokeDashoffset="0"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">68%</span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">Overall Completion</span>
          </div>
        </div>

        {/* Right Legend */}
        <div className="flex-1 space-y-3 pl-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-slate-600 font-medium">Completed</span>
            </div>
            <span className="font-bold text-slate-900">3,482</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              <span className="text-slate-600 font-medium">In Progress</span>
            </div>
            <span className="font-bold text-slate-900">1,124</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
              <span className="text-slate-600 font-medium">Not Started</span>
            </div>
            <span className="font-bold text-slate-900">1,216</span>
          </div>
        </div>
      </div>
    </div>
  );
};
