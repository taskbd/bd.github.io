import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Mail,
  Search,
  CheckCircle2,
  ExternalLink,
  Eye,
  Send,
  FileText,
} from 'lucide-react';
import { EmailLog } from '../../types';

export const AdminEmailLogsPage: React.FC = () => {
  const { emailLogs } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewingEmail, setViewingEmail] = useState<EmailLog | null>(null);

  const filteredLogs = emailLogs.filter((log) => {
    return (
      log.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Automated Email Dispatch Audit Stream
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Inspection log of all transactional receipts, invoice copies, security alerts, and escrow releases delivered to users' email inboxes.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by recipient email or subject..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Email ID / Time</th>
                <th className="p-4">Recipient</th>
                <th className="p-4">Subject Line</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Inspect Email Body</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    No dispatched email logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">#{log.id}</p>
                      <p className="text-[11px] text-slate-400">{log.sentAt}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">
                      {log.recipientEmail}
                    </td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                      {log.subject}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Delivered</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setViewingEmail(log)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview HTML</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Body Modal */}
      {viewingEmail && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Email Dispatch #{viewingEmail.id}
                </h3>
                <p className="text-xs text-slate-400">To: {viewingEmail.recipientEmail}</p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{viewingEmail.sentAt}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                Subject: {viewingEmail.subject}
              </p>
              <div
                className="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300"
                dangerouslySetInnerHTML={{ __html: viewingEmail.bodyHtml }}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingEmail(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
