import React from 'react';
import { Award, Check } from 'lucide-react';

interface CertificatesIssuedListProps {
  onViewAll?: () => void;
}

export const CertificatesIssuedList: React.FC<CertificatesIssuedListProps> = ({ onViewAll }) => {
  const certificates = [
    {
      id: 'CT-2025-0842',
      worker: 'Ravi Kumar',
      module: 'Fire Safety',
      date: '16 Sep 2025',
    },
    {
      id: 'CT-2025-0841',
      worker: 'Sita Devi',
      module: 'Equipment Safety',
      date: '16 Sep 2025',
    },
    {
      id: 'CT-2025-0840',
      worker: 'Aman Toppo',
      module: 'First Aid',
      date: '15 Sep 2025',
    },
    {
      id: 'CT-2025-0839',
      worker: 'Neha Singh',
      module: 'Emergency Response',
      date: '15 Sep 2025',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900">Certificates Issued</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Certificates List */}
      <div className="space-y-3.5 my-auto">
        {certificates.map((cert) => (
          <div key={cert.id} className="flex items-center justify-between">
            {/* Left: Cert icon + ID + Worker & Module */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 tracking-tight leading-tight">
                  {cert.id}
                </div>
                <div className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                  {cert.worker}
                </div>
                <div className="text-[10px] text-slate-400 font-medium truncate">
                  {cert.module}
                </div>
              </div>
            </div>

            {/* Right: Verified Badge & Date */}
            <div className="text-right shrink-0">
              <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Verified</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">{cert.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
