import React from 'react';
import { ChevronDown } from 'lucide-react';

export const AssessmentBarChart: React.FC = () => {
  const data = [
    { month: 'Jan', pass: 78, fail: 18 },
    { month: 'Feb', pass: 68, fail: 15 },
    { month: 'Mar', pass: 85, fail: 12 },
    { month: 'Apr', pass: 64, fail: 14 },
    { month: 'May', pass: 72, fail: 19 },
    { month: 'Jun', pass: 54, fail: 10 },
  ];

  const yTicks = [100, 80, 60, 40, 20, 0];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header with Legend and Dropdown */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-900">Assessment Performance</h3>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
            <span>Last 6 Months</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Pass / Fail Legend markers */}
      <div className="flex items-center space-x-4 mb-2 text-xs font-semibold">
        <div className="flex items-center space-x-1.5 text-slate-700">
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
          <span>Pass</span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-700">
          <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
          <span>Fail</span>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="relative w-full h-[150px] flex">
        {/* Y Axis Labels */}
        <div className="flex flex-col justify-between text-[10px] text-slate-400 font-medium pr-2 h-[120px] select-none text-right w-6">
          {yTicks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        {/* Chart Canvas & Bars */}
        <div className="flex-1 relative flex flex-col justify-between pl-2">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-x-2 top-0 flex flex-col justify-between pointer-events-none h-[120px]">
            {yTicks.map((t) => (
              <div key={t} className="border-b border-slate-100 w-full" />
            ))}
          </div>

          {/* Monthly Paired Bars */}
          <div className="relative z-10 flex justify-around items-end h-[120px] px-1">
            {data.map((item) => {
              const maxH = 116;
              const passHeight = Math.round((item.pass / 100) * maxH);
              const failHeight = Math.round((item.fail / 100) * maxH);
              return (
                <div key={item.month} className="flex items-end space-x-1 group cursor-pointer">
                  {/* Pass Bar (Green) */}
                  <div
                    className="w-3 sm:w-3.5 bg-emerald-500 hover:bg-emerald-600 rounded-t-sm transition-all duration-300"
                    style={{ height: `${passHeight}px` }}
                    title={`${item.month} Pass: ${item.pass}%`}
                  />
                  {/* Fail Bar (Red) */}
                  <div
                    className="w-3 sm:w-3.5 bg-rose-500 hover:bg-rose-600 rounded-t-sm transition-all duration-300"
                    style={{ height: `${failHeight}px` }}
                    title={`${item.month} Fail: ${item.fail}%`}
                  />
                </div>
              );
            })}
          </div>

          {/* X Axis Month Labels */}
          <div className="flex justify-around text-[10px] font-semibold text-slate-500 pt-2 border-t border-slate-200/80">
            {data.map((item) => (
              <span key={item.month}>{item.month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
