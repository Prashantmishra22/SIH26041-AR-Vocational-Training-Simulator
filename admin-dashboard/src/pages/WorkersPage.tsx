import React, { useState } from 'react';
import { Worker, Sector, WorkerStatus } from '../types';
import { WorkerTable } from '../components/workers/WorkerTable';
import { WorkerFilters } from '../components/workers/WorkerFilters';
import { Users, Plus, Download, FileSpreadsheet } from 'lucide-react';

interface WorkersPageProps {
  workers: Worker[];
  searchQuery: string;
  onSelectWorker: (worker: Worker) => void;
}

export const WorkersPage: React.FC<WorkersPageProps> = ({ workers, searchQuery, onSelectWorker }) => {
  const [selectedSector, setSelectedSector] = useState<Sector | 'ALL'>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<WorkerStatus | 'ALL'>('ALL');

  const filteredWorkers = workers.filter((w) => {
    // Search query
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      w.name.toLowerCase().includes(q) ||
      w.workerId.toLowerCase().includes(q) ||
      w.company.toLowerCase().includes(q) ||
      w.facility.toLowerCase().includes(q) ||
      w.district.toLowerCase().includes(q);

    // Sector filter
    const matchesSector = selectedSector === 'ALL' || w.sector === selectedSector;

    // District filter
    const matchesDistrict = selectedDistrict === 'ALL' || w.district === selectedDistrict;

    // Status filter
    const matchesStatus = selectedStatus === 'ALL' || w.status === selectedStatus;

    return matchesSearch && matchesSector && matchesDistrict && matchesStatus;
  });

  const handleResetFilters = () => {
    setSelectedSector('ALL');
    setSelectedDistrict('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>Industrial Workforce & Miner Registry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered industrial workers, training progress, and DGMS compliance status across Jharkhand facilities
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => alert('Worker Batch Import CSV feature — Ready for HR upload.')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Import Miner CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <WorkerFilters
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onReset={handleResetFilters}
      />

      {/* Main Table */}
      <WorkerTable workers={filteredWorkers} onSelectWorker={onSelectWorker} />
    </div>
  );
};
