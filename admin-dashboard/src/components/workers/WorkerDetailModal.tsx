import React from 'react';
import { Worker } from '../../types';
import { X, Award, ShieldCheck, CheckCircle2, Phone, Building2, MapPin, Calendar, QrCode } from 'lucide-react';

interface WorkerDetailModalProps {
  worker: Worker | null;
  onClose: () => void;
}

export const WorkerDetailModal: React.FC<WorkerDetailModalProps> = ({ worker, onClose }) => {
  if (!worker) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/60 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xl font-bold text-slate-950 shadow-lg shadow-amber-500/20">
              {worker.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">{worker.name}</h2>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-semibold uppercase">
                  {worker.sector}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-['JetBrains_Mono',monospace] mt-0.5">
                {worker.workerId} • {worker.experienceYears} Years Experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Company & Facility</span>
              </div>
              <p className="font-semibold text-slate-200">{worker.company}</p>
              <p className="text-[11px] text-slate-400 truncate">{worker.facility}</p>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>District / State</span>
              </div>
              <p className="font-semibold text-slate-200">{worker.district}</p>
              <p className="text-[11px] text-slate-400">Jharkhand State</p>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Phone</span>
              </div>
              <p className="font-semibold text-slate-200 font-['JetBrains_Mono',monospace]">{worker.phone}</p>
              <p className="text-[11px] text-slate-400">Preferred Lang: {worker.preferredLanguage.toUpperCase()}</p>
            </div>
          </div>

          {/* Training Proficiency */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">AR Practical Safety Score</span>
              <div className="text-3xl font-extrabold text-white font-['JetBrains_Mono',monospace] mt-0.5">
                {worker.averageScore}%
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase font-semibold">Modules Completed</span>
              <div className="text-xl font-bold text-amber-400 mt-0.5">
                {worker.completedModulesCount} of 5 Modules
              </div>
            </div>
          </div>

          {/* Certificates Issued */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Issued DGMS Safety Certificates</span>
            </h3>

            {worker.certificates.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
                No certificates issued yet. Worker must score 70%+ on training modules to earn certification.
              </p>
            ) : (
              <div className="space-y-3">
                {worker.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-amber-300 font-['JetBrains_Mono',monospace]">
                          {cert.certificateNumber}
                        </span>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {cert.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white mt-1">{cert.moduleTitle}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Issued: {cert.issueDate} • Valid Until: {cert.expiryDate} • Score: {cert.score}%
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <a
                        href={cert.qrCodeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-500 text-slate-200"
                        title="View Verification QR"
                      >
                        <QrCode className="w-5 h-5 text-amber-400" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
