import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowDownLeft,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

interface DepositPageProps {
  onNavigate: (path: string) => void;
}

export const DepositPage: React.FC<DepositPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { paymentMethods, submitDeposit, setSelectedInvoice } = useData();
  const { language } = useLanguage();

  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('1000');
  const [selectedGateway, setSelectedGateway] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedDeposit, setSubmittedDeposit] = useState<any>(null);

  const activeMethod = paymentMethods.find((p) => p.name.toLowerCase() === selectedGateway.toLowerCase()) || paymentMethods[0];

  const presets = [500, 1000, 2000, 5000, 10000];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeMethod.number);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handlePreset = (val: number) => {
    setAmount(val);
    setCustomAmount(val.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = parseFloat(customAmount);
    if (!finalAmount || finalAmount < 50) {
      setError('Minimum deposit amount is ৳50.');
      return;
    }
    if (!senderNumber.trim() || !trxId.trim()) {
      setError('Please provide your sender phone number and the Transaction ID (TrxID).');
      return;
    }
    setError('');

    try {
      const deposit = submitDeposit({
        amount: finalAmount,
        gateway: selectedGateway,
        senderNumber: senderNumber.trim(),
        trxId: trxId.trim().toUpperCase(),
      });
      setSubmittedDeposit(deposit);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Deposit submission failed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {language === 'bn' ? 'টাকা জমা দিন (ডিপোজিট)' : 'Deposit Funds to Wallet'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'bn'
            ? 'বিকাশ, নগদ বা রকেটের মাধ্যমে টাকা পাঠিয়ে TrxID প্রদান করুন।'
            : 'Transfer funds via bKash, Nagad, or Rocket and submit your transaction ID.'}
        </p>
      </div>

      {isSuccess ? (
        <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200">
              Deposit Submitted Successfully!
            </h2>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto mt-1">
              Your deposit of <strong className="font-mono">৳{customAmount}</strong> ({selectedGateway}) is registered.
              An official tax invoice and email receipt have been dispatched.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() =>
                setSelectedInvoice({
                  id: `INV-${submittedDeposit?.id || 'DEP-99'}`,
                  userId: currentUser?.id || 'USR-1001',
                  userName: currentUser?.name || 'Valued User',
                  userEmail: currentUser?.email || 'user@taskbd.com',
                  type: 'deposit',
                  serviceOrItemTitle: `Wallet Deposit via ${selectedGateway}`,
                  amount: parseFloat(customAmount),
                  fee: 0,
                  subtotal: parseFloat(customAmount),
                  total: parseFloat(customAmount),
                  paymentMethod: selectedGateway,
                  trxRef: trxId,
                  status: 'paid',
                  date: new Date().toISOString().split('T')[0],
                })
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>View Official Invoice</span>
            </button>

            <button
              onClick={() => onNavigate('/dashboard/wallet')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Back to Wallet
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Gateway & Amount */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. Select Deposit Amount</h3>

              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePreset(p)}
                    className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                      customAmount === p.toString()
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    ৳{p}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Or Custom Amount (BDT)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 font-bold text-slate-400">৳</span>
                  <input
                    type="number"
                    min="50"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 text-base font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white pt-2">2. Select Payment Gateway</h3>
              <div className="grid grid-cols-3 gap-2.5">
                {(['bKash', 'Nagad', 'Rocket'] as const).map((gw) => (
                  <button
                    key={gw}
                    type="button"
                    onClick={() => setSelectedGateway(gw)}
                    className={`py-3 px-2 rounded-2xl border text-center font-bold text-xs transition-all ${
                      selectedGateway === gw
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {gw}
                  </button>
                ))}
              </div>

              {/* Number Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">TaskBD {selectedGateway} Number:</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {activeMethod.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono font-extrabold text-slate-900 dark:text-white">
                    {activeMethod.number}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form: TrxID submission */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">3. Submit Payment Details</h3>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your {selectedGateway} Account / Sender Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Transaction ID (TrxID)
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                    placeholder="e.g. 9J8B7G6F5E"
                    className="w-full px-4 py-2.5 text-xs font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-bold"
                  />
                </div>

                {/* Summary calculation */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Deposit Amount:</span>
                    <span className="font-mono font-bold">৳{parseFloat(customAmount || '0').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Deposit Fee (0%):</span>
                    <span className="font-mono">৳0</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>Credited to Wallet:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      ৳{parseFloat(customAmount || '0').toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Submit ৳{customAmount} Deposit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
