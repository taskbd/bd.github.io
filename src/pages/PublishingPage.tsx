import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  CheckCircle,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Briefcase,
  Layers,
  TrendingUp,
} from 'lucide-react';

interface PublishingPageProps {
  onNavigate: (path: string) => void;
}

export const PublishingPage: React.FC<PublishingPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { paymentMethods, feeSettings, submitPublishingRequest } = useData();
  const { language } = useLanguage();

  const [selectedGateway, setSelectedGateway] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const activeMethod =
    paymentMethods.find((p) => p.name.toLowerCase() === selectedGateway.toLowerCase()) ||
    paymentMethods[0];

  const publishingFee = feeSettings.publishingActivationFee || 50;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeMethod.number);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderNumber.trim() || !trxId.trim()) {
      setError('Please provide your sender account number and Transaction ID (TrxID).');
      return;
    }

    setError('');
    const res = await submitPublishingRequest(selectedGateway, senderNumber.trim(), trxId.trim().toUpperCase());
    if (res.success) {
      setIsSuccess(true);
    } else {
      setError(res.message);
    }
  };

  if (currentUser?.publishingStatus === 'active') {
    return (
      <div className="max-w-xl mx-auto text-center p-8 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-3xl space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">
          Publishing Privilege Active!
        </h2>
        <p className="text-xs text-emerald-700 dark:text-emerald-300">
          Your account has full seller and employer access enabled. You can post gigs and microtasks anytime in your workspace.
        </p>
        <button
          onClick={() => onNavigate('/dashboard/workspace')}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
        >
          Go to My Workspace
        </button>
      </div>
    );
  }

  if (currentUser?.publishingStatus === 'pending' || isSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center p-8 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-3xl space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-200">
          Publishing Activation Under Review
        </h2>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          We have received your ৳{publishingFee} activation fee transaction. Our compliance team verifies TrxIDs within 10 to 30 minutes. You will receive an instant email notification once approved.
        </p>
        <button
          onClick={() => onNavigate('/dashboard')}
          className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {language === 'bn' ? 'সেলার ও পাবলিশিং অ্যাক্টিভেশন' : 'Seller & Job Publisher Activation'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'bn'
            ? 'মাত্র ৫০ টাকায় আজীবনের জন্য আনলিমিটেড গিগ ও মাইক্রোটাস্ক পোস্ট করার সুবিধা গ্রহণ করুন।'
            : 'One-time ৳50 anti-spam security activation to publish unlimited marketplace gigs and hire workers.'}
        </p>
      </div>

      {/* Value Proposition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Publish Unlimited Gigs</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Offer your skills directly to thousands of Bangladeshi business owners and startups.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Post Custom Microtasks</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hire workers for app testing, content, social engagement, or custom data entry campaigns.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">24h Escrow Protection</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Automatic release upon delivery inspection with 100% money-back dispute protection.
          </p>
        </div>
      </div>

      {/* Payment Instructions & Submission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Mobile banking instructions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. Select Mobile Wallet</h3>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs">
                Fee: ৳{publishingFee} Only
              </span>
            </div>

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

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Official TaskBD {selectedGateway} Number:</span>
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

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <p className="font-bold text-slate-800 dark:text-slate-200">How to pay:</p>
              <ol className="list-decimal list-inside space-y-1 text-[11px]">
                <li>Open your {selectedGateway} App on your mobile phone.</li>
                <li>Choose Send Money / Payment to <strong>{activeMethod.number}</strong>.</li>
                <li>Enter exactly <strong>৳{publishingFee}</strong>.</li>
                <li>Copy the Transaction ID (TrxID) from your SMS or app receipt.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Right: TrxID Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">2. Submit Verification Details</h3>

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
                  placeholder="e.g. 9H8B7F6D5E"
                  className="w-full px-4 py-2.5 text-xs font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-bold"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>One-time activation gives lifetime publishing access without monthly charges.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Activate Publishing Privilege (৳{publishingFee})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
