import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
} from 'lucide-react';
import { Dispute } from '../../types';

export const AdminDisputesPage: React.FC = () => {
  const { disputes, adminResolveDispute } = useData();

  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionType, setResolutionType] = useState<'buyer' | 'seller'>('buyer');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute || !resolutionNotes.trim()) return;
    adminResolveDispute(selectedDispute.id, resolutionType, resolutionNotes.trim());
    setSelectedDispute(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Escrow Dispute Mediation Room
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Mediate conflict between buyers and sellers. Admin resolution triggers automated escrow release or refund.
        </p>
      </div>

      {/* Disputes List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Dispute ID</th>
                <th className="p-4">Service & Order</th>
                <th className="p-4">Opened By</th>
                <th className="p-4">Against</th>
                <th className="p-4 text-right">Disputed Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {disputes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No active escrow disputes in queue. Platform health is optimal.
                  </td>
                </tr>
              ) : (
                disputes.map((disp) => (
                  <tr key={disp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      #{disp.id}
                    </td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                      {disp.serviceTitle}
                      <span className="block text-[11px] text-slate-400 font-mono">#{disp.orderId}</span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-semibold">
                      {disp.openedByName}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {disp.openedAgainstName}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-red-600 dark:text-red-400">
                      ৳{disp.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          disp.status.includes('resolved')
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {disp.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {disp.status === 'open' || disp.status === 'under_review' ? (
                        <button
                          onClick={() => setSelectedDispute(disp)}
                          className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs"
                        >
                          Mediate Case
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Closed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mediation Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Mediate Dispute #{selectedDispute.id}
            </h3>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">Claimant Note:</p>
              <p className="text-slate-600 dark:text-slate-400">{selectedDispute.description}</p>
            </div>

            <form onSubmit={handleResolve} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Administrative Ruling</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setResolutionType('buyer')}
                    className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                      resolutionType === 'buyer'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    100% Refund to Buyer (৳{selectedDispute.amount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setResolutionType('seller')}
                    className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                      resolutionType === 'seller'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Release Payout to Seller (৳{selectedDispute.amount})
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Official Resolution Memo</label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Explain reason for ruling based on submitted evidence..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDispute(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Execute Administrative Ruling
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
