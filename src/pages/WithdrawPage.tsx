import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Info,
  Clock,
  FileText,
} from 'lucide-react';

interface WithdrawPageProps {
  onNavigate: (path: string) => void;
}

export const WithdrawPage: React.FC<WithdrawPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { userWallet, feeSettings, submitWithdrawal, setSelectedInvoice } = useData();
  const { language } = useLanguage();

  const [amount, setAmount] = useState<string>('500');
  const [selectedGateway, setSelectedGateway] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedWithdrawal, setSubmittedWithdrawal] = useState<any>(null);

  const numAmount = parseFloat(amount) || 0;
  const feePercent = feeSettings.withdrawalFeePercentage || 2;
  const feeAmount = Math.round((numAmount * feePercent) / 100);
  const netAmount = Math.max(0, numAmount - feeAmount);

  const minWithdrawal = feeSettings.minWithdrawalAmount || 100;
  const availableBalance = userWallet.withdrawableBalance ?? userWallet.availableBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount < minWithdrawal) {
      setError(`Minimum withdrawal amount is ৳${minWithdrawal}.`);
      return;
    }
    if (numAmount > availableBalance) {
      setError(`Insufficient withdrawable balance. Your available balance is ৳${availableBalance.toLocaleString()}.`);
      return;
    }
    if (!accountNumber.trim() || accountNumber.trim().length < 11) {
      setError('Please provide a valid 11-digit Bangladeshi mobile wallet account number.');
      return;
    }

    setError('');
    const res = await submitWithdrawal(numAmount, selectedGateway, accountNumber.trim());
    if (res.success) {
      setIsSuccess(true);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {language === 'bn' ? 'টাকা উত্তোলন (উইথড্র)' : 'Withdraw Earnings & Balance'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'bn'
              ? 'বিকাশ, নগদ বা রকেটে টাকা উত্তোলন করুন। ২৪ ঘণ্টার মধ্যে পেমেন্ট সম্পন্ন হবে।'
              : 'Direct mobile banking payouts with transparent 2% service charge & instant escrow settlement.'}
          </p>
        </div>

        <div className="p-3 px-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-3">
          <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500">Withdrawable Balance</p>
            <p className="text-base font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
              ৳{availableBalance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {isSuccess ? (
        <div className="p-8 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-blue-900 dark:text-blue-200">
              Withdrawal Request Queued!
            </h2>
            <p className="text-xs text-blue-700 dark:text-blue-300 max-w-md mx-auto mt-1">
              Your request for <strong className="font-mono">৳{netAmount.toLocaleString()}</strong> net payout to{' '}
              <span className="font-bold">{selectedGateway} ({accountNumber})</span> has been submitted to the finance desk.
            </p>
          </div>

          <div className="p-4 max-w-sm mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-500">
              <span>Gross Amount:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">৳{numAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Processing Fee ({feePercent}%):</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">৳{feeAmount}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-800 pt-1.5 text-blue-600 dark:text-blue-400">
              <span>Expected Disbursement:</span>
              <span className="font-mono">৳{netAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/dashboard/wallet')}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Back to Wallet
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Input Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. Select Withdrawal Gateway</h3>
              
              <div className="grid grid-cols-3 gap-3">
                {(['bKash', 'Nagad', 'Rocket'] as const).map((gw) => (
                  <button
                    key={gw}
                    type="button"
                    onClick={() => setSelectedGateway(gw)}
                    className={`py-3 px-2 rounded-2xl border text-center font-bold text-xs transition-all ${
                      selectedGateway === gw
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {gw}
                  </button>
                ))}
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Withdrawal Amount (BDT)
                    </label>
                    <button
                      type="button"
                      onClick={() => setAmount(availableBalance.toString())}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      Max: ৳{availableBalance.toLocaleString()}
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 font-bold text-slate-400">৳</span>
                    <input
                      type="number"
                      min={minWithdrawal}
                      max={availableBalance}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`Min ৳${minWithdrawal}`}
                      className="w-full pl-8 pr-4 py-2.5 text-base font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your {selectedGateway} Personal Account Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Ensure the phone number is active and registered under your personal NID.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={availableBalance < minWithdrawal}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Request ৳{numAmount.toLocaleString()} Payout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right: Payout Summary & Policy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Payout Breakdown</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Requested Amount:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ৳{numAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Platform Fee ({feePercent}%):</span>
                  <span className="font-mono text-red-500">-৳{feeAmount.toLocaleString()}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                  <span>Net Credited to MFS:</span>
                  <span className="font-mono text-base">৳{netAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-[11px] text-slate-500">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Processing Time: Standard disbursements are settled within 2 to 24 hours.</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Double-Entry Escrow: Funds are held in audited trust until confirmation.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
