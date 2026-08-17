import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Home,
  Briefcase,
  Plus,
  Sparkles,
  MessageSquare,
  User,
  X,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Layers,
  FilePlus,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPath, onNavigate }) => {
  const { t, language } = useLanguage();
  const [showActionSheet, setShowActionSheet] = useState(false);

  const navItems = [
    { label: t('home'), path: '/dashboard', icon: Home },
    { label: t('jobs'), path: '/dashboard/jobs', icon: Briefcase },
    { label: t('workspace'), path: '/dashboard/workspace', icon: Sparkles },
    { label: t('messages'), path: '/dashboard/messages', icon: MessageSquare },
    { label: t('profile'), path: '/dashboard/profile', icon: User },
  ];

  const quickActions = [
    {
      title: language === 'bn' ? 'টাকা জমা দিন (ডিপোজিট)' : 'Deposit Funds',
      desc: 'bKash, Nagad, Rocket',
      icon: ArrowDownLeft,
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      path: '/dashboard/wallet/deposit',
    },
    {
      title: language === 'bn' ? 'টাকা উত্তোলন করুন' : 'Withdraw Earnings',
      desc: language === 'bn' ? 'দ্রুত পেমেন্ট' : 'Fast Payout',
      icon: ArrowUpRight,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      path: '/dashboard/wallet/withdraw',
    },
    {
      title: language === 'bn' ? 'নতুন সার্ভিস পাবলিশ করুন' : 'Publish Service',
      desc: language === 'bn' ? 'আপনার গিগ তৈরি করুন' : 'Offer your freelance skills',
      icon: Layers,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      path: '/dashboard/workspace/publish-service',
    },
    {
      title: language === 'bn' ? 'নতুন জব / টাস্ক পোস্ট করুন' : 'Post Microtask / Job',
      desc: language === 'bn' ? 'কর্মী নিয়োগ দিন' : 'Hire talent across Bangladesh',
      icon: FilePlus,
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      path: '/dashboard/workspace/publish-job',
    },
  ];

  return (
    <>
      {/* Mobile Fixed Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 2).map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
                isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Central Prominent "+" Action Button */}
        <div className="relative -top-3">
          <button
            onClick={() => setShowActionSheet(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-sky-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 transition-transform border-4 border-white dark:border-slate-900"
            aria-label="Quick Actions"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {navItems.slice(2, 5).map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
                isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Sheet Modal */}
      {showActionSheet && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-4 animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {language === 'bn' ? 'কুইক অ্যাকশন' : 'Quick Actions'}
              </h3>
              <button
                onClick={() => setShowActionSheet(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(action.path);
                    setShowActionSheet(false);
                  }}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-left transition-colors"
                >
                  <div className={`p-2.5 rounded-xl ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{action.title}</p>
                    <p className="text-[11px] text-slate-500">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
