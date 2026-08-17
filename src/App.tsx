import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AdminNavbar } from './components/AdminNavbar';
import { AdminSidebar } from './components/AdminSidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { InvoiceViewerModal } from './components/InvoiceViewerModal';
import { EmailNotificationModal } from './components/EmailNotificationModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { MayaAssistant } from './components/MayaAssistant';
import { Logo } from './components/Logo';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OtpVerifyPage } from './pages/OtpVerifyPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { WalletPage } from './pages/WalletPage';
import { DepositPage } from './pages/DepositPage';
import { WithdrawPage } from './pages/WithdrawPage';
import { JobsPage } from './pages/JobsPage';
import { ServicesPage } from './pages/ServicesPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { VerificationPage } from './pages/VerificationPage';
import { PublishingPage } from './pages/PublishingPage';
import { ReferralsPage } from './pages/ReferralsPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { SettingsPage } from './pages/SettingsPage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminDepositsPage } from './pages/admin/AdminDepositsPage';
import { AdminWithdrawalsPage } from './pages/admin/AdminWithdrawalsPage';
import { AdminVerificationsPage } from './pages/admin/AdminVerificationsPage';
import { AdminPublishingPage } from './pages/admin/AdminPublishingPage';
import { AdminDisputesPage } from './pages/admin/AdminDisputesPage';
import { AdminLedgerPage } from './pages/admin/AdminLedgerPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminEmailLogsPage } from './pages/admin/AdminEmailLogsPage';
import { AdminSecurityPage } from './pages/admin/AdminSecurityPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminPaymentManagementPage } from './pages/admin/AdminPaymentManagementPage';

const AppContent: React.FC = () => {
  const { currentUser, isAdminLoggedIn } = useAuth();
  const { selectedInvoice, setSelectedInvoice } = useData();

  // Navigation state (SPA routing)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname && window.location.pathname !== '/'
      ? window.location.pathname
      : '/';
  });

  // Modals state
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showEmailCenter, setShowEmailCenter] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showMayaChat, setShowMayaChat] = useState(false);

  // Sync browser url history
  const navigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPath(path);
    window.history.pushState({}, '', path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K, ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
      if (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isAdminRoute = currentPath.startsWith('/admin') && currentPath !== '/admin/login';
  const isAuthRoute =
    currentPath === '/login' ||
    currentPath === '/register' ||
    currentPath === '/forgot-password' ||
    currentPath === '/verify-otp' ||
    currentPath === '/admin/login';
  const isLandingRoute = currentPath === '/';

  // Render appropriate view
  const renderMainView = () => {
    // Admin Routes
    if (isAdminRoute) {
      if (!isAdminLoggedIn) {
        return <AdminLoginPage onNavigate={navigate} />;
      }
      if (currentPath === '/admin/dashboard' || currentPath === '/admin') {
        return <AdminOverviewPage onNavigate={navigate} />;
      }
      if (currentPath === '/admin/dashboard/deposits' || currentPath === '/admin/deposits') {
        return <AdminDepositsPage />;
      }
      if (currentPath === '/admin/dashboard/withdrawals' || currentPath === '/admin/withdrawals') {
        return <AdminWithdrawalsPage />;
      }
      if (currentPath === '/admin/dashboard/verification' || currentPath === '/admin/verifications') {
        return <AdminVerificationsPage />;
      }
      if (currentPath === '/admin/dashboard/publishing' || currentPath === '/admin/publishing') {
        return <AdminPublishingPage />;
      }
      if (currentPath === '/admin/dashboard/disputes' || currentPath === '/admin/disputes') {
        return <AdminDisputesPage />;
      }
      if (currentPath === '/admin/dashboard/finance' || currentPath === '/admin/ledger') {
        return <AdminLedgerPage />;
      }
      if (currentPath === '/admin/dashboard/users') {
        return <AdminUsersPage />;
      }
      if (currentPath === '/admin/dashboard/audit-logs' || currentPath === '/admin/emails') {
        return <AdminEmailLogsPage />;
      }
      if (currentPath === '/admin/dashboard/security') {
        return <AdminSecurityPage />;
      }
      if (
        currentPath === '/admin/dashboard/payment-methods' ||
        currentPath === '/admin/payment-methods'
      ) {
        return <AdminPaymentManagementPage />;
      }
      if (
        currentPath === '/admin/dashboard/fees' ||
        currentPath === '/admin/dashboard/settings'
      ) {
        return <AdminSettingsPage />;
      }
      return <AdminOverviewPage onNavigate={navigate} />;
    }

    // Public Auth Routes
    if (currentPath === '/login') {
      return <LoginPage onNavigate={navigate} />;
    }
    if (currentPath === '/register') {
      return <RegisterPage onNavigate={navigate} />;
    }
    if (currentPath === '/forgot-password') {
      return <ForgotPasswordPage onNavigate={navigate} />;
    }
    if (currentPath === '/verify-otp') {
      return <OtpVerifyPage onNavigate={navigate} />;
    }
    if (currentPath === '/admin/login') {
      return <AdminLoginPage onNavigate={navigate} />;
    }

    // Public Landing Page
    if (isLandingRoute) {
      return <LandingPage onNavigate={navigate} />;
    }

    // User Dashboard Routes (Guarded)
    if (!currentUser) {
      return <LoginPage onNavigate={navigate} />;
    }

    if (currentPath === '/dashboard') {
      return <DashboardOverview onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard/wallet') {
      return <WalletPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard/wallet/deposit' || currentPath === '/dashboard/deposit') {
      return <DepositPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard/wallet/withdraw' || currentPath === '/dashboard/withdraw') {
      return <WithdrawPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard/jobs' || currentPath === '/dashboard/applications') {
      return <JobsPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard/services') {
      return <ServicesPage onNavigate={navigate} />;
    }
    if (
      currentPath.startsWith('/dashboard/workspace') ||
      currentPath === '/dashboard/orders'
    ) {
      return <WorkspacePage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard/verification') {
      return <VerificationPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard/publishing') {
      return <PublishingPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard/referrals') {
      return <ReferralsPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard/messages') {
      return <MessagesPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard/notifications') {
      return <NotificationsPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard/invoices' || currentPath === '/dashboard/transactions') {
      return <InvoicesPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard/profile' || currentPath === '/dashboard/settings') {
      return <SettingsPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard/maya') {
      return (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-md">
            <h1 className="text-2xl font-bold">Maya AI Freelance Assistant</h1>
            <p className="text-xs text-emerald-100 mt-1">
              Ask Maya for gig proposals, price calculations, or bKash payment verification guidance.
            </p>
          </div>
          <MayaAssistant standalone />
        </div>
      );
    }

    // Default Fallback
    return <DashboardOverview onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      {isAdminRoute ? (
        <AdminNavbar onNavigate={navigate} onOpenEmailCenter={() => setShowEmailCenter(true)} />
      ) : !isAuthRoute ? (
        <Navbar
          onNavigate={navigate}
          onOpenSearch={() => setShowSearchModal(true)}
          onOpenEmailCenter={() => setShowEmailCenter(true)}
          onToggleShortcuts={() => setShowShortcuts(true)}
          currentPath={currentPath}
        />
      ) : null}

      {/* Main Content Layout */}
      <div className="flex-1 flex w-full">
        {/* User Sidebar */}
        {!isAdminRoute && !isAuthRoute && !isLandingRoute && (
          <Sidebar currentPath={currentPath} onNavigate={navigate} />
        )}

        {/* Admin Sidebar */}
        {isAdminRoute && isAdminLoggedIn && (
          <AdminSidebar currentPath={currentPath} onNavigate={navigate} />
        )}

        {/* Content View Container */}
        <main
          className={`flex-1 min-w-0 ${
            isLandingRoute || isAuthRoute
              ? ''
              : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8'
          }`}
        >
          {renderMainView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (for users on handheld screens) */}
      {!isAdminRoute && !isAuthRoute && !isLandingRoute && (
        <MobileBottomNav currentPath={currentPath} onNavigate={navigate} />
      )}

      {/* Floating Maya Assistant Widget for Quick Help */}
      {!isAdminRoute && !isAuthRoute && currentPath !== '/dashboard/maya' && (
        <MayaAssistant
          isOpen={showMayaChat}
          onToggle={() => setShowMayaChat(!showMayaChat)}
        />
      )}

      {/* Global Invoices Viewer Modal */}
      {selectedInvoice && (
        <InvoiceViewerModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* Simulated Email Center Notification Modal */}
      {showEmailCenter && (
        <EmailNotificationModal
          onClose={() => setShowEmailCenter(false)}
          onNavigate={navigate}
        />
      )}

      {/* Global Search Modal (Cmd+K) */}
      {showSearchModal && (
        <GlobalSearchModal
          onClose={() => setShowSearchModal(false)}
          onNavigate={navigate}
        />
      )}

      {/* Keyboard Shortcuts Modal (?) */}
      {showShortcuts && (
        <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
