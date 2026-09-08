import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrainingModule } from '../../types';

interface ModulePerformanceProps {
  modules: TrainingModule[];
}

export const ModulePerformance: React.FC<ModulePerformanceProps> = ({ modules }) => {
  const chartData = modules.map((m) => ({
    name: m.id === 'fire_safety_01' ? 'Mine Fire' :
          m.id === 'gas_leak_02' ? 'Methane/Gas' :
          m.id === 'ppe_heavy_machinery_03' ? 'Furnace PPE' :
          m.id === 'confined_space_04' ? 'Mica Adit' : 'Substation LOTO',
    completionRate: m.completionRate,
    avgScore: m.avgScore,
    totalTrained: m.totalTrained,
    sector: m.sector,
  }));

  const colors = ['#F59E0B', '#F97316', '#3B82F6', '#10B981', '#6366F1'];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div>
            <h3 className="text-base font-bold text-white">Module Pass & Avg Score Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Average proficiency score achieved by module</p>
          </div>
          <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
            5 Active Modules
          </span>
        </div>

        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#F8FAFC',
                  fontSize: '12px',
                }}
                formatter={(val: number) => [`${val}%`, 'Average Score']}
              />
              <Bar dataKey="avgScore" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mini Legend & Key Findings */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/60 text-[11px]">
        <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block">Top Performer</span>
          <span className="font-bold text-emerald-400">Furnace PPE (91.2%)</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block">Highest Hazard</span>
          <span className="font-bold text-amber-400">Methane Gas (84.0%)</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-slate-400 block">Total Trained</span>
          <span className="font-bold text-cyan-400">2,826 Completions</span>
        </div>
      </div>
    </div>
  );
};
