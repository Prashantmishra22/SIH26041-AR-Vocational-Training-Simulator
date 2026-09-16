import React from 'react';
import { Award, Shield, CheckCircle2, QrCode, Download, ExternalLink, ArrowLeft, Printer } from 'lucide-react';

interface WorkerCertificateScreenProps {
  certificate: any;
  worker: any;
  score: number;
  onBackToHome: () => void;
  onViewInAdminPortal?: () => void;
}

export const WorkerCertificateScreen: React.FC<WorkerCertificateScreenProps> = ({
  certificate,
  worker,
  score,
  onBackToHome,
  onViewInAdminPortal,
}) => {
  const certNumber = certificate?.certificateNumber || `JH-SAFE-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const certDate = certificate?.issueDate || new Date().toISOString().slice(0, 10);
  const verifyUrl = `http://localhost:8000/api/certificates/verify/${certNumber}`;

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 p-4 sm:p-5 justify-between space-y-4">
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Worker Home</span>
          </button>
          <div className="flex items-center space-x-1 text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Accredited DGMS Pass</span>
          </div>
        </div>

        {/* Official Certificate Card */}
        <div className="mt-4 relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 border-2 border-amber-500/50 shadow-2xl">
          {/* Watermark & decorative background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <Shield className="w-64 h-64 text-amber-400" />
          </div>

          {/* Certificate Header */}
          <div className="text-center pb-4 border-b border-amber-500/30">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-[10px] uppercase tracking-widest font-black text-amber-400">
                Government of Jharkhand
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[10px] uppercase tracking-widest font-black text-emerald-400">
                DGMS Certified
              </span>
            </div>
            <h2 className="text-sm font-black text-slate-100 uppercase tracking-wider mt-1">
              Certificate of Vocational Safety Competence
            </h2>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Ref: DGMS (Tech) / Coal Mines Regulations 2017
            </p>
          </div>

          {/* Certificate Body */}
          <div className="py-4 text-center space-y-3">
            <p className="text-[11px] text-slate-400">This is to certify that industrial miner / technician</p>

            <h1 className="text-base sm:text-lg font-black text-amber-300 tracking-wide">
              {worker.name || 'Worker'}
            </h1>

            <div className="flex items-center justify-center space-x-3 text-xs font-mono text-slate-300">
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                ID: <strong className="text-amber-400">{worker.workerId}</strong>
              </span>
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                District: <strong className="text-slate-200">{worker.district || 'Dhanbad'}</strong>
              </span>
            </div>

            <p className="text-[11px] text-slate-300 px-2 leading-relaxed">
              has successfully accomplished all AR simulation vocational steps and statutory examination for:
            </p>

            <div className="py-1.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 inline-block">
              <span className="text-xs font-bold text-amber-300">
                Fire & Explosion Response (DGMS CMR 2017)
              </span>
            </div>

            {/* Score & Validation Pill */}
            <div className="flex items-center justify-center space-x-4 pt-1">
              <div className="text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Competency Score</span>
                <span className="text-sm font-black text-emerald-400 font-mono">{score}% PASS</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div className="text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Date of Issue</span>
                <span className="text-xs font-bold text-slate-300 font-mono">{certDate}</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div className="text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Valid Till</span>
                <span className="text-xs font-bold text-slate-300 font-mono">2028-09-15</span>
              </div>
            </div>
          </div>

          {/* Certificate Footer / QR Verification */}
          <div className="pt-4 border-t border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Simulated QR Code Badge */}
              <div className="w-14 h-14 bg-white p-1 rounded-lg shadow-md flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-950" />
              </div>
              <div className="text-left">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">Certificate Serial</span>
                <span className="text-[11px] font-mono font-black text-amber-400 block">{certNumber}</span>
                <span className="text-[9px] font-mono text-emerald-400 block mt-0.5">SHA256:VERIFIED_DGMS</span>
              </div>
            </div>

            <div className="text-right">
              <div className="w-20 border-b border-slate-700 mb-1" />
              <span className="text-[9px] text-slate-400 font-serif block">Competent Authority</span>
              <span className="text-[9px] text-amber-400 font-bold block">DGMS Eastern Zone</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-2 transition-all"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print / Save PDF</span>
          </button>

          {onViewInAdminPortal && (
            <button
              onClick={onViewInAdminPortal}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
            >
              <span>Verify in Admin</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={onBackToHome}
          className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 font-semibold text-center"
        >
          Return to Dashboard & Other Modules
        </button>
      </div>
    </div>
  );
};
