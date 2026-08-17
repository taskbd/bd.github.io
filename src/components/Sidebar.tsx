import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Briefcase,
  Layers,
  Sparkles,
  ShoppingBag,
  PackageCheck,
  MessageSquare,
  Bell,
  Users,
  FileText,
  Bot,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { currentUser, logout } = useAuth();
  const { unreadNotificationCount } = useData();
  const { language } = useLanguage();

  const navItems = [
    { num: '01', label: language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { num: '02', label: language === 'bn' ? 'ওয়ালেট' : 'Wallet', path: '/dashboard/wallet', icon: Wallet },
    { num: '03', label: language === 'bn' ? 'ডিপোজিট' : 'Deposit', path: '/dashboard/wallet/deposit', icon: ArrowDownLeft },
    { num: '04', label: language === 'bn' ? 'উইথড্র' : 'Withdraw', path: '/dashboard/wallet/withdraw', icon: ArrowUpRight },
    { num: '05', label: language === 'bn' ? 'জবস' : 'Jobs', path: '/dashboard/jobs', icon: Briefcase },
    { num: '06', label: language === 'bn' ? 'সার্ভিস' : 'Services', path: '/dashboard/services', icon: Layers },
    { num: '07', label: language === 'bn' ? 'ওয়ার্কস্পেস' : 'Workspace', path: '/dashboard/workspace', icon: Sparkles, highlight: true },
    { num: '08', label: language === 'bn' ? 'অর্ডারস' : 'Orders', path: '/dashboard/workspace', icon: ShoppingBag },
    { num: '09', label: language === 'bn' ? 'রিসিভড অর্ডারস' : 'Received Orders', path: '/dashboard/workspace', icon: PackageCheck },
    { num: '10', label: language === 'bn' ? 'মেসেজ' : 'Messages', path: '/dashboard/messages', icon: MessageSquare, badge: 5 },
    {
      num: '11',
      label: language === 'bn' ? 'নোটিফিকেশনস' : 'Notifications',
      path: '/dashboard/notifications',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : 12,
    },
    { num: '12', label: language === 'bn' ? 'রেফারেলস' : 'Referrals', path: '/dashboard/referrals', icon: Users, badge: 12 },
    { num: '13', label: language === 'bn' ? 'ইনভয়েস' : 'Invoices', path: '/dashboard/invoices', icon: FileText },
    { num: '14', label: 'Maya AI', path: '/dashboard/maya', icon: Bot, isMaya: true, newBadge: true },
    { num: '15', label: language === 'bn' ? 'প্রোফাইল' : 'Profile', path: '/dashboard/profile', icon: User },
    { num: '16', label: language === 'bn' ? 'সেটিংস' : 'Settings', path: '/dashboard/settings', icon: Settings },
    { num: '17', label: language === 'bn' ? 'সাপোর্ট' : 'Support', path: '/dashboard/messages', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 justify-between transition-colors">
      <div className="space-y-1">
        {/* Verification Status Banner Mini */}
        {currentUser && currentUser.verificationStatus !== 'approved' && (
          <button
            onClick={() => onNavigate('/dashboard/verification')}
            className="w-full mb-3 p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-left transition-all hover:scale-[1.02] group shadow-xs"
          >
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{language === 'bn' ? 'অ্যাকাউন্ট ভেরিফাই করুন' : 'Verify Account (৳15)'}</span>
            </div>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5 group-hover:underline">
              {language === 'bn' ? 'আনলক করুন সব সুযোগ' : 'Click to submit TrxID'}
            </p>
          </button>
        )}

        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath === item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.num}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : item.highlight
                  ? 'text-blue-700 dark:text-blue-300 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                  : item.isMaya
                  ? 'text-purple-700 dark:text-purple-300 bg-purple-50/60 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-white'
                      : item.highlight
                      ? 'text-blue-600 dark:text-blue-400'
                      : item.isMaya
                      ? 'text-purple-500'
                      : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.newBadge && (
                  <span className="px-1.5 py-0.2 rounded-md bg-blue-600 text-white text-[9px] font-bold uppercase">
                    New
                  </span>
                )}
                {item.badge !== undefined && (
                  <span
                    className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white text-blue-600' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <span
                  className={`text-[10px] font-mono font-bold ${
                    isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {item.num}
                </span>
              </div>
            </button>
          );
        })}

        {/* 18 Logout Button */}
        <button
          onClick={() => {
            logout();
            onNavigate('/login');
          }}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-rose-400">18</span>
        </button>
      </div>

      {/* Bottom Maya AI Assistant Mini Card (Matching Image 2 Bottom Left) */}
      <div className="pt-4 space-y-3">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-950 text-white shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1 rounded-lg bg-white/20">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold tracking-tight">Maya AI Assistant</span>
          </div>
          <p className="text-[10px] text-blue-100/90 leading-tight">
            {language === 'bn'
              ? 'আপনার স্মার্ট সহকারী। যেকোনো প্রশ্ন করুন, সারা ২৪/৭ সহায়তা পাবেন।'
              : 'Your smart freelance assistant. Available 24/7 for instant guidance.'}
          </p>
          <button
            onClick={() => onNavigate('/dashboard/maya')}
            className="mt-2.5 w-full py-1.5 px-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-[10px] font-bold text-center transition-all block"
          >
            {language === 'bn' ? 'Maya এর সাথে চ্যাট করুন' : 'Chat with Maya'}
          </button>
        </div>
      </div>
    </aside>
  );
};
