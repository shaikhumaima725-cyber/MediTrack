import React, { useState, useEffect } from 'react';
import {
  Search, QrCode, Shield, CheckCircle2, AlertTriangle, XCircle,
  Building, Truck, Store, ArrowRight, Clock, MapPin, Hash,
  FileCheck, ExternalLink, Plus, Copy, Check, Info, RefreshCw
} from 'lucide-react';
import { verifyBatchIntegrity } from '../services/integrityCheck';
import BatchQRCodeModal from './BatchQRCodeModal';
import AddBatchModal from './AddBatchModal';
import { blockchainService } from '../services/blockchain';

export default function BlockchainTracker({
  batches,
  selectedBatchId,
  onSelectBatchId,
  walletState,
  onAddBatch,
  onUpdateBatch
}) {
  const [searchInput, setSearchInput] = useState(selectedBatchId || '');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedBatchId, setCopiedBatchId] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferStage, setTransferStage] = useState('Distributor');
  const [transferLocation, setTransferLocation] = useState('AmerisourceBergen Cross-Dock, Chicago, IL');
  const [transferActor, setTransferActor] = useState('AmerisourceBergen Cold Chain Logistics');
  const [transferNotes, setTransferNotes] = useState('Custody handoff completed. Temperature sensors logged 21.0°C.');

  // Synchronize search input if selectedBatchId changes externally (e.g., from patient dashboard or URL query)
  useEffect(() => {
    if (selectedBatchId) {
      setSearchInput(selectedBatchId);
    }
  }, [selectedBatchId]);

  // Find active batch or default to the first one
  const currentBatch = batches.find(b => b.batchId.toLowerCase() === (searchInput || selectedBatchId || '').trim().toLowerCase()) 
    || batches.find(b => b.batchId === selectedBatchId)
    || batches[0];

  // Run the multi-level supply-chain integrity audit
  const integrityResult = verifyBatchIntegrity(currentBatch);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const match = batches.find(b => b.batchId.toLowerCase() === searchInput.trim().toLowerCase());
    if (match) {
      onSelectBatchId(match.batchId);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedBatchId(true);
    setTimeout(() => setCopiedBatchId(false), 2000);
  };

  // Record a next transfer stage (Manufacturer -> Distributor -> Pharmacy)
  const handleRecordTransfer = async (e) => {
    e.preventDefault();
    if (!currentBatch) return;

    try {
      const prevEvent = currentBatch.events[currentBatch.events.length - 1];
      const prevHash = prevEvent ? prevEvent.eventHash : "0x0000000000000000000000000000000000000000000000000000000000000000";
      const newHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;

      const newEvent = {
        id: `EVT-${Date.now().toString().slice(-4)}`,
        stage: transferStage,
        title: `Consignment Transferred to ${transferStage}`,
        actor: transferActor,
        location: transferLocation,
        timestamp: new Date().toISOString(),
        notes: transferNotes,
        previousHash: prevHash,
        eventHash: newHash,
        signer: walletState.isConnected ? walletState.account : '0xDemoTransfereeKey'
      };

      const updatedBatch = {
        ...currentBatch,
        currentStage: transferStage,
        currentLocation: transferLocation,
        events: [...currentBatch.events, newEvent]
      };

      // If connected to testnet, attempt on-chain transfer
      if (walletState.isConnected && currentBatch.source === 'BLOCKCHAIN') {
        const stageMap = { 'Manufacturer': 0, 'Distributor': 1, 'Pharmacy': 2, 'Dispensed': 3 };
        await blockchainService.transferBatchOnChain(
          currentBatch.batchId,
          stageMap[transferStage] || 1,
          transferLocation,
          transferActor,
          transferNotes
        );
      }

      onUpdateBatch(updatedBatch);
      setIsTransferring(false);
      alert(`Success: Checkpoint event recorded for stage: ${transferStage}`);
    } catch (err) {
      console.error(err);
      alert("Transfer recording failed: " + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Batch Search Bar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase tracking-wider">
                Provenance Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">ERC-Proven 2.0</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Blockchain Medicine Batch Tracking
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Verify authentic manufacture, cold-chain handoffs, and tamper-evident event histories.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-teal-900/30"
            >
              <Plus className="w-4 h-4" />
              Register Batch
            </button>
          </div>
        </div>

        {/* Search & Suggestions */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by unique Batch ID (e.g. BATCH-MED-2026-001)..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                const match = batches.find(b => b.batchId.toLowerCase() === e.target.value.trim().toLowerCase());
                if (match) onSelectBatchId(match.batchId);
              }}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-12 pr-28 py-3.5 text-sm text-slate-100 placeholder-slate-400 font-mono focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition"
            >
              Search
            </button>
          </div>

          {/* Quick select pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-700/60 text-xs">
            <span className="text-slate-400 font-medium">Quick Pick:</span>
            {batches.map((b) => (
              <button
                key={b.batchId}
                type="button"
                onClick={() => {
                  setSearchInput(b.batchId);
                  onSelectBatchId(b.batchId);
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] transition ${
                  currentBatch?.batchId === b.batchId
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                    : b.batchId.includes('SUSPECT')
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                    : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {b.batchId} {b.batchId.includes('SUSPECT') && '⚠️'}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Distinction Banner: Demo Record vs Blockchain Verified */}
      {currentBatch.source === 'BLOCKCHAIN' ? (
        <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border border-emerald-500/40 rounded-2xl p-4.5 shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">BLOCKCHAIN-VERIFIED RECORD</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase">
                  Consensus Confirmed
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                This batch record was queried directly from the Ethereum Testnet smart contract. Cryptographically immutable.
              </p>
            </div>
          </div>
          {currentBatch.txHash && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 text-xs font-mono">
              TX: {currentBatch.txHash.substring(0, 10)}...
            </span>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-2xl p-4.5 shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">DEMO PROTOTYPE RECORD</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  Local Simulation — Not On-Chain
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Never presented as blockchain-verified. Connect a Web3 wallet to Sepolia or a local testnet to record real on-chain batches.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-900/30 text-amber-300 border border-amber-700/40 text-xs font-semibold">
            Demo Mode Active
          </span>
        </div>
      )}

      {/* Main Grid: Batch Overview & Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Batch Details Card */}
        <div className="lg:col-span-1 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Hash className="w-4 h-4" />
              </span>
              <h2 className="font-bold text-white text-base">Batch Details</h2>
            </div>
            {/* QR Code Action Button */}
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-teal-300 rounded-lg text-xs font-semibold transition border border-slate-600"
              title="Open QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
              Show QR
            </button>
          </div>

          {/* Batch ID Banner */}
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Batch Identifier
              </span>
              <span className="font-mono text-sm font-bold text-teal-300 break-all">
                {currentBatch.batchId}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(currentBatch.batchId)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Copy Batch ID"
            >
              {copiedBatchId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Core Medicine Specs */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-700/60">
              <span className="text-slate-400">Medicine Name:</span>
              <span className="font-semibold text-white text-right">{currentBatch.medicineName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/60">
              <span className="text-slate-400">Strength / Dose:</span>
              <span className="font-semibold text-teal-400">{currentBatch.strength}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/60">
              <span className="text-slate-400">Dosage Form:</span>
              <span className="font-medium text-slate-200">{currentBatch.dosageForm || 'Tablets'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/60">
              <span className="text-slate-400">Therapeutic Class:</span>
              <span className="font-medium text-slate-200">{currentBatch.category || 'General'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/60">
              <span className="text-slate-400">Mfg Date:</span>
              <span className="font-mono text-slate-200">{currentBatch.mfgDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/60">
              <span className="text-slate-400">Expiry Date:</span>
              <span className="font-mono font-semibold text-rose-300">{currentBatch.expDate}</span>
            </div>
            <div className="py-2 border-b border-slate-700/60">
              <span className="text-slate-400 block mb-1">Current Custody Location:</span>
              <div className="flex items-start gap-1.5 text-slate-200 font-medium">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>{currentBatch.currentLocation}</span>
              </div>
            </div>
            <div className="py-2">
              <span className="text-slate-400 block mb-1">Storage Conditions:</span>
              <span className="text-slate-300 italic">{currentBatch.temperatureControl || 'Ambient 15°C-25°C'}</span>
            </div>
          </div>

          {/* Quick Record Transfer Toggle */}
          <button
            onClick={() => setIsTransferring(!isTransferring)}
            className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 border border-slate-600"
          >
            <Truck className="w-3.5 h-3.5 text-teal-400" />
            {isTransferring ? 'Cancel Handover Form' : 'Record Custody Handover'}
          </button>

          {isTransferring && (
            <form onSubmit={handleRecordTransfer} className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-3 text-xs animate-fadeIn">
              <h4 className="font-bold text-white text-xs">Record Supply-Chain Transfer</h4>
              <div>
                <label className="text-slate-400 block mb-1">Destination Stage:</label>
                <select
                  value={transferStage}
                  onChange={(e) => setTransferStage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="Distributor">Distributor Checkpoint</option>
                  <option value="Pharmacy">Pharmacy Delivery</option>
                  <option value="Dispensed">Dispensed to Patient</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Receiving Organization:</label>
                <input
                  type="text"
                  required
                  value={transferActor}
                  onChange={(e) => setTransferActor(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">New Physical Location:</label>
                <input
                  type="text"
                  required
                  value={transferLocation}
                  onChange={(e) => setTransferLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Inspection Notes:</label>
                <textarea
                  rows={2}
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold text-xs transition"
              >
                Sign & Commit Transfer Event
              </button>
            </form>
          )}
        </div>

        {/* Right 2 Columns: Supply-Chain Journey + Integrity Check + Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Supply Chain 3-Stage Journey (Manufacturer -> Distributor -> Pharmacy) */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-white text-base">Medicine Supply-Chain Journey</h2>
                <p className="text-xs text-slate-400">Verifiable custody transitions across licensed participants</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 text-teal-400 border border-teal-500/30 text-xs font-mono font-semibold">
                Stage: {currentBatch.currentStage}
              </span>
            </div>

            {/* Visual 3-Stage Progress Path */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {/* Stage 1: Manufacturer */}
              <div className={`p-4 rounded-xl border relative transition ${
                currentBatch.currentStage === 'Manufacturer'
                  ? 'bg-teal-500/10 border-teal-500/50 ring-1 ring-teal-500/50'
                  : 'bg-slate-900/60 border-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-500/20 text-teal-300">
                    1. Manufacturer
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  {currentBatch.manufacturer?.name || 'Authorized Lab'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {currentBatch.manufacturer?.location || 'Origin Facility'}
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex justify-between text-[11px]">
                  <span className="text-slate-500">License:</span>
                  <span className="font-mono text-slate-300">{currentBatch.manufacturer?.license || 'FDA-MFG-CERT'}</span>
                </div>
              </div>

              {/* Stage 2: Distributor */}
              <div className={`p-4 rounded-xl border relative transition ${
                currentBatch.currentStage === 'Distributor'
                  ? 'bg-teal-500/10 border-teal-500/50 ring-1 ring-teal-500/50'
                  : currentBatch.currentStage === 'Pharmacy' || currentBatch.currentStage === 'Dispensed'
                  ? 'bg-slate-900/60 border-slate-700'
                  : 'bg-slate-900/30 border-slate-800 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    currentBatch.distributor ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    2. Distributor
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  {currentBatch.distributor?.name || (currentBatch.currentStage === 'Manufacturer' ? 'Awaiting Dispatch' : 'Logistics Partner')}
                </h4>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {currentBatch.distributor?.location || 'Transit Network'}
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex justify-between text-[11px]">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-mono text-slate-300">
                    {currentBatch.currentStage === 'Manufacturer' ? 'Pending Handoff' : 'In Transit / Dispatched'}
                  </span>
                </div>
              </div>

              {/* Stage 3: Pharmacy */}
              <div className={`p-4 rounded-xl border relative transition ${
                currentBatch.currentStage === 'Pharmacy' || currentBatch.currentStage === 'Dispensed'
                  ? 'bg-teal-500/10 border-teal-500/50 ring-1 ring-teal-500/50'
                  : 'bg-slate-900/30 border-slate-800 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Store className="w-5 h-5" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    currentBatch.pharmacy ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    3. Pharmacy
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  {currentBatch.pharmacy?.name || (currentBatch.currentStage === 'Pharmacy' ? 'Central Dispensary' : 'Not Yet Stocked')}
                </h4>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {currentBatch.pharmacy?.location || 'Destination Shelf'}
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex justify-between text-[11px]">
                  <span className="text-slate-500">Dispensary:</span>
                  <span className="font-mono text-slate-300">
                    {currentBatch.currentStage === 'Pharmacy' ? 'Stock Verified' : 'Awaiting Delivery'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status & Integrity Audit */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-white text-base">Chain-of-Custody Integrity Check</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                integrityResult.passed
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {integrityResult.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {integrityResult.badgeText}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
              {integrityResult.summary}
            </p>

            {/* Individual Check Breakdowns */}
            <div className="space-y-2.5 pt-2">
              {integrityResult.checks.map((chk, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-700/50 text-xs"
                >
                  <div className="shrink-0 mt-0.5">
                    {chk.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : chk.isInformational ? (
                      <Info className="w-4 h-4 text-amber-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-200 block">{chk.name}</span>
                    <span className="text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                      {chk.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline of Recorded Supply-Chain Events */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Supply-Chain Event Timeline</h3>
                <p className="text-xs text-slate-400">Chronological ledger entries and cryptographic checkpoint hashes</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {currentBatch.events?.length || 0} Events Recorded
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-700">
              {currentBatch.events?.map((evt, idx) => (
                <div key={evt.id || idx} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-teal-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  </div>

                  <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 transition group-hover:border-slate-600">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-teal-300 border border-slate-700">
                          {evt.stage}
                        </span>
                        <h4 className="font-bold text-white text-sm">{evt.title}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(evt.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 mb-2">
                      <span className="text-slate-400 font-medium">Actor: </span>{evt.actor} &bull;{' '}
                      <span className="text-slate-400 font-medium">Location: </span>{evt.location}
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/40 mb-3 leading-relaxed">
                      {evt.notes}
                    </p>

                    {/* Cryptographic Hash Details */}
                    <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[10px] font-mono space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>Prev Hash:</span>
                        <span className="text-slate-500 truncate max-w-[240px]">{evt.previousHash}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Event Hash:</span>
                        <span className="text-teal-400 truncate max-w-[240px]">{evt.eventHash}</span>
                      </div>
                      {evt.signer && (
                        <div className="flex justify-between text-slate-400">
                          <span>Signer Key:</span>
                          <span className="text-indigo-400 truncate max-w-[240px]">{evt.signer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BatchQRCodeModal
        batch={currentBatch}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      <AddBatchModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBatchAdded={onAddBatch}
        walletState={walletState}
      />
    </div>
  );
}
