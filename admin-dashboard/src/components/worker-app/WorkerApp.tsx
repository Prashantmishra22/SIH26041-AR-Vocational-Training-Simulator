import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WorkerAuthScreen } from './WorkerAuthScreen';
import { WorkerHomeScreen } from './WorkerHomeScreen';
import { WorkerARTrainingScreen } from './WorkerARTrainingScreen';
import { WorkerQuizScreen } from './WorkerQuizScreen';
import { WorkerCertificateScreen } from './WorkerCertificateScreen';
import { Smartphone, Wifi, Battery, Radio } from 'lucide-react';

interface WorkerAppProps {
  isEmbedded?: boolean;
  onViewInAdminPortal?: () => void;
  onWorkerActivityTriggered?: () => void;
}

type ScreenState = 'AUTH' | 'HOME' | 'AR_TRAINING' | 'QUIZ' | 'CERTIFICATE';

export const WorkerApp: React.FC<WorkerAppProps> = ({
  isEmbedded = false,
  onViewInAdminPortal,
  onWorkerActivityTriggered,
}) => {
  const [activeScreen, setActiveScreen] = useState<ScreenState>('AUTH');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<string>('hi');
  const [activeModuleId, setActiveModuleId] = useState<string>('FIRE-001');
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [earnedCertificate, setEarnedCertificate] = useState<any>(null);
  const [userCertificates, setUserCertificates] = useState<any[]>([]);
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);

  // Connect to Worker WebSocket Pipeline
  const connectWorkerWs = useCallback((workerId: string) => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const cleanId = workerId.trim().toUpperCase();
      const ws = new WebSocket(`ws://localhost:8000/ws/worker/${cleanId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsWsConnected(true);
        console.log(`[WorkerApp] WebSocket connected for worker ${cleanId}`);
      };

      ws.onclose = () => {
        setIsWsConnected(false);
        console.log(`[WorkerApp] WebSocket closed`);
      };

      ws.onerror = (err) => {
        console.warn(`[WorkerApp] WebSocket error:`, err);
        setIsWsConnected(false);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
          }
        } catch {}
      };
    } catch (e) {
      console.warn('Failed to initiate worker WebSocket:', e);
    }
  }, []);

  const sendWsEvent = useCallback(
    (eventType: string, step: number, totalSteps: number, description: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          const payload = {
            event_type: eventType,
            module: activeModuleId,
            description: description,
            step: step,
            total_steps: totalSteps,
            name: currentUser?.name,
            sector: currentUser?.sector,
            district: currentUser?.district,
          };
          wsRef.current.send(JSON.stringify(payload));
        } catch (err) {
          console.warn('Error sending WS event:', err);
        }
      }
      if (onWorkerActivityTriggered) {
        onWorkerActivityTriggered();
      }
    },
    [activeModuleId, currentUser, onWorkerActivityTriggered]
  );

  const handleLoginSuccess = (userData: any, userToken: string) => {
    setCurrentUser(userData);
    setToken(userToken);
    connectWorkerWs(userData.workerId);
    setActiveScreen('HOME');
    if (onWorkerActivityTriggered) {
      onWorkerActivityTriggered();
    }
  };

  const handleLogout = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setCurrentUser(null);
    setToken('');
    setIsWsConnected(false);
    setActiveScreen('AUTH');
    if (onWorkerActivityTriggered) {
      onWorkerActivityTriggered();
    }
  };

  const handleStartModule = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setActiveScreen('AR_TRAINING');
  };

  const handleCompleteSimulation = () => {
    setActiveScreen('QUIZ');
  };

  const handleQuizCompleted = (certData: any, score: number) => {
    setCurrentScore(score);
    if (certData) {
      setEarnedCertificate(certData);
      setUserCertificates((prev) => [certData, ...prev]);
    }
    setActiveScreen('CERTIFICATE');
    if (onWorkerActivityTriggered) {
      onWorkerActivityTriggered();
    }
  };

  const handleBackToHome = () => {
    setActiveScreen('HOME');
  };

  // Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Screen content rendering
  const renderScreen = () => {
    switch (activeScreen) {
      case 'AUTH':
        return (
          <WorkerAuthScreen
            onLoginSuccess={handleLoginSuccess}
            selectedLang={selectedLang}
            onLanguageChange={setSelectedLang}
          />
        );
      case 'HOME':
        return (
          <WorkerHomeScreen
            user={currentUser}
            selectedLang={selectedLang}
            onStartModule={handleStartModule}
            onLogout={handleLogout}
            isWsConnected={isWsConnected}
            userCertificates={userCertificates}
          />
        );
      case 'AR_TRAINING':
        return (
          <WorkerARTrainingScreen
            moduleId={activeModuleId}
            selectedLang={selectedLang}
            onCompleteSimulation={handleCompleteSimulation}
            onBackToHome={handleBackToHome}
            onSendWsEvent={sendWsEvent}
          />
        );
      case 'QUIZ':
        return (
          <WorkerQuizScreen
            moduleId={activeModuleId}
            worker={currentUser}
            selectedLang={selectedLang}
            token={token}
            onQuizCompleted={handleQuizCompleted}
            onSendWsEvent={sendWsEvent}
          />
        );
      case 'CERTIFICATE':
        return (
          <WorkerCertificateScreen
            certificate={earnedCertificate}
            worker={currentUser}
            score={currentScore}
            onBackToHome={handleBackToHome}
            onViewInAdminPortal={onViewInAdminPortal}
          />
        );
      default:
        return null;
    }
  };

  // If embedded in split view, render inside a smartphone frame
  return (
    <div className={`flex flex-col items-center justify-center ${isEmbedded ? 'w-full h-full' : 'min-h-[calc(100vh-80px)] py-6'}`}>
      <div
        className={`w-full max-w-[430px] h-[780px] bg-black rounded-[42px] p-3 shadow-2xl border-4 border-slate-800 relative flex flex-col overflow-hidden transition-all`}
      >
        {/* Phone Notch / Speaker Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-center space-x-2 border border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700" />
          <div className="w-8 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Mobile Status Bar */}
        <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none z-40 bg-slate-950">
          <span className="font-semibold text-slate-300">09:45</span>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Radio className={`w-3 h-3 ${isWsConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="text-[10px] text-slate-400 font-bold">5G</span>
            </div>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          </div>
        </div>

        {/* Inner Phone Screen Content */}
        <div className="flex-1 w-full bg-slate-950 rounded-[32px] overflow-y-auto overflow-x-hidden relative scrollbar-none">
          {renderScreen()}
        </div>

        {/* Mobile Bottom Home Indicator Bar */}
        <div className="pt-2 pb-1 flex justify-center bg-slate-950">
          <div className="w-32 h-1 bg-slate-700/80 rounded-full" />
        </div>
      </div>
    </div>
  );
};
