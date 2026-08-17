import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Briefcase,
  Layers,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  TrendingUp,
  Download,
  Eye,
  EyeOff,
  ShoppingBag,
  Plus,
  Tag,
  FileText,
  LayoutGrid,
  Bot,
  CheckCircle2,
  ChevronRight,
  Copy,
  Send,
  Bell,
  MessageSquare,
  HelpCircle,
  ShieldAlert,
  Search,
  ExternalLink,
  Users,
  Award,
  Zap,
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigate: (path: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { userWallet, orders, jobs, transactions, setSelectedInvoice } = useData();
  const { language, setLanguage } = useLanguage();

  const [showBalance, setShowBalance] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mayaPrompt, setMayaPrompt] = useState('');
  const [mayaResponse, setMayaResponse] = useState<string | null>(null);
  const [isAskingMaya, setIsAskingMaya] = useState(false);
  const [showHelperGuide, setShowHelperGuide] = useState(true);

  // Dynamic or fallback sample numbers matching Image 2
  const availableBal = userWallet?.availableBalance ?? 10700.75;
  const pendingBal = userWallet?.pendingBalance ?? 2150.0;
  const totalBal = availableBal + pendingBal; // 12,850.75 in screenshot
  const totalDeposit = 28540.0;
  const totalEarnings = 45230.0;

  const handleCopy = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAskMaya = (promptText: string) => {
    setIsAskingMaya(true);
    setMayaPrompt(promptText);
    setTimeout(() => {
      if (promptText.includes('ব্যালেন্স') || promptText.includes('balance')) {
        setMayaResponse(`আপনার বর্তমান মোট ওয়ালেট ব্যালেন্স ৳${totalBal.toLocaleString()} (উইথড্রযোগ্য: ৳${availableBal.toLocaleString()}, এসক্রো পেন্ডিং: ৳${pendingBal.toLocaleString()})।`);
      } else if (promptText.includes('অর্ডার') || promptText.includes('order')) {
        setMayaResponse('ওয়ার্কস্পেসে গিয়ে আপনার ডেলিভারি সাবমিট করতে পারেন। ক্লায়েন্ট অনুমোদনের পর সাথে সাথে এসক্রো ফান্ড আপনার ওয়ালেটে ক্রেডিট হবে।');
      } else if (promptText.includes('সার্ভিস') || promptText.includes('service') || promptText.includes('publish')) {
        setMayaResponse('সার্ভিস পাবলিশ করতে মেনু থেকে "06 সার্ভিস" অথবা "07 ওয়ার্কস্পেস" এ যান এবং "+ নতুন সার্ভিস" এ ক্লিক করে প্রাইসিং ও পোর্টফোলিও সেট করুন।');
      } else if (promptText.includes('উইথড্র') || promptText.includes('withdraw')) {
        setMayaResponse('বিকাশ, নগদ বা রকেটে ন্যূনতম ৳১০০ থেকে উইথড্র করতে পারেন। উইথড্রয়াল পেজে গিয়ে আপনার নম্বর ও পিন নিশ্চিত করুন।');
      } else {
        setMayaResponse('ধন্যবাদ! TaskBD প্ল্যাটফর্মে আপনার যেকোনো সমস্যা বা প্রশ্নের সমাধানে আমি ২৪/৭ প্রস্তুত। আপনি সরাসরি চ্যাট শুরু করতে পারেন।');
      }
      setIsAskingMaya(false);
    }, 600);
  };

  // Recent Orders (matching Image 2)
  const recentOrdersList = [
    { id: '1', title: 'Logo Design for Brand', buyer: 'Ari Hasan', price: 1500, status: 'in_progress', statusText: 'In Progress', badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    { id: '2', title: 'Website Landing Page', buyer: 'Farjana Akter', price: 8500, status: 'delivered', statusText: 'Delivered', badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
    { id: '3', title: 'SEO Optimization', buyer: 'Tanvir Ahmad', price: 3000, status: 'completed', statusText: 'Completed', badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
    { id: '4', title: 'Content Writing', buyer: 'Nusrat Jahan', price: 1200, status: 'in_progress', statusText: 'In Progress', badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    { id: '5', title: 'Social Media Design', buyer: 'Mahadi Hasan', price: 2200, status: 'completed', statusText: 'Completed', badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  ];

  // Recent Transactions (matching Image 2)
  const recentTxnsList = [
    { id: '1', title: 'Order Payment', sub: 'Order ID: #123456', amount: '+ ৳1,500', time: 'আজ', isPositive: true },
    { id: '2', title: 'Add Money', sub: 'Via bKash', amount: '+ ৳2,000', time: 'গতকাল', isPositive: true },
    { id: '3', title: 'Withdraw', sub: 'To bKash', amount: '- ৳1,200', time: '২ দিন আগে', isPositive: false },
    { id: '4', title: 'Referral Bonus', sub: 'Referral ID: #88765', amount: '+ ৳300', time: '৩ দিন আগে', isPositive: true },
    { id: '5', title: 'Service Fee', sub: 'Order ID: #12344', amount: '- ৳150', time: '৩ দিন আগে', isPositive: false },
  ];

  // Recent Jobs (matching Image 2)
  const recentJobsList = [
    { id: '1', title: 'Build a WordPress Website', budget: '৳ 15,000', status: 'Published', badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
    { id: '2', title: 'Fix PHP Bug', budget: '৳ 5,000', status: '3 Applications', badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    { id: '3', title: 'Mobile App UI Design', budget: '৳ 8,000', status: 'In Progress', badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
    { id: '4', title: 'Content Writer Needed', budget: '৳ 2,500', status: 'Closed', badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    { id: '5', title: 'SEO Expert Needed', budget: '৳ 6,000', status: 'Published', badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  ];

  // Notifications List (matching Image 2)
  const notificationsList = [
    { id: '1', text: 'আপনার অর্ডার #123456 ডেলিভার হয়েছে', time: '2 min ago', dot: 'bg-blue-500' },
    { id: '2', text: 'পেমেন্ট রিসিভড ফর অর্ডার #12344', time: '10 min ago', dot: 'bg-emerald-500' },
    { id: '3', text: 'আপনার উইথড্র রিকোয়েস্ট প্রসেস হয়েছে', time: '1 hour ago', dot: 'bg-amber-500' },
    { id: '4', text: 'আপনার জন্য একটি মেসেজ এসেছে', time: '2 hour ago', dot: 'bg-purple-500' },
    { id: '5', text: 'ভেরিফিকেশন সফল হয়েছে', time: '1 day ago', dot: 'bg-emerald-500' },
  ];

  // Guide Items (01 - 18)
  const guideItems = [
    { num: '01', title: 'ড্যাশবোর্ড', desc: 'আপনার সম্পূর্ণ একাউন্টের সামগ্রিক তথ্য ও সারাংশ দেখুন।' },
    { num: '02', title: 'ওয়ালেট', desc: 'আপনার ব্যালেন্স, আয়, জমা, উইথড্র, ট্রানজেকশন সব দেখুন।' },
    { num: '03', title: 'ডিপোজিট', desc: 'টাকা জমা দেওয়ার জন্য রিকোয়েস্ট করতে পারবেন।' },
    { num: '04', title: 'উইথড্র', desc: 'আপনার আয়ের টাকা উত্তোলনের জন্য রিকোয়েস্ট করতে পারবেন।' },
    { num: '05', title: 'জবস', desc: 'বিভিন্ন কাজ দেখবেন, আবেদন করতে এবং আপনার জব পোস্ট পরিচালনা করতে পারবেন।' },
    { num: '06', title: 'সার্ভিস', desc: 'সার্ভিস দেখবেন এবং অর্ডার করতে পারবেন।' },
    { num: '07', title: 'ওয়ার্কস্পেস', desc: 'আপনার নিজস্ব সার্ভিস এবং জব পাবলিশ, ম্যানেজ এবং অর্ডারের স্ট্যাটাস দেখতে পারবেন।' },
    { num: '08', title: 'অর্ডারস', desc: 'আপনি যে সার্ভিস অর্ডার করেছেন তার অবস্থা দেখুন।' },
    { num: '09', title: 'রিসিভড অর্ডারস', desc: 'আপনার সার্ভিসে যে অর্ডার এসেছে তা পরিচালনা করতে পারবেন।' },
    { num: '10', title: 'মেসেজ', desc: 'ব্যবহারকারীদের সাথে চ্যাট করতে পারবেন।' },
    { num: '11', title: 'নোটিফিকেশনস', desc: 'আপনার অ্যাকাউন্টের গুরুত্বপূর্ণ নোটিফিকেশন দেখুন।' },
    { num: '12', title: 'রেফারেলস', desc: 'আপনার রেফারেল কোড, লিঙ্ক, রেফারেল, রিওয়ার্ড দেখতে পারবেন।' },
    { num: '13', title: 'ইনভয়েস', desc: 'আপনার লেনদেনের ইনভয়েস ডাউনলোড করতে পারবেন।' },
    { num: '14', title: 'Maya AI', desc: 'আপনার স্মার্ট সহকারী। যেকোন তথ্য জানতে পারবেন।' },
    { num: '15', title: 'প্রোফাইল', desc: 'আপনার প্রোফাইল তথ্য দেখুন এবং আপডেট করতে পারবেন।' },
    { num: '16', title: 'সেটিংস', desc: 'একাউন্ট, সিকিউরিটি, ভেরিফিকেশন ইত্যাদি সেটিংস পরিবর্তন করুন।' },
    { num: '17', title: 'সাপোর্ট', desc: 'সাহায্য, অভিযোগ অথবা সরাসরি সাপোর্ট পেতে পারেন।' },
    { num: '18', title: 'লগআউট', desc: 'অ্যাকাউন্ট থেকে সুরক্ষিতভাবে লগআউট করুন।' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Introduction (Matching Image 2 Header Description) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>TaskBD – USER PANEL (ইউজার প্যানেল)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            এটি TaskBD ওয়েবসাইটের ইউজার প্যানেল। এখান একজন ইউজার তার ওয়ালেট, সার্ভিস, জব, অর্ডার, মেসেজ, রেফারেল, ইনভয়েস এবং আরও অনেক কিছু পরিচালনা করতে পারবে।
          </p>
        </div>

        <button
          onClick={() => setShowHelperGuide(!showHelperGuide)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
            showHelperGuide
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{showHelperGuide ? 'গাইড বন্ধ করুন' : 'সেকশন ও কাজের গাইড'}</span>
        </button>
      </div>

      {/* Greeting & Top Search Header (Matching Image 2 Top Sub-header) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
            {currentUser?.name?.slice(0, 1) || 'R'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                সুপ্রভাত, {currentUser?.name || 'Rakib Hasan'} 👋
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              User ID: <span className="font-bold text-slate-700 dark:text-slate-300">{currentUser?.id || '12345678'}</span> |{' '}
              <span className="text-blue-600 dark:text-blue-400 font-bold">Freelancer</span>
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="সার্চিং, জব, বা অন্য কিছু খুঁজুন..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Top 4 Status Badges Row (Matching Image 2) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-500 block truncate">ভেরিফাইড অ্যাকাউন্ট</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Approved</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-500 block truncate">পাবলিশিং অ্যাক্সেস</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Active</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-500 block truncate">একাউন্ট স্ট্যাটাস</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Active</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-500 block truncate">মেম্বার সাইন</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">12 Feb 2024</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Dashboard Content + Right Side Helper Guide */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left/Main Column (8 or 12 Cols) */}
        <div className={`${showHelperGuide ? 'xl:col-span-8' : 'xl:col-span-12'} space-y-6 transition-all`}>
          {/* Financial Cards Row (Hero Gradient Card + 4 Side Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main Gradient Wallet Card (5 Cols) */}
            <div className="md:col-span-5 p-5 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">
                    ওয়ালেট ব্যালেন্স
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                    title={showBalance ? 'Hide Balance' : 'Show Balance'}
                  >
                    {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div>
                  <span className="text-[11px] text-blue-100 block">মোট ব্যালেন্স</span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-0.5">
                    {showBalance ? `৳ ${totalBal.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '৳ •••••••'}
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-4">
                <button
                  onClick={() => onNavigate('/dashboard/wallet/deposit')}
                  className="w-full py-2.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ টাকা যোগ করুন</span>
                </button>
              </div>
            </div>

            {/* 4 Financial Stat Cards (7 Cols) */}
            <div className="md:col-span-7 grid grid-cols-2 gap-3">
              {/* Pending Balance */}
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold text-slate-500">পেন্ডিং ব্যালেন্স</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="mt-2">
                  <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
                    ৳ {pendingBal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Withdrawable Balance */}
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold text-slate-500">উইথড্রয়েবল ব্যালেন্স</span>
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <div className="mt-2">
                  <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
                    ৳ {availableBal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Total Deposit */}
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold text-slate-500">মোট জমা</span>
                  <Download className="w-4 h-4 text-sky-500" />
                </div>
                <div className="mt-2">
                  <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
                    ৳ {totalDeposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Total Earnings */}
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold text-slate-500">মোট আয়</span>
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                <div className="mt-2">
                  <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
                    ৳ {totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Row (দ্রুত অ্যাকশন - Matching Image 2) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              দ্রুত অ্যাকশন
            </span>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center">
              {/* Deposit */}
              <button
                onClick={() => onNavigate('/dashboard/wallet/deposit')}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/60 transition-all group flex flex-col items-center gap-1.5"
              >
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 group-hover:scale-110 transition-transform">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">ডিপোজিট</span>
              </button>

              {/* Withdraw */}
              <button
                onClick={() => onNavigate('/dashboard/wallet/withdraw')}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/60 transition-all group flex flex-col items-center gap-1.5"
              >
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">উইথড্র</span>
              </button>

              {/* Search Jobs */}
              <button
                onClick={() => onNavigate('/dashboard/jobs')}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700/60 transition-all group flex flex-col items-center gap-1.5"
              >
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">জব খুঁজুন</span>
              </button>

              {/* Browse Services */}
              <button
                onClick={() => onNavigate('/dashboard/services')}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700/60 transition-all group flex flex-col items-center gap-1.5"
              >
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full">সার্ভিস ব্রাউজ</span>
              </button>

              {/* Publish Service */}
              <button
                onClick={() => onNavigate('/dashboard/workspace')}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700/60 transition-all group flex flex-col items-center gap-1.5"
              >
                <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 group-hover:scale-110 transition-transform">
                  <Tag className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full">সার্ভিস publish</span>
              </button>

              {/* Publish Job */}
              <button
                onClick={() => onNavigate('/dashboard/workspace')}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700/60 transition-all group flex flex-col items-center gap-1.5"
              >
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full">জব publish</span>
              </button>

              {/* Workspace */}
              <button
                onClick={() => onNavigate('/dashboard/workspace')}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200 dark:border-slate-700/60 transition-all group flex flex-col items-center gap-1.5"
              >
                <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900/50 text-sky-600 group-hover:scale-110 transition-transform">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full">ওয়ার্কস্পেস</span>
              </button>

              {/* Maya AI */}
              <button
                onClick={() => onNavigate('/dashboard/maya')}
                className="p-2.5 rounded-2xl bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 hover:shadow-xs border border-purple-200 dark:border-purple-800/50 transition-all group flex flex-col items-center gap-1.5"
              >
                <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white group-hover:scale-110 transition-transform shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">Maya AI</span>
              </button>
            </div>
          </div>

          {/* 3 Column Grid Section (Matching Image 2 Mid Section) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. সাম্প্রতিক অর্ডারস */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">সাম্প্রতিক অর্ডারস</h3>
                  <button
                    onClick={() => onNavigate('/dashboard/workspace')}
                    className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    সব দেখুন
                  </button>
                </div>

                <div className="space-y-2.5 pt-2">
                  {recentOrdersList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onNavigate('/dashboard/workspace')}
                      className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
                          {item.title}
                        </span>
                        <span className="text-xs font-bold font-mono text-slate-900 dark:text-white shrink-0">
                          ৳ {item.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Buyer: {item.buyer}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${item.badgeColor}`}>
                          {item.statusText}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. সাম্প্রতিক ট্রানজাকশনস */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">সাম্প্রতিক ট্রানজাকশনস</h3>
                  <button
                    onClick={() => onNavigate('/dashboard/transactions')}
                    className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    সব দেখুন
                  </button>
                </div>

                <div className="space-y-2.5 pt-2">
                  {recentTxnsList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onNavigate('/dashboard/transactions')}
                      className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {item.title}
                        </span>
                        <span
                          className={`text-xs font-bold font-mono ${
                            item.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {item.amount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-mono">{item.sub}</span>
                        <span className="text-slate-400">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. সাম্প্রতিক জবস */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">সাম্প্রতিক জবস</h3>
                  <button
                    onClick={() => onNavigate('/dashboard/jobs')}
                    className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    সব দেখুন
                  </button>
                </div>

                <div className="space-y-2.5 pt-2">
                  {recentJobsList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onNavigate('/dashboard/jobs')}
                      className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer space-y-1"
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                        {item.title}
                      </span>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-mono">Budget: {item.budget}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${item.badgeColor}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 3 Columns: Maya AI Assistant | Notifications | Referrals (Matching Image 2 Bottom) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Maya AI Assistant Interactive Card */}
            <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Maya AI Assistant</h3>
                    <p className="text-[10px] text-slate-400">আমি কীভাবে সাহায্য করতে পারি?</p>
                  </div>
                </div>

                {/* Quick Interactive Prompt Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'আমার অর্ডার পাঠাব কীভাবে?',
                    'আমার ব্যালেন্স কত?',
                    'কীভাবে সার্ভিস publish করব?',
                    'উইথড্র কীভাবে করব?',
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleAskMaya(chip)}
                      className="px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 transition-colors text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Response Bubble */}
                {mayaResponse && (
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-xs text-purple-900 dark:text-purple-200 animate-fade-in">
                    {mayaResponse}
                  </div>
                )}
              </div>

              {/* Question Input */}
              <div className="relative pt-2">
                <input
                  type="text"
                  value={mayaPrompt}
                  onChange={(e) => setMayaPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && mayaPrompt && handleAskMaya(mayaPrompt)}
                  placeholder="আপনার প্রশ্ন লিখুন..."
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => mayaPrompt && handleAskMaya(mayaPrompt)}
                  className="absolute right-1.5 top-3.5 p-1 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 2. নোটিফিকেশনস */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">নোটিফিকেশনস</h3>
                  <button
                    onClick={() => onNavigate('/dashboard/notifications')}
                    className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    সব দেখুন
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {notificationsList.map((notif) => (
                    <div key={notif.id} className="flex items-start gap-2 text-xs">
                      <span className={`w-2 h-2 rounded-full ${notif.dot} mt-1.5 shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-tight truncate">
                          {notif.text}
                        </p>
                        <span className="text-[9px] text-slate-400">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. রেফারেল সারাংশ */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  রেফারেল সারাংশ
                </h3>

                <div className="space-y-2 pt-2 text-xs">
                  {/* Code */}
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[11px] text-slate-500">রেফারেল কোড:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">TASKBD123</span>
                      <button
                        onClick={() => handleCopy('TASKBD123', 'code')}
                        className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold"
                      >
                        {copiedCode ? '✓' : 'কপি'}
                      </button>
                    </div>
                  </div>

                  {/* Share Link */}
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[11px] text-slate-500 truncate mr-2">শেয়ার লিংক:</span>
                    <button
                      onClick={() => handleCopy('https://taskbd.com/ref/TASKBD123', 'link')}
                      className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold shrink-0"
                    >
                      {copiedLink ? '✓' : 'কপি'}
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-[9px] text-slate-400 block">মোট রেফারেল</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white text-xs">25</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-[9px] text-slate-400 block">স্বাভাবিক</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white text-xs">10</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-[9px] text-slate-400 block">অর্জিত রিওয়ার্ড</span>
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-xs">৳ 1,250</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/dashboard/referrals')}
                className="w-full text-center text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline pt-1"
              >
                রেফারেল হিস্ট্রি দেখুন →
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Column: "সেকশন ও তাদের কাজ" (Matching Image 2 Right Sidebar Guide) */}
        {showHelperGuide && (
          <div className="xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>সেকশন ও তাদের কাজ</span>
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                18 টি সেকশন
              </span>
            </div>

            <div className="space-y-2.5 max-h-[900px] overflow-y-auto pr-1">
              {guideItems.map((guide) => (
                <div
                  key={guide.num}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                      {guide.num}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{guide.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-8 leading-snug">
                    {guide.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6-Point Trust Strip (Matching Image 2 Bottom) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h5 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">১০০% নিরাপদ পেমেন্ট</h5>
            <p className="text-[9px] text-slate-500 truncate">আপনার টাকা সম্পূর্ণ নিরাপদ</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h5 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">২৪/৭ সাপোর্ট</h5>
            <p className="text-[9px] text-slate-500 truncate">যেকোন সময় সহায়তা</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h5 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">দ্রুত পেমেন্ট রিলিজ</h5>
            <p className="text-[9px] text-slate-500 truncate">নির্দিষ্ট সময়ে অটো রিলিজ</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h5 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">বিশ্বস্ত মার্কেটপ্লেস</h5>
            <p className="text-[9px] text-slate-500 truncate">হাজারো ক্লায়েন্ট ও ফ্রিল্যান্সার</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h5 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">সহজ এবং স্বচ্ছ সিস্টেম</h5>
            <p className="text-[9px] text-slate-500 truncate">স্বচ্ছতা আমাদের মূলনীতি</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h5 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">AI Powered Platform</h5>
            <p className="text-[9px] text-slate-500 truncate">Maya AI দিয়ে স্মার্ট সহায়তা</p>
          </div>
        </div>
      </div>

      {/* Sub-Footer (Matching Image 2 Footer) */}
      <footer className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>© 2024-2026 TaskBD, All Rights Reserved.</span>

        <div className="flex flex-wrap items-center gap-4">
          <button onClick={() => onNavigate('/dashboard')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            শর্তাবলী
          </button>
          <button onClick={() => onNavigate('/dashboard')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            গোপনীয়তা নীতি
          </button>
          <button onClick={() => onNavigate('/dashboard/messages')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            সাপোর্ট
          </button>
          <button onClick={() => onNavigate('/dashboard/messages')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            যোগাযোগ করুন
          </button>
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold pl-2">
            <span>🌐</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'bn' | 'en')}
              className="bg-transparent text-xs font-bold cursor-pointer focus:outline-none"
            >
              <option value="bn">বাংলা</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </footer>
    </div>
  );
};
