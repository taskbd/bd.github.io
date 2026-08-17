import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';
import {
  Bell,
  Search,
  Moon,
  Sun,
  Globe,
  Wallet as WalletIcon,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Mail,
  ChevronDown,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenEmailCenter: () => void;
  onToggleShortcuts: () => void;
  currentPath: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenSearch,
  onOpenEmailCenter,
  onToggleShortcuts,
  currentPath,
}) => {
  const { currentUser, logout, isAdminLoggedIn } = useAuth();
  const { userWallet, userNotifications, unreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } =
    useData();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title (One line) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(currentUser ? '/dashboard' : '/')}
            className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-0.5"
          >
            <Logo size="md" />
          </button>

          {/* Quick Search Button (Desktop) */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 rounded-full transition-colors w-56 justify-between ml-4"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'অনুসন্ধান...' : 'Search...'}</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, max 5) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('/dashboard/jobs')}
            className={`whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
              currentPath === '/dashboard/jobs' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
            }`}
          >
            {t('jobs')}
          </button>

          <button
            onClick={() => onNavigate('/dashboard/services')}
            className={`whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
              currentPath === '/dashboard/services' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
            }`}
          >
            {t('services')}
          </button>

          <button
            onClick={() => onNavigate('/dashboard/workspace')}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold hover:bg-blue-100 transition-colors ${
              currentPath.startsWith('/dashboard/workspace') ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{t('workspace')}</span>
          </button>

          <button
            onClick={() => onNavigate('/dashboard/wallet')}
            className={`whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
              currentPath === '/dashboard/wallet' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
            }`}
          >
            {t('wallet')}
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Wallet Pill, Email Center, Notifs, Theme, Language, Profile) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher Toggle */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Switch Language (English / বাংলা)"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{language === 'bn' ? 'বাং' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Transactional Email Center Inspector Button */}
          <button
            onClick={onOpenEmailCenter}
            className="relative p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Email Center (Simulated Inbox Logs)"
          >
            <Mail className="w-4 h-4" />
          </button>

          {/* Notification Center Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-fadeIn">
                <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Notifications</h4>
                    {unreadNotificationCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        {unreadNotificationCount} New
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {userNotifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">No notifications yet.</div>
                  ) : (
                    userNotifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.link) onNavigate(n.link);
                          setShowNotifications(false);
                        }}
                        className={`p-3.5 cursor-pointer transition-colors ${
                          !n.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{n.createdAt.split(' ')[1]}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
                  <button
                    onClick={() => {
                      onNavigate('/dashboard/notifications');
                      setShowNotifications(false);
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Wallet Balance Pill */}
          {currentUser && (
            <button
              onClick={() => onNavigate('/dashboard/wallet')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-2xs hover:bg-emerald-100 transition-colors"
            >
              <WalletIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono">৳{userWallet.availableBalance.toLocaleString()}</span>
            </button>
          )}

          {/* User Profile Avatar & Menu */}
          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn text-xs">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{currentUser.name}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{currentUser.id}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      {currentUser.verificationStatus === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                          <ShieldAlert className="w-3 h-3" /> Unverified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('/dashboard/profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>{t('profile')}</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('/dashboard/workspace');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{t('workspace')}</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('/dashboard/invoices');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                    >
                      <WalletIcon className="w-4 h-4 text-slate-400" />
                      <span>{t('invoices')}</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('/admin/login');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{t('adminPanel')}</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                        onNavigate('/login');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('/register')}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
