import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Sector, WorkerStatus } from '../../types';

interface WorkerFiltersProps {
  selectedSector: Sector | 'ALL';
  setSelectedSector: (sector: Sector | 'ALL') => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedStatus: WorkerStatus | 'ALL';
  setSelectedStatus: (status: WorkerStatus | 'ALL') => void;
  onReset: () => void;
}

export const WorkerFilters: React.FC<WorkerFiltersProps> = ({
  selectedSector,
  setSelectedSector,
  selectedDistrict,
  setSelectedDistrict,
  selectedStatus,
  setSelectedStatus,
  onReset,
}) => {
  const districts = ['ALL', 'Dhanbad', 'East Singhbhum', 'Bokaro', 'Ranchi', 'Ramgarh', 'Koderma', 'Giridih', 'West Singhbhum'];

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Filters:</span>
        </div>

        {/* Sector Filter */}
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value as any)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">All Sectors</option>
          <option value="MINING">Mining & Quarrying</option>
          <option value="STEEL">Steel & Heavy Mfg</option>
          <option value="MICA">Mica Mining & Flaking</option>
        </select>

        {/* District Filter */}
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
        >
          {districts.map((d) => (
            <option key={d} value={d}>
              {d === 'ALL' ? 'All Districts' : `District: ${d}`}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">All Training Statuses</option>
          <option value="CERTIFIED">Certified (Passed &gt;=70%)</option>
          <option value="IN_TRAINING">In Training</option>
          <option value="PENDING">Pending AR Session</option>
          <option value="FAILED">Retest Needed</option>
        </select>
      </div>

      <button
        onClick={onReset}
        className="flex items-center space-x-1 text-xs text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
};
