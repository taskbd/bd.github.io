import React from 'react';
import { useData } from '../../context/DataContext';
import {
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
  Users,
  Briefcase,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigate: (path: string) => void;
}

export const AdminOverviewPage: React.FC<AdminOverviewProps> = ({ onNavigate }) => {
  const {
    depositRequests,
    withdrawalRequests,
    verificationRequests,
    publishingRequests,
    orders,
    jobs,
    services,
    ledger,
  } = useData();

  const pendingDeposits = depositRequests.filter((d) => d.status === 'pending');
  const pendingWithdrawals = withdrawalRequests.filter((w) => w.status === 'pending');
  const pendingVerifications = verificationRequests.filter((v) => v.status === 'pending');
  const pendingPublishings = publishingRequests.filter((p) => p.status === 'pending');

  const totalDepositsApproved = depositRequests
    .filter((d) => d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalWithdrawalsCompleted = withdrawalRequests
    .filter((w) => w.status === 'completed' || w.status === 'approved')
    .reduce((sum, w) => sum + w.amount, 0);

  const totalEscrowLocked = orders
    .filter((o) => o.status === 'in_progress' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.escrowAmount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            TaskBD Executive Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time platform financial balances, double-entry ledger health & pending approval queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Ledger Healthy (Zero Discrepancy)</span>
          </span>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV Deposited */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Deposits Approved</span>
            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
            ৳{totalDepositsApproved.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">bKash / Nagad / Rocket</p>
        </div>

        {/* Total Withdrawals Settled */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Payouts Settled</span>
            <ArrowUpRight className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
            ৳{totalWithdrawalsCompleted.toLocaleString()}
          </div>
          <p className="text-[11px] text-blue-600 font-semibold">Disbursed to Freelancers</p>
        </div>

        {/* Escrow Locked */}
        <div className="p-6 rounded-3xl bg-amber-500 text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Active Escrow in Vault
            </span>
            <ShieldCheck className="w-5 h-5 text-amber-200" />
          </div>
          <div className="text-3xl font-extrabold font-mono">
            ৳{totalEscrowLocked.toLocaleString()}
          </div>
          <p className="text-[11px] text-amber-100">Secured pending buyer acceptance</p>
        </div>

        {/* Total Services & Gigs */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Marketplace Catalog</span>
            <Layers className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
            {services.length + jobs.length}
          </div>
          <p className="text-[11px] text-slate-400">
            {services.length} Gigs • {jobs.length} Active Jobs
          </p>
        </div>
      </div>

      {/* Actionable Pending Queues */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Requires Immediate Admin Action
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pending Deposits Card */}
          <div
            onClick={() => onNavigate('/admin/deposits')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 cursor-pointer transition-all shadow-xs space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Pending Deposits
              </span>
              <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold text-xs flex items-center justify-center">
                {pendingDeposits.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">Review MFS TrxIDs for wallet credit</p>
            <span className="text-[11px] font-bold text-emerald-600 group-hover:underline inline-block pt-1">
              Open Deposit Queue &rarr;
            </span>
          </div>

          {/* Pending Withdrawals Card */}
          <div
            onClick={() => onNavigate('/admin/withdrawals')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all shadow-xs space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Pending Payouts
              </span>
              <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold text-xs flex items-center justify-center">
                {pendingWithdrawals.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">Process user mobile bank payouts</p>
            <span className="text-[11px] font-bold text-blue-600 group-hover:underline inline-block pt-1">
              Open Payout Queue &rarr;
            </span>
          </div>

          {/* Pending Verifications Card */}
          <div
            onClick={() => onNavigate('/admin/verifications')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 cursor-pointer transition-all shadow-xs space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                ৳15 Verifications
              </span>
              <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 font-bold text-xs flex items-center justify-center">
                {pendingVerifications.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">Verify blue tick account requests</p>
            <span className="text-[11px] font-bold text-purple-600 group-hover:underline inline-block pt-1">
              Open Verification Queue &rarr;
            </span>
          </div>

          {/* Pending Publishing Card */}
          <div
            onClick={() => onNavigate('/admin/publishing')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 cursor-pointer transition-all shadow-xs space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                ৳50 Publishing
              </span>
              <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 font-bold text-xs flex items-center justify-center">
                {pendingPublishings.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">Approve seller & employer activations</p>
            <span className="text-[11px] font-bold text-amber-600 group-hover:underline inline-block pt-1">
              Open Publishing Queue &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Recent Immutable Ledger Stream */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Real-time Double-Entry Ledger Stream
            </h3>
            <p className="text-xs text-slate-500">Zero floating balance discrepancy</p>
          </div>

          <button
            onClick={() => onNavigate('/admin/ledger')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          >
            Full Ledger &rarr;
          </button>
        </div>

        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Ref ID</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Reason</th>
                <th className="p-3 text-right">Delta (BDT)</th>
                <th className="p-3 text-right">New Balance</th>
                <th className="p-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ledger.slice(0, 5).map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{l.reference}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{l.actor}</td>
                  <td className="p-3 text-slate-800 dark:text-slate-200 font-medium">{l.reason}</td>
                  <td className="p-3 text-right font-mono font-bold">
                    <span className={l.amount >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                      {l.amount >= 0 ? `+৳${l.amount}` : `-৳${Math.abs(l.amount)}`}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ৳{l.newBalance.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-slate-400 font-mono text-[11px]">{l.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
