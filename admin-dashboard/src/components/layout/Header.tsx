import React from 'react';
import {
  Search,
  Bell,
  Download,
  QrCode,
  Globe2,
  RefreshCw,
  HardHat,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onOpenQRVerifier: () => void;
  onSyncRefresh: () => void;
  isSyncing: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQRVerifier,
  onSyncRefresh,
  isSyncing,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="h-16 bg-[#0E1522]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between z-20 shrink-0">
      {/* Search Input */}
      <div className="flex items-center space-x-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search workers by Name, ID (e.g. JH-MIN-10492), Mine, or Certificate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
        </div>
      </div>

      {/* Quick Actions & Status */}
      <div className="flex items-center space-x-3 ml-4">
        {/* Verification Modal Trigger */}
        <button
          onClick={onOpenQRVerifier}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-semibold transition-all shadow-sm shadow-amber-500/10 cursor-pointer"
          title="Instant QR & Certificate Hash Validator"
        >
          <QrCode className="w-3.5 h-3.5 text-amber-400" />
          <span>Verify QR Certificate</span>
        </button>

        {/* Sync Trigger */}
        <button
          onClick={onSyncRefresh}
          disabled={isSyncing}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/80 text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
          title="Poll backend & offline queue"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
        </button>

        {/* Export Report */}
        <button
          onClick={() => {
            alert('Exporting DGMS Form VI Annual Compliance Report (Jharkhand District Batch)...');
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/80 text-xs font-medium transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Export DGMS Report</span>
        </button>

        <div className="h-5 w-px bg-slate-800"></div>

        {/* State Seal Indicator */}
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
          <HardHat className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300">Govt of Jharkhand</span>
        </div>

        {/* Notification Bell */}
        <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5 ring-2 ring-[#0E1522]"></span>
        </button>
      </div>
    </header>
  );
};
