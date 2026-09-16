import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface WorkerLocationMapProps {
  onViewFullMap?: () => void;
}

export const WorkerLocationMap: React.FC<WorkerLocationMapProps> = ({ onViewFullMap }) => {
  const [activePin, setActivePin] = useState<string>('dhanbad');

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900">Live Map - Worker Locations</h3>
        <button
          onClick={onViewFullMap}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          View Map
        </button>
      </div>

      {/* Interactive Satellite Terrain Map View */}
      <div className="relative w-full h-[220px] rounded-xl overflow-hidden bg-[#111A15] border border-slate-700/50 shadow-inner select-none">
        {/* Satellite Map Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85"
          style={{ backgroundImage: `url('/jharkhand_satellite_map.svg')` }}
        />

        {/* Satellite Terrain Graphic & Contours Overlay */}
        <svg
          className="absolute inset-0 w-full h-full object-cover z-10"
          viewBox="0 0 500 300"
          preserveAspectRatio="none"
        >
          {/* Topographic elevation contours */}
          <path
            d="M 20,90 Q 90,40 160,80 T 320,60 T 480,110 L 480,280 L 20,280 Z"
            fill="rgba(34, 197, 94, 0.05)"
            stroke="rgba(34, 197, 94, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <path
            d="M 60,130 Q 140,110 220,150 T 380,120 T 490,160"
            fill="none"
            stroke="rgba(234, 179, 8, 0.2)"
            strokeWidth="1"
          />

          {/* Highway & Railway Arteries (NH2 & Rail) */}
          <path
            d="M 30,70 L 150,110 L 290,120 L 370,140 L 480,190"
            fill="none"
            stroke="rgba(251, 191, 36, 0.4)"
            strokeWidth="2"
            strokeDasharray="6 3"
          />
          <path
            d="M 280,120 L 260,190 L 370,250"
            fill="none"
            stroke="rgba(59, 130, 246, 0.35)"
            strokeWidth="1.5"
          />

          {/* River Damodar & Subarnarekha */}
          <path
            d="M 40,240 Q 150,210 270,220 T 460,270"
            fill="none"
            stroke="rgba(56, 189, 248, 0.5)"
            strokeWidth="2.5"
          />

          {/* Region City Labels */}
          <text x="355" y="175" fill="#FFFFFF" fontSize="12" fontWeight="700" letterSpacing="0.5" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">Dhanbad</text>
          <text x="220" y="215" fill="#FFFFFF" fontSize="12" fontWeight="700" letterSpacing="0.5" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">Ranchi</text>
          <text x="365" y="265" fill="#E2E8F0" fontSize="11" fontWeight="600" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">Jamshedpur</text>

          {/* Radar Waves / Map Pins */}
          {/* Dhanbad / Kusunda Pin (Green) */}
          <circle cx="345" cy="155" r="14" fill="rgba(34, 197, 94, 0.3)" className="animate-ping" />
          <circle cx="345" cy="155" r="5" fill="#22C55E" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Bokaro / Ramgarh (Yellow Pin) */}
          <circle cx="280" cy="140" r="4.5" fill="#EAB308" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Ranchi Pin (Green) */}
          <circle cx="240" cy="195" r="5" fill="#22C55E" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Jamshedpur Pin (Red) */}
          <circle cx="350" cy="245" r="4.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Koderma (Yellow Pin) */}
          <circle cx="180" cy="95" r="4" fill="#EAB308" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>

        {/* Floating Tooltip Card over Kusunda Mine / Dhanbad */}
        <div
          className="absolute left-[38%] top-[18%] -translate-x-1/2 bg-white rounded-xl p-2 px-3 shadow-2xl border border-slate-200/90 flex items-center space-x-2.5 z-20 cursor-pointer animate-fade-in"
          onClick={() => setActivePin('dhanbad')}
        >
          <img
            src="/avatar_ravi.png"
            alt="Ravi Kumar"
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-900 leading-tight">Ravi Kumar</span>
              <span className="text-[10px] text-slate-400">⌵</span>
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-emerald-600">Online</span>
            </div>
            <div className="text-[10px] text-slate-500 flex items-center space-x-0.5">
              <MapPin className="w-2.5 h-2.5 text-slate-400" />
              <span>Kusunda Mine</span>
            </div>
          </div>
          {/* Tooltip triangle indicator */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-slate-200" />
        </div>
      </div>

      {/* Bottom Status Legend */}
      <div className="flex items-center justify-around pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Online (12)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>In Training (5)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Offline (3)</span>
        </div>
      </div>
    </div>
  );
};
