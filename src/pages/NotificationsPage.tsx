import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Bell,
  CheckCircle,
  CheckCheck,
  CreditCard,
  Briefcase,
  ShoppingBag,
  ShieldAlert,
  ArrowRight,
  FileText,
} from 'lucide-react';

interface NotificationsPageProps {
  onNavigate: (path: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { userNotifications, markNotificationAsRead, markAllNotificationsAsRead } = useData();
  const { language } = useLanguage();

  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = userNotifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.isRead;
    return n.type === filterType;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {language === 'bn' ? 'বিজ্ঞপ্তি ও নোটিফিকেশন' : 'Notification Center'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'bn'
              ? 'পেমেন্ট, অর্ডার এবং এসক্রো সম্পর্কিত সকল গুরুত্বপূর্ণ আপডেট।'
              : 'Real-time financial receipts, escrow milestones, and job updates.'}
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {['all', 'unread', 'deposit', 'withdrawal', 'order', 'payment'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              filterType === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No notifications found</p>
            <p className="text-xs text-slate-400">You're all caught up with your updates!</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.link) onNavigate(notif.link);
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                !notif.isRead
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  notif.type === 'deposit' || notif.type === 'payment'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                    : notif.type === 'withdrawal'
                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-600'
                    : notif.type === 'order'
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                {notif.type === 'deposit' || notif.type === 'payment' ? (
                  <CreditCard className="w-5 h-5" />
                ) : notif.type === 'order' ? (
                  <ShoppingBag className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{notif.title}</span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    )}
                  </h3>
                  <span className="text-[10px] text-slate-400">{notif.createdAt}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
