import React from 'react';
import {
  Shield, Pill, Store, User, AlertTriangle, Clock,
  Settings, Wallet, Link as LinkIcon, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function Navbar({
  activeTab,
  onSelectTab,
  walletState,
  onOpenWalletModal
}) {
  const navItems = [
    { id: 'blockchain', label: 'Blockchain Tracker', icon: LinkIcon, highlight: true },
    { id: 'pharmacy', label: 'Pharmacy Dashboard', icon: Store },
    { id: 'patient', label: 'Patient Dashboard', icon: User },
    { id: 'stockAlerts', label: 'Stock Alerts', icon: AlertTriangle, badge: '1' },
    { id: 'expiryAlerts', label: 'Expiry Alerts', icon: Clock, badge: '2' },
    { id: 'admin', label: 'Admin Dashboard', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('blockchain')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Pill className="w-5 h-5 text-teal-400 -rotate-45" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">
                  Medi<span className="text-teal-400">Track</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  Web3 Verified
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono -mt-0.5">Supply-Chain Provenance</p>
            </div>
          </div>

          {/* Web3 / Demo Mode Wallet Status Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenWalletModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                walletState.isConnected
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                walletState.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`} />
              <Wallet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {walletState.isConnected
                  ? `${walletState.networkName} (${walletState.account?.substring(0, 6)}...)`
                  : 'Demo Mode — Not Connected to Blockchain'}
              </span>
              <span className="sm:hidden font-mono text-[11px]">
                {walletState.isConnected ? 'Testnet' : 'Demo Mode'}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    item.id === 'stockAlerts'
                      ? 'bg-rose-500/30 text-rose-300'
                      : 'bg-amber-500/30 text-amber-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
