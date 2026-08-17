import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Receipt,
  FileText,
  Filter,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface WalletPageProps {
  onNavigate: (path: string) => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { userWallet, transactions, setSelectedInvoice } = useData();
  const { language, t } = useLanguage();

  const [filterType, setFilterType] = useState<string>('all');

  const filteredTransactions = transactions.filter((trx) => {
    if (filterType === 'all') return true;
    return trx.type === filterType;
  });

  return (
    <div className="space-y-8">
      {/* Wallet Header & Financial Balances */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {language === 'bn' ? 'ডিজিটাল ওয়ালেট ও লেনদেন' : 'Digital Wallet & Financials'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'bn'
              ? 'বিকাশ, নগদ, রকেটের মাধ্যমে টাকা জমা দিন এবং নিশ্চিত উইথড্রয়াল গ্রহণ করুন।'
              : 'Seamless mobile banking deposits & instant escrow-backed payouts.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('/dashboard/wallet/deposit')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'টাকা জমা দিন' : 'Deposit Money'}</span>
          </button>

          <button
            onClick={() => onNavigate('/dashboard/wallet/withdraw')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{language === 'bn' ? 'টাকা উত্তোলন করুন' : 'Withdraw Funds'}</span>
          </button>
        </div>
      </div>

      {/* Balance Hub Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              Available Balance
            </span>
            <Wallet className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="text-3xl font-extrabold font-mono">
            ৳{userWallet.availableBalance.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-100">Withdrawable immediately</p>
        </div>

        {/* Escrow / Pending Balance */}
        <div className="p-6 rounded-3xl bg-amber-500 text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              24h Escrow Vault
            </span>
            <Clock className="w-5 h-5 text-amber-200" />
          </div>
          <div className="text-3xl font-extrabold font-mono">
            ৳{userWallet.pendingBalance.toLocaleString()}
          </div>
          <p className="text-[11px] text-amber-100">Protected in pending review</p>
        </div>

        {/* Total Earned */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Lifetime Earned</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
            ৳{userWallet.totalEarned.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">Microtasks & service gigs</p>
        </div>

        {/* Total Deposited */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Deposited</span>
            <ArrowDownLeft className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
            ৳{userWallet.totalDeposited.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">Mobile banking funded</p>
        </div>
      </div>

      {/* Transaction History & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Ledger & Transaction History</h2>
            <p className="text-xs text-slate-500">Every transaction generates an electronic invoice</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['all', 'deposit', 'withdrawal', 'service_earning', 'service_purchase'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  filterType === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">ID / Date</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Gateway / TrxID</th>
                <th className="p-3.5 text-right">Amount (BDT)</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No transactions match this filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">#{trx.id}</p>
                      <p className="text-[11px] text-slate-400">{trx.createdAt}</p>
                    </td>
                    <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">{trx.description}</td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                      <span className="font-bold uppercase text-slate-800 dark:text-slate-200">{trx.gateway}</span>
                      {trx.trxId && <span className="block text-[11px] text-slate-500">{trx.trxId}</span>}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold">
                      <span
                        className={
                          trx.type === 'deposit' || trx.type === 'service_earning' || trx.type === 'referral_bonus'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }
                      >
                        {trx.type === 'deposit' || trx.type === 'service_earning' || trx.type === 'referral_bonus' ? '+' : '-'}
                        ৳{trx.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          trx.status === 'completed' || trx.status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : trx.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() =>
                          setSelectedInvoice({
                            id: `INV-${trx.id}`,
                            userId: currentUser?.id || 'USR-1001',
                            userName: currentUser?.name || 'Valued User',
                            userEmail: currentUser?.email || 'user@taskbd.com',
                            type: trx.type,
                            serviceOrItemTitle: trx.description,
                            amount: trx.amount,
                            fee: 0,
                            subtotal: trx.amount,
                            total: trx.amount,
                            paymentMethod: trx.gateway,
                            trxRef: trx.trxId || trx.id,
                            status: 'paid',
                            date: trx.createdAt,
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-semibold text-[11px]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
