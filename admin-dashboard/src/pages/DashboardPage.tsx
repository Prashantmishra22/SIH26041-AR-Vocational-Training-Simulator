import React from 'react';
import { KPISummary, TrainingModule, DistrictMetric, Worker } from '../types';
import { WorkerStatus, ActivityEvent } from '../services/useWebSocket';
import { KPICard } from '../components/dashboard/KPICard';
import { TrainingProgressDonut } from '../components/dashboard/TrainingProgressDonut';
import { AssessmentBarChart } from '../components/dashboard/AssessmentBarChart';
import { WorkerStatusDonut } from '../components/dashboard/WorkerStatusDonut';
import { LiveWorkerList } from '../components/dashboard/LiveWorkerList';
import { WorkerLocationMap } from '../components/dashboard/WorkerLocationMap';
import { RecentActivityList } from '../components/dashboard/RecentActivityList';
import { TrainingModulesProgressList } from '../components/dashboard/TrainingModulesProgressList';
import { CertificatesIssuedList } from '../components/dashboard/CertificatesIssuedList';
import { AlertsNotificationsList } from '../components/dashboard/AlertsNotificationsList';
import {
  Users,
  GraduationCap,
  BarChart2,
  Award
} from 'lucide-react';

interface DashboardPageProps {
  kpis: KPISummary;
  modules: TrainingModule[];
  districts: DistrictMetric[];
  trainingTrend: any[];
  workers: Worker[];
  isWsConnected?: boolean;
  workerStatuses?: Record<string, WorkerStatus>;
  activityFeed?: ActivityEvent[];
  connectedWorkersCount?: number;
  connectedAdminsCount?: number;
  onNavigateTab: (tab: string) => void;
  onSelectWorker: (worker: Worker) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  kpis,
  workers,
  onNavigateTab,
  onSelectWorker,
}) => {
  return (
    <div className="space-y-5 pb-6">
      {/* 1. Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-slate-700/60 shadow-sm min-h-[165px] flex items-center">
        {/* Dark Mining Panoramic Background with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url('/mining_hero_bg.svg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1325]/85 via-[#0F1D36]/60 to-[#1A2C4A]/70 z-10 pointer-events-none" />

        {/* Ambient mining dusk light accent */}
        <div className="absolute right-12 top-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none z-10" />

        {/* Banner Content */}
        <div className="relative z-20 w-full px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Welcome */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Welcome Back, Admin!
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 mt-1 font-medium drop-shadow-xs">
              Monitor. Manage. Ensure a Safer Jharkhand.
            </p>
          </div>

          {/* Right Date, Time & Quote */}
          <div className="text-left md:text-right">
            <div className="text-xs text-slate-300 font-medium tracking-wide drop-shadow-xs">
              Tuesday, 16 Sep 2025 &nbsp;&nbsp;&nbsp;&nbsp; 01:24 PM
            </div>
            <div className="mt-2.5">
              <p className="text-base lg:text-xl font-serif italic text-white font-medium tracking-wide drop-shadow-sm">
                “Safety is not just a rule, it’s a way of life.”
              </p>
              <div className="h-1 w-28 bg-amber-400 rounded-full md:ml-auto mt-2 shadow-xs shadow-amber-400/50" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards (5 Cards in 1 Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Workers"
          value="1,254"
          subtitle="vs last month"
          change="↑ 12%"
          isPositive={true}
          icon={Users}
          colorScheme="blue"
        />

        <KPICard
          title="Active Workers"
          value="892"
          subtitle="Currently active"
          change="↑ 8%"
          isPositive={true}
          icon={Users}
          colorScheme="emerald"
        />

        <KPICard
          title="Training Completed"
          value="3,482"
          subtitle="Total completions"
          change="↑ 24%"
          isPositive={true}
          icon={GraduationCap}
          colorScheme="purple"
        />

        <KPICard
          title="Average Score"
          value="83%"
          subtitle="Assessment score"
          change="↑ 5%"
          isPositive={true}
          icon={BarChart2}
          colorScheme="orange"
        />

        <KPICard
          title="Certificates Issued"
          value="2,130"
          subtitle="Total certificates"
          change="↑ 18%"
          isPositive={true}
          icon={Award}
          colorScheme="amber"
        />
      </div>

      {/* 3. Row 1: Analytics Charts (3 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 min-h-[260px]">
          <TrainingProgressDonut />
        </div>

        <div className="lg:col-span-5 min-h-[260px]">
          <AssessmentBarChart />
        </div>

        <div className="lg:col-span-3 min-h-[260px]">
          <WorkerStatusDonut />
        </div>
      </div>

      {/* 4. Row 2: Live Monitoring, Live Map, Recent Activity (3 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="min-h-[290px]">
          <LiveWorkerList
            onViewAll={() => onNavigateTab('workers')}
            onSelectWorker={(workerName) => {
              const matched = workers.find((w) => w.name.toLowerCase().includes(workerName.toLowerCase()));
              if (matched) onSelectWorker(matched);
              else onNavigateTab('workers');
            }}
          />
        </div>

        <div className="min-h-[290px]">
          <WorkerLocationMap
            onViewFullMap={() => onNavigateTab('analytics')}
          />
        </div>

        <div className="min-h-[290px]">
          <RecentActivityList
            onViewAll={() => onNavigateTab('workers')}
          />
        </div>
      </div>

      {/* 5. Row 3: Training Modules, Certificates Issued, Alerts & Notifications (3 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="min-h-[290px]">
          <TrainingModulesProgressList
            onViewAll={() => onNavigateTab('training')}
          />
        </div>

        <div className="min-h-[290px]">
          <CertificatesIssuedList
            onViewAll={() => onNavigateTab('certificates')}
          />
        </div>

        <div className="min-h-[290px]">
          <AlertsNotificationsList
            onViewAll={() => onNavigateTab('settings')}
          />
        </div>
      </div>
    </div>
  );
};
