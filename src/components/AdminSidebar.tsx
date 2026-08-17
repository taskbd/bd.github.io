import React from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Briefcase,
  Layers,
  ShoppingBag,
  Lock,
  Scale,
  CreditCard,
  Percent,
  BarChart3,
  ScrollText,
  ShieldAlert,
  Bot,
  Settings,
  Receipt,
  FileText,
  Headphones,
} from 'lucide-react';

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPath, onNavigate }) => {
  const { depositRequests, withdrawalRequests, verificationRequests, publishingRequests, disputes } = useData();
  const { language } = useLanguage();

  const pendingDeposits = depositRequests.filter((d) => d.status === 'pending').length;
  const pendingWithdrawals = withdrawalRequests.filter((w) => w.status === 'pending').length;
  const pendingVerifications = verificationRequests.filter((v) => v.status === 'pending').length;
  const pendingPublishings = publishingRequests.filter((p) => p.status === 'pending').length;
  const openDisputes = disputes.filter((d) => d.status === 'open').length;

  const adminNavItems = [
    { label: language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: language === 'bn' ? 'ইউজার ম্যানেজমেন্ট' : 'User Management', path: '/admin/dashboard/users', icon: Users },
    {
      label: language === 'bn' ? 'ভেরিফিকেশন' : 'Verifications (৳15)',
      path: '/admin/dashboard/verification',
      icon: ShieldCheck,
      badge: pendingVerifications,
    },
    {
      label: language === 'bn' ? 'ডিপোজিট ম্যানেজমেন্ট' : 'Deposit Management',
      path: '/admin/dashboard/deposits',
      icon: ArrowDownLeft,
      badge: pendingDeposits,
    },
    {
      label: language === 'bn' ? 'উইথড্রয়াল ম্যানেজমেন্ট' : 'Withdrawal Management',
      path: '/admin/dashboard/withdrawals',
      icon: ArrowUpRight,
      badge: pendingWithdrawals,
    },
    { label: language === 'bn' ? 'ট্রানজাকশন' : 'Transactions', path: '/admin/dashboard/finance', icon: Receipt },
    {
      label: language === 'bn' ? 'পেমেন্ট ম্যানেজমেন্ট' : 'Payment Gateways',
      path: '/admin/dashboard/payment-methods',
      icon: CreditCard,
      highlight: true,
    },
    { label: language === 'bn' ? 'ফিন্যান্স ও লেজার' : 'Finance & Treasury', path: '/admin/dashboard/finance', icon: DollarSign },
    { label: language === 'bn' ? 'জব ম্যানেজমেন্ট' : 'Job Management', path: '/admin/dashboard/jobs', icon: Briefcase },
    { label: language === 'bn' ? 'সার্ভিস ম্যানেজমেন্ট' : 'Service Management', path: '/admin/dashboard/services', icon: Layers },
    { label: language === 'bn' ? 'অর্ডার ম্যানেজমেন্ট' : 'Order Management', path: '/admin/dashboard/orders', icon: ShoppingBag },
    { label: language === 'bn' ? 'এসক্রো ম্যানেজমেন্ট' : 'Escrow Vault', path: '/admin/dashboard/escrow', icon: Lock },
    {
      label: language === 'bn' ? 'ডিসপুট ম্যানেজমেন্ট' : 'Disputes & Claims',
      path: '/admin/dashboard/disputes',
      icon: Scale,
      badge: openDisputes,
    },
    { label: language === 'bn' ? 'ইনভয়েস ম্যানেজমেন্ট' : 'Invoices', path: '/admin/dashboard/invoices', icon: FileText },
    { label: language === 'bn' ? 'রিপোর্টস' : 'Reports & Analytics', path: '/admin/dashboard/reports', icon: BarChart3 },
    { label: language === 'bn' ? 'অডিট লগস' : 'Audit Logs', path: '/admin/dashboard/audit-logs', icon: ScrollText },
    { label: language === 'bn' ? 'সিকিউরিটি সেটিংস' : 'Security & 2FA', path: '/admin/dashboard/security', icon: ShieldAlert },
    { label: language === 'bn' ? 'সিস্টেম সেটিংস' : 'System Settings', path: '/admin/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-950 text-slate-300 min-h-[calc(100vh-4rem)] p-4 border-r border-slate-800 flex flex-col justify-between overflow-y-auto">
      <div className="space-y-4">
        {/* Admin Navigation Menu */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
            {language === 'bn' ? 'মেইন নেভিগেশন' : 'ADMIN CONTROL'}
          </span>

          {adminNavItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : item.highlight
                    ? 'text-purple-300 hover:text-white hover:bg-slate-900 bg-purple-950/20 border border-purple-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : item.highlight ? 'text-purple-400' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950 shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TaskBD Support Card (Matching Image 1 Bottom Left) */}
      <div className="pt-4 space-y-3">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-900/40 text-slate-200 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-white tracking-tight">TaskBD Support</span>
            <Headphones className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-[10px] text-slate-300 leading-tight">
            সহায়তার প্রয়োজন? আমাদের সাপোর্ট টিম ২৪/৭ আপনার পাশে আছে।
          </p>
          <button
            onClick={() => onNavigate('/admin/dashboard/audit-logs')}
            className="mt-2.5 w-full py-1.5 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold text-center transition-all block shadow-xs"
          >
            সাপোর্টে যোগাযোগ করুন
          </button>
        </div>

        <div className="text-[10px] text-slate-500 text-center font-mono">
          TaskBD Admin Panel v3.4
        </div>
      </div>
    </aside>
  );
};
