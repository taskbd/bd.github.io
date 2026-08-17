import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Sliders,
  DollarSign,
  Smartphone,
  Save,
  CheckCircle2,
  AlertCircle,
  Percent,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { feeSettings, updateFeeSettings, paymentMethods, updatePaymentMethods } = useData();

  const [verificationFee, setVerificationFee] = useState(
    feeSettings.verificationFee.toString()
  );
  const [publishingFee, setPublishingFee] = useState(
    feeSettings.publishingActivationFee.toString()
  );
  const [withdrawalFeePercent, setWithdrawalFeePercent] = useState(
    feeSettings.withdrawalFeePercent.toString()
  );
  const [serviceCommissionPercent, setServiceCommissionPercent] = useState(
    feeSettings.serviceCommissionPercent.toString()
  );
  const [referralRewardAmount, setReferralRewardAmount] = useState(
    feeSettings.referralRewardAmount.toString()
  );

  const [methods, setMethods] = useState(paymentMethods);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleMethodChange = (index: number, field: string, val: string) => {
    const updated = [...methods];
    updated[index] = { ...updated[index], [field]: val };
    setMethods(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFeeSettings({
      verificationFee: parseFloat(verificationFee) || 15,
      publishingActivationFee: parseFloat(publishingFee) || 50,
      withdrawalFeePercent: parseFloat(withdrawalFeePercent) || 2,
      serviceCommissionPercent: parseFloat(serviceCommissionPercent) || 10,
      referralRewardAmount: parseFloat(referralRewardAmount) || 10,
    });
    updatePaymentMethods(methods);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          System Rates & Payment Gateway Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure dynamic fees, commission percentages, referral reward balances, and official receiving wallet numbers.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Platform fee rates & payment gateways saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Dynamic Platform Fees */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Platform Fee Rates & Rewards</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Account Verification Fee (BDT)
              </label>
              <input
                type="number"
                required
                value={verificationFee}
                onChange={(e) => setVerificationFee(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
              <span className="text-[10px] text-slate-400">Currently: ৳15</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Seller/Publishing Fee (BDT)
              </label>
              <input
                type="number"
                required
                value={publishingFee}
                onChange={(e) => setPublishingFee(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
              <span className="text-[10px] text-slate-400">Currently: ৳50</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Referral Reward (BDT)
              </label>
              <input
                type="number"
                required
                value={referralRewardAmount}
                onChange={(e) => setReferralRewardAmount(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
              <span className="text-[10px] text-slate-400">Currently: ৳10</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Withdrawal Fee (%)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={withdrawalFeePercent}
                onChange={(e) => setWithdrawalFeePercent(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
              <span className="text-[10px] text-slate-400">Currently: 2.0%</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Marketplace Order Fee (%)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={serviceCommissionPercent}
                onChange={(e) => setServiceCommissionPercent(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
              <span className="text-[10px] text-slate-400">Currently: 10.0%</span>
            </div>
          </div>
        </div>

        {/* Official Receiving Numbers */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Official Receiving MFS Numbers (Shown on Deposit & Activation)</span>
          </h2>

          <div className="space-y-4">
            {methods.map((method, index) => (
              <div
                key={method.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
              >
                <div>
                  <label className="block font-bold mb-1">Gateway Name</label>
                  <input
                    type="text"
                    value={method.name}
                    onChange={(e) => handleMethodChange(index, 'name', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Official Receiving Number</label>
                  <input
                    type="text"
                    value={method.number}
                    onChange={(e) => handleMethodChange(index, 'number', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Account Type</label>
                  <select
                    value={method.type}
                    onChange={(e) => handleMethodChange(index, 'type', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold uppercase"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Agent">Agent</option>
                    <option value="Merchant">Merchant</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings & Rates</span>
        </button>
      </form>
    </div>
  );
};
