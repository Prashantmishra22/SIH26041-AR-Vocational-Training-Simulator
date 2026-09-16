import React from 'react';

export const WorkerStatusDonut: React.FC = () => {
  const radius = 52;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  // Active: 71%, Inactive: 18%, Yet to Login: 11%
  const activePercent = 0.71;
  const inactivePercent = 0.18;
  const pendingPercent = 0.11;

  const activeStroke = circumference * activePercent;
  const inactiveStroke = circumference * inactivePercent;
  const pendingStroke = circumference * pendingPercent;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900">Worker Status</h3>
      </div>

      {/* Donut & Legend */}
      <div className="flex items-center justify-between gap-4 my-auto">
        {/* Donut Chart SVG */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
            {/* Base Circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
            />
            {/* Active (Emerald 71%) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#10B981"
              strokeWidth={strokeWidth}
              strokeDasharray={`${activeStroke} ${circumference}`}
              strokeDashoffset="0"
            />
            {/* Inactive (Slate 18%) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#94A3B8"
              strokeWidth={strokeWidth}
              strokeDasharray={`${inactiveStroke} ${circumference}`}
              strokeDashoffset={-activeStroke}
            />
            {/* Yet to Login (Red 11%) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#EF4444"
              strokeWidth={strokeWidth}
              strokeDasharray={`${pendingStroke} ${circumference}`}
              strokeDashoffset={-(activeStroke + inactiveStroke)}
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">1,254</span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">Total Workers</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5 pl-2">
          <div className="text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-slate-600 font-medium">Active</span>
            </div>
            <div className="font-bold text-slate-900 pl-4.5 mt-0.5">892 (71%)</div>
          </div>

          <div className="text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
              <span className="text-slate-600 font-medium">Inactive</span>
            </div>
            <div className="font-bold text-slate-900 pl-4.5 mt-0.5">230 (18%)</div>
          </div>

          <div className="text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <span className="text-slate-600 font-medium">Yet to Login</span>
            </div>
            <div className="font-bold text-slate-900 pl-4.5 mt-0.5">132 (11%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
