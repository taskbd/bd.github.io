import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Logo } from './Logo';
import { Mail, X, Check, Copy, ExternalLink, Inbox, ShieldCheck } from 'lucide-react';

interface EmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({ isOpen, onClose }) => {
  const { emailLogs, selectedEmail, setSelectedEmail } = useData();
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  if (!isOpen && !selectedEmail) return null;

  const activeEmail = selectedEmail || emailLogs[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = emailLogs.filter(
    (e) =>
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.event.toLowerCase().includes(search.toLowerCase()) ||
      e.referenceId.toLowerCase().includes(search.toLowerCase()) ||
      e.to.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                TaskBD Automated Email Center & Notification Dispatcher
              </h3>
              <p className="text-xs text-slate-500">
                Live transactional email logs dispatched for every invoice, deposit, escrow, and order event.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedEmail(null);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Email List */}
          <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/20">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email logs..."
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No emails match your query.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <button
                    key={log.id}
                    onClick={() => setSelectedEmail(log)}
                    className={`w-full text-left p-3.5 transition-colors ${
                      activeEmail?.id === log.id
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {log.event}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.sentAt.split(' ')[1]}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{log.subject}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{log.to}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Email Preview (Simulated In-box Rendering) */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-100/50 dark:bg-slate-950 flex flex-col justify-between">
            {activeEmail ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
                {/* Email Header Bar */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Logo size="sm" />
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                      ✓ Status: {activeEmail.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{activeEmail.subject}</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">From:</span> {activeEmail.from}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">To:</span> {activeEmail.recipientName} &lt;{activeEmail.to}&gt;
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">User ID:</span>{' '}
                      <span className="font-mono">{activeEmail.recipientUserId}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Sent At:</span> {activeEmail.sentAt}
                    </div>
                  </div>
                </div>

                {/* Email Template Body */}
                <div className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-300">
                  <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Event Triggered
                      </p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{activeEmail.event}</p>
                    </div>

                    {activeEmail.amount && (
                      <div className="text-right">
                        <p className="text-[11px] text-slate-500">Amount</p>
                        <p className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          {activeEmail.amount}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                    Hello <span className="font-semibold">{activeEmail.recipientName}</span>,
                  </p>

                  <p className="leading-relaxed">{activeEmail.bodyPreview}</p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                    <span className="font-mono text-slate-600 dark:text-slate-400">Reference: {activeEmail.referenceId}</span>
                    <button
                      onClick={() => handleCopy(activeEmail.referenceId)}
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Ref'}</span>
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] text-slate-400">
                      Best regards,
                      <br />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">TaskBD Automated Notifications</span>
                      <br />
                      Dhaka, Bangladesh • Security Guaranteed
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">Select an email to view full details.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
