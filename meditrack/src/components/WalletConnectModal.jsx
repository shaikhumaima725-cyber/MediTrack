import React, { useState } from 'react';
import { X, Wallet, Shield, AlertTriangle, CheckCircle2, RefreshCw, ExternalLink } from 'lucide-react';
import { blockchainService, DEFAULT_CONTRACT_ADDRESS } from '../services/blockchain';

export default function WalletConnectModal({ isOpen, onClose, walletState, onWalletUpdate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customAddress, setCustomAddress] = useState(blockchainService.contractAddress);

  if (!isOpen) return null;

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await blockchainService.connectWallet();
      onWalletUpdate({
        isConnected: true,
        account: res.account,
        networkName: res.networkName,
        chainId: res.chainId
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to connect wallet.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchSepolia = async () => {
    setLoading(true);
    setError(null);
    try {
      await blockchainService.switchToSepolia();
      const res = await blockchainService.connectWallet();
      onWalletUpdate({
        isConnected: true,
        account: res.account,
        networkName: res.networkName,
        chainId: res.chainId
      });
    } catch (err) {
      setError(err.message || "Failed to switch network.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    blockchainService.disconnect();
    onWalletUpdate({
      isConnected: false,
      account: null,
      networkName: "Not Connected",
      chainId: null
    });
  };

  const handleSaveContractAddress = () => {
    blockchainService.setContractAddress(customAddress);
    alert(`Contract address updated to: ${customAddress}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Web3 Testnet Connection</h3>
            <p className="text-xs text-slate-400">Connect to Sepolia Testnet or Local Hardhat Node</p>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <span className="font-bold">Hackathon Prototype Notice:</span> When no Web3 wallet is connected, MediTrack runs in <span className="font-semibold text-white">"Demo Mode — Not Connected to Blockchain"</span>. In this mode, mock batch data is displayed and strictly marked as demo records.
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl mb-4 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Connection Status Box */}
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-700/60 mb-5 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Connection Status:</span>
            {walletState.isConnected ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected to Testnet
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
                Demo Mode — Not Connected
              </span>
            )}
          </div>

          {walletState.isConnected && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Network:</span>
                <span className="font-semibold text-slate-200">{walletState.networkName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Connected Wallet:</span>
                <span className="font-mono text-teal-400">
                  {walletState.account ? `${walletState.account.substring(0, 8)}...${walletState.account.substring(36)}` : 'N/A'}
                </span>
              </div>
            </>
          )}

          <div className="pt-2 border-t border-slate-800">
            <label className="block text-slate-400 mb-1 font-medium">Smart Contract Address (Testnet):</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={handleSaveContractAddress}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold text-slate-200 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {!walletState.isConnected ? (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-teal-900/30"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
              Connect Browser Wallet (MetaMask)
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSwitchSepolia}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition"
              >
                Switch to Sepolia
              </button>
              <button
                onClick={handleDisconnect}
                className="py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-rose-300 rounded-xl font-semibold text-xs transition"
              >
                Disconnect
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>Need free Sepolia testnet ETH?</span>
            <a
              href="https://sepoliafaucet.com"
              target="_blank"
              rel="noreferrer"
              className="text-teal-400 hover:underline flex items-center gap-1"
            >
              Sepolia Faucet <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
