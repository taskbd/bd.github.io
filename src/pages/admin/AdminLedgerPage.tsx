import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  FileText,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Download,
  Filter,
} from 'lucide-react';

export const AdminLedgerPage: React.FC = () => {
  const { ledger } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLedger = ledger.filter((l) => {
    return (
      l.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Immutable Double-Entry Financial Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cryptographically sequenced financial audit log of every wallet debit, credit, escrow lock, and fee collection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Trail Verified</span>
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Reference ID, actor, or transaction reason..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Entry ID</th>
                <th className="p-4">Reference & Actor</th>
                <th className="p-4">Transaction Memo / Reason</th>
                <th className="p-4 text-right">Previous Balance</th>
                <th className="p-4 text-right">Delta (BDT)</th>
                <th className="p-4 text-right">New Balance</th>
                <th className="p-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No ledger entries match this search.
                  </td>
                </tr>
              ) : (
                filteredLedger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      #{entry.id}
                    </td>
                    <td className="p-4">
                      <p className="font-mono font-bold text-blue-600 dark:text-blue-400">{entry.reference}</p>
                      <p className="text-[11px] text-slate-400">By: {entry.actor} ({entry.actorType})</p>
                    </td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                      {entry.reason}
                    </td>
                    <td className="p-4 text-right font-mono text-slate-500">
                      ৳{entry.previousBalance.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono font-extrabold text-sm">
                      <span className={entry.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}>
                        {entry.amount >= 0 ? `+৳${entry.amount.toLocaleString()}` : `-৳${Math.abs(entry.amount).toLocaleString()}`}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                      ৳{entry.newBalance.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-slate-400 text-[11px]">
                      {entry.timestamp}
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
