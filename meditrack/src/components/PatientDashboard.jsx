import React from 'react';
import { Pill, ShieldCheck, Calendar, Clock, AlertCircle, ArrowUpRight, User, CheckCircle2 } from 'lucide-react';
import { mockPrescriptions } from '../data/mockData';

export default function PatientDashboard({ onVerifyBatch }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-800 to-indigo-950/60 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center font-bold text-xl shadow-inner">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Eleanor Vance</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-xs font-mono font-semibold">
                Patient ID: PAT-1092
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active Prescriptions: 3 &bull; Next Dose: 2:00 PM (Amoxicillin 500mg)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 text-xs">
            <span className="text-slate-400 block">Adherence Score</span>
            <span className="text-lg font-bold text-emerald-400">96%</span>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 text-xs">
            <span className="text-slate-400 block">Verified Batches</span>
            <span className="text-lg font-bold text-teal-400">100%</span>
          </div>
        </div>
      </div>

      {/* Counterfeit Protection Safety Banner */}
      <div className="bg-teal-950/40 border border-teal-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-xs text-teal-200">
            <span className="font-bold text-white">Blockchain Authenticity Protection Active:</span> Every medication dispensed to you is stamped with a unique cryptographically tracked Batch ID to guarantee 0% risk of counterfeit medicine.
          </p>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white text-lg">My Prescribed Medications</h2>
            <p className="text-xs text-slate-400">Click "Verify Batch" on any prescription to trace its journey from factory to pharmacy.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {mockPrescriptions.length} Active Prescriptions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-5 hover:border-teal-500/50 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                    <Pill className="w-5 h-5" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    rx.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {rx.status}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base">{rx.medicineName}</h3>
                <span className="text-xs font-semibold text-teal-400">{rx.strength}</span>

                <div className="mt-3 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                  <div className="text-slate-300">
                    <span className="text-slate-400">Dosage:</span> {rx.dosage}
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Prescriber:</span> {rx.prescribedBy}
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Dispensed:</span>
                    <span className="text-slate-300 font-mono">{rx.dispensedDate}</span>
                  </div>
                </div>

                {/* Unique Batch ID Display */}
                <div className="mt-3 p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-xs flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Batch ID:</span>
                  <span className="font-mono text-teal-300 font-semibold text-[11px]">{rx.batchId}</span>
                </div>
              </div>

              {/* Verify Batch Button */}
              <button
                onClick={() => onVerifyBatch(rx.batchId)}
                className="mt-4 w-full py-2.5 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-teal-900/30"
              >
                <ShieldCheck className="w-4 h-4" />
                Verify Batch Provenance
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
