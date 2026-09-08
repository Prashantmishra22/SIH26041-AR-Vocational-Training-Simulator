import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SECTOR_DISTRIBUTION } from '../../data/mockData';

export const SectorChart: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div>
          <h3 className="text-base font-bold text-white">Sector Trainee Distribution</h3>
          <p className="text-xs text-slate-400 mt-0.5">Mining, Steel, and Mica industries</p>
        </div>
        <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          Jharkhand State
        </span>
      </div>

      <div className="h-48 w-full mt-2">
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
              formatter={(val: number) => [`${val} Workers`, 'Enrolled']}
            />
            <Pie
              data={SECTOR_DISTRIBUTION}
              innerRadius={45}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {SECTOR_DISTRIBUTION.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0E1522" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-1.5 pt-3 border-t border-slate-800/60 text-xs">
        {SECTOR_DISTRIBUTION.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-slate-300">{item.name}</span>
            </div>
            <span className="font-bold text-white">{item.value} ({((item.value / 1284) * 100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
