import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Search,
  AlertCircle,
  Clock,
  Send,
} from 'lucide-react';
import { WithdrawalRequest } from '../../types';

export const AdminWithdrawalsPage: React.FC = () => {
  const { withdrawalRequests, adminApproveWithdrawal, adminRejectWithdrawal } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [rejectingWith, setRejectingWith] = useState<WithdrawalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredWithdrawals = withdrawalRequests.filter((w) => {
    const matchesFilter = filterStatus === 'all' || w.status === filterStatus;
    const matchesSearch =
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingWith || !rejectReason.trim()) return;
    adminRejectWithdrawal(rejectingWith.id, rejectReason.trim());
    setRejectingWith(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Withdrawal Payout Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Disburse pending seller and user earnings to bKash, Nagad, and Rocket accounts.
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
            placeholder="Search account, user..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['pending', 'completed', 'rejected', 'all'].map((st) => (
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
                <th className="p-4">Payout ID / Date</th>
                <th className="p-4">User</th>
                <th className="p-4">Gateway & Recipient Number</th>
                <th className="p-4 text-right">Gross (BDT)</th>
                <th className="p-4 text-right">Fee (2%)</th>
                <th className="p-4 text-right">Net Payout</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    No withdrawal requests match this criteria.
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map((withReq) => (
                  <tr key={withReq.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">#{withReq.id}</p>
                      <p className="text-[11px] text-slate-400">{withReq.submittedAt}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{withReq.userName}</p>
                      <p className="text-[11px] text-slate-400">{withReq.userEmail}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{withReq.paymentMethod}</span>
                      <p className="text-[11px] font-mono text-slate-500 font-bold">{withReq.accountNumber}</p>
                    </td>
                    <td className="p-4 text-right font-mono text-slate-500">
                      ৳{withReq.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-red-500">
                      -৳{withReq.fee}
                    </td>
                    <td className="p-4 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      ৳{withReq.netAmount.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          withReq.status === 'completed' || withReq.status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : withReq.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {withReq.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {withReq.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => adminApproveWithdrawal(withReq.id)}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Disburse</span>
                          </button>

                          <button
                            onClick={() => setRejectingWith(withReq)}
                            className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 font-bold text-xs border border-red-200 dark:border-red-800 transition-colors"
                          >
                            Reject & Refund
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Settled</span>
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
      {rejectingWith && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-red-600 dark:text-red-400">
              Reject Withdrawal #{rejectingWith.id}
            </h3>
            <p className="text-xs text-slate-500">
              The gross amount of ৳{rejectingWith.amount} will be immediately refunded back to the user's available wallet balance.
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
                  <option value="Invalid mobile wallet account number">Invalid mobile wallet account number</option>
                  <option value="Account limit reached on recipient MFS">Account limit reached on recipient MFS</option>
                  <option value="Suspicious withdrawal activity under review">Suspicious withdrawal activity under review</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingWith(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold"
                >
                  Confirm Reject & Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
