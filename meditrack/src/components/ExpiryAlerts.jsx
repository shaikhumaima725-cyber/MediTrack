import React from 'react';
import { Clock, AlertOctagon, ShieldAlert, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { mockPharmacyStock } from '../data/mockData';

export default function ExpiryAlerts({ onVerifyBatch }) {
  // Current simulated date is 2026-11-19
  const now = new Date("2026-11-19T00:00:00Z");

  const expiryAnalyzed = mockPharmacyStock.map(item => {
    const exp = new Date(item.expDate + "T00:00:00Z");
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    let urgency = 'safe';
    if (diffDays <= 0) urgency = 'expired';
    else if (diffDays <= 30) urgency = 'critical';
    else if (diffDays <= 90) urgency = 'warning';

    return {
      ...item,
      diffDays,
      urgency
    };
  }).filter(item => item.urgency !== 'safe');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-white">Batch Expiration & Quarantine Sentinel</h1>
            </div>
            <p className="text-xs text-slate-400">
              Real-time expiration risk detection. Quarantine expired batches with permanent immutable audit logs.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            {expiryAnalyzed.length} Batches Requiring Review
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {expiryAnalyzed.map((item) => (
          <div
            key={item.id}
            className={`bg-slate-800/80 border rounded-2xl p-6 shadow-xl space-y-4 ${
              item.urgency === 'expired'
                ? 'border-red-600/50 bg-red-950/20'
                : 'border-amber-500/40 bg-amber-950/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  item.urgency === 'expired'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {item.urgency === 'expired' ? 'Expired — Do Not Dispense' : `Expiring in ${item.diffDays} Days`}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{item.name}</h3>
                <span className="text-xs text-teal-400 font-medium">{item.strength}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Expiry</span>
                <span className="font-mono text-sm font-bold text-white">{item.expDate}</span>
              </div>
            </div>

            {/* Quarantine Info */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Batch Identifier:</span>
                <span className="font-mono text-teal-300 font-semibold">{item.batchId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Inventory Units:</span>
                <span className="text-white font-bold">{item.currentStock} {item.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Location:</span>
                <span className="text-slate-300">{item.shelf}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => alert(`Batch ${item.batchId} locked in Quarantine Bay. Audit log recorded.`)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg ${
                  item.urgency === 'expired'
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                {item.urgency === 'expired' ? 'Mark as Quarantined' : 'Early Quarantine Warning'}
              </button>
              <button
                onClick={() => onVerifyBatch(item.batchId)}
                className="py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-teal-300 rounded-xl text-xs font-semibold transition flex items-center gap-1 border border-slate-600"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Trace Provenance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
