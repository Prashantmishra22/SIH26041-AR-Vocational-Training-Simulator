import React from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  Video,
  ClipboardCheck,
  Award,
  BarChart3,
  FileText,
  MapPin,
  Bell,
  Settings,
  LogOut,
  HardHat
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingSyncCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'workers', label: 'Workers', icon: Users, badge: null },
    { id: 'training', label: 'Training Modules', icon: Layers, badge: null },
    { id: 'monitoring', label: 'Live Monitoring', icon: Video, badge: null },
    { id: 'assessments', label: 'Assessments', icon: ClipboardCheck, badge: null },
    { id: 'certificates', label: 'Certificates', icon: Award, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'reports', label: 'Safety Reports', icon: FileText, badge: null },
    { id: 'locations', label: 'Locations & Sites', icon: MapPin, badge: null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '4', badgeColor: 'bg-rose-500 text-white' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 bg-[#0D1527] flex flex-col h-screen select-none shrink-0 z-30 border-r border-slate-800/80">
      {/* Brand Header */}
      <div className="p-5 pb-4 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 shrink-0">
          <HardHat className="w-5 h-5 fill-slate-950 stroke-slate-950 stroke-[1.5]" />
        </div>
        <div>
          <div className="font-extrabold text-base tracking-wider text-white leading-tight">JH-SAFETY</div>
          <div className="text-[11px] text-slate-400 font-medium">Admin Dashboard</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer group ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Safety Slogan Banner Card */}
      <div className="px-3 py-2">
        <div className="p-4 rounded-xl bg-[#131D33] border border-slate-700/60 flex flex-col items-center text-center shadow-inner">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center mb-2 shadow-md shadow-amber-500/20">
            <HardHat className="w-5 h-5 text-slate-950 fill-slate-950" />
          </div>
          <p className="text-xs font-bold text-white leading-snug">Safety Today</p>
          <p className="text-xs font-bold text-white leading-snug">A Better Tomorrow</p>
          <p className="text-[10px] text-amber-400 font-semibold mt-1 tracking-wide">— JH-SAFETY</p>
        </div>
      </div>

      {/* Logout Footer Button */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to log out of JH-SAFETY Admin?')) {
              window.location.reload();
            }
          }}
          className="w-full flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 text-sm font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
