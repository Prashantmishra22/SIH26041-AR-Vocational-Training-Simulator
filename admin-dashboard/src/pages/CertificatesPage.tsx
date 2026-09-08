import React from 'react';
import { Certificate } from '../types';
import { CertificateTable } from '../components/certificates/CertificateTable';
import { Award, QrCode, Download, ShieldCheck } from 'lucide-react';

interface CertificatesPageProps {
  certificates: Certificate[];
  onOpenVerifierWithCert: (certNumber: string) => void;
}

export const CertificatesPage: React.FC<CertificatesPageProps> = ({ certificates, onOpenVerifierWithCert }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>DGMS & State Safety Certificate Registry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-proof digital credentials issued upon scoring 70%+ on practical AR vocational safety simulations
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onOpenVerifierWithCert('')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-slate-950" />
            <span>Verify Any Certificate</span>
          </button>
        </div>
      </div>

      {/* Main Certificates Ledger */}
      <CertificateTable certificates={certificates} onVerify={onOpenVerifierWithCert} />
    </div>
  );
};
