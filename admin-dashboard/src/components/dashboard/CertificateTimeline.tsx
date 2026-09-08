import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { DistrictMetric } from '../../types';

interface CertificateTimelineProps {
  districts: DistrictMetric[];
}

export const CertificateTimeline: React.FC<CertificateTimelineProps> = ({ districts }) => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
        <div>
          <h3 className="text-base font-bold text-white">District-Wise Safety Compliance & Certification</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Total workers registered vs DGMS-Certified per Jharkhand district
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1.5 text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block"></span>
            <span>Total Enrolled</span>
          </span>
          <span className="flex items-center space-x-1.5 text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Certified</span>
          </span>
        </div>
      </div>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={districts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="district" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#F8FAFC',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="totalWorkers" name="Total Enrolled" fill="#334155" radius={[4, 4, 0, 0]} />
            <Bar dataKey="certifiedCount" name="Certified" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
