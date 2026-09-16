import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CertificateVerifyModal } from '../certificates/CertificateVerifyModal';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSyncRefresh: () => void;
  isSyncing: boolean;
  pendingSyncCount?: number;
  viewMode?: 'admin' | 'worker' | 'split';
  onViewModeChange?: (mode: 'admin' | 'worker' | 'split') => void;
  connectedWorkersCount?: number;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onSyncRefresh,
  isSyncing,
  pendingSyncCount = 14,
  viewMode = 'admin',
  onViewModeChange = () => {},
  connectedWorkersCount = 0,
}) => {
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F1F4F9] text-slate-900">
      {/* Fixed Dark Sidebar (hidden in standalone worker mode for maximum immersion) */}
      {viewMode !== 'worker' && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingSyncCount={pendingSyncCount}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Header
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          connectedWorkersCount={connectedWorkersCount}
          onOpenQRVerifier={() => setIsVerifierOpen(true)}
          onSyncRefresh={onSyncRefresh}
          isSyncing={isSyncing}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className={`flex-1 overflow-y-auto ${viewMode === 'worker' ? 'p-2 bg-slate-950 flex items-center justify-center' : 'p-4 md:p-6 lg:p-8 space-y-6 bg-[#F1F4F9]'}`}>
          {children}
        </main>
      </div>

      {/* Global QR Verifier Modal */}
      {isVerifierOpen && (
        <CertificateVerifyModal onClose={() => setIsVerifierOpen(false)} />
      )}
    </div>
  );
};
