import React, { useState } from 'react';
import { X, Plus, Shield, Sparkles, Building, Calendar, MapPin, Pill, RefreshCw } from 'lucide-react';
import { blockchainService } from '../services/blockchain';

export default function AddBatchModal({ isOpen, onClose, onBatchAdded, walletState }) {
  const generateBatchId = () => {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    return `BATCH-MED-2026-${randomHex}`;
  };

  const [formData, setFormData] = useState({
    batchId: generateBatchId(),
    medicineName: '',
    strength: '',
    dosageForm: 'Tablets',
    category: 'Antibiotics',
    mfgDate: new Date().toISOString().split('T')[0],
    expDate: '2028-11-20',
    location: 'Pfizer BioPharma Plant #1, New York, NY',
    actorName: 'Pfizer Manufacturing Operations',
    notes: 'Initial GMP quality assurance passed. Batch sealed.',
    mode: walletState.isConnected ? 'BLOCKCHAIN' : 'DEMO'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.medicineName || !formData.strength || !formData.batchId) {
      setError("Please fill in Medicine Name, Strength, and Batch ID.");
      return;
    }

    setLoading(true);

    try {
      const initialHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
      
      let newBatch;

      if (formData.mode === 'BLOCKCHAIN' && walletState.isConnected) {
        // Broadcast on-chain
        const txResult = await blockchainService.registerBatchOnChain({
          batchId: formData.batchId,
          medicineName: formData.medicineName,
          strength: formData.strength,
          mfgDate: formData.mfgDate,
          expDate: formData.expDate,
          currentLocation: formData.location,
          actorName: formData.actorName,
          notes: formData.notes
        });

        newBatch = {
          batchId: formData.batchId,
          medicineName: formData.medicineName,
          strength: formData.strength,
          dosageForm: formData.dosageForm,
          category: formData.category,
          mfgDate: formData.mfgDate,
          expDate: formData.expDate,
          quantity: 5000,
          currentLocation: formData.location,
          currentStage: 'Manufacturer',
          manufacturer: {
            name: formData.actorName,
            location: formData.location,
            license: 'FDA-REG-CHAIN',
            wallet: walletState.account || '0xConnectedAccount'
          },
          distributor: null,
          pharmacy: null,
          source: 'BLOCKCHAIN',
          isBlockchainVerified: true,
          verificationStatus: 'PASS',
          txHash: txResult.transactionHash,
          temperatureControl: 'Standard (15°C - 25°C)',
          events: [
            {
              id: `EVT-01`,
              stage: 'Manufacturer',
              title: 'Batch Created on Blockchain',
              actor: formData.actorName,
              location: formData.location,
              timestamp: new Date().toISOString(),
              notes: formData.notes,
              previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
              eventHash: initialHash,
              signer: walletState.account
            }
          ]
        };
      } else {
        // Create Demo batch
        newBatch = {
          batchId: formData.batchId,
          medicineName: formData.medicineName,
          strength: formData.strength,
          dosageForm: formData.dosageForm,
          category: formData.category,
          mfgDate: formData.mfgDate,
          expDate: formData.expDate,
          quantity: 5000,
          currentLocation: formData.location,
          currentStage: 'Manufacturer',
          manufacturer: {
            name: formData.actorName,
            location: formData.location,
            license: 'FDA-DEMO-LIC',
            wallet: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
          },
          distributor: null,
          pharmacy: null,
          source: 'DEMO', // Strictly DEMO
          isBlockchainVerified: false,
          verificationStatus: 'PASS',
          integrityNote: 'Unaltered local demo prototype record.',
          temperatureControl: 'Standard (15°C - 25°C)',
          events: [
            {
              id: `EVT-01`,
              stage: 'Manufacturer',
              title: 'Batch Manufactured & Initialized',
              actor: formData.actorName,
              location: formData.location,
              timestamp: new Date().toISOString(),
              notes: formData.notes,
              previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
              eventHash: initialHash,
              signer: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
            }
          ]
        };
      }

      onBatchAdded(newBatch);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create batch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Register Medicine Batch</h3>
            <p className="text-xs text-slate-400">Generate a unique Batch ID and register supply-chain provenance.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl mb-4 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target destination toggle */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/60">
            <span className="font-semibold text-slate-300 block mb-2">Record Destination:</span>
            <div className="grid grid-cols-2 gap-2">
              <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition ${
                formData.mode === 'DEMO'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}>
                <input
                  type="radio"
                  name="recordMode"
                  value="DEMO"
                  checked={formData.mode === 'DEMO'}
                  onChange={() => setFormData({ ...formData, mode: 'DEMO' })}
                  className="accent-amber-400"
                />
                <div>
                  <div className="font-bold text-xs">Demo Mode Record</div>
                  <div className="text-[10px] text-slate-400">Local prototype dataset</div>
                </div>
              </label>

              <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition ${
                formData.mode === 'BLOCKCHAIN'
                  ? 'bg-teal-500/15 border-teal-500/40 text-teal-200'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}>
                <input
                  type="radio"
                  name="recordMode"
                  value="BLOCKCHAIN"
                  disabled={!walletState.isConnected}
                  checked={formData.mode === 'BLOCKCHAIN'}
                  onChange={() => setFormData({ ...formData, mode: 'BLOCKCHAIN' })}
                  className="accent-teal-400"
                />
                <div>
                  <div className="font-bold text-xs">Testnet Blockchain</div>
                  <div className="text-[10px] text-slate-400">
                    {walletState.isConnected ? 'Ethereum Testnet Contract' : 'Connect Wallet First'}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Batch ID */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-medium">Unique Batch ID</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, batchId: generateBatchId() })}
                className="text-teal-400 hover:text-teal-300 flex items-center gap-1 text-[11px]"
              >
                <RefreshCw className="w-3 h-3" /> Regenerate ID
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.batchId}
              onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-teal-400 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Medicine Name & Strength */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Medicine Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Amoxicillin Trihydrate"
                value={formData.medicineName}
                onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Strength / Dosage</label>
              <input
                type="text"
                required
                placeholder="e.g. 500mg"
                value={formData.strength}
                onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Dosage Form & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Dosage Form</label>
              <select
                value={formData.dosageForm}
                onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="Capsules">Capsules</option>
                <option value="Tablets">Tablets</option>
                <option value="Injectable Vial">Injectable Vial</option>
                <option value="Oral Suspension">Oral Suspension</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Therapeutic Category</label>
              <input
                type="text"
                placeholder="e.g. Antibiotics, Analgesic"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Mfg Date & Exp Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Manufacturing Date</label>
              <input
                type="date"
                required
                value={formData.mfgDate}
                onChange={(e) => setFormData({ ...formData, mfgDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Expiry Date</label>
              <input
                type="date"
                required
                value={formData.expDate}
                onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Manufacturer & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Manufacturer Name</label>
              <input
                type="text"
                required
                value={formData.actorName}
                onChange={(e) => setFormData({ ...formData, actorName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Facility Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Release & Inspection Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {formData.mode === 'BLOCKCHAIN' ? 'Register on Testnet' : 'Create Demo Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
