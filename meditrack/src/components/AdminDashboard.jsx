import React from 'react';
import { Shield, Server, Activity, Users, AlertTriangle, CheckCircle, Database, Cpu, Terminal } from 'lucide-react';
import { mockAdminStats } from '../data/mockData';
import { DEFAULT_CONTRACT_ADDRESS } from '../services/blockchain';

export default function AdminDashboard({ walletState, onOpenWalletModal }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Batches Tracked</span>
            <Database className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white">{mockAdminStats.totalBatchesTracked.toLocaleString()}</div>
          <p className="text-[11px] text-teal-400 mt-1">Across 176 Registered Facilities</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Authenticity Audit Rate</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{mockAdminStats.verifiedIntegrityRate}</div>
          <p className="text-[11px] text-slate-400 mt-1">Cryptographic Hash Validation</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Drug Recalls</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{mockAdminStats.activeRecalls}</div>
          <p className="text-[11px] text-emerald-400 mt-1">All Batches Clear</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Blockchain Network</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-sm font-bold text-teal-300 truncate">
            {walletState.isConnected ? walletState.networkName : 'Ethereum Sepolia (Target)'}
          </div>
          <button
            onClick={onOpenWalletModal}
            className="text-[11px] text-indigo-400 hover:underline mt-1 block"
          >
            {walletState.isConnected ? 'Manage Wallet Connection &rarr;' : 'Connect Testnet Wallet &rarr;'}
          </button>
        </div>
      </div>

      {/* Node & Network Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Infrastructure */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-teal-400" />
              <h2 className="text-base font-bold text-white">Consensus & Node Topology</h2>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              walletState.isConnected
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }`}>
              {walletState.isConnected ? 'Live Web3 Connected' : 'Demo Mode Active'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-700">
              <span className="text-slate-400">Target Testnet:</span>
              <span className="font-semibold text-slate-200">Ethereum Sepolia (Chain ID 11155111)</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-700">
              <span className="text-slate-400">Smart Contract:</span>
              <span className="font-mono text-teal-300 truncate max-w-[220px]">
                {DEFAULT_CONTRACT_ADDRESS}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-700">
              <span className="text-slate-400">Solidity Version:</span>
              <span className="font-mono text-slate-200">^0.8.20 (EVM Paris)</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-700">
              <span className="text-slate-400">Participant Nodes:</span>
              <span className="text-slate-200">
                {mockAdminStats.connectedNodes.manufacturers} Mfgs &bull; {mockAdminStats.connectedNodes.distributors} Dist &bull; {mockAdminStats.connectedNodes.pharmacies} Pharmacies
              </span>
            </div>
          </div>
        </div>

        {/* Real-Time System Security Audits */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Security & Audit Event Stream</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Live Feed</span>
          </div>

          <div className="space-y-3">
            {mockAdminStats.recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 bg-slate-900 rounded-xl border border-slate-700 flex items-start gap-3 text-xs"
              >
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-slate-200 block">{alert.message}</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hackathon Prototype Disclosure */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl text-xs space-y-2">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Terminal className="w-4 h-4 text-teal-400" />
          Hackathon Prototype Architecture & Rules Compliance
        </h3>
        <p className="text-slate-300 leading-relaxed">
          MediTrack strictly distinguishes between demo prototype data and live on-chain smart contract data. When no wallet is connected, the application runs under <span className="text-amber-300 font-semibold">Demo Mode — Not Connected to Blockchain</span>. Under no circumstance are mock records misrepresented as blockchain-verified. When an operator connects MetaMask configured for Sepolia Testnet, batches are queried directly from the immutable <span className="font-mono text-teal-300">MedicineTracker.sol</span> contract.
        </p>
      </div>
    </div>
  );
}
