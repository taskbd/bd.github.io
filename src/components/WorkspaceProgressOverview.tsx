import React from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Layers,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { ServiceOrder, Job } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface WorkspaceProgressOverviewProps {
  orders: ServiceOrder[];
  receivedOrders: ServiceOrder[];
  jobs: Job[];
  activeFilter?: string;
  onSelectFilter?: (filter: string) => void;
}

export const WorkspaceProgressOverview: React.FC<WorkspaceProgressOverviewProps> = ({
  orders,
  receivedOrders,
  jobs,
  activeFilter = 'all',
  onSelectFilter,
}) => {
  const { language } = useLanguage();

  const allActiveOrders = [...orders, ...receivedOrders].filter(
    (o, idx, self) => self.findIndex((s) => s.id === o.id) === idx
  );

  const inProgressOrders = allActiveOrders.filter((o) => o.status === 'in_progress');
  const deliveredOrders = allActiveOrders.filter(
    (o) => o.status === 'delivered' || o.status === 'waiting_approval'
  );
  const completedOrders = allActiveOrders.filter((o) => o.status === 'completed');

  // Compute average progress
  const totalTrackedOrders = inProgressOrders.length + deliveredOrders.length + completedOrders.length;
  const totalPercentageSum = allActiveOrders.reduce((sum, o) => {
    if (o.status === 'completed') return sum + 100;
    if (o.status === 'delivered') return sum + (o.progressPercentage ?? 90);
    return sum + (o.progressPercentage ?? 25);
  }, 0);

  const averageProgress =
    totalTrackedOrders > 0 ? Math.round(totalPercentageSum / totalTrackedOrders) : 0;

  const totalEscrowLocked = allActiveOrders
    .filter((o) => o.status === 'in_progress' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {language === 'bn' ? 'লাইভ টাস্ক ও অর্ডার কমপ্লিশন ট্র্যাকার' : 'Live Task & Order Completion Pipeline'}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'চলমান সকল সার্ভিস অর্ডার ও মাইক্রোটাস্কের অগ্রগতি রিয়েল-টাইমে পর্যবেক্ষণ করুন।'
              : 'Real-time completion percentage tracking across active buyer contracts and seller deliverables.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'bn' ? 'গড় অগ্রগতি' : 'Avg Pipeline Progress'}
            </span>
            <span className="text-xl sm:text-2xl font-mono font-extrabold text-blue-600 dark:text-blue-400">
              {averageProgress}%
            </span>
          </div>

          <div className="w-14 h-14 relative flex items-center justify-center">
            {/* SVG Circular Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-600 transition-all duration-700 ease-out"
                strokeDasharray={`${averageProgress}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[10px] font-bold font-mono text-slate-700 dark:text-slate-300">
              {averageProgress}%
            </span>
          </div>
        </div>
      </div>

      {/* Aggregate Pipeline Multi-segment Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold">
            {language === 'bn' ? 'অর্ডার স্টেজ ডিস্ট্রিবিউশন' : 'Stage Distribution'} ({allActiveOrders.length} {language === 'bn' ? 'টি অর্ডার' : 'Total Orders'})
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>৳{totalEscrowLocked.toLocaleString()} {language === 'bn' ? 'এসক্রো লকড' : 'Escrow Secured'}</span>
          </span>
        </div>

        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5 gap-0.5">
          {inProgressOrders.length > 0 && (
            <div
              className="bg-indigo-500 h-full rounded-full transition-all"
              style={{ width: `${(inProgressOrders.length / (allActiveOrders.length || 1)) * 100}%` }}
              title={`In Progress: ${inProgressOrders.length}`}
            />
          )}
          {deliveredOrders.length > 0 && (
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${(deliveredOrders.length / (allActiveOrders.length || 1)) * 100}%` }}
              title={`Delivered / In Review: ${deliveredOrders.length}`}
            />
          )}
          {completedOrders.length > 0 && (
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${(completedOrders.length / (allActiveOrders.length || 1)) * 100}%` }}
              title={`Completed: ${completedOrders.length}`}
            />
          )}
        </div>
      </div>

      {/* Interactive Quick Metrics Cards / Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <button
          type="button"
          onClick={() => onSelectFilter && onSelectFilter('all')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            activeFilter === 'all'
              ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            {language === 'bn' ? 'মোট সক্রিয়' : 'Total Active'}
          </span>
          <p className="text-base font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
            {allActiveOrders.length}
          </p>
          <span className="text-[10px] text-slate-500">
            {language === 'bn' ? 'সমস্ত অর্ডার' : 'Purchased & Received'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectFilter && onSelectFilter('in_progress')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            activeFilter === 'in_progress'
              ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block">
            {language === 'bn' ? 'কাজ চলছে' : 'In Production'}
          </span>
          <p className="text-base font-extrabold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
            {inProgressOrders.length}
          </p>
          <span className="text-[10px] text-slate-500">
            {language === 'bn' ? '২৫% - ৭৫% প্রগ্রেস' : '25% - 75% Progress'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectFilter && onSelectFilter('delivered')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            activeFilter === 'delivered'
              ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">
            {language === 'bn' ? 'রিভিউ ও ডেলিভার্ড' : 'Review & QA'}
          </span>
          <p className="text-base font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
            {deliveredOrders.length}
          </p>
          <span className="text-[10px] text-slate-500">
            {language === 'bn' ? '২৪ ঘণ্টা অটোরিলিজ' : '90% Complete'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectFilter && onSelectFilter('completed')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            activeFilter === 'completed'
              ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block">
            {language === 'bn' ? 'সম্পন্ন ও পেইড' : 'Completed'}
          </span>
          <p className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            {completedOrders.length}
          </p>
          <span className="text-[10px] text-slate-500">
            {language === 'bn' ? '১০০% এসক্রো রিলিজড' : '100% Escrow Released'}
          </span>
        </button>
      </div>
    </div>
  );
};
