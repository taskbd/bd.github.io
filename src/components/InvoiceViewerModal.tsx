import React from 'react';
import { useData } from '../context/DataContext';
import { Logo } from './Logo';
import { Printer, Download, X, CheckCircle, ShieldCheck } from 'lucide-react';

export const InvoiceViewerModal: React.FC = () => {
  const { selectedInvoice, setSelectedInvoice } = useData();

  if (!selectedInvoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Top Modal Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Official Tax Invoice
            </span>
            <span className="text-xs text-slate-500 font-mono">#{selectedInvoice.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setSelectedInvoice(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document Body */}
        <div id="printable-invoice" className="p-8 text-slate-800 dark:text-slate-200 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <Logo size="md" />
              <p className="text-xs text-slate-500 mt-2">
                TaskBD Technologies Bangladesh Ltd.
                <br />
                Financial Hub, Motijheel C/A, Dhaka-1000
                <br />
                support@taskbd.com • www.taskbd.com
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">INVOICE</h2>
              <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                Invoice No: <span className="text-slate-900 dark:text-white font-bold">{selectedInvoice.id}</span>
              </p>
              <p className="text-xs text-slate-500">Date: {selectedInvoice.date}</p>
              <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                <CheckCircle className="w-3 h-3" />
                <span>PAID</span>
              </div>
            </div>
          </div>

          {/* Billed To & Payment Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Billed To
              </span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{selectedInvoice.userName}</p>
              <p className="text-slate-500">User ID: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{selectedInvoice.userId}</span></p>
              <p className="text-slate-500">{selectedInvoice.userEmail}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Payment Details
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                Method: <span className="font-semibold text-slate-900 dark:text-white">{selectedInvoice.paymentMethod}</span>
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                Reference ID: <span className="font-mono text-slate-900 dark:text-white">{selectedInvoice.trxRef}</span>
              </p>
              <p className="text-slate-500">Transaction Status: Verified & Completed</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Type</th>
                  <th className="p-3 text-right">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3">
                    <p className="font-semibold text-slate-900 dark:text-white">{selectedInvoice.serviceOrItemTitle}</p>
                    <p className="text-slate-500 text-[11px]">TaskBD Secure Transaction Guarantee</p>
                  </td>
                  <td className="p-3 text-center text-slate-600 dark:text-slate-400">{selectedInvoice.type}</td>
                  <td className="p-3 text-right font-semibold font-mono text-slate-900 dark:text-white">
                    ৳{selectedInvoice.amount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">৳{selectedInvoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Platform Processing Fee:</span>
                <span className="font-mono font-medium">৳{selectedInvoice.fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total Paid:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">৳{selectedInvoice.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Escrow Guarantee Stamp */}
          <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
            <p className="text-[11px] text-blue-900 dark:text-blue-200">
              <span className="font-semibold">TaskBD 100% Escrow Protected:</span> All marketplace service payments are backed by TaskBD Escrow System with automated dispute protection.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center text-[11px] text-slate-400">
          This is an electronically generated receipt verified by TaskBD Cryptographic Ledger. No physical signature is required.
        </div>
      </div>
    </div>
  );
};
