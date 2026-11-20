import React from 'react';
import { AlertTriangle, Package, RefreshCw, ArrowUpRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { mockPharmacyStock } from '../data/mockData';

export default function StockAlerts({ onVerifyBatch }) {
  const lowStockItems = mockPharmacyStock.filter(item => item.currentStock <= item.minThreshold);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-white">Stock Depletion & Reorder Alerts</h1>
            </div>
            <p className="text-xs text-slate-400">
              Automated reorder triggers linked to traceable Batch IDs and manufacturer logistics pipelines.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold">
            {lowStockItems.length} Critical Items Detected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {lowStockItems.map((item) => {
          const percent = Math.min(100, Math.round((item.currentStock / item.minThreshold) * 100));
          return (
            <div
              key={item.id}
              className="bg-slate-800/80 border border-rose-500/40 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Low Stock Threshold Breached
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{item.name}</h3>
                  <span className="text-xs text-teal-400 font-medium">{item.strength}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-rose-400">{item.currentStock}</div>
                  <div className="text-[10px] text-slate-400">Min: {item.minThreshold} {item.unit}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Inventory Level</span>
                  <span className="font-bold text-rose-400">{percent}% of Safety Stock</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Batch Metadata */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Traceable Batch ID:</span>
                  <span className="font-mono text-teal-300 font-semibold">{item.batchId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shelf Storage:</span>
                  <span className="text-slate-200">{item.shelf}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expiry Window:</span>
                  <span className="text-amber-300 font-mono">{item.expDate}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => alert(`Replenishment purchase order dispatched for ${item.name} (${item.batchId})`)}
                  className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-teal-900/30"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Trigger Reorder
                </button>
                <button
                  onClick={() => onVerifyBatch(item.batchId)}
                  className="py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-teal-300 rounded-xl text-xs font-semibold transition flex items-center gap-1 border border-slate-600"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Trace Batch
                </button>
              </div>
            </div>
          );
        })}

        {lowStockItems.length === 0 && (
          <div className="col-span-2 text-center p-12 bg-slate-800/80 rounded-2xl border border-slate-700">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">All Stock Levels Optimal</h3>
            <p className="text-xs text-slate-400 mt-1">No medicine inventory is currently below minimum safety thresholds.</p>
          </div>
        )}
      </div>
    </div>
  );
}
