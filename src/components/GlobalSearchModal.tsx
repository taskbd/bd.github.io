import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, Briefcase, Sparkles, FileText, ArrowRight, X, Wallet, ShieldCheck } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { jobs, services, orders } = useData();
  const { language } = useLanguage();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // handled in root
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredJobs = jobs.filter(
    (j) => j.title.toLowerCase().includes(query.toLowerCase()) || j.category.toLowerCase().includes(query.toLowerCase())
  );
  const filteredServices = services.filter(
    (s) => s.title.toLowerCase().includes(query.toLowerCase()) || s.category.toLowerCase().includes(query.toLowerCase())
  );
  const filteredOrders = orders.filter(
    (o) => o.id.toLowerCase().includes(query.toLowerCase()) || o.serviceTitle.toLowerCase().includes(query.toLowerCase())
  );

  const quickPages = [
    { title: 'Dashboard', path: '/dashboard', icon: FileText },
    { title: 'Wallet & Deposits', path: '/dashboard/wallet', icon: Wallet },
    { title: 'My Workspace', path: '/dashboard/workspace', icon: Sparkles },
    { title: 'Account Verification', path: '/dashboard/verification', icon: ShieldCheck },
    { title: 'Jobs Marketplace', path: '/dashboard/jobs', icon: Briefcase },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'bn' ? 'জব, সার্ভিস, অর্ডার বা পেজ অনুসন্ধান করুন...' : 'Search jobs, services, orders, or pages... (ESC to close)'}
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Quick Pages */}
          {!query && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Quick Navigation</p>
              <div className="grid grid-cols-2 gap-2">
                {quickPages.map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigate(page.path);
                      onClose();
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-300 transition-colors text-left"
                  >
                    <page.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="font-medium truncate">{page.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Jobs Results */}
          {filteredJobs.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Jobs ({filteredJobs.length})</p>
              <div className="space-y-1.5">
                {filteredJobs.slice(0, 3).map((j) => (
                  <button
                    key={j.id}
                    onClick={() => {
                      onNavigate(`/dashboard/jobs/${j.id}`);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white truncate">{j.title}</p>
                      <span className="text-slate-500 font-mono">৳{j.budget} • {j.category}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Services Results */}
          {filteredServices.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Services ({filteredServices.length})</p>
              <div className="space-y-1.5">
                {filteredServices.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onNavigate(`/dashboard/services/${s.id}`);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white truncate">{s.title}</p>
                      <span className="text-slate-500 font-mono">৳{s.price} • by {s.providerName}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
