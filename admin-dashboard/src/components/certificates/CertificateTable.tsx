import React from 'react';
import { Certificate } from '../../types';
import { Award, ShieldCheck, QrCode, ExternalLink, Download, CheckCircle2 } from 'lucide-react';

interface CertificateTableProps {
  certificates: Certificate[];
  onVerify: (certNumber: string) => void;
}

export const CertificateTable: React.FC<CertificateTableProps> = ({ certificates, onVerify }) => {
  return (
    <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-[#0E1522]">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>State Safety Certificate Ledger</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically signed and QR-verifiable industrial worker safety credentials
          </p>
        </div>
        <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
          {certificates.length} Total Issued
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 border-b border-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            <tr>
              <th className="py-3 px-4">Certificate ID</th>
              <th className="py-3 px-4">Recipient Miner / Worker</th>
              <th className="py-3 px-4">Certified Safety Module</th>
              <th className="py-3 px-4 text-center">Score</th>
              <th className="py-3 px-4">Issued & Valid Date</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {certificates.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No certificates found in registry.
                </td>
              </tr>
            ) : (
              certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-amber-300 font-['JetBrains_Mono',monospace] text-xs">
                      {cert.certificateNumber}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px]" title={cert.verificationHash}>
                      SHA256: {cert.verificationHash.slice(0, 12)}...
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{cert.workerName}</div>
                    <div className="text-xs text-slate-400">{cert.workerCompany}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200">{cert.moduleTitle}</div>
                    <div className="text-[11px] text-slate-400">{cert.dgmsReference}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold font-['JetBrains_Mono',monospace] text-emerald-400">
                      {cert.score}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-xs text-slate-200">Issued: {cert.issueDate}</div>
                    <div className="text-[11px] text-slate-400">Expires: {cert.expiryDate}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{cert.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onVerify(cert.certificateNumber)}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-amber-400" />
                      <span>Verify</span>
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
