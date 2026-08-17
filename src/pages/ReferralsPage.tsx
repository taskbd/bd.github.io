import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Users,
  Copy,
  Check,
  Share2,
  Gift,
  TrendingUp,
  Award,
  CheckCircle,
  QrCode,
} from 'lucide-react';

interface ReferralsPageProps {
  onNavigate: (path: string) => void;
}

export const ReferralsPage: React.FC<ReferralsPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { feeSettings } = useData();
  const { language } = useLanguage();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const referralCode = currentUser?.referralCode || 'TASKBD-REF';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
  const rewardAmount = feeSettings.referralRewardAmount || 10;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const mockReferredUsers = [
    {
      id: 'USR-881',
      name: 'Mohammad Faruk',
      joinedDate: '2026-08-14',
      status: 'verified',
      reward: rewardAmount,
    },
    {
      id: 'USR-882',
      name: 'Sadia Sultana',
      joinedDate: '2026-08-15',
      status: 'pending_verification',
      reward: 0,
    },
    {
      id: 'USR-883',
      name: 'Kamrul Hassan',
      joinedDate: '2026-08-16',
      status: 'verified',
      reward: rewardAmount,
    },
  ];

  const totalEarned = mockReferredUsers
    .filter((u) => u.status === 'verified')
    .reduce((sum, u) => sum + u.reward, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {language === 'bn' ? 'রেফার ও পুরস্কার হাব' : 'Referral & Rewards Hub'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'bn'
            ? 'বন্ধুদের ইনভাইট করুন এবং প্রতিটি ভেরিফায়েড সাইনআপে জিতে নিন ৳১০ ইনস্ট্যান্ট বোনাস।'
            : 'Invite peers and earn ৳10 direct wallet bonus for every verified member who joins.'}
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-blue-600 text-white shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Total Referral Bonus
            </span>
            <Gift className="w-5 h-5 text-blue-200" />
          </div>
          <div className="text-3xl font-extrabold font-mono">৳{totalEarned}</div>
          <p className="text-[11px] text-blue-100">Credited to available balance</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Invited Users</span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
            {mockReferredUsers.length}
          </div>
          <p className="text-[11px] text-slate-400">Registered with your code</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Reward Per Verification</span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            ৳{rewardAmount}
          </div>
          <p className="text-[11px] text-slate-400">Direct instant payout</p>
        </div>
      </div>

      {/* Link Sharing Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <h2 className="font-bold text-base text-slate-900 dark:text-white">
          Your Exclusive Referral Links
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Code */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="text-xs font-bold text-slate-500">Your Referral Code</label>
            <div className="flex items-center justify-between">
              <span className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400">
                {referralCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Full Link */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="text-xs font-bold text-slate-500">Shareable Invitation Link</label>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono truncate text-slate-700 dark:text-slate-300">
                {referralLink}
              </span>
              <button
                onClick={handleCopyLink}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Referred Users Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Referred Friends List</h3>

        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Joined Date</th>
                <th className="p-3.5">Verification Status</th>
                <th className="p-3.5 text-right">Bonus Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockReferredUsers.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white">{usr.name}</td>
                  <td className="p-3.5 text-slate-400">{usr.joinedDate}</td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        usr.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {usr.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-emerald-600">
                    ৳{usr.reward}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
