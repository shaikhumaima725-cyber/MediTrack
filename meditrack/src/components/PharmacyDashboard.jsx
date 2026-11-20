import React, { useState } from 'react';
import { Store, Package, AlertTriangle, ArrowUpRight, Search, ShieldCheck, Truck, Plus } from 'lucide-react';
import { mockPharmacyStock } from '../data/mockData';

export default function PharmacyDashboard({ onVerifyBatch, onNavigateTab }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStock = mockPharmacyStock.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.batchId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Inventory SKUs</span>
            <Package className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white">1,420</div>
          <p className="text-[11px] text-teal-400 mt-1">Across 8 Dispensary Aisles</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Critical Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">1 Item</div>
          <button
            onClick={() => onNavigateTab('stockAlerts')}
            className="text-[11px] text-rose-300 hover:underline mt-1 block"
          >
            Review Stock Warnings &rarr;
          </button>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Near Expiry Quarantined</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">2 Batches</div>
          <button
            onClick={() => onNavigateTab('expiryAlerts')}
            className="text-[11px] text-amber-300 hover:underline mt-1 block"
          >
            Inspect Expiry Batches &rarr;
          </button>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Verified Batch Custodies</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">100%</div>
          <p className="text-[11px] text-slate-400 mt-1">Full Traceability Active</p>
        </div>
      </div>

      {/* Main Inventory Management Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Pharmacy Dispensary Inventory</h2>
            <p className="text-xs text-slate-400">Every inventory item links to a verifiable smart contract Batch ID.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search medicine or Batch ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>
            <button
              onClick={() => onNavigateTab('blockchain')}
              className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              New Intake
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Medicine & Strength</th>
                <th className="py-3 px-4">Batch ID (Traceable)</th>
                <th className="py-3 px-4">In Stock / Safety</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Shelf Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Blockchain Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredStock.map((item) => (
                <tr key={item.id} className="hover:bg-slate-700/30 transition">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {item.name}
                    <span className="block text-[11px] text-teal-400 font-normal">{item.strength}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-300">
                    {item.batchId}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-bold ${item.currentStock <= item.minThreshold ? 'text-rose-400' : 'text-slate-200'}`}>
                      {item.currentStock} {item.unit}
                    </span>
                    <span className="block text-[10px] text-slate-500">Min: {item.minThreshold}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {item.expDate}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {item.shelf}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      item.status.includes('Critical')
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : item.status.includes('Expired')
                        ? 'bg-red-950/60 text-red-300 border border-red-800'
                        : item.status.includes('Transit')
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onVerifyBatch(item.batchId)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-teal-300 hover:text-white rounded-lg text-xs font-semibold transition border border-slate-600"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Trace
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
