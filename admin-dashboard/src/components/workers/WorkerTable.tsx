import React from 'react';
import { Worker } from '../../types';
import { Award, ShieldCheck, Clock, AlertTriangle, Eye, QrCode } from 'lucide-react';

interface WorkerTableProps {
  workers: Worker[];
  onSelectWorker: (worker: Worker) => void;
}

export const WorkerTable: React.FC<WorkerTableProps> = ({ workers, onSelectWorker }) => {
  const getSectorBadge = (sector: string) => {
    switch (sector) {
      case 'MINING':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">MINING</span>;
      case 'STEEL':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">STEEL</span>;
      case 'MICA':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">MICA</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]">GENERAL</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CERTIFIED':
        return (
          <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Certified</span>
          </span>
        );
      case 'IN_TRAINING':
        return (
          <span className="flex items-center space-x-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>In Training</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center space-x-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Retest Req.</span>
          </span>
        );
      default:
        return (
          <span className="text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full text-xs font-medium">
            Pending
          </span>
        );
    }
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'sat':
        return <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-1.5 py-0.5 rounded font-medium">Santali (Ol Chiki)</span>;
      case 'hi':
        return <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1.5 py-0.5 rounded font-medium">Hindi (हिंदी)</span>;
      default:
        return <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-medium">English</span>;
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-[#0E1522] border-b border-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            <tr>
              <th className="py-3.5 px-4">Worker ID & Name</th>
              <th className="py-3.5 px-4">Sector & Facility</th>
              <th className="py-3.5 px-4">District</th>
              <th className="py-3.5 px-4">Language</th>
              <th className="py-3.5 px-4 text-center">Avg AR Score</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center">Certificates</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {workers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No workers found matching the current search & filters.
                </td>
              </tr>
            ) : (
              workers.map((worker) => (
                <tr
                  key={worker.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectWorker(worker)}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                        {worker.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                          {worker.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-['JetBrains_Mono',monospace]">
                          {worker.workerId}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {getSectorBadge(worker.sector)}
                      <div className="text-xs text-slate-300 truncate max-w-[180px]" title={worker.company}>
                        {worker.company}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {worker.district}
                  </td>

                  <td className="py-3.5 px-4">
                    {getLanguageLabel(worker.preferredLanguage)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-bold font-['JetBrains_Mono',monospace] text-sm ${
                        worker.averageScore >= 85
                          ? 'text-emerald-400'
                          : worker.averageScore >= 70
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {worker.averageScore > 0 ? `${worker.averageScore}%` : '—'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex justify-center">{getStatusBadge(worker.status)}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {worker.certificates.length > 0 ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        <Award className="w-3 h-3 text-amber-400" />
                        <span>{worker.certificates.length} Issued</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">None</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectWorker(worker);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="View Worker Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
