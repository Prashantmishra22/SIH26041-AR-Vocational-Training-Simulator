import React from 'react';
import { DistrictMetric, LanguageMetric } from '../types';
import { BarChart3, Globe2, MapPin, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsPageProps {
  districts: DistrictMetric[];
  languages: LanguageMetric[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ districts, languages }) => {
  const langColors = ['#F59E0B', '#A855F7', '#3B82F6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-amber-400" />
          <span>Regional Safety Adoption & Localization Analytics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed metrics on Santali (Ol Chiki) and Hindi vernacular adoption, plus district compliance rates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Language Breakdown */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Globe2 className="w-4 h-4 text-amber-400" />
                <span>Language & Voice Preference</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Primary language chosen by Jharkhand industrial workers for audio TTS & UI text
            </p>

            <div className="h-48 w-full mt-4">
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
                    formatter={(val: number) => [`${val}%`, 'Trainees']}
                  />
                  <Pie
                    data={languages}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="percentage"
                  >
                    {languages.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={langColors[index % langColors.length]} stroke="#0E1522" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800/60 text-xs">
            {languages.map((l, idx) => (
              <div key={l.language} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColors[idx] }}></span>
                  <span className="text-slate-300 font-medium">{l.label}</span>
                </div>
                <span className="font-bold text-white font-['JetBrains_Mono',monospace]">
                  {l.usersCount} ({l.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* District Compliance Rankings */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>District Compliance Rate Rankings</span>
            </h3>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              Avg: 88.4%
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {districts.map((d) => (
              <div key={d.district} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{d.district}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded uppercase">
                      {d.primarySector}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 font-['JetBrains_Mono',monospace] text-sm">
                      {d.complianceRate}%
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({d.certifiedCount}/{d.totalWorkers} Certified)
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${d.complianceRate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
