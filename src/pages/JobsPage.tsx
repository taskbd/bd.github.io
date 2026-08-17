import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Briefcase,
  Clock,
  CheckCircle2,
  Users,
  Send,
  PlusCircle,
  X,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Job } from '../types';

interface JobsPageProps {
  onNavigate: (path: string) => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { jobs, applyForJob, userApplications } = useData();
  const { language } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [proposal, setProposal] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('2');
  const [experienceSummary, setExperienceSummary] = useState('');
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  const categories = ['All', 'Microtasks', 'Data Entry', 'Video & Animation', 'Writing', 'Design'];

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.publisherName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && job.status === 'active';
  });

  const handleOpenApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplying(true);
    setProposal('');
    setDeliveryDays('2');
    setExperienceSummary('');
    setApplyError('');
    setApplySuccess(false);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    if (!currentUser) {
      onNavigate('/login');
      return;
    }
    if (!proposal.trim()) {
      setApplyError('Please explain how you plan to complete this job or microtask.');
      return;
    }

    const res = await applyForJob(
      selectedJob.id,
      proposal.trim(),
      parseInt(deliveryDays) || 1,
      experienceSummary.trim()
    );

    if (res.success) {
      setApplySuccess(true);
    } else {
      setApplyError(res.message);
    }
  };

  const hasApplied = (jobId: string) => {
    return userApplications.some((a) => a.jobId === jobId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'bn' ? 'মাইক্রোটাস্ক ও জব মার্কেট' : 'Microtasks & Job Board'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'bn'
              ? 'ছোট ছোট কাজ বা প্রজেক্ট সম্পন্ন করে সাথে সাথে আর্ন করুন। ১০০% নিশ্চয়তা ও সুরক্ষিত পেমেন্ট।'
              : 'Browse active microtasks and client job postings. Submit proposals and get paid.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser?.publishingStatus === 'active' ? (
            <button
              onClick={() => onNavigate('/dashboard/workspace')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Job</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('/dashboard/publishing')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Post Jobs (Activate ৳50)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by keyword or client name..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No jobs match your search</p>
            <p className="text-xs text-slate-400">Check back later or explore another category.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[11px] font-bold">
                    {job.category}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium">Posted by {job.publisherName}</span>
                  {job.publisherVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 inline" />
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {job.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Deadline: {job.deadline}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>{job.applicationsCount} Proposals</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800 gap-3">
                <div className="text-left sm:text-right">
                  <p className="text-[11px] text-slate-400 uppercase font-semibold">Budget</p>
                  <p className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    ৳{job.budget.toLocaleString()}
                  </p>
                </div>

                {hasApplied(job.id) ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                    Proposal Submitted
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenApply(job)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply / Submit</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Apply Modal */}
      {selectedJob && isApplying && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsApplying(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            {applySuccess ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Proposal Submitted!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  The client ({selectedJob.publisherName}) has received your application. Once accepted, you can submit your completed work for instant payout.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsApplying(false)}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Apply for Microtask / Job
                  </h2>
                  <p className="text-xs text-slate-500">
                    Job: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedJob.title}</span> (৳{selectedJob.budget})
                  </p>
                </div>

                {applyError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{applyError}</span>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <p className="font-bold text-slate-900 dark:text-white">Job Requirements Checklist:</p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Proposal & Work Plan
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Describe how you will execute this task accurately..."
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Expected Delivery (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Relevant Experience / Proof
                    </label>
                    <input
                      type="text"
                      value={experienceSummary}
                      onChange={(e) => setExperienceSummary(e.target.value)}
                      placeholder="e.g. 2 years experience, portfolio link"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsApplying(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Proposal</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
