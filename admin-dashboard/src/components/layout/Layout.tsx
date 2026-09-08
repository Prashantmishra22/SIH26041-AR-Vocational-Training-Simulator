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
}) => {
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F17] text-slate-100">
      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingSyncCount={pendingSyncCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Header
          onOpenQRVerifier={() => setIsVerifierOpen(true)}
          onSyncRefresh={onSyncRefresh}
          isSyncing={isSyncing}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
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
