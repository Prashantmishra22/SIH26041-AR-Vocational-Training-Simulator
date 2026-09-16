import { useState, useEffect, useRef, useCallback } from 'react';

// ── Types ────────────────────────────────────────────────────────

export interface WorkerStatus {
  worker_id: string;
  status: 'ONLINE' | 'OFFLINE';
  connected_at: string | null;
  last_heartbeat: string | null;
  current_module: string | null;
  current_step: number | null;
  total_steps: number | null;
  last_event: string | null;
  name: string | null;
  sector: string | null;
  district: string | null;
}

export interface ActivityEvent {
  type: string;
  worker_id: string;
  event_type: string;
  module: string | null;
  description: string;
  step: number | null;
  total_steps: number | null;
  score: number | null;
  data: Record<string, any>;
  timestamp: string;
  worker_status: WorkerStatus;
  status?: string;
}

export interface WebSocketState {
  isConnected: boolean;
  workerStatuses: Record<string, WorkerStatus>;
  activityFeed: ActivityEvent[];
  connectedWorkersCount: number;
  connectedAdminsCount: number;
}

// ── Hook ─────────────────────────────────────────────────────────

const WS_URL = (import.meta.env.VITE_WS_URL || 'ws://localhost:8000') + '/ws/admin';
const MAX_RECONNECT_DELAY = 10000;
const MAX_ACTIVITY_ITEMS = 100;

export function useWebSocket(): WebSocketState {
  const [isConnected, setIsConnected] = useState(false);
  const [workerStatuses, setWorkerStatuses] = useState<Record<string, WorkerStatus>>({});
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);
  const [connectedWorkersCount, setConnectedWorkersCount] = useState(0);
  const [connectedAdminsCount, setConnectedAdminsCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempt = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);

      // Respond to server ping with pong
      if (data.type === 'ping') {
        wsRef.current?.send(JSON.stringify({ type: 'pong' }));
        return;
      }

      // ── STATE_SNAPSHOT: Full state on initial connect ──
      if (data.type === 'STATE_SNAPSHOT') {
        setWorkerStatuses(data.worker_statuses || {});
        setActivityFeed(data.activity_feed || []);
        setConnectedWorkersCount(data.connected_workers_count || 0);
        setConnectedAdminsCount(data.connected_admins_count || 0);
        return;
      }

      // ── WORKER_STATUS: Online/Offline status change ──
      if (data.type === 'WORKER_STATUS') {
        const workerId = data.worker_id;
        const workerStatus: WorkerStatus = data.worker_status || {
          worker_id: workerId,
          status: data.status || 'OFFLINE',
          connected_at: null,
          last_heartbeat: null,
          current_module: null,
          current_step: null,
          total_steps: null,
          last_event: data.event_type,
          name: null,
          sector: null,
          district: null,
        };

        setWorkerStatuses(prev => ({
          ...prev,
          [workerId]: workerStatus,
        }));

        // Add to activity feed
        setActivityFeed(prev => {
          const newFeed = [...prev, data as ActivityEvent];
          return newFeed.slice(-MAX_ACTIVITY_ITEMS);
        });

        // Update connected count
        if (data.status === 'ONLINE') {
          setConnectedWorkersCount(prev => prev + 1);
        } else if (data.status === 'OFFLINE') {
          setConnectedWorkersCount(prev => Math.max(0, prev - 1));
        }
        return;
      }

      // ── WORKER_EVENT: Training events ──
      if (data.type === 'WORKER_EVENT') {
        const workerId = data.worker_id;

        // Update worker status from the event
        if (data.worker_status) {
          setWorkerStatuses(prev => ({
            ...prev,
            [workerId]: data.worker_status,
          }));
        }

        // Add to activity feed
        setActivityFeed(prev => {
          const newFeed = [...prev, data as ActivityEvent];
          return newFeed.slice(-MAX_ACTIVITY_ITEMS);
        });
        return;
      }

    } catch (e) {
      console.warn('[WebSocket] Failed to parse message:', e);
    }
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WebSocket] Connected to admin endpoint');
        setIsConnected(true);
        reconnectAttempt.current = 0;
      };

      ws.onmessage = handleMessage;

      ws.onclose = (e) => {
        console.log(`[WebSocket] Disconnected (code: ${e.code})`);
        setIsConnected(false);
        wsRef.current = null;

        // Auto-reconnect with exponential backoff
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttempt.current),
          MAX_RECONNECT_DELAY,
        );
        reconnectAttempt.current++;
        console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${reconnectAttempt.current})...`);
        reconnectTimer.current = setTimeout(connect, delay);
      };

      ws.onerror = (e) => {
        console.warn('[WebSocket] Error:', e);
      };
    } catch (e) {
      console.error('[WebSocket] Connection failed:', e);
      const delay = Math.min(
        1000 * Math.pow(2, reconnectAttempt.current),
        MAX_RECONNECT_DELAY,
      );
      reconnectAttempt.current++;
      reconnectTimer.current = setTimeout(connect, delay);
    }
  }, [handleMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return {
    isConnected,
    workerStatuses,
    activityFeed,
    connectedWorkersCount,
    connectedAdminsCount,
  };
}
