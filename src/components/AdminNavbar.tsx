import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';
import { ShieldCheck, Moon, Sun, Globe, LogOut, ArrowLeft, Mail } from 'lucide-react';

interface AdminNavbarProps {
  onNavigate: (path: string) => void;
  onOpenEmailCenter: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ onNavigate, onOpenEmailCenter }) => {
  const { adminUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand & Admin Badge */}
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('/admin/dashboard')} className="flex items-center gap-2">
            <Logo size="md" />
          </button>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-red-950/80 border border-red-800 text-red-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Super Admin Portal
          </span>
        </div>

        {/* Admin Top Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to User Site */}
          <button
            onClick={() => onNavigate('/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Switch to User Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">User Site</span>
          </button>

          {/* Email Center */}
          <button
            onClick={onOpenEmailCenter}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Email Center Logs"
          >
            <Mail className="w-4 h-4" />
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 inline mr-1 text-blue-400" />
            <span>{language === 'bn' ? 'বাং' : 'EN'}</span>
          </button>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Admin User info */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-tight">{adminUser?.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">task.b.d.mail@gmail.com</p>
            </div>
            <button
              onClick={() => {
                logout();
                onNavigate('/admin/login');
              }}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors"
              title="Admin Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
