import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface TrainingChartProps {
  data: {
    month: string;
    totalAttempts: number;
    passed: number;
    avgScore: number;
  }[];
}

export const TrainingChart: React.FC<TrainingChartProps> = ({ data }) => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/60 gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span>AR Training Volume & Pass Trajectory</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Monthly aggregate attempts across underground and industrial surface facilities
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center space-x-1.5 text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Total Attempts</span>
          </span>
          <span className="flex items-center space-x-1.5 text-emerald-400 font-medium ml-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Passed (&gt;=70%)</span>
          </span>
        </div>
      </div>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                color: '#F8FAFC',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="totalAttempts"
              name="Total Attempts"
              stroke="#F59E0B"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#amberGrad)"
            />
            <Area
              type="monotone"
              dataKey="passed"
              name="Passed Certifications"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#emeraldGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
