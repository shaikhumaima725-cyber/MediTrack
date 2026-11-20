import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BlockchainTracker from './components/BlockchainTracker';
import PatientDashboard from './components/PatientDashboard';
import PharmacyDashboard from './components/PharmacyDashboard';
import StockAlerts from './components/StockAlerts';
import ExpiryAlerts from './components/ExpiryAlerts';
import AdminDashboard from './components/AdminDashboard';
import WalletConnectModal from './components/WalletConnectModal';
import { mockBatches } from './data/mockData';
import { blockchainService } from './services/blockchain';

export default function App() {
  const [batches, setBatches] = useState(mockBatches);
  const [selectedBatchId, setSelectedBatchId] = useState('BATCH-MED-2026-001');
  const [activeTab, setActiveTab] = useState('blockchain');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletState, setWalletState] = useState({
    isConnected: false,
    account: null,
    networkName: "Not Connected",
    chainId: null
  });

  // Check URL query parameters on mount (e.g. ?batchId=BATCH-MED-2026-001 from QR Code scan)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const urlBatchId = params.get('batchId');
      if (urlBatchId) {
        setSelectedBatchId(urlBatchId);
        setActiveTab('blockchain');
      }
    }
  }, []);

  const handleVerifyBatch = (batchId) => {
    setSelectedBatchId(batchId);
    setActiveTab('blockchain');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddBatch = (newBatch) => {
    setBatches(prev => [newBatch, ...prev]);
    setSelectedBatchId(newBatch.batchId);
  };

  const handleUpdateBatch = (updatedBatch) => {
    setBatches(prev => prev.map(b => b.batchId === updatedBatch.batchId ? updatedBatch : b));
    setSelectedBatchId(updatedBatch.batchId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        walletState={walletState}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'blockchain' && (
          <BlockchainTracker
            batches={batches}
            selectedBatchId={selectedBatchId}
            onSelectBatchId={setSelectedBatchId}
            walletState={walletState}
            onAddBatch={handleAddBatch}
            onUpdateBatch={handleUpdateBatch}
          />
        )}

        {activeTab === 'pharmacy' && (
          <PharmacyDashboard
            onVerifyBatch={handleVerifyBatch}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'patient' && (
          <PatientDashboard
            onVerifyBatch={handleVerifyBatch}
          />
        )}

        {activeTab === 'stockAlerts' && (
          <StockAlerts
            onVerifyBatch={handleVerifyBatch}
          />
        )}

        {activeTab === 'expiryAlerts' && (
          <ExpiryAlerts
            onVerifyBatch={handleVerifyBatch}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            walletState={walletState}
            onOpenWalletModal={() => setIsWalletModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-5 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">MediTrack</span>
            <span>&bull;</span>
            <span>Blockchain Medicine Batch Tracking & Healthcare Inventory</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Network: <strong className="text-teal-400 font-mono">{walletState.isConnected ? walletState.networkName : 'Demo Mode (Offline Ledger)'}</strong></span>
            <span>Smart Contract: <code className="text-slate-300">MedicineTracker.sol</code></span>
          </div>
        </div>
      </footer>

      {/* Wallet Modal */}
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        walletState={walletState}
        onWalletUpdate={setWalletState}
      />
    </div>
  );
}
