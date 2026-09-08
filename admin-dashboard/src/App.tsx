import React, { useState, useEffect } from 'react';
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

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [kpis, setKpis] = useState<KPISummary>(KPI_DATA);
  const [workers, setWorkers] = useState<Worker[]>(WORKERS_DATA);
  const [modules, setModules] = useState<TrainingModule[]>(MODULES_DATA);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [districts, setDistricts] = useState<DistrictMetric[]>(DISTRICT_METRICS);
  const [languages, setLanguages] = useState<LanguageMetric[]>(LANGUAGE_METRICS);
  const [trainingTrend, setTrainingTrend] = useState<any[]>(MONTHLY_TRAINING_TREND);

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [verifierCertId, setVerifierCertId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [k, w, m, c, d, l, t] = await Promise.all([
        api.getKPIs(),
        api.getWorkers(),
        api.getModules(),
        api.getCertificates(),
        api.getDistrictMetrics(),
        api.getLanguageMetrics(),
        api.getMonthlyTrends(),
      ]);
      setKpis(k);
      setWorkers(w);
      setModules(m);
      setCertificates(c);
      setDistricts(d);
      setLanguages(l);
      setTrainingTrend(t);
    } catch (e) {
      console.warn('Using embedded mock dataset fallback');
    }
  };

  const handleSyncRefresh = async () => {
    setIsSyncing(true);
    await loadData();
    setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSyncRefresh={handleSyncRefresh}
      isSyncing={isSyncing}
      pendingSyncCount={kpis.offlineSyncPending}
    >
      {activeTab === 'dashboard' && (
        <DashboardPage
          kpis={kpis}
          modules={modules}
          districts={districts}
          trainingTrend={trainingTrend}
          workers={workers}
          onNavigateTab={setActiveTab}
          onSelectWorker={setSelectedWorker}
        />
      )}

      {activeTab === 'workers' && (
        <WorkersPage
          workers={workers}
          searchQuery={searchQuery}
          onSelectWorker={setSelectedWorker}
        />
      )}

      {activeTab === 'training' && (
        <TrainingPage modules={modules} />
      )}

      {activeTab === 'assessments' && (
        <AssessmentsPage workers={workers} />
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

      {activeTab === 'settings' && (
        <SettingsPage />
      )}

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
