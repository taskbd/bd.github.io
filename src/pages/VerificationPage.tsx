import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

interface VerificationPageProps {
  onNavigate: (path: string) => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { paymentMethods, submitVerification, verificationRequests } = useData();
  const { language } = useLanguage();

  const [selectedGateway, setSelectedGateway] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeMethod = paymentMethods.find((p) => p.name.toLowerCase() === selectedGateway.toLowerCase()) || paymentMethods[0];
  const userRequest = verificationRequests.find((v) => v.userId === currentUser?.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeMethod.number);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderNumber.trim() || !trxId.trim()) {
      setError('Please provide both your sender phone number and the Transaction ID (TrxID).');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      submitVerification({
        gateway: selectedGateway,
        senderNumber: senderNumber.trim(),
        trxId: trxId.trim().toUpperCase(),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit verification request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {language === 'bn' ? 'অ্যাকাউন্ট ভেরিফিকেশন (৳১৫)' : 'Official Account Verification (৳15)'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          {language === 'bn'
            ? 'মাত্র ১৫ টাকা ভেরিফিকেশন ফি প্রদান করে ব্লু-ব্যাজ ভেরিফাইড মেম্বার হন এবং উইথড্রয়াল সুবিধা আনলক করুন।'
            : 'Secure your TaskBD profile, unlock wallet withdrawals, and establish verified trust with clients.'}
        </p>
      </div>

      {/* Verification Status Cards */}
      {currentUser?.verificationStatus === 'approved' ? (
        <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-200">
            {language === 'bn' ? 'আপনার অ্যাকাউন্ট সম্পূর্ণ ভেরিফাইড!' : 'Your Account is Fully Verified!'}
          </h2>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
            {language === 'bn'
              ? 'আপনার প্রোফাইলে ব্লু ভেরিফাইড ব্যাজ সক্রিয় রয়েছে। আপনি এখন আনলিমিটেড সার্ভিস ও উইথড্রয়াল করতে পারবেন।'
              : 'You have full access to freelance publishing, instant wallet payouts, and priority escrow protection.'}
          </p>
          <button
            onClick={() => onNavigate('/dashboard/workspace')}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            Go to My Workspace
          </button>
        </div>
      ) : currentUser?.verificationStatus === 'pending' || success ? (
        <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md animate-pulse">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200">
            {language === 'bn' ? 'ভেরিফিকেশন রিকোয়েস্ট প্রক্রিয়াধীন রয়েছে' : 'Verification Request Pending Approval'}
          </h2>
          <p className="text-xs text-amber-700 dark:text-amber-400 max-w-md mx-auto leading-relaxed">
            {language === 'bn'
              ? 'আপনার ১৫ টাকা লেনদেনের TrxID সফলভাবে জমা হয়েছে। আমাদের অ্যাডমিন টিম ৫-১৫ মিনিটের মধ্যে তথ্য যাচাই করে অ্যাকাউন্ট অ্যাক্টিভ করবেন।'
              : 'Your ৳15 TrxID has been received. Our admin team verifies mobile payment logs within 5-15 minutes.'}
          </p>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-800 inline-block font-mono text-xs text-slate-700 dark:text-slate-300">
            TrxID: <span className="font-bold text-slate-900 dark:text-white">{userRequest?.trxId || trxId || 'PENDING'}</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Instructions & Gateway Choice */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Step 1: Select Payment Gateway
              </h3>

              <div className="grid grid-cols-3 gap-2.5">
                {(['bKash', 'Nagad', 'Rocket'] as const).map((gw) => (
                  <button
                    key={gw}
                    type="button"
                    onClick={() => setSelectedGateway(gw)}
                    className={`py-3 px-2 rounded-2xl border text-center font-bold text-xs transition-all ${
                      selectedGateway === gw
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {gw}
                  </button>
                ))}
              </div>

              {/* Number Copy Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">TaskBD {selectedGateway} Number:</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {activeMethod.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-extrabold font-mono text-slate-900 dark:text-white tracking-wider">
                    {activeMethod.number}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Send Money Instructions */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <h4 className="font-bold text-slate-900 dark:text-white">Payment Steps:</h4>
                <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                  <li>
                    Open your <strong>{selectedGateway} App</strong> or Dial USSD (*247# / *167#).
                  </li>
                  <li>
                    Select <strong>"Send Money"</strong> (বা টাকা পাঠান).
                  </li>
                  <li>
                    Enter recipient number: <strong className="font-mono">{activeMethod.number}</strong>
                  </li>
                  <li>
                    Amount: <strong className="font-mono text-emerald-600">৳15 (Fifteen Taka)</strong>
                  </li>
                  <li>Complete payment and copy the Transaction ID (TrxID).</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Right Form: Submit TrxID */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Step 2: Submit Transaction Verification
              </h3>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your {selectedGateway} Sender Phone Number
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
                    placeholder="e.g. BL99X8K2Q1"
                    className="w-full px-4 py-2.5 text-xs font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-bold"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>An automated tax receipt and confirmation email will be issued upon verification.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit ৳15 Verification'}</span>
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
