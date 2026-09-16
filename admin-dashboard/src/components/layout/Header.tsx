import React from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Shield,
  Smartphone,
  Zap,
  QrCode,
  Radio,
  Download
} from 'lucide-react';

interface HeaderProps {
  viewMode: 'admin' | 'worker' | 'split';
  onViewModeChange: (mode: 'admin' | 'worker' | 'split') => void;
  connectedWorkersCount?: number;
  onOpenQRVerifier?: () => void;
  onSyncRefresh?: () => void;
  isSyncing?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  connectedWorkersCount = 0,
  onOpenQRVerifier,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between z-20 shrink-0 shadow-xs gap-4">
      {/* Search Input Bar */}
      <div className="flex items-center space-x-3 flex-1 max-w-xs md:max-w-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search workers, modules, certificates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50/90 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Center View Mode Switcher */}
      <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => onViewModeChange('admin')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            viewMode === 'admin'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Admin Portal</span>
        </button>

        <button
          onClick={() => onViewModeChange('worker')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            viewMode === 'worker'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Worker AR App</span>
        </button>

        <button
          onClick={() => onViewModeChange('split')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            viewMode === 'split'
              ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 shadow-sm font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>⚡ Split Demo View</span>
        </button>
      </div>

      {/* Right User & Live Status Area */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5">
        {/* Direct APK Download Button */}
        <a
          href="/JH-Safety-AR.apk"
          download="JH-Safety-AR.apk"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          title="Download Jharkhand Safety AR Android APK"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden lg:inline">Download APK</span>
          <span className="text-[10px] bg-emerald-700/60 px-1 py-0.2 rounded text-emerald-100 font-mono">3.4MB</span>
        </a>

        {/* Live Trainees online indicator */}
        <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{connectedWorkersCount} Trainee{connectedWorkersCount === 1 ? '' : 's'} Online</span>
        </div>

        {/* Global QR Verifier shortcut button */}
        {onOpenQRVerifier && (
          <button
            onClick={onOpenQRVerifier}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-700 border border-blue-200/80 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Verify QR</span>
          </button>
        )}

        {/* User Profile Info */}
        <div className="flex items-center space-x-2.5 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-xs">
            DG
          </div>
          <div className="text-left hidden 2xl:block">
            <div className="text-xs font-bold text-slate-900 leading-tight">DGMS Admin</div>
            <div className="text-[10px] text-slate-500 font-medium">Compliance Officer</div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </header>
  );
};

