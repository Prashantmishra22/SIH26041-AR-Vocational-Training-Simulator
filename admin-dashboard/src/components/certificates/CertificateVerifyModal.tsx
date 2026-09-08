import React, { useState } from 'react';
import { api } from '../../services/api';
import { Certificate } from '../../types';
import { X, Search, CheckCircle2, AlertTriangle, ShieldCheck, QrCode, Download, Building2, Calendar, Award } from 'lucide-react';

interface CertificateVerifyModalProps {
  onClose: () => void;
  initialCertNumber?: string;
}

export const CertificateVerifyModal: React.FC<CertificateVerifyModalProps> = ({ onClose, initialCertNumber = '' }) => {
  const [certInput, setCertInput] = useState(initialCertNumber);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; data?: Certificate; message?: string } | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!certInput.trim()) return;
    setLoading(true);
    try {
      const res = await api.verifyCertificate(certInput.trim());
      setResult(res);
    } catch {
      setResult({ valid: false, message: 'Verification lookup failed due to network error.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSampleSelect = (code: string) => {
    setCertInput(code);
    api.verifyCertificate(code).then(setResult);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">QR & Certificate Verifier</h2>
              <p className="text-xs text-slate-400">DGMS Cryptographic Registry Validation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Verification Form */}
          <form onSubmit={handleVerify} className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Enter Certificate ID or Scan QR Code Payload:
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. JH-SAFE-2026-BCCL-08492"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  className="w-full pl-4 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-['JetBrains_Mono',monospace] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !certInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm transition-all shadow-md shadow-amber-500/10 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Validate'}
              </button>
            </div>
          </form>

          {/* Quick Demo Pre-fills */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Click to test sample certificates:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSampleSelect('JH-SAFE-2026-BCCL-08492')}
                className="text-xs font-['JetBrains_Mono',monospace] bg-slate-900 hover:bg-amber-500/10 hover:border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors"
              >
                JH-SAFE-2026-BCCL-08492 (BCCL Miner)
              </button>
              <button
                type="button"
                onClick={() => handleSampleSelect('JH-SAFE-2026-TSL-04192')}
                className="text-xs font-['JetBrains_Mono',monospace] bg-slate-900 hover:bg-amber-500/10 hover:border-amber-500/30 text-blue-300 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors"
              >
                JH-SAFE-2026-TSL-04192 (Tata Steel)
              </button>
            </div>
          </div>

          {/* Verification Results Display */}
          {result && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              {result.valid && result.data ? (
                <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center space-x-2.5 text-emerald-400">
                    <ShieldCheck className="w-6 h-6 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-white">GENUINE CERTIFICATE VERIFIED</h4>
                      <p className="text-xs text-emerald-400/90">
                        Authenticated against Govt of Jharkhand Safety Registry
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/40 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Certificate No:</span>
                      <span className="font-bold text-amber-300 font-['JetBrains_Mono',monospace]">
                        {result.data.certificateNumber}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Recipient Worker:</span>
                      <span className="font-semibold text-white">{result.data.workerName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Company & Facility:</span>
                      <span className="text-slate-200">{result.data.workerCompany}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Module Passed:</span>
                      <span className="text-slate-200 font-medium">{result.data.moduleTitle}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Examination Score:</span>
                      <span className="font-bold text-emerald-400 font-['JetBrains_Mono',monospace]">
                        {result.data.score}%
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Validity:</span>
                      <span className="text-slate-200">{result.data.issueDate} to {result.data.expiryDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-800/50 p-2.5 rounded-lg">
                    <span className="font-['JetBrains_Mono',monospace] truncate max-w-[280px]">
                      Hash: {result.data.verificationHash}
                    </span>
                    <span className="text-emerald-400 font-bold shrink-0">DGMS APPROVED</span>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-rose-300">CERTIFICATE NOT RECOGNIZED</h4>
                    <p className="text-xs text-rose-400/90 mt-1">
                      {result.message || 'No active certification found with this identifier in the state registry.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
