import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import { Worker, TrainingModule, Certificate, DistrictMetric, LanguageMetric, KPISummary } from './types';
import { KPI_DATA, MODULES_DATA, WORKERS_DATA, DISTRICT_METRICS, LANGUAGE_METRICS, MONTHLY_TRAINING_TREND } from './data/mockData';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { WorkersPage } from './pages/WorkersPage';
import { TrainingPage } from './pages/TrainingPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { WorkerDetailModal } from './components/workers/WorkerDetailModal';
import { CertificateVerifyModal } from './components/certificates/CertificateVerifyModal';
import { WorkerApp } from './components/worker-app/WorkerApp';
import { useWebSocket } from './services/useWebSocket';

export const App: React.FC = () => {
  const wsState = useWebSocket();
  const [viewMode, setViewMode] = useState<'admin' | 'worker' | 'split'>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  const [kpis, setKpis] = useState<KPISummary>(KPI_DATA);
  const [workers, setWorkers] = useState<Worker[]>(WORKERS_DATA);
  const [modules, setModules] = useState<TrainingModule[]>(MODULES_DATA);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [districts, setDistricts] = useState<DistrictMetric[]>(DISTRICT_METRICS);
  const [languages, setLanguages] = useState<LanguageMetric[]>(LANGUAGE_METRICS);
  const [trainingTrend, setTrainingTrend] = useState<any[]>(MONTHLY_TRAINING_TREND);

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [verifierCertId, setVerifierCertId] = useState<string | null>(null);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const [k, w, m, c, att, d, l, t] = await Promise.all([
        api.getKPIs(),
        api.getWorkers(),
        api.getModules(),
        api.getCertificates(),
        api.getAttempts(),
        api.getDistrictMetrics(),
        api.getLanguageMetrics(),
        api.getMonthlyTrends(),
      ]);
      setKpis(k);
      setWorkers(w);
      setModules(m);
      setCertificates(c);
      setAttempts(att);
      setDistricts(d);
      setLanguages(l);
      setTrainingTrend(t);
      setBackendError(null);
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (e: any) {
      console.warn('Backend API connection issue:', e);
      setBackendError('Backend service unreachable at ' + (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '. Displaying cached state registry.');
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Auto-refresh poll every 3 seconds to reflect Worker app live updates in real time
    const interval = setInterval(() => {
      loadData(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [loadData]);

  const handleSyncRefresh = async () => {
    setIsSyncing(true);
    await loadData(false);
    setTimeout(() => {
      setIsSyncing(false);
    }, 600);
  };

  const renderAdminContent = () => (
    <>
      {activeTab === 'dashboard' && (
        <DashboardPage
          kpis={kpis}
          modules={modules}
          districts={districts}
          trainingTrend={trainingTrend}
          workers={workers}
          isWsConnected={wsState.isConnected}
          workerStatuses={wsState.workerStatuses}
          activityFeed={wsState.activityFeed}
          connectedWorkersCount={wsState.connectedWorkersCount}
          connectedAdminsCount={wsState.connectedAdminsCount}
          onNavigateTab={setActiveTab}
          onSelectWorker={setSelectedWorker}
        />
      )}

      {activeTab === 'workers' && (
        <WorkersPage
          workers={workers}
          workerStatuses={wsState.workerStatuses}
          searchQuery={searchQuery}
          onSelectWorker={setSelectedWorker}
        />
      )}

      {activeTab === 'training' && (
        <TrainingPage modules={modules} />
      )}

      {activeTab === 'monitoring' && (
        <WorkersPage
          workers={workers}
          workerStatuses={wsState.workerStatuses}
          searchQuery={searchQuery}
          onSelectWorker={setSelectedWorker}
        />
      )}

      {activeTab === 'assessments' && (
        <AssessmentsPage workers={workers} attempts={attempts} />
      )}

      {activeTab === 'certificates' && (
        <CertificatesPage
          certificates={certificates}
          onOpenVerifierWithCert={(certId) => setVerifierCertId(certId)}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsPage districts={districts} languages={languages} />
      )}

      {activeTab === 'locations' && (
        <AnalyticsPage districts={districts} languages={languages} />
      )}

      {activeTab === 'reports' && (
        <AssessmentsPage workers={workers} attempts={attempts} />
      )}

      {(activeTab === 'settings' || activeTab === 'notifications') && (
        <SettingsPage />
      )}
    </>
  );

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSyncRefresh={handleSyncRefresh}
      isSyncing={isSyncing}
      pendingSyncCount={kpis.offlineSyncPending}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      connectedWorkersCount={wsState.connectedWorkersCount}
    >
      {/* View Mode 1: Dedicated Worker AR Training App */}
      {viewMode === 'worker' && (
        <WorkerApp
          onViewInAdminPortal={() => {
            setViewMode('admin');
            setActiveTab('certificates');
          }}
          onWorkerActivityTriggered={() => loadData(true)}
        />
      )}

      {/* View Mode 2: Split Demo View (Worker App on Left + Live Admin Monitoring on Right) */}
      {viewMode === 'split' && (
        <div className="flex flex-col 2xl:flex-row gap-6 w-full items-start">
          {/* Left Panel: Worker Smartphone Simulator */}
          <div className="w-full 2xl:w-[440px] shrink-0 flex flex-col items-center">
            <div className="mb-3 flex items-center space-x-2 text-xs font-bold text-slate-800 bg-amber-50 border border-amber-300/80 px-3.5 py-1.5 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>📱 Trainee Smartphone Simulator (Live Active)</span>
            </div>
            <WorkerApp
              isEmbedded={true}
              onViewInAdminPortal={() => {
                setViewMode('split');
                setActiveTab('certificates');
              }}
              onWorkerActivityTriggered={() => loadData(true)}
            />
          </div>

          {/* Right Panel: Live Admin Portal Dashboard */}
          <div className="flex-1 w-full space-y-6 min-w-0">
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800">DGMS Live Compliance Stream (Auto-Synced with Worker App)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Updated: {lastSyncTime}</span>
            </div>
            {renderAdminContent()}
          </div>
        </div>
      )}

      {/* View Mode 3: Full Admin Compliance Portal */}
      {viewMode === 'admin' && renderAdminContent()}

      {/* Selected Worker Drawer / Modal */}
      {selectedWorker && (
        <WorkerDetailModal
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
        />
      )}

      {/* Standalone Verifier Modal when triggered from certificate page */}
      {verifierCertId !== null && (
        <CertificateVerifyModal
          initialCertNumber={verifierCertId}
          onClose={() => setVerifierCertId(null)}
        />
      )}
    </Layout>
  );
};
export default App;
