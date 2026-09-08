import React from 'react';
import {
  LayoutDashboard,
  Users,
  Award,
  BarChart3,
  Layers,
  FileCheck2,
  Settings,
  ShieldCheck,
  Radio,
  Flame,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingSyncCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, pendingSyncCount = 14 }) => {
  const navItems = [
    { id: 'dashboard', label: 'Compliance Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'workers', label: 'Worker Registry', icon: Users, badge: '1,284' },
    { id: 'training', label: 'AR Modules & Tasks', icon: Layers, badge: '5 Active' },
    { id: 'assessments', label: 'Assessment Audits', icon: FileCheck2, badge: null },
    { id: 'certificates', label: 'Issued Certificates', icon: Award, badge: '986' },
    { id: 'analytics', label: 'District Analytics', icon: BarChart3, badge: null },
    { id: 'settings', label: 'System & DGMS Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-72 bg-[#0E1522] border-r border-slate-800/80 flex flex-col h-screen select-none shrink-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950">
            <Flame className="w-6 h-6 fill-slate-950 stroke-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-wider text-white">JH-SAFETY</span>
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30 uppercase">
                AR PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">Jharkhand Industrial Safety</p>
          </div>
        </div>
      </div>

      {/* State Gov & Regulatory Banner */}
      <div className="mx-4 my-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center space-x-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <div className="text-[11px]">
          <p className="text-slate-200 font-semibold leading-tight">DGMS & State Compliant</p>
          <p className="text-slate-400 text-[10px]">Coal Mines Reg. 2017 Sec 133</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Live Offline Sync Status Widget */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Underground Sync</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">
            LIVE
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          {pendingSyncCount} offline mine records pending automated batch upload.
        </p>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-1.5 rounded-full w-4/5"></div>
        </div>
      </div>

      {/* Operator Footer */}
      <div className="p-4 border-t border-slate-800/80 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200">
          SO
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-200 truncate">Safety Officer (Dhanbad)</p>
          <p className="text-[10px] text-slate-400 truncate">DGMS Admin Portal v2.4</p>
        </div>
      </div>
    </aside>
  );
};
