import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PassFailChartProps {
  passRate: number; // e.g. 89.2
}

export const PassFailChart: React.FC<PassFailChartProps> = ({ passRate }) => {
  const failRate = Number((100 - passRate).toFixed(1));
  const data = [
    { name: 'Passed (>=70% Score)', value: passRate, color: '#10B981' },
    { name: 'Retest Required (<70%)', value: failRate, color: '#F43F5E' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div>
          <h3 className="text-base font-bold text-white">First-Attempt Pass Rate</h3>
          <p className="text-xs text-slate-400 mt-0.5">Threshold: 70% combined practical + theory</p>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          89.2% Overall
        </span>
      </div>

      <div className="h-48 w-full relative flex items-center justify-center my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#F8FAFC',
                fontSize: '12px',
              }}
              formatter={(val: number) => [`${val}%`, '']}
            />
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0E1522" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-white font-['JetBrains_Mono',monospace]">
            {passRate}%
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Pass Rate</span>
        </div>
      </div>

      <div className="flex items-center justify-around pt-3 border-t border-slate-800/60 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-slate-300 font-medium">Passed: <strong className="text-white">{passRate}%</strong></span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <span className="text-slate-300 font-medium">Failed: <strong className="text-white">{failRate}%</strong></span>
        </div>
      </div>
    </div>
  );
};
