import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  Download,
  Printer,
  ExternalLink,
  Search,
  CheckCircle,
  Receipt,
} from 'lucide-react';
import { Invoice } from '../types';

interface InvoicesPageProps {
  onNavigate: (path: string) => void;
}

export const InvoicesPage: React.FC<InvoicesPageProps> = () => {
  const { userInvoices, setSelectedInvoice } = useData();
  const { language } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = userInvoices.filter((inv) => {
    return (
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.serviceOrItemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {language === 'bn' ? 'অফিসিয়াল ইনভয়েস ও রসিদ' : 'Official Invoices & Tax Receipts'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'bn'
              ? 'আপনার প্রতিটি লেনদেনের লিগ্যাল ইনভয়েস ডাউনলোড বা প্রিন্ট করুন।'
              : 'Download and print verified electronic invoices generated for every financial activity.'}
          </p>
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
            placeholder="Search by Invoice ID or title..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4 text-right">Amount (BDT)</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    No official invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {inv.id}
                    </td>
                    <td className="p-4 text-slate-400">{inv.date}</td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                      {inv.serviceOrItemTitle}
                    </td>
                    <td className="p-4 text-slate-500 font-mono">{inv.paymentMethod}</td>
                    <td className="p-4 text-right font-mono font-extrabold text-slate-900 dark:text-white">
                      ৳{inv.total.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View / Print</span>
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
