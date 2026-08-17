import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  QrCode,
  History,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Search,
  Download,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  X,
  Sliders,
  Send,
  FileSpreadsheet,
  Coins,
  Wallet,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';

interface PaymentMethodDetail {
  id: 'bkash' | 'nagad' | 'rocket';
  name: string;
  banglaName: string;
  tagline: string;
  accountName: string;
  accountNumber: string;
  accountType: 'Personal' | 'Merchant' | 'Agent';
  accountWallet: string;
  accountHolderName: string;
  instructions: string;
  balance: number;
  holdBalance: number;
  todayIn: number;
  todayOut: number;
  status: 'active' | 'inactive';
  lastUpdated: string;
  minDeposit: number;
  maxDeposit: number;
  minWithdraw: number;
  maxWithdraw: number;
  autoApproval: boolean;
  alertEmailNotification: boolean;
  logoBg: string;
  accentColor: string;
}

export const AdminPaymentManagementPage: React.FC = () => {
  const { language } = useLanguage();
  const { depositRequests } = useData();

  const [methods, setMethods] = useState<PaymentMethodDetail[]>([
    {
      id: 'bkash',
      name: 'bKash',
      banglaName: 'বিকাশ',
      tagline: 'Active',
      accountName: 'TaskBD Official',
      accountNumber: '01712-345678',
      accountType: 'Personal',
      accountWallet: 'bKash Personal',
      accountHolderName: 'TaskBD Official',
      instructions: 'পেমেন্ট করার পর অবশ্যই ট্রানজাকশন আইডি দিন। ভুল নাম্বারে পেমেন্ট করলে আমরা দায়ী নই।',
      balance: 1245850.0,
      holdBalance: 25500.0,
      todayIn: 78450.0,
      todayOut: 45320.0,
      status: 'active',
      lastUpdated: '12 May 2024, 10:30 AM',
      minDeposit: 10.0,
      maxDeposit: 50000.0,
      minWithdraw: 100.0,
      maxWithdraw: 100000.0,
      autoApproval: true,
      alertEmailNotification: true,
      logoBg: 'bg-pink-600',
      accentColor: 'text-pink-500',
    },
    {
      id: 'nagad',
      name: 'Nagad',
      banglaName: 'নগদ',
      tagline: 'Active',
      accountName: 'TaskBD Official',
      accountNumber: '01876-543210',
      accountType: 'Personal',
      accountWallet: 'Nagad Personal',
      accountHolderName: 'TaskBD Official',
      instructions: 'নগদ সেন্ড মানি করুন এবং অ্যাপে ট্রানজাকশন আইডি সাবমিট করুন।',
      balance: 845620.0,
      holdBalance: 18200.0,
      todayIn: 42100.0,
      todayOut: 31200.0,
      status: 'active',
      lastUpdated: '12 May 2024, 09:45 AM',
      minDeposit: 10.0,
      maxDeposit: 50000.0,
      minWithdraw: 100.0,
      maxWithdraw: 100000.0,
      autoApproval: true,
      alertEmailNotification: true,
      logoBg: 'bg-orange-600',
      accentColor: 'text-orange-500',
    },
    {
      id: 'rocket',
      name: 'Rocket',
      banglaName: 'রকেট',
      tagline: 'Active',
      accountName: 'TaskBD Official',
      accountNumber: '01911-223344',
      accountType: 'Personal',
      accountWallet: 'Rocket Personal (12 Digit)',
      accountHolderName: 'TaskBD Official',
      instructions: 'ডাচ-বাংলা রকেট সেন্ড মানি করুন। ১২ ডিজিটের একাউন্ট নাম্বার নিশ্চিত করুন।',
      balance: 367280.0,
      holdBalance: 8750.0,
      todayIn: 24770.0,
      todayOut: 21930.0,
      status: 'active',
      lastUpdated: '11 May 2024, 08:20 PM',
      minDeposit: 10.0,
      maxDeposit: 50000.0,
      minWithdraw: 100.0,
      maxWithdraw: 100000.0,
      autoApproval: true,
      alertEmailNotification: true,
      logoBg: 'bg-purple-600',
      accentColor: 'text-purple-500',
    },
  ]);

  // Active Selected Method for Drawer / Modal (Right panel in screenshot)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodDetail | null>(methods[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsEdit, setShowSettingsEdit] = useState(false);
  const [showTestPayment, setShowTestPayment] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const totalBalance = methods.reduce((acc, curr) => acc + curr.balance, 0);
  const totalTodayDeposit = methods.reduce((acc, curr) => acc + curr.todayIn, 0);
  const totalTodayWithdraw = methods.reduce((acc, curr) => acc + curr.todayOut, 0);
  const activeCount = methods.filter((m) => m.status === 'active').length;
  const inactiveCount = methods.filter((m) => m.status === 'inactive').length;

  const toggleMethodStatus = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = m.status === 'active' ? 'inactive' : 'active';
          triggerToast(`${m.name} স্ট্যাটাস পরিবর্তন: ${next === 'active' ? 'সচল (Active)' : 'নিষ্ক্রিয় (Inactive)'}`);
          return { ...m, status: next };
        }
        return m;
      })
    );
    if (selectedMethod && selectedMethod.id === id) {
      setSelectedMethod((prev) =>
        prev ? { ...prev, status: prev.status === 'active' ? 'inactive' : 'active' } : null
      );
    }
  };

  // Recent deposits table data (matching the screenshot)
  const sampleDeposits = [
    {
      id: '#DP125487',
      user: 'Rakib Hasan',
      method: 'bKash',
      number: '01712-345678',
      amount: 5000,
      trxId: 'TXN87654321',
      status: 'pending',
      time: '2 min ago',
    },
    {
      id: '#DP125486',
      user: 'Ali Hasan',
      method: 'Nagad',
      number: '01876-543210',
      amount: 2500,
      trxId: 'TXN87654320',
      status: 'approved',
      time: '5 min ago',
    },
    {
      id: '#DP125485',
      user: 'Tanvir Ahmed',
      method: 'bKash',
      number: '01712-345678',
      amount: 8000,
      trxId: 'TXN87654319',
      status: 'approved',
      time: '10 min ago',
    },
    {
      id: '#DP125484',
      user: 'Farhana Akter',
      method: 'Rocket',
      number: '01911-223344',
      amount: 3200,
      trxId: 'TXN87654318',
      status: 'pending',
      time: '15 min ago',
    },
  ];

  // 7-day transaction chart bars data
  const chartDays = [
    { day: '06 May', deposit: 60, withdraw: 45 },
    { day: '07 May', deposit: 85, withdraw: 55 },
    { day: '08 May', deposit: 70, withdraw: 60 },
    { day: '09 May', deposit: 95, withdraw: 68 },
    { day: '10 May', deposit: 75, withdraw: 50 },
    { day: '11 May', deposit: 110, withdraw: 80 },
    { day: '12 May', deposit: 145, withdraw: 98 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Row (Matching Image 1) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            এডমিন প্যানেল - পেমেন্ট ম্যানেজমেন্ট (Payment Management)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            এখানে সব পেমেন্ট মেথড, অ্যাকাউন্ট নাম্বার, ব্যালেন্স, ট্রানজাকশন, স্ট্যাটাস এবং সেটিংস ম্যানেজ করা যাবে।
          </p>
        </div>

        {/* Header Search & Admin status */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="সার্চ করুন (যেমন: bkash, nagad, rocket...)"
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 4 Payment Management Overview Metric Cards */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          পেমেন্ট ম্যানেজমেন্ট ওভারভিউ
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Methods */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-purple-900/40 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">মোট পেমেন্ট মেথড</span>
              <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-400">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold font-mono text-white">{methods.length}</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Active: <span className="text-emerald-400 font-bold">{activeCount}</span> | Inactive:{' '}
                <span className="text-rose-400 font-bold">{inactiveCount}</span>
              </p>
            </div>
          </div>

          {/* 2. Total Balance Across All Methods */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-emerald-900/40 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">মোট ব্যালেন্স (সকল মেথড)</span>
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                <Coins className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                ৳ {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>সর্বশেষ আপডেট: এখনই</span>
              </p>
            </div>
          </div>

          {/* 3. Today's Total Deposit */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-amber-900/40 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">আজকের মোট ডিপোজিট</span>
              <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                ৳ {totalTodayDeposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>↑ 18.6% গতকালের তুলনায়</span>
              </p>
            </div>
          </div>

          {/* 4. Today's Total Withdrawal */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-blue-900/40 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">আজকের মোট উইথড্রয়াল</span>
              <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                ৳ {totalTodayWithdraw.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[11px] text-sky-400 mt-1 flex items-center gap-1">
                <span>↓ 12.4% গতকালের তুলনায়</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Table & Selected Method View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Side (7 Cols): Payment Methods Table & Charts */}
        <div className="xl:col-span-7 space-y-6">
          {/* Payment Method Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>পেমেন্ট মেথড তালিকা</span>
              </h3>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন পেমেন্ট মেথড যোগ করুন</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-3 px-2">মেথড</th>
                    <th className="pb-3 px-2">অ্যাকাউন্ট তথ্য</th>
                    <th className="pb-3 px-2">ব্যালেন্স</th>
                    <th className="pb-3 px-2">স্ট্যাটাস</th>
                    <th className="pb-3 px-2">সর্বশেষ আপডেট</th>
                    <th className="pb-3 px-2 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {methods
                    .filter(
                      (m) =>
                        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.accountNumber.includes(searchQuery)
                    )
                    .map((method) => {
                      const isSelected = selectedMethod?.id === method.id;
                      return (
                        <tr
                          key={method.id}
                          onClick={() => setSelectedMethod(method)}
                          className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                            isSelected ? 'bg-slate-800/80 border-l-4 border-blue-500' : ''
                          }`}
                        >
                          {/* Method Name + Logo Icon */}
                          <td className="py-3.5 px-2">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-xl ${method.logoBg} flex items-center justify-center text-white font-black text-xs shadow-xs`}
                              >
                                {method.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-bold text-white block">{method.name}</span>
                                <span className="text-[10px] text-emerald-400 font-semibold">
                                  {method.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Account Info */}
                          <td className="py-3.5 px-2">
                            <span className="text-slate-300 block font-medium">নাম: {method.accountName}</span>
                            <span className="text-slate-400 text-[11px] font-mono">
                              নাম্বার: {method.accountNumber}
                            </span>
                          </td>

                          {/* Balance */}
                          <td className="py-3.5 px-2">
                            <span className="font-bold font-mono text-white block">
                              ৳ {method.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] text-amber-400 font-mono">
                              হোল্ড: ৳ {method.holdBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </td>

                          {/* Status Toggle Switch */}
                          <td className="py-3.5 px-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => toggleMethodStatus(method.id)}
                              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                                method.status === 'active' ? 'bg-blue-600' : 'bg-slate-700'
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                  method.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>

                          {/* Last Updated */}
                          <td className="py-3.5 px-2 text-[11px] text-slate-400 font-mono">
                            {method.lastUpdated}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedMethod(method);
                                  setShowSettingsEdit(true);
                                }}
                                title="Edit Settings"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setSelectedMethod(method)}
                                title="View History & Details"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                              >
                                <History className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 7-Day Chart & Donut Share (Matching Image 1 Mid Row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Bar Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">পেমেন্ট ট্রানজাকশন (গত ৭ দিন)</h4>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ডিপোজিট
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> উইথড্রয়াল
                  </span>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="h-44 flex items-end justify-between gap-2 pt-4 px-1">
                {chartDays.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1 h-32">
                      <div
                        className="w-3 bg-emerald-500 rounded-t-sm hover:opacity-80 transition-all"
                        style={{ height: `${(d.deposit / 150) * 100}%` }}
                        title={`Deposit: ৳${d.deposit}k`}
                      />
                      <div
                        className="w-3 bg-rose-500 rounded-t-sm hover:opacity-80 transition-all"
                        style={{ height: `${(d.withdraw / 150) * 100}%` }}
                        title={`Withdrawal: ৳${d.withdraw}k`}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono truncate">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Method Share Donut */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h4 className="text-xs font-bold text-white">পেমেন্ট মেথড অনুযায়ী ব্যবহার</h4>

              <div className="flex items-center justify-between gap-4 pt-2">
                {/* Donut representation */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Rocket segment 11% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="transparent"
                      stroke="#a855f7"
                      strokeWidth="4"
                      strokeDasharray="100 100"
                      strokeDashoffset="0"
                    />
                    {/* Nagad segment 31% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="transparent"
                      stroke="#f97316"
                      strokeWidth="4"
                      strokeDasharray="89 100"
                      strokeDashoffset="0"
                    />
                    {/* bKash segment 58% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="transparent"
                      stroke="#ec4899"
                      strokeWidth="4"
                      strokeDasharray="58 100"
                      strokeDashoffset="0"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-[9px] text-slate-400 block font-bold">মোট ব্যালেন্স</span>
                    <span className="text-[10px] font-mono font-extrabold text-white">৳ 2.45M</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-pink-400 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> bKash
                    </span>
                    <div className="text-right">
                      <span className="font-mono font-bold text-white">58%</span>
                      <span className="text-[10px] text-slate-400 block">৳ 1,245,850</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-orange-400 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Nagad
                    </span>
                    <div className="text-right">
                      <span className="font-mono font-bold text-white">31%</span>
                      <span className="text-[10px] text-slate-400 block">৳ 845,620</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Rocket
                    </span>
                    <div className="text-right">
                      <span className="font-mono font-bold text-white">11%</span>
                      <span className="text-[10px] text-slate-400 block">৳ 367,280</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Deposits Table (Image 1 Bottom) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">সাম্প্রতিক ডিপোজিট (সকল মেথড)</h4>
              <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold hover:underline">
                সব দেখুন
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[10px] uppercase">
                    <th className="pb-2 px-2">ID</th>
                    <th className="pb-2 px-2">ইউজার</th>
                    <th className="pb-2 px-2">মেথড</th>
                    <th className="pb-2 px-2">নাম্বার</th>
                    <th className="pb-2 px-2">পরিমাণ</th>
                    <th className="pb-2 px-2">ট্রানজাকশন ID</th>
                    <th className="pb-2 px-2">স্ট্যাটাস</th>
                    <th className="pb-2 px-2 text-right">সময়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sampleDeposits.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-2 font-mono text-slate-400">{item.id}</td>
                      <td className="py-2.5 px-2 font-bold text-white">{item.user}</td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            item.method === 'bKash'
                              ? 'bg-pink-950 text-pink-300 border border-pink-800'
                              : item.method === 'Nagad'
                              ? 'bg-orange-950 text-orange-300 border border-orange-800'
                              : 'bg-purple-950 text-purple-300 border border-purple-800'
                          }`}
                        >
                          {item.method}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-mono text-slate-400 text-[11px]">{item.number}</td>
                      <td className="py-2.5 px-2 font-mono font-bold text-white">৳ {item.amount.toLocaleString()}</td>
                      <td className="py-2.5 px-2 font-mono text-blue-400 text-[11px]">{item.trxId}</td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'approved'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {item.status === 'approved' ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right text-[11px] text-slate-500 font-mono">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side (5 Cols): Payment Method Details Screen (Image 1 Right Side) */}
        <div className="xl:col-span-5 space-y-6">
          {selectedMethod ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              {/* Method Title & Active Status Toggle */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl ${selectedMethod.logoBg} flex items-center justify-center text-white font-black text-sm shadow-md`}
                  >
                    {selectedMethod.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-white">{selectedMethod.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                        {selectedMethod.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      সর্বশেষ আপডেট: {selectedMethod.lastUpdated}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block mb-1">
                    {selectedMethod.status === 'active' ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয়'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleMethodStatus(selectedMethod.id)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      selectedMethod.status === 'active' ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        selectedMethod.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Account Info Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">অ্যাকাউন্ট তথ্য</h4>
                  <button
                    onClick={() => setShowSettingsEdit(true)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    <span>তথ্য সম্পাদনা করুন</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">অ্যাকাউন্ট নাম</span>
                    <span className="font-bold text-white">{selectedMethod.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">অ্যাকাউন্ট নাম্বার</span>
                    <span className="font-bold font-mono text-slate-200">{selectedMethod.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">অ্যাকাউন্ট টাইপ</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {selectedMethod.accountType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">অ্যাকাউন্ট ওয়ালেট</span>
                    <span className="font-semibold text-slate-200">{selectedMethod.accountWallet}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">অ্যাকাউন্ট হোল্ডার নাম</span>
                    <span className="font-semibold text-slate-200">{selectedMethod.accountHolderName}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400 block mb-1">নির্দেশনা/ইনস্ট্রাকশন:</span>
                    <p className="text-[11px] text-slate-300 italic bg-slate-900 p-2 rounded-xl border border-slate-800">
                      "{selectedMethod.instructions}"
                    </p>
                  </div>

                  {/* QR Code snippet */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                    <span className="text-slate-400">QR কোড (ইমেজ)</span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-slate-900" />
                      </div>
                      <button
                        onClick={() => triggerToast('QR কোড ডাউনলোড করা হচ্ছে...')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>QR ডাউনলোড করুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance & Limits Metrics */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">ব্যালেন্স ও সীমা</h4>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">বর্তমান ব্যালেন্স</span>
                    <span className="text-base font-extrabold font-mono text-emerald-400 mt-0.5 block">
                      ৳ {selectedMethod.balance.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">হোল্ড ব্যালেন্স</span>
                    <span className="text-base font-extrabold font-mono text-amber-400 mt-0.5 block">
                      ৳ {selectedMethod.holdBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">আজকের ইন</span>
                    <span className="text-sm font-bold font-mono text-sky-400 mt-0.5 block">
                      ৳ {selectedMethod.todayIn.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">আজকের আউট</span>
                    <span className="text-sm font-bold font-mono text-rose-400 mt-0.5 block">
                      ৳ {selectedMethod.todayOut.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Settings Box */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">সেটিংস</h4>
                  <button
                    onClick={() => setShowSettingsEdit(true)}
                    className="px-2.5 py-1 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>সেটিংস পরিবর্তন করুন</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ন্যূনতম ডিপোজিট সীমা</span>
                    <span className="font-mono text-slate-200 font-bold">৳ {selectedMethod.minDeposit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">সর্বোচ্চ ডিপোজিট সীমা</span>
                    <span className="font-mono text-slate-200 font-bold">৳ {selectedMethod.maxDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ন্যূনতম উইথড্রয়াল সীমা</span>
                    <span className="font-mono text-slate-200 font-bold">৳ {selectedMethod.minWithdraw.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">সর্বোচ্চ উইথড্রয়াল সীমা</span>
                    <span className="font-mono text-slate-200 font-bold">৳ {selectedMethod.maxWithdraw.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400">অটো অ্যাপ্রুভাল</span>
                    <span className="text-emerald-400 font-bold">চালু আছে</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">সক্রিয় অবস্থার সতর্কতা</span>
                    <span className="text-blue-400 font-bold">ইমেইল + নোটিফিকেশন</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions (Matching Image 1 Button Strip) */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">দ্রুত অ্যাকশন</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => triggerToast('ব্যালেন্স রিয়েল-টাইম গেটওয়ের সাথে সিঙ্ক হয়েছে!')}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ব্যালেন্স আপডেট করুন</span>
                  </button>

                  <button
                    onClick={() => setShowTestPayment(true)}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>টেস্ট পেমেন্ট করুন</span>
                  </button>

                  <button
                    onClick={() => triggerToast('CSV ট্রানজাকশন লেজার প্রস্তুত!')}
                    className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>অ্যাকাউন্ট এক্সপোর্ট করুন</span>
                  </button>

                  <button
                    onClick={() => toggleMethodStatus(selectedMethod.id)}
                    className={`p-2.5 rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                      selectedMethod.status === 'active'
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{selectedMethod.status === 'active' ? 'মেথড নিষ্ক্রিয় করুন' : 'মেথড সক্রিয় করুন'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
              <CreditCard className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">কোনো মেথড নির্বাচন করা হয়নি</h4>
              <p className="text-xs text-slate-400">বিস্তারিত দেখতে তালিকা থেকে যেকোনো পেমেন্ট মেথড ক্লিক করুন।</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Settings Modal */}
      {showSettingsEdit && selectedMethod && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>{selectedMethod.name} সেটিংস ও সীমা কনফিগারেশন</span>
              </h3>
              <button
                onClick={() => setShowSettingsEdit(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">অ্যাকাউন্ট নাম্বার</label>
                <input
                  type="text"
                  defaultValue={selectedMethod.accountNumber}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">ন্যূনতম ডিপোজিট (৳)</label>
                  <input
                    type="number"
                    defaultValue={selectedMethod.minDeposit}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">সর্বোচ্চ ডিপোজিট (৳)</label>
                  <input
                    type="number"
                    defaultValue={selectedMethod.maxDeposit}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">ইউজারদের নির্দেশনা মেসেজ</label>
                <textarea
                  rows={2}
                  defaultValue={selectedMethod.instructions}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowSettingsEdit(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  setShowSettingsEdit(false);
                  triggerToast('পেমেন্ট মেথড সেটিংস সংরক্ষিত হয়েছে!');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Payment Simulator Modal */}
      {showTestPayment && selectedMethod && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>{selectedMethod.name} টেস্ট ডিপোজিট সিমুলেশন</span>
              </h3>
              <button
                onClick={() => setShowTestPayment(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              গেটওয়ে অটোমেশন ও ইনস্ট্যান্ট নোটিফিকেশন পরীক্ষা করার জন্য একটি টেস্ট লেনদেন প্রেরণ করুন।
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">টেস্ট ডিপোজিট পরিমাণ (৳)</label>
                <input
                  type="number"
                  defaultValue="500"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">সিমুলেটেড TrxID</label>
                <input
                  type="text"
                  defaultValue="TEST_TXN_992182"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowTestPayment(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  setShowTestPayment(false);
                  triggerToast(`টেস্ট পেমেন্ট ৳500 ${selectedMethod.name} লেজারে জমা হয়েছে!`);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                সিমুলেট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
