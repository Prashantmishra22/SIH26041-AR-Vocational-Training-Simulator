import React, { useState } from 'react';
import { Worker } from '../types';
import { FileCheck2, CheckCircle2, XCircle, Clock, AlertTriangle, Radio, ShieldCheck } from 'lucide-react';

interface AssessmentsPageProps {
  workers: Worker[];
}

export const AssessmentsPage: React.FC<AssessmentsPageProps> = ({ workers }) => {
  // Extract all attempts across all workers
  const attempts = [
    {
      id: 'att-01',
      workerName: 'Birsa Munda Soren',
      workerId: 'JH-MIN-10492',
      moduleTitle: 'Underground Mine Fire & Explosion Protocol',
      score: 96,
      practicalScore: 98,
      theoryScore: 94,
      passed: true,
      timeSpent: '15m 40s',
      date: '2026-08-14',
      language: 'Santali (Ol Chiki)',
      isOfflineSync: false,
    },
    {
      id: 'att-02',
      workerName: 'Rajesh Kumar Mahto',
      workerId: 'JH-STL-20811',
      moduleTitle: 'Blast Furnace & Steel Melt Shop Molten Metal PPE',
      score: 94,
      practicalScore: 95,
      theoryScore: 93,
      passed: true,
      timeSpent: '14m 10s',
      date: '2026-07-19',
      language: 'Hindi',
      isOfflineSync: false,
    },
    {
      id: 'att-03',
      workerName: 'Sunita Devi Marandi',
      workerId: 'JH-MIC-30114',
      moduleTitle: 'Mica Underground Adit Shoring & Silicosis Dust',
      score: 89,
      practicalScore: 90,
      theoryScore: 88,
      passed: true,
      timeSpent: '18m 20s',
      date: '2026-08-02',
      language: 'Santali (Ol Chiki)',
      isOfflineSync: true,
    },
    {
      id: 'att-04',
      workerName: 'Amitabh Oraon',
      workerId: 'JH-MIN-10904',
      moduleTitle: 'Toxic Methane (CH4) & CO Gas Detection',
      score: 64,
      practicalScore: 68,
      theoryScore: 60,
      passed: false,
      timeSpent: '18m 40s',
      date: '2026-09-05',
      language: 'Hindi',
      isOfflineSync: true,
    },
    {
      id: 'att-05',
      workerName: 'Gurmeet Singh Sodhi',
      workerId: 'JH-STL-21045',
      moduleTitle: 'High Voltage Substation Lockout/Tagout (LOTO)',
      score: 98,
      practicalScore: 100,
      theoryScore: 96,
      passed: true,
      timeSpent: '12m 15s',
      date: '2026-08-30',
      language: 'English',
      isOfflineSync: false,
    },
    {
      id: 'att-06',
      workerName: 'Somra Tudu',
      workerId: 'JH-MIN-10558',
      moduleTitle: 'Underground Mine Fire & Explosion Protocol',
      score: 88,
      practicalScore: 92,
      theoryScore: 84,
      passed: true,
      timeSpent: '16m 05s',
      date: '2026-08-30',
      language: 'Santali (Ol Chiki)',
      isOfflineSync: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <FileCheck2 className="w-6 h-6 text-amber-400" />
            <span>Assessment & Practical Scoring Audits</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Granular evaluation logs showing AR practical simulation scores vs theoretical knowledge checks
          </p>
        </div>
      </div>

      {/* Attempts Ledger Table */}
      <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0E1522] border-b border-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Trainee Worker</th>
                <th className="py-3.5 px-4">Module Assessed</th>
                <th className="py-3.5 px-4 text-center">AR Practical</th>
                <th className="py-3.5 px-4 text-center">Theory Score</th>
                <th className="py-3.5 px-4 text-center">Total Score</th>
                <th className="py-3.5 px-4 text-center">Result</th>
                <th className="py-3.5 px-4">Time & Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {attempts.map((att) => (
                <tr key={att.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{att.workerName}</div>
                    <div className="text-[11px] text-slate-400 font-['JetBrains_Mono',monospace]">
                      {att.workerId} • {att.language}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200">{att.moduleTitle}</div>
                    <div className="text-[11px] text-slate-400">Date: {att.date}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-slate-200 font-['JetBrains_Mono',monospace]">
                      {att.practicalScore}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-slate-200 font-['JetBrains_Mono',monospace]">
                      {att.theoryScore}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-extrabold text-sm font-['JetBrains_Mono',monospace] ${
                        att.score >= 70 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {att.score}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {att.passed ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>PASSED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>FAILED</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-xs text-slate-300">{att.timeSpent}</div>
                    <div className="text-[10px] flex items-center space-x-1 text-slate-400">
                      {att.isOfflineSync ? (
                        <span className="text-amber-400 flex items-center space-x-1">
                          <Radio className="w-3 h-3" />
                          <span>Offline Sync</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400">Direct Online</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
