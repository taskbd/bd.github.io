import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    wallet: 'Wallet',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    jobs: 'Jobs',
    services: 'Services',
    workspace: 'My Workspace',
    orders: 'Orders',
    receivedOrders: 'Received Orders',
    applications: 'Applications',
    transactions: 'Transactions',
    invoices: 'Invoices',
    messages: 'Messages',
    notifications: 'Notifications',
    referrals: 'Referrals',
    maya: 'Maya AI',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    home: 'Home',
    adminPanel: 'Admin Panel',

    // Dashboard Overview
    welcomeBack: 'Welcome Back',
    userId: 'User ID',
    verified: 'Verified',
    unverified: 'Unverified',
    availableBalance: 'Available Balance',
    pendingBalance: 'Pending Balance',
    withdrawableBalance: 'Withdrawable Balance',
    totalEarned: 'Total Earned',
    totalDeposited: 'Total Deposited',
    totalWithdrawn: 'Total Withdrawn',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    noRecentActivity: 'No recent activity found',
    verifyAccountNow: 'Verify Account Now',
    verificationRequired: 'Account Verification Required',
    verificationPrompt: 'Verify your account for ৳15 to unlock withdrawals, service orders, and job posting.',
    
    // Workspace
    publishService: 'Publish Service',
    publishJob: 'Publish Job',
    myServices: 'My Services',
    myJobs: 'My Jobs',
    earnings: 'Earnings',
    escrow: 'Escrow Protection',
    disputes: 'Disputes',
    publishingStatus: 'Publishing Status',
    activatePublishing: 'Activate Publishing Access',

    // Financial & Wallet
    paymentMethod: 'Payment Method',
    accountNumber: 'Account Number',
    transactionId: 'Transaction ID (TrxID)',
    amount: 'Amount',
    fee: 'Fee',
    netPayout: 'Net Payout',
    submit: 'Submit',
    cancel: 'Cancel',
    confirm: 'Confirm',
    status: 'Status',
    date: 'Date',
    reference: 'Reference',
    all: 'All',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',

    // Search & Actions
    searchPlaceholder: 'Search jobs, services, orders...',
    viewDetails: 'View Details',
    applyNow: 'Apply Now',
    orderNow: 'Order Now',
    send: 'Send',
    saveChanges: 'Save Changes',
  },
  bn: {
    // Navigation
    dashboard: 'ড্যাশবোর্ড',
    wallet: 'ওয়ালেট',
    deposit: 'ডিপোজিট',
    withdraw: 'উইথড্র',
    jobs: 'জব মার্কেটপ্লেস',
    services: 'সার্ভিসসমূহ',
    workspace: 'মাই ওয়ার্কস্পেস',
    orders: 'আমার অর্ডার',
    receivedOrders: 'রিসিভড অর্ডার',
    applications: 'আবেদনসমূহ',
    transactions: 'লেনদেন হিস্ট্রি',
    invoices: 'ইনভয়েস',
    messages: 'মেসেজ',
    notifications: 'নোটিফিকেশন',
    referrals: 'রেফারেল ও রিওয়ার্ড',
    maya: 'মায়া এআই',
    profile: 'প্রোফাইল',
    settings: 'সেটিংস',
    logout: 'লগআউট',
    home: 'হোম',
    adminPanel: 'অ্যাডমিন প্যানেল',

    // Dashboard Overview
    welcomeBack: 'স্বাগতম',
    userId: 'ইউজার আইডি',
    verified: 'ভেরিফাইড',
    unverified: 'আনভেরিফাইড',
    availableBalance: 'উপলব্ধ ব্যালেন্স',
    pendingBalance: 'পেন্ডিং ব্যালেন্স',
    withdrawableBalance: 'উত্তোলনযোগ্য ব্যালেন্স',
    totalEarned: 'মোট আয়',
    totalDeposited: 'মোট জমা',
    totalWithdrawn: 'মোট উত্তোলন',
    quickActions: 'কুইক অ্যাকশন',
    recentActivity: 'সাম্প্রতিক কার্যক্রম',
    noRecentActivity: 'কোনো সাম্প্রতিক কার্যক্রম পাওয়া যায়নি',
    verifyAccountNow: 'অ্যাকাউন্ট ভেরিফাই করুন',
    verificationRequired: 'অ্যাকাউন্ট ভেরিফিকেশন প্রয়োজন',
    verificationPrompt: 'সব ফিচার আনলক এবং লেনদেন নিরাপদ করতে মাত্র ৳১৫ দিয়ে অ্যাকাউন্ট ভেরিফাই করুন।',

    // Workspace
    publishService: 'সার্ভিস পাবলিশ করুন',
    publishJob: 'জব পোস্ট করুন',
    myServices: 'আমার সার্ভিসসমূহ',
    myJobs: 'আমার জবসমূহ',
    earnings: 'উপার্জন বিবরণী',
    escrow: 'এসক্রো নিরাপত্তা',
    disputes: 'বিরোধ ও সালিশ',
    publishingStatus: 'পাবলিশিং স্ট্যাটাস',
    activatePublishing: 'পাবলিশিং সুবিধা একটিভ করুন',

    // Financial & Wallet
    paymentMethod: 'পেমেন্ট মাধ্যম',
    accountNumber: 'অ্যাকাউন্ট নম্বর',
    transactionId: 'ট্রানজেকশন আইডি (TrxID)',
    amount: 'টাকার পরিমাণ',
    fee: 'ফি',
    netPayout: 'প্রাপ্য পরিমাণ',
    submit: 'সাবমিট করুন',
    cancel: 'বাতিল',
    confirm: 'নিশ্চিত করুন',
    status: 'অবস্থা',
    date: 'তারিখ',
    reference: 'রেফারেন্স',
    all: 'সকল',
    pending: 'পেন্ডিং',
    approved: 'অনুমোদিত',
    rejected: 'প্রত্যাখ্যাত',
    completed: 'সম্পন্ন',

    // Search & Actions
    searchPlaceholder: 'জব, সার্ভিস, অর্ডার খুঁজুন...',
    viewDetails: 'বিস্তারিত দেখুন',
    applyNow: 'আবেদন করুন',
    orderNow: 'অর্ডার করুন',
    send: 'পাঠান',
    saveChanges: 'পরিবর্তন সংরক্ষণ করুন',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'bn',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('taskbd_language') as Language) || 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('taskbd_language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
