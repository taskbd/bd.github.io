import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  ArrowDownLeft,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  AlertCircle,
  Copy,
  Check,
  FileText,
} from 'lucide-react';
import { DepositRequest } from '../../types';

export const AdminDepositsPage: React.FC = () => {
  const { depositRequests, adminApproveDeposit, adminRejectDeposit, setSelectedInvoice } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [rejectingDep, setRejectingDep] = useState<DepositRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDeposits = depositRequests.filter((d) => {
    const matchesFilter = filterStatus === 'all' || d.status === filterStatus;
    const matchesSearch =
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.trxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.senderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopyTrx = (trx: string, id: string) => {
    navigator.clipboard.writeText(trx);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingDep || !rejectReason.trim()) return;
    adminRejectDeposit(rejectingDep.id, rejectReason.trim());
    setRejectingDep(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Deposit Verification Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Verify incoming bKash, Nagad, and Rocket payments. Approving triggers an atomic balance credit and dispatches an official invoice receipt.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search TrxID, user, phone..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['pending', 'approved', 'rejected', 'all'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Deposit ID / Date</th>
                <th className="p-4">User</th>
                <th className="p-4">Gateway & Sender</th>
                <th className="p-4">Transaction ID (TrxID)</th>
                <th className="p-4 text-right">Amount (BDT)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No deposit requests match this criteria.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">#{dep.id}</p>
                      <p className="text-[11px] text-slate-400">{dep.submittedAt}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{dep.userName}</p>
                      <p className="text-[11px] text-slate-400">{dep.userEmail}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{dep.paymentMethod}</span>
                      <p className="text-[11px] font-mono text-slate-500">{dep.senderNumber}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{dep.trxId}</span>
                        <button
                          onClick={() => handleCopyTrx(dep.trxId, dep.id)}
                          className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
                        >
                          {copiedId === dep.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                      ৳{dep.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          dep.status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : dep.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {dep.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {dep.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => adminApproveDeposit(dep.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => setRejectingDep(dep)}
                            className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 font-bold text-xs border border-red-200 dark:border-red-800 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingDep && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-red-600 dark:text-red-400">
              Reject Deposit Request #{rejectingDep.id}
            </h3>
            <p className="text-xs text-slate-500">
              State the reason for rejecting deposit of ৳{rejectingDep.amount} (TrxID: {rejectingDep.trxId}). An email will notify the user.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Rejection Reason</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="">Select reason</option>
                  <option value="TrxID not found in mobile banking statement">TrxID not found in mobile banking statement</option>
                  <option value="Amount mismatch with statement">Amount mismatch with statement</option>
                  <option value="Duplicate TrxID already claimed">Duplicate TrxID already claimed</option>
                  <option value="Invalid sender phone number">Invalid sender phone number</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingDep(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
