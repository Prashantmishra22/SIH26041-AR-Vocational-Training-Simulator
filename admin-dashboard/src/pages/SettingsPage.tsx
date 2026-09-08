import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, Server, Key, Bell, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [passThreshold, setPassThreshold] = useState(70);
  const [offlineMaxDays, setOfflineMaxDays] = useState(14);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [mockMode, setMockMode] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <span>System & DGMS Compliance Configuration</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Adjust regulatory passing criteria, underground offline sync timeouts, and backend connectors
        </p>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
        {/* Section 1: DGMS Passing Thresholds */}
        <div className="pb-6 border-b border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DGMS Examination & Scoring Standards</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Certification Pass Score Threshold (%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={passThreshold}
                onChange={(e) => setPassThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-['JetBrains_Mono',monospace] text-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Mandated minimum score: 70% (Coal Mines Reg. 2017).
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Practical vs Theory Weightage
              </label>
              <select className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500">
                <option>60% AR Practical + 40% Theory (Standard)</option>
                <option>70% AR Practical + 30% Theory (Heavy Industrial)</option>
                <option>50% AR Practical + 50% Theory (Balanced)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Offline Sync Policies */}
        <div className="pb-6 border-b border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Database className="w-4 h-4 text-amber-400" />
            <span>Underground Offline Sync & Cache Policies</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Max Offline Cache Expiry (Days)
              </label>
              <input
                type="number"
                value={offlineMaxDays}
                onChange={(e) => setOfflineMaxDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-['JetBrains_Mono',monospace] text-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Workers can train underground without network for up to {offlineMaxDays} days.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/80 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">Auto-Sync on Surface WiFi</span>
                <span className="text-[11px] text-slate-400">Batch upload offline records immediately upon reconnect</span>
              </div>
              <input
                type="checkbox"
                checked={autoSyncEnabled}
                onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Backend Connection */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Server className="w-4 h-4 text-blue-400" />
            <span>Backend Server & Mock Mode</span>
          </h3>

          <div className="flex items-center justify-between p-4 bg-slate-900/80 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Demo / Standalone Mock Data Mode</span>
              <span className="text-[11px] text-slate-400">
                Use embedded Jharkhand industrial datasets for hackathon presentation without live server requirement
              </span>
            </div>
            <input
              type="checkbox"
              checked={mockMode}
              onChange={(e) => setMockMode(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 flex items-center justify-end space-x-3">
          {saved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Settings saved successfully!</span>
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
