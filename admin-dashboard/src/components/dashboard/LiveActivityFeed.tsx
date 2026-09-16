import React, { useState } from 'react';
import { WorkerStatus, ActivityEvent } from '../../services/useWebSocket';
import {
  Activity,
  Radio,
  Wifi,
  WifiOff,
  Flame,
  CheckCircle2,
  Award,
  LogIn,
  LogOut,
  Sparkles,
  Layers,
  ChevronRight,
  Clock,
  User,
  Shield,
  Zap,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

interface LiveActivityFeedProps {
  isConnected: boolean;
  workerStatuses: Record<string, WorkerStatus>;
  activityFeed: ActivityEvent[];
  connectedWorkersCount: number;
  connectedAdminsCount: number;
  onSelectWorkerId?: (workerId: string) => void;
}

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'WORKER_LOGIN':
      return <LogIn className="w-4 h-4 text-emerald-400" />;
    case 'WORKER_LOGOUT':
      return <LogOut className="w-4 h-4 text-rose-400" />;
    case 'MODULE_STARTED':
      return <Flame className="w-4 h-4 text-amber-400" />;
    case 'MODULE_STEP_COMPLETED':
      return <Layers className="w-4 h-4 text-cyan-400" />;
    case 'MODULE_COMPLETED':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case 'ASSESSMENT_STARTED':
      return <Zap className="w-4 h-4 text-purple-400" />;
    case 'ASSESSMENT_COMPLETED':
    case 'SCORE_GENERATED':
      return <Award className="w-4 h-4 text-amber-400" />;
    case 'CERTIFICATE_GENERATED':
      return <Shield className="w-4 h-4 text-yellow-400" />;
    case 'SAFETY_REPORT_SUBMITTED':
      return <AlertTriangle className="w-4 h-4 text-orange-400" />;
    case 'MESSAGE_SENT':
      return <MessageSquare className="w-4 h-4 text-sky-400" />;
    default:
      return <Activity className="w-4 h-4 text-blue-400" />;
  }
};

const getEventBadgeClass = (eventType: string) => {
  switch (eventType) {
    case 'WORKER_LOGIN':
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    case 'WORKER_LOGOUT':
      return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    case 'MODULE_STARTED':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    case 'MODULE_STEP_COMPLETED':
      return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
    case 'MODULE_COMPLETED':
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    case 'ASSESSMENT_STARTED':
      return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
    case 'ASSESSMENT_COMPLETED':
    case 'SCORE_GENERATED':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    case 'CERTIFICATE_GENERATED':
      return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30';
    case 'SAFETY_REPORT_SUBMITTED':
      return 'bg-orange-500/10 text-orange-300 border-orange-500/30';
    case 'MESSAGE_SENT':
      return 'bg-sky-500/10 text-sky-300 border-sky-500/30';
    default:
      return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
  }
};

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({
  isConnected,
  workerStatuses,
  activityFeed,
  connectedWorkersCount,
  connectedAdminsCount,
  onSelectWorkerId,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const workersList = Object.values(workerStatuses);
  const onlineWorkers = workersList.filter(w => w.status === 'ONLINE');
  const recentEvents = [...activityFeed].reverse().slice(0, 30);

  const filteredEvents = filterType === 'all'
    ? recentEvents
    : recentEvents.filter(e => {
        if (filterType === 'modules') return e.event_type.startsWith('MODULE');
        if (filterType === 'assessments') return e.event_type.startsWith('ASSESSMENT') || e.event_type.includes('SCORE') || e.event_type.includes('CERTIFICATE');
        if (filterType === 'auth') return e.event_type.startsWith('WORKER');
        if (filterType === 'reports') return e.event_type.includes('REPORT') || e.event_type.includes('MESSAGE');
        return true;
      });

  return (
    <div className="glass-card rounded-2xl border border-slate-800/90 p-5 bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-[#0c1322]/90 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with live connection status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Radio className="w-5 h-5 animate-pulse text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base lg:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Real-Time Worker Activity Stream
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                  LIVE PIPELINE
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Direct WebSocket broadcast from active AR mobile units & headsets
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {isConnected ? (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>WS Connected</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              <WifiOff className="w-3.5 h-3.5" />
              <span>WS Disconnected (Reconnecting...)</span>
            </div>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 flex items-center space-x-1.5 font-['JetBrains_Mono',monospace]">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-400 font-bold">{onlineWorkers.length}</span>
            <span className="text-slate-500">online</span>
          </div>
        </div>
      </div>

      {/* Active Online Workers Strip */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Active Worker Nodes ({onlineWorkers.length})
          </span>
          {onlineWorkers.length > 0 && (
            <span className="text-[11px] text-slate-500 font-medium">Click worker to inspect</span>
          )}
        </div>

        {onlineWorkers.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              No workers currently connected to WebSocket stream.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              When a worker logs into the AR App, their live telemetry and module progress will display here instantly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {onlineWorkers.map((w) => {
              const stepPercent = w.total_steps && w.current_step 
                ? Math.round((w.current_step / w.total_steps) * 100) 
                : 0;

              return (
                <div
                  key={w.worker_id}
                  onClick={() => onSelectWorkerId?.(w.worker_id)}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400/60 transition-all cursor-pointer group shadow-lg shadow-emerald-950/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div className="relative">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300">
                          {w.name ? w.name.charAt(0) : w.worker_id.charAt(0)}
                        </div>
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                          {w.name || w.worker_id}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {w.sector || 'Underground Mining'} • {w.district || 'Dhanbad'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      {w.worker_id}
                    </span>
                  </div>

                  {/* Module & Step Progress */}
                  {w.current_module ? (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-amber-400 font-medium truncate capitalize">
                          {w.current_module.replace(/_/g, ' ')}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          {w.current_step}/{w.total_steps || '?'} ({stepPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, stepPercent)}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 text-[10px] text-slate-500 italic">
                      Standing by in AR lobby...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity Events Stream */}
      <div className="mt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Live Event Feed ({recentEvents.length})
          </span>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 text-[11px]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilterType('modules')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterType === 'modules'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Modules
            </button>
            <button
              onClick={() => setFilterType('assessments')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterType === 'assessments'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Assessments
            </button>
            <button
              onClick={() => setFilterType('auth')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterType === 'auth'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Sessions
            </button>
            <button
              onClick={() => setFilterType('reports')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterType === 'reports'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Reports & Comm
            </button>
          </div>
        </div>

        {/* Scrollable event log */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
          {filteredEvents.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              Waiting for incoming WebSocket events...
            </div>
          ) : (
            filteredEvents.map((event, idx) => {
              const timeStr = event.timestamp
                ? new Date(event.timestamp).toLocaleTimeString()
                : 'Just now';

              return (
                <div
                  key={`${event.worker_id}-${event.timestamp}-${idx}`}
                  className="flex items-center justify-between p-2.5 px-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all text-xs group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                      {getEventIcon(event.event_type)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-bold text-white font-mono text-[11px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                          {event.worker_id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getEventBadgeClass(event.event_type)}`}>
                          {event.event_type}
                        </span>
                        {event.module && (
                          <span className="text-amber-400 font-medium text-[11px]">
                            • {event.module.replace(/_/g, ' ')}
                          </span>
                        )}
                        {event.step && event.total_steps && (
                          <span className="text-cyan-400 font-mono text-[10px]">
                            [Step {event.step}/{event.total_steps}]
                          </span>
                        )}
                        {event.score !== null && event.score !== undefined && (
                          <span className="text-emerald-400 font-bold font-mono text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            Score: {event.score}%
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5 truncate">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-500 text-[10px] shrink-0 font-mono ml-2">
                    <Clock className="w-3 h-3" />
                    <span>{timeStr}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
