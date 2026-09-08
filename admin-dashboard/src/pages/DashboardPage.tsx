import React from 'react';
import { KPISummary, TrainingModule, DistrictMetric, LanguageMetric, Worker } from '../types';
import { KPICard } from '../components/dashboard/KPICard';
import { TrainingChart } from '../components/dashboard/TrainingChart';
import { ModulePerformance } from '../components/dashboard/ModulePerformance';
import { PassFailChart } from '../components/dashboard/PassFailChart';
import { SectorChart } from '../components/dashboard/SectorChart';
import { CertificateTimeline } from '../components/dashboard/CertificateTimeline';
import {
  Users,
  Award,
  ShieldCheck,
  TrendingUp,
  Radio,
  Layers,
  Flame,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface DashboardPageProps {
  kpis: KPISummary;
  modules: TrainingModule[];
  districts: DistrictMetric[];
  trainingTrend: any[];
  workers: Worker[];
  onNavigateTab: (tab: string) => void;
  onSelectWorker: (worker: Worker) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  kpis,
  modules,
  districts,
  trainingTrend,
  workers,
  onNavigateTab,
  onSelectWorker,
}) => {
  const recentCertifiedWorkers = workers.filter(w => w.status === 'CERTIFIED').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#131C2D] to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-md border border-amber-500/30">
              STATE SAFETY COMPLIANCE MONITOR
            </span>
            <span className="text-xs text-slate-400">Jharkhand Eastern Zone</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Jharkhand Mining & Manufacturing Safety Command Center
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1 max-w-3xl">
            Live monitoring of Augmented Reality vocational hazard simulations, DGMS regulatory certification rates, and multi-language adoption (Hindi, Santali & English) across Dhanbad, Bokaro, Jamshedpur & Koderma mining districts.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => onNavigateTab('training')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-slate-950" />
            <span>Launch AR Module Suite</span>
          </button>
        </div>
      </div>

      {/* 6 Key Performance Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Workforce"
          value={kpis.totalWorkers.toLocaleString()}
          subtitle="Enrolled Miners"
          change="+18.5%"
          isPositive={true}
          icon={Users}
          colorScheme="blue"
        />

        <KPICard
          title="In AR Training"
          value={kpis.activeTrainees}
          subtitle="Active Sessions"
          change="+12.0%"
          isPositive={true}
          icon={Layers}
          colorScheme="amber"
        />

        <KPICard
          title="Certified Workers"
          value={kpis.certifiedWorkers.toLocaleString()}
          subtitle="DGMS Accredited"
          change="+24.1%"
          isPositive={true}
          icon={Award}
          colorScheme="emerald"
        />

        <KPICard
          title="Compliance Rate"
          value={`${kpis.complianceRate}%`}
          subtitle="Target: 85%"
          change="+4.2%"
          isPositive={true}
          icon={ShieldCheck}
          colorScheme="cyan"
        />

        <KPICard
          title="Avg Assessment Score"
          value={`${kpis.averageScore}%`}
          subtitle="Passing >= 70%"
          change="+2.8%"
          isPositive={true}
          icon={TrendingUp}
          colorScheme="purple"
        />

        <KPICard
          title="Pending Syncs"
          value={kpis.offlineSyncPending}
          subtitle="Underground Batches"
          change="Auto-upload"
          isPositive={true}
          icon={Radio}
          colorScheme="rose"
        />
      </div>

      {/* Charts Grid Row 1: Training Volume & Pass/Fail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrainingChart data={trainingTrend} />
        </div>
        <div>
          <PassFailChart passRate={kpis.passRatePercent} />
        </div>
      </div>

      {/* Charts Grid Row 2: Module Performance & Sector Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ModulePerformance modules={modules} />
        </div>
        <div>
          <SectorChart />
        </div>
      </div>

      {/* Charts Grid Row 3: District Compliance & Recent Certified Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CertificateTimeline districts={districts} />
        </div>

        {/* Live Certification Stream */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Recent Certifications</span>
              </h3>
              <button
                onClick={() => onNavigateTab('certificates')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {recentCertifiedWorkers.map((w) => (
                <div
                  key={w.id}
                  onClick={() => onSelectWorker(w)}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
                      {w.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{w.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{w.company} • {w.district}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-400 font-['JetBrains_Mono',monospace]">
                      {w.averageScore}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">Score</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Automatic QR Hash verification enabled</span>
              <span className="text-emerald-400 font-semibold">DGMS Validated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
