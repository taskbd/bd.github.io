import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from '../components/Logo';
import { KeyRound, ArrowRight, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface OtpVerifyPageProps {
  onNavigate: (path: string) => void;
}

export const OtpVerifyPage: React.FC<OtpVerifyPageProps> = ({ onNavigate }) => {
  const { pendingEmail, pendingOtp, verifyOtp, currentUser, isAdminLoggedIn } = useAuth();
  const { language } = useLanguage();

  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (!pendingEmail && !currentUser && !isAdminLoggedIn) {
      onNavigate('/login');
    }
  }, [pendingEmail, currentUser, isAdminLoggedIn, onNavigate]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await verifyOtp(otpCode);
      if (res.success) {
        if (res.isAdmin) {
          onNavigate('/admin/dashboard');
        } else {
          onNavigate('/dashboard');
        }
      } else {
        setError(res.message || 'Invalid or expired OTP code.');
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected verification error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFillOtp = () => {
    if (pendingOtp) {
      setOtpCode(pendingOtp);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex justify-center">
          <Logo size="lg" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {language === 'bn' ? 'দ্বিমাত্রিক নিরাপত্তা ওটিপি ভেরিফিকেশন' : 'Two-Factor OTP Verification'}
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'bn' ? '৬ সংখ্যার ওটিপি কোডটি আপনার ইমেইলে পাঠানো হয়েছে:' : 'A 6-digit code was dispatched to your email:'}{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{pendingEmail || 'your email'}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick simulated OTP helper banner */}
          {pendingOtp && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                  Simulated Code Dispatched
                </span>
                <span className="font-mono text-base font-extrabold tracking-widest">{pendingOtp}</span>
              </div>
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Auto Fill
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center">
                Enter 6-Digit Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={otpCode.length < 6 || isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying...' : 'Verify & Enter Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('/login')}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              ← Back to Login
            </button>

            {cooldown > 0 ? (
              <span className="font-mono text-[11px]">Resend in {cooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={() => setCooldown(60)}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Resend Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
