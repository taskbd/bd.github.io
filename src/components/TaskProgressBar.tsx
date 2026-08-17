import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ServiceOrder, OrderMilestone } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TaskProgressBarProps {
  order: ServiceOrder;
  isSeller?: boolean;
  onUpdateProgress?: (percentage: number, note?: string) => Promise<{ success: boolean; message: string }>;
  onToggleMilestone?: (milestoneId: string) => Promise<{ success: boolean; message: string }>;
  compact?: boolean;
}

export const TaskProgressBar: React.FC<TaskProgressBarProps> = ({
  order,
  isSeller = false,
  onUpdateProgress,
  onToggleMilestone,
  compact = false,
}) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [customNote, setCustomNote] = useState(order.progressNotes || '');
  const [sliderValue, setSliderValue] = useState(order.progressPercentage ?? (order.status === 'completed' ? 100 : order.status === 'delivered' ? 90 : 20));
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const progress = Math.max(
    0,
    Math.min(
      100,
      order.status === 'completed'
        ? 100
        : order.status === 'delivered'
        ? Math.max(90, order.progressPercentage ?? 90)
        : order.progressPercentage ?? 25
    )
  );

  // Determine stage and color theme
  const getProgressColor = (val: number) => {
    if (val >= 100) return 'from-emerald-500 to-teal-600 shadow-emerald-500/20';
    if (val >= 80) return 'from-blue-500 to-indigo-600 shadow-blue-500/20';
    if (val >= 50) return 'from-indigo-500 to-purple-600 shadow-indigo-500/20';
    if (val >= 25) return 'from-amber-500 to-orange-500 shadow-amber-500/20';
    return 'from-slate-400 to-slate-600 shadow-slate-500/20';
  };

  const getStageLabel = (val: number) => {
    if (language === 'bn') {
      if (val >= 100) return 'সম্পূর্ণ ও অনুমোদিত (১০০%)';
      if (val >= 85) return 'ডেলিভার্ড ও ক্লায়েন্ট রিভিউ (৮৫-৯০%)';
      if (val >= 60) return 'চূড়ান্ত পলিশ ও কোয়ালিটি চেক (৬০-৮০%)';
      if (val >= 35) return 'ড্রাফটিং ও প্রোডাকশন চলছে (৩৫-৬০%)';
      return 'রিকোয়ারমেন্ট যাচাই ও শুরু (০-২৫%)';
    }
    if (val >= 100) return 'Completed & Escrow Approved (100%)';
    if (val >= 85) return 'Delivered & In Review (85-95%)';
    if (val >= 60) return 'Production & Revisions (60-80%)';
    if (val >= 35) return 'Drafting & Active Work (35-60%)';
    return 'Brief Confirmed & Kickoff (0-25%)';
  };

  const defaultMilestones: OrderMilestone[] = order.milestones && order.milestones.length > 0
    ? order.milestones
    : [
        { id: 'm1', title: 'Requirements & Brief Confirmation', completed: progress >= 20 },
        { id: 'm2', title: 'Initial Draft & Design Concepts', completed: progress >= 40 },
        { id: 'm3', title: 'Production, Revisions & Polish', completed: progress >= 65 },
        { id: 'm4', title: 'Quality Assurance & Deliverables Packaging', completed: progress >= 90 },
        { id: 'm5', title: 'Final Handover & Client Approval', completed: progress >= 100 },
      ];

  const handleQuickPercent = async (targetPct: number) => {
    if (!onUpdateProgress || isUpdating) return;
    setIsUpdating(true);
    setSliderValue(targetPct);
    const res = await onUpdateProgress(targetPct, customNote || undefined);
    setIsUpdating(false);
    if (res.success) {
      setFeedbackMsg(`✓ ${language === 'bn' ? 'প্রগ্রেস আপডেট হয়েছে' : 'Progress updated'} ${targetPct}%`);
      setTimeout(() => setFeedbackMsg(''), 2500);
    }
  };

  const handleSaveNote = async () => {
    if (!onUpdateProgress) return;
    setIsUpdating(true);
    const res = await onUpdateProgress(sliderValue, customNote.trim());
    setIsUpdating(false);
    setIsEditingNote(false);
    if (res.success) {
      setFeedbackMsg(`✓ ${language === 'bn' ? 'স্ট্যাটাস নোট সংরক্ষিত' : 'Status note saved'}`);
      setTimeout(() => setFeedbackMsg(''), 2500);
    }
  };

  const handleMilestoneClick = async (mId: string) => {
    if (!isSeller || !onToggleMilestone || isUpdating) return;
    setIsUpdating(true);
    await onToggleMilestone(mId);
    setIsUpdating(false);
  };

  return (
    <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 p-4 space-y-3.5 transition-all">
      {/* Header bar: Stage name & Percentage pill */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {getStageLabel(progress)}
              </span>
              {order.status === 'in_progress' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>{language === 'bn' ? 'চলমান' : 'Active'}</span>
                </span>
              )}
            </div>
            {order.progressUpdatedAt && (
              <p className="text-[10px] text-slate-400 font-mono">
                {language === 'bn' ? 'সর্বশেষ আপডেট:' : 'Updated:'} {order.progressUpdatedAt}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {feedbackMsg && (
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in hidden sm:inline">
              {feedbackMsg}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-extrabold bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs">
            {progress}%
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
            title={isExpanded ? 'Collapse milestones' : 'Expand milestones'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Track Bar with Shimmer Animation */}
      <div className="relative w-full h-3 bg-slate-200 dark:bg-slate-700/70 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-500 relative shadow-sm`}
          style={{ width: `${progress}%` }}
        >
          {/* Animated striped gloss */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-[progress-bar-stripes_1s_linear_infinite]" />
        </div>
      </div>

      {/* Progress Note / Live Status Snippet */}
      {order.progressNotes && !isEditingNote && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs">
          <MessageSquare className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {language === 'bn' ? 'ফ্রিল্যান্সার আপডেট:' : 'Latest Freelancer Update:'}
            </span>{' '}
            <span className="text-slate-600 dark:text-slate-400 italic">"{order.progressNotes}"</span>
          </div>
          {isSeller && onUpdateProgress && (
            <button
              onClick={() => {
                setCustomNote(order.progressNotes || '');
                setIsEditingNote(true);
              }}
              className="text-[11px] text-blue-600 hover:underline font-semibold shrink-0"
            >
              {language === 'bn' ? 'সম্পাদনা' : 'Edit'}
            </button>
          )}
        </div>
      )}

      {/* Expanded Details: Milestone Steps & Freelancer Interactive Controls */}
      {isExpanded && (
        <div className="space-y-4 pt-2 border-t border-slate-200/60 dark:border-slate-800">
          {/* Milestone Checkpoints */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'মাইক্রো-মাইলস্টোন ও ডেলিভারি ধাপ' : 'Deliverable Milestones & Stages'}
              </span>
              {isSeller && (
                <span className="text-[10px] text-slate-400">
                  {language === 'bn' ? '(ক্লিক করে সম্পন্ন মার্ক করুন)' : '(Click milestone to toggle)'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {defaultMilestones.map((m, idx) => (
                <button
                  key={m.id || idx}
                  type="button"
                  disabled={!isSeller || order.status === 'completed'}
                  onClick={() => handleMilestoneClick(m.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                    m.completed
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  } ${isSeller && order.status !== 'completed' ? 'cursor-pointer hover:shadow-xs' : 'cursor-default'}`}
                >
                  {m.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                  <span className={`text-[11px] leading-snug flex-1 ${m.completed ? 'font-bold line-through opacity-85' : 'font-medium'}`}>
                    {idx + 1}. {m.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Freelancer Progress Controls (Only for seller when order is in progress) */}
          {isSeller && order.status === 'in_progress' && onUpdateProgress && (
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'bn' ? 'তাত্ক্ষণিক প্রগ্রেস অ্যাডজাস্ট করুন' : 'Update Client on Current Progress'}</span>
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {sliderValue}%
                </span>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[25, 50, 75, 90, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleQuickPercent(pct)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                      sliderValue === pct
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              {/* Slider Input */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseInt(e.target.value))}
                  onMouseUp={() => handleQuickPercent(sliderValue)}
                  onTouchEnd={() => handleQuickPercent(sliderValue)}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                />
              </div>

              {/* Note Editor */}
              {isEditingNote ? (
                <div className="space-y-2 pt-1">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {language === 'bn' ? 'ক্লায়েন্টকে স্ট্যাটাস মেসেজ লিখুন:' : 'Status Message for Client:'}
                  </label>
                  <textarea
                    rows={2}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Completed initial design vector files, testing on mobile viewports..."
                    className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingNote(false)}
                      className="px-3 py-1 rounded-lg text-xs text-slate-500 hover:text-slate-700"
                    >
                      {language === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={handleSaveNote}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'সংরক্ষণ ও সেন্ড' : 'Save & Notify Client'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-slate-400">
                    {language === 'bn' ? 'ক্লায়েন্ট আপনার প্রগ্রেস লাইভ দেখতে পাচ্ছেন।' : 'Client sees this status in real-time.'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingNote(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{language === 'bn' ? 'স্ট্যাটাস নোট যোগ করুন' : 'Add Status Note'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
