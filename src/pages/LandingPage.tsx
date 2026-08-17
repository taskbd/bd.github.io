import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Logo } from '../components/Logo';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Briefcase,
  Layers,
  Sparkles,
  Bot,
  Lock,
  CheckCircle2,
  TrendingUp,
  Star,
  Users,
  ChevronRight,
  CreditCard,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { services, jobs } = useData();
  const [calculatorBudget, setCalculatorBudget] = useState(5000);

  const categories = [
    { title: 'Web & App Development', icon: '💻', count: '140+ Services' },
    { title: 'Graphics & Logo Design', icon: '🎨', count: '280+ Services' },
    { title: 'Video Editing & Reels', icon: '🎬', count: '95+ Services' },
    { title: 'Microtasks & Testing', icon: '📱', count: '450+ Jobs' },
    { title: 'SEO & Content Writing', icon: '✍️', count: '180+ Services' },
    { title: 'Digital Marketing', icon: '📈', count: '120+ Services' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent dark:from-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Bangladesh Trusted Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>
                {language === 'bn'
                  ? '🇧🇩 বাংলাদেশের বিশ্বস্ত ফ্রিল্যান্সিং ও মাইক্রোটাস্ক প্ল্যাটফর্ম'
                  : '🇧🇩 Bangladesh’s #1 Trusted Freelance & Microtask Marketplace'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {language === 'bn' ? (
                <>
                  কাজ করুন, সেবা দিন এবং{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
                    নিরাপদে আয় করুন
                  </span>
                </>
              ) : (
                <>
                  Hire Top Talent, Offer Services &{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
                    Earn with 100% Escrow
                  </span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {language === 'bn'
                ? 'TaskBD-তে সহজে মাইক্রোটাস্ক সমাধান করুন, ওয়েবসাইট ও গ্রাফিক্স ডিজাইন অর্ডার দিন এবং bKash, Nagad, Rocket-এর মাধ্যমে দ্রুত পেমেন্ট বুঝে নিন।'
                : 'TaskBD connects Bangladesh businesses and talented freelancers with automated escrow protection, Maya AI assistance, and instant mobile wallet payouts.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('/register')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'bn' ? 'ফ্রি অ্যাকাউন্ট খুলুন' : 'Join TaskBD Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/dashboard/jobs')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{language === 'bn' ? 'জব ব্রাউজ করুন' : 'Browse Microtasks'}</span>
              </button>
            </div>

            {/* Key Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Escrow Protection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Mobile Payouts (bKash/Nagad)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Maya 24/7 AI Assistance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {language === 'bn' ? 'জনপ্রিয় সার্ভিস ক্যাটাগরি' : 'Popular Marketplace Categories'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {language === 'bn' ? 'হাজারো দক্ষ ফ্রিল্যান্সারদের সেরা সেবা বেছে নিন' : 'Hire verified experts across top high-demand niches'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('/dashboard/services')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            <span>{language === 'bn' ? 'সব সার্ভিস দেখুন' : 'Explore All Services'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('/dashboard/services')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group text-center"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">{cat.title}</h3>
              <p className="text-[11px] text-slate-400 mt-1">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Services Carousel Preview */}
      <section className="py-12 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'জনপ্রিয় ফ্রিল্যান্স সার্ভিসসমূহ' : 'Trending Freelance Services'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'bn' ? '১০০% এসক্রো সুরক্ষায় অর্ডার করুন' : 'Guaranteed delivery with automated escrow'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('/dashboard/services')}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((srv) => (
              <div
                key={srv.id}
                onClick={() => onNavigate(`/dashboard/services/${srv.id}`)}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col group"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={srv.thumbnail}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white font-mono text-[10px] font-bold">
                    {srv.deliveryDays} Days
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{srv.category}</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {srv.providerRating} ({srv.reviewsCount})
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {srv.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Starting at</span>
                    <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      ৳{srv.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How TaskBD Escrow Works */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {language === 'bn' ? 'TaskBD এসক্রো নিরাপত্তা পদ্ধতি' : 'How TaskBD 100% Escrow Works'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'bn' ? 'বায়ার ও ফ্রিল্যান্সার উভয়ের টাকা ও শ্রম সম্পূর্ণ সুরক্ষিত' : 'Zero risk for both buyers and sellers with automated 24-hour safeguard'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold mb-4">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Order & Payment Locked</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Buyer deposits funds. The amount is securely locked in the TaskBD Escrow Vault before the freelancer starts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold mb-4">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Work In Progress</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Freelancer works on the tasks and submits completed files directly through the workspace deliverable channel.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold mb-4">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">24h Review Window</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Buyer inspects the deliverables. You have 24 hours to approve or request revisions with arbitration safety.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold mb-4">
              4
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Instant Payout & Receipt</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upon approval, funds are instantly transferred to the seller's wallet with an electronic tax invoice and email receipt.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Freelance Earning Calculator */}
      <section className="py-12 bg-slate-900 text-white rounded-3xl max-w-6xl mx-4 sm:mx-auto my-8 p-6 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full">
              Interactive Income Calculator
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {language === 'bn' ? 'TaskBD থেকে আপনার সম্ভাব্য আয়' : 'Calculate Your Monthly Freelance Earning'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'সপ্তাহে মাত্র ৩-৪টি প্রজেক্ট বা দিনে ১০টি মাইক্রোটাস্ক সম্পন্ন করে ঘরে বসে সম্মানজনক আয় করুন।'
                : 'See how easily you can scale your earnings by publishing services and executing microtasks.'}
            </p>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-xs font-semibold">
                <span>Average Project Value:</span>
                <span className="font-mono text-emerald-400">৳{calculatorBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={calculatorBudget}
                onChange={(e) => setCalculatorBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-4 text-center">
            <p className="text-xs text-slate-400 uppercase font-semibold">Estimated Monthly Earning (8 Orders / mo)</p>
            <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-mono">
              ৳{(calculatorBudget * 8 * 0.9).toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400">Net payout after 10% platform commission</p>

            <button
              onClick={() => onNavigate('/register')}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
            >
              Start Earning on TaskBD
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>© {new Date().getFullYear()} TaskBD Technologies Ltd. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <button onClick={() => onNavigate('/dashboard/jobs')} className="hover:text-blue-600">Jobs</button>
            <button onClick={() => onNavigate('/dashboard/services')} className="hover:text-blue-600">Services</button>
            <button onClick={() => onNavigate('/admin/login')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Admin Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
