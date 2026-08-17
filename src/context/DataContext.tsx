import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Wallet,
  Transaction,
  LedgerEntry,
  DepositRequest,
  WithdrawalRequest,
  VerificationRequest,
  PublishingRequest,
  Job,
  JobApplication,
  Service,
  ServiceOrder,
  Dispute,
  Invoice,
  NotificationItem,
  EmailLog,
  AuditLog,
  SecurityEvent,
  PaymentMethodConfig,
  FeeSettings,
  Conversation,
  ChatMessage,
  User,
} from '../types';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface DataContextType {
  // Data lists
  wallets: Record<string, Wallet>;
  transactions: Transaction[];
  ledger: LedgerEntry[];
  depositRequests: DepositRequest[];
  withdrawalRequests: WithdrawalRequest[];
  verificationRequests: VerificationRequest[];
  publishingRequests: PublishingRequest[];
  jobs: Job[];
  jobApplications: JobApplication[];
  services: Service[];
  orders: ServiceOrder[];
  disputes: Dispute[];
  invoices: Invoice[];
  notifications: NotificationItem[];
  emailLogs: EmailLog[];
  auditLogs: AuditLog[];
  securityEvents: SecurityEvent[];
  paymentMethods: PaymentMethodConfig[];
  feeSettings: FeeSettings;
  conversations: Conversation[];
  chatMessages: Record<string, ChatMessage[]>;

  // Current User Helpers
  userWallet: Wallet;
  userTransactions: Transaction[];
  userNotifications: NotificationItem[];
  userOrders: ServiceOrder[];
  userReceivedOrders: ServiceOrder[];
  userJobs: Job[];
  userServices: Service[];
  userApplications: JobApplication[];
  userInvoices: Invoice[];
  unreadNotificationCount: number;

  // Actions
  submitVerificationRequest: (method: 'bKash' | 'Nagad' | 'Rocket', senderNumber: string, trxId: string) => Promise<{ success: boolean; message: string }>;
  adminApproveVerification: (requestId: string) => void;
  adminRejectVerification: (requestId: string, reason: string) => void;

  submitPublishingRequest: (method: 'bKash' | 'Nagad' | 'Rocket', senderNumber: string, trxId: string) => Promise<{ success: boolean; message: string }>;
  adminApprovePublishing: (requestId: string) => void;
  adminRejectPublishing: (requestId: string, reason: string) => void;

  submitDeposit: (amount: number, method: 'bKash' | 'Nagad' | 'Rocket', senderNumber: string, trxId: string) => Promise<{ success: boolean; message: string }>;
  adminApproveDeposit: (depositId: string) => void;
  adminRejectDeposit: (depositId: string, reason: string) => void;

  submitWithdrawal: (amount: number, method: 'bKash' | 'Nagad' | 'Rocket', accountNumber: string) => Promise<{ success: boolean; message: string }>;
  adminApproveWithdrawal: (withdrawalId: string) => void;
  adminRejectWithdrawal: (withdrawalId: string, reason: string) => void;

  createJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'applicationsCount' | 'status' | 'publisherId' | 'publisherName' | 'publisherVerified'>) => Promise<{ success: boolean; message: string; job?: Job }>;
  applyForJob: (jobId: string, proposal: string, days: number, exp: string) => Promise<{ success: boolean; message: string }>;
  selectJobWorker: (jobId: string, applicationId: string) => void;
  submitJobWork: (jobId: string, message: string, linksOrFiles: string) => Promise<{ success: boolean; message: string }>;
  approveJobWorkAndPayout: (jobId: string) => void;

  createService: (serviceData: Omit<Service, 'id' | 'createdAt' | 'ordersCount' | 'reviewsCount' | 'providerRating' | 'providerId' | 'providerName' | 'status'>) => Promise<{ success: boolean; message: string; service?: Service }>;
  toggleServiceStatus: (serviceId: string, status: 'active' | 'paused') => void;
  createServiceOrder: (serviceId: string, requirements: string) => Promise<{ success: boolean; message: string; orderId?: string }>;
  updateOrderProgress: (orderId: string, percentage: number, note?: string) => Promise<{ success: boolean; message: string }>;
  toggleOrderMilestone: (orderId: string, milestoneId: string) => Promise<{ success: boolean; message: string }>;
  deliverServiceOrder: (orderId: string, message: string, attachment?: string) => Promise<{ success: boolean; message: string }>;
  buyerApproveOrder: (orderId: string, rating?: number, review?: string) => Promise<{ success: boolean; message: string }>;
  openDispute: (orderId: string, reason: string, description: string) => Promise<{ success: boolean; message: string }>;
  adminResolveDispute: (disputeId: string, resolution: 'buyer' | 'seller', notes: string) => void;

  sendChatMessage: (conversationId: string, message: string, attachment?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  updatePaymentMethods: (methods: PaymentMethodConfig[]) => void;
  updateFeeSettings: (fees: FeeSettings) => void;
  adminToggleUserSuspension: (userId: string) => void;

  // Selected state for modals
  selectedInvoice: Invoice | null;
  setSelectedInvoice: (inv: Invoice | null) => void;
  selectedEmail: EmailLog | null;
  setSelectedEmail: (email: EmailLog | null) => void;
}

const DEFAULT_FEE_SETTINGS: FeeSettings = {
  accountVerificationFee: 15,
  publishingActivationFee: 50,
  withdrawalFeePercentage: 2,
  serviceCommissionPercentage: 10,
  jobCommissionPercentage: 5,
  referralRewardAmount: 10,
  minDepositAmount: 50,
  minWithdrawalAmount: 100,
};

const DEFAULT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'pm-1',
    method: 'bKash',
    number: '01890-349182',
    accountType: 'Merchant',
    accountName: 'TaskBD Official',
    instructions: 'Go to bKash App > Send Money / Make Payment > Enter Number > Enter Amount > Use Reference "TBD" > Copy TrxID.',
    isActive: true,
  },
  {
    id: 'pm-2',
    method: 'Nagad',
    number: '01711-849201',
    accountType: 'Personal',
    accountName: 'TaskBD Official Account',
    instructions: 'Go to Nagad App > Send Money > Enter Number > Enter Amount > Copy TrxID.',
    isActive: true,
  },
  {
    id: 'pm-3',
    method: 'Rocket',
    number: '01920-771920-4',
    accountType: 'Personal',
    accountName: 'TaskBD Finance',
    instructions: 'Go to Rocket App > Send Money > Enter 12-digit Number > Enter Amount > Copy TrxID.',
    isActive: true,
  },
];

const INITIAL_SERVICES: Service[] = [
  {
    id: 'SRV-101',
    title: 'Modern Responsive React & Tailwind Website Development',
    category: 'Web Development',
    price: 4500,
    deliveryDays: 3,
    providerId: 'TBD-99182',
    providerName: 'Rafiqul Islam',
    providerRating: 4.9,
    reviewsCount: 34,
    ordersCount: 48,
    description: 'I will design and build a high-converting, fully mobile-responsive website using Next.js / React with clean code, lightning fast loading speed, and modern aesthetics.',
    requirements: 'Please provide your project wireframe, required pages list, branding color preferences, and text copy.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-08-01',
    faqs: [
      { question: 'Do you provide source code?', answer: 'Yes, full clean source code with documentation is provided upon delivery.' },
      { question: 'Is mobile responsiveness guaranteed?', answer: '100% responsive across mobile, tablet, laptop, and ultra-wide screens.' },
    ],
  },
  {
    id: 'SRV-102',
    title: 'Professional Brand Identity, 3D Logo Design & Vector Kit',
    category: 'Graphic Design',
    price: 1800,
    deliveryDays: 2,
    providerId: 'TBD-33910',
    providerName: 'Nusrat Jahan',
    providerRating: 5.0,
    reviewsCount: 52,
    ordersCount: 89,
    description: 'High-end corporate logo and brand guideline kit with AI, EPS, SVG, PNG transparent, and 3D mockup renders.',
    requirements: 'Company name, slogan, target audience, and preferred visual style.',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-08-05',
  },
  {
    id: 'SRV-103',
    title: 'YouTube & Social Media 4K Video Editing & Color Grading',
    category: 'Video Editing',
    price: 2500,
    deliveryDays: 2,
    providerId: 'TBD-88412',
    providerName: 'Shakib Al Hasan',
    providerRating: 4.8,
    reviewsCount: 19,
    ordersCount: 27,
    description: 'Dynamic pacing, animated captions, sound effects, B-roll selection, motion graphics, and audio mastering in Premiere Pro.',
    requirements: 'Raw footage Google Drive link and video outline or script.',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-08-08',
  },
  {
    id: 'SRV-104',
    title: 'SEO Friendly Bengali & English Content & Article Writing',
    category: 'Content Writing',
    price: 800,
    deliveryDays: 1,
    providerId: 'TBD-55190',
    providerName: 'Farhana Akhter',
    providerRating: 4.9,
    reviewsCount: 41,
    ordersCount: 65,
    description: '100% human-written, engaging, plagiarism-free 1000+ words article optimized with target keywords and schema structure.',
    requirements: 'Topic, target keywords, tone of voice, and word count target.',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-08-11',
  },
];

const INITIAL_JOBS: Job[] = [
  {
    id: 'JOB-901',
    title: 'Need 50 App Testers for Android E-Commerce App Feedback',
    category: 'Microtasks',
    budget: 350,
    deadline: '2026-08-25',
    publisherId: 'TBD-11092',
    publisherName: 'ShopBD Tech',
    publisherVerified: true,
    description: 'Install APK from Play Store, test checkout flow with test account, submit 3 screenshots of order success screen with your honest feedback.',
    requirements: ['Android 10+ device', 'Submit screenshot of profile and order confirmation', 'Must not delete app within 3 days'],
    status: 'active',
    createdAt: '2026-08-15',
    applicationsCount: 18,
  },
  {
    id: 'JOB-902',
    title: 'Bangladesh University Student Data Entry & Excel Formatting',
    category: 'Data Entry',
    budget: 1200,
    deadline: '2026-08-28',
    publisherId: 'TBD-44810',
    publisherName: 'Academic Research BD',
    publisherVerified: true,
    description: 'Extract and clean 400 survey response entries into structured Excel columns with verified phone formatting.',
    requirements: ['Proficiency in Excel / Google Sheets', 'Zero typo errors', 'Submit within 48 hours'],
    status: 'active',
    createdAt: '2026-08-14',
    applicationsCount: 9,
  },
  {
    id: 'JOB-903',
    title: 'Create 10 Promotional Instagram Reels with Voiceover',
    category: 'Video & Animation',
    budget: 3000,
    deadline: '2026-08-30',
    publisherId: 'TBD-77201',
    publisherName: 'Dhaka Trends',
    publisherVerified: true,
    description: 'Create 10 short 9:16 reels for fashion brand with engaging hook, trending audio, and subtitles in Bangla.',
    requirements: ['Sample portfolio of past reels', 'Deliver in 1080x1920 MP4 format'],
    status: 'active',
    createdAt: '2026-08-16',
    applicationsCount: 14,
  },
];

const DataContext = createContext<DataContextType>({} as DataContextType);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateCurrentUserProfile } = useAuth();

  // State initialization with localStorage fallback
  const [wallets, setWallets] = useState<Record<string, Wallet>>(() => {
    const saved = localStorage.getItem('taskbd_wallets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      'TBD-78241': {
        userId: 'TBD-78241',
        availableBalance: 1250,
        pendingBalance: 0,
        withdrawableBalance: 1250,
        totalEarned: 2450,
        totalDeposited: 3000,
        totalWithdrawn: 1200,
      },
    };
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('taskbd_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'TXN-904128',
        userId: 'TBD-78241',
        userName: 'Tanvir Hossain',
        userEmail: 'tanvir.dev@gmail.com',
        type: 'deposit',
        amount: 2000,
        status: 'approved',
        reference: 'DEP-88419',
        method: 'bKash',
        accountNumber: '01712-345678',
        trxId: 'BK89X20194',
        date: '2026-08-12 14:30',
        description: 'bKash Deposit Approved',
        invoiceId: 'INV-2026-00109',
      },
      {
        id: 'TXN-904129',
        userId: 'TBD-78241',
        userName: 'Tanvir Hossain',
        userEmail: 'tanvir.dev@gmail.com',
        type: 'withdrawal',
        amount: 1000,
        fee: 20,
        status: 'completed',
        reference: 'WTH-33910',
        method: 'Nagad',
        accountNumber: '01890-112233',
        date: '2026-08-14 11:20',
        description: 'Nagad Payout Completed',
        invoiceId: 'INV-2026-00142',
      },
    ];
  });

  const [ledger, setLedger] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem('taskbd_ledger');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'LED-001',
        actor: 'Admin',
        actorType: 'admin',
        reference: 'DEP-88419',
        type: 'deposit',
        previousBalance: 0,
        amount: 2000,
        newBalance: 2000,
        reason: 'Deposit bKash approval for TBD-78241',
        timestamp: '2026-08-12 14:30:00',
      },
      {
        id: 'LED-002',
        actor: 'System',
        actorType: 'system',
        reference: 'WTH-33910',
        type: 'withdrawal',
        previousBalance: 2000,
        amount: -1000,
        newBalance: 1000,
        reason: 'Withdrawal processing to Nagad',
        timestamp: '2026-08-14 11:20:00',
      },
    ];
  });

  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>(() => {
    const saved = localStorage.getItem('taskbd_deposits');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'DEP-88419',
        userId: 'TBD-78241',
        userName: 'Tanvir Hossain',
        userEmail: 'tanvir.dev@gmail.com',
        amount: 2000,
        paymentMethod: 'bKash',
        senderNumber: '01712-345678',
        trxId: 'BK89X20194',
        status: 'approved',
        submittedAt: '2026-08-12 14:25',
        reviewedAt: '2026-08-12 14:30',
      },
    ];
  });

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('taskbd_withdrawals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'WTH-33910',
        userId: 'TBD-78241',
        userName: 'Tanvir Hossain',
        userEmail: 'tanvir.dev@gmail.com',
        amount: 1000,
        fee: 20,
        netAmount: 980,
        paymentMethod: 'Nagad',
        accountNumber: '01890-112233',
        status: 'completed',
        submittedAt: '2026-08-14 11:15',
        processedAt: '2026-08-14 11:20',
      },
    ];
  });

  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(() => {
    const saved = localStorage.getItem('taskbd_verifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [publishingRequests, setPublishingRequests] = useState<PublishingRequest[]>(() => {
    const saved = localStorage.getItem('taskbd_publishing_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('taskbd_jobs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_JOBS;
  });

  const [jobApplications, setJobApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('taskbd_job_applications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('taskbd_services');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_SERVICES;
  });

  const [orders, setOrders] = useState<ServiceOrder[]>(() => {
    const saved = localStorage.getItem('taskbd_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'ORD-55410',
        serviceId: 'SRV-102',
        serviceTitle: 'Professional Brand Identity, 3D Logo Design & Vector Kit',
        buyerId: 'TBD-78241',
        buyerName: 'Tanvir Hossain',
        sellerId: 'TBD-33910',
        sellerName: 'Nusrat Jahan',
        amount: 1800,
        platformFee: 180,
        sellerEarning: 1620,
        escrowAmount: 1800,
        escrowStatus: 'secured',
        status: 'in_progress',
        orderDate: '2026-08-16 10:15',
        deadline: '2026-08-18 10:15',
        buyerRequirementsText: 'Need a tech company logo named NexaPulse with modern blue & cyan gradient.',
        progressPercentage: 45,
        progressNotes: 'Initial 3D mockup variations rendered; finalizing typography and palette options.',
        progressUpdatedAt: '2026-08-16 18:30',
        milestones: [
          { id: 'm1', title: 'Requirements Brief & Brand Moodboard', completed: true, completedAt: '2026-08-16 12:00' },
          { id: 'm2', title: 'Draft Logo Concept & Typography', completed: true, completedAt: '2026-08-16 18:30' },
          { id: 'm3', title: '3D Render Variations & Color Palette', completed: false },
          { id: 'm4', title: 'Vector Asset Packages (SVG, PNG, AI)', completed: false },
          { id: 'm5', title: 'Final Deliverables Packaging & QA', completed: false },
        ],
      },
      {
        id: 'ORD-66291',
        serviceId: 'SRV-101',
        serviceTitle: 'Full-Stack Responsive Web Application Development in React & Node.js',
        buyerId: 'TBD-44102',
        buyerName: 'Rahim Ahmed',
        sellerId: 'TBD-78241',
        sellerName: 'Tanvir Hossain',
        amount: 4500,
        platformFee: 450,
        sellerEarning: 4050,
        escrowAmount: 4500,
        escrowStatus: 'secured',
        status: 'in_progress',
        orderDate: '2026-08-15 14:00',
        deadline: '2026-08-19 20:00',
        buyerRequirementsText: 'Develop customer portal dashboard with responsive charts, dark mode, and bKash webhook integration.',
        progressPercentage: 65,
        progressNotes: 'Core dashboard layout, authentication flow, and dynamic chart widgets completed. Working on API connection.',
        progressUpdatedAt: '2026-08-17 09:20',
        milestones: [
          { id: 'm1', title: 'Architecture Setup & UI Wireframes', completed: true, completedAt: '2026-08-15 17:00' },
          { id: 'm2', title: 'Authentication & Profile Dashboard', completed: true, completedAt: '2026-08-16 14:30' },
          { id: 'm3', title: 'Responsive Charts & Dark Mode Themes', completed: true, completedAt: '2026-08-17 09:20' },
          { id: 'm4', title: 'API Integration & bKash Webhook Testing', completed: false },
          { id: 'm5', title: 'Production Build & Live Demo Handover', completed: false },
        ],
      },
    ];
  });

  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    const saved = localStorage.getItem('taskbd_disputes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('taskbd_invoices');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'INV-2026-00109',
        date: '2026-08-12',
        userId: 'TBD-78241',
        userName: 'Tanvir Hossain',
        userEmail: 'tanvir.dev@gmail.com',
        serviceOrItemTitle: 'Wallet Deposit via bKash',
        type: 'Deposit',
        amount: 2000,
        fee: 0,
        subtotal: 2000,
        total: 2000,
        paymentMethod: 'bKash (Merchant)',
        trxRef: 'BK89X20194',
        status: 'paid',
      },
      {
        id: 'INV-2026-00142',
        date: '2026-08-14',
        userId: 'TBD-78241',
        userName: 'Tanvir Hossain',
        userEmail: 'tanvir.dev@gmail.com',
        serviceOrItemTitle: 'Wallet Payout via Nagad',
        type: 'Withdrawal',
        amount: 1000,
        fee: 20,
        subtotal: 980,
        total: 980,
        paymentMethod: 'Nagad Payout',
        trxRef: 'WTH-33910',
        status: 'paid',
      },
    ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('taskbd_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'NOTIF-01',
        userId: 'TBD-78241',
        type: 'deposit',
        title: 'Deposit Approved',
        message: 'Your deposit of ৳2,000 via bKash was verified and added to your wallet balance.',
        referenceId: 'DEP-88419',
        isRead: false,
        createdAt: '2026-08-12 14:30',
        link: '/dashboard/wallet',
      },
      {
        id: 'NOTIF-02',
        userId: 'TBD-78241',
        type: 'order',
        title: 'Order Started',
        message: 'Your order #ORD-55410 for Brand Logo Design is now In Progress by Nusrat Jahan.',
        referenceId: 'ORD-55410',
        isRead: false,
        createdAt: '2026-08-16 10:15',
        link: '/dashboard/workspace/orders',
      },
    ];
  });

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    const saved = localStorage.getItem('taskbd_email_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'EML-9901',
        from: 'TaskBD Finance <finance@taskbd.com>',
        to: 'tanvir.dev@gmail.com',
        recipientName: 'Tanvir Hossain',
        recipientUserId: 'TBD-78241',
        subject: 'Receipt: Your Deposit of ৳2,000 is Confirmed',
        event: 'Deposit Approved',
        referenceId: 'DEP-88419',
        amount: '৳2,000',
        status: 'Delivered',
        bodyPreview: 'Your deposit of ৳2,000 via bKash (TrxID: BK89X20194) has been verified. Invoice #INV-2026-00109 has been generated.',
        sentAt: '2026-08-12 14:30:10',
      },
      {
        id: 'EML-9902',
        from: 'TaskBD Escrow System <escrow@taskbd.com>',
        to: 'tanvir.dev@gmail.com',
        recipientName: 'Tanvir Hossain',
        recipientUserId: 'TBD-78241',
        subject: 'Escrow Secured: Order #ORD-55410',
        event: 'Order Escrow Locked',
        referenceId: 'ORD-55410',
        amount: '৳1,800',
        status: 'Delivered',
        bodyPreview: 'Your payment of ৳1,800 is safely held in TaskBD Escrow. Payout will only be released after you inspect and approve work.',
        sentAt: '2026-08-16 10:15:30',
      },
    ];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('taskbd_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'AUD-1001',
        actor: 'task.b.d.mail@gmail.com',
        actorType: 'admin',
        action: 'Approve Deposit',
        target: 'TBD-78241',
        amount: 2000,
        referenceId: 'DEP-88419',
        timestamp: '2026-08-12 14:30:00',
        ipAddress: '103.112.54.21',
      },
    ];
  });

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(() => {
    const saved = localStorage.getItem('taskbd_security_events');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'SEC-01',
        type: 'login_attempt',
        email: 'task.b.d.mail@gmail.com',
        status: 'success',
        ip: '103.112.54.21',
        location: 'Dhaka, Bangladesh',
        timestamp: '2026-08-16 09:30:00',
        details: 'Admin authenticated with password and 2FA OTP',
      },
    ];
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(() => {
    const saved = localStorage.getItem('taskbd_payment_methods');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_PAYMENT_METHODS;
  });

  const [feeSettings, setFeeSettings] = useState<FeeSettings>(() => {
    const saved = localStorage.getItem('taskbd_fee_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_FEE_SETTINGS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('taskbd_conversations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'CONV-101',
        participants: [
          { id: 'TBD-78241', name: 'Tanvir Hossain' },
          { id: 'TBD-33910', name: 'Nusrat Jahan' },
        ],
        orderId: 'ORD-55410',
        lastMessage: 'I have started drafting the vector art for your logo concept!',
        lastMessageTime: '2026-08-16 11:30',
        unreadCount: 0,
      },
    ];
  });

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('taskbd_chat_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      'CONV-101': [
        {
          id: 'MSG-1',
          conversationId: 'CONV-101',
          senderId: 'TBD-78241',
          senderName: 'Tanvir Hossain',
          senderRole: 'user',
          message: 'Hi Nusrat, just placed the order! Please take a look at the requirements.',
          timestamp: '2026-08-16 10:20',
          isRead: true,
        },
        {
          id: 'MSG-2',
          conversationId: 'CONV-101',
          senderId: 'TBD-33910',
          senderName: 'Nusrat Jahan',
          senderRole: 'user',
          message: 'Hello Tanvir! Thank you for the order. I have started drafting the vector art for your logo concept!',
          timestamp: '2026-08-16 11:30',
          isRead: true,
        },
      ],
    };
  });

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);

  // Persistence effects
  useEffect(() => { localStorage.setItem('taskbd_wallets', JSON.stringify(wallets)); }, [wallets]);
  useEffect(() => { localStorage.setItem('taskbd_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('taskbd_ledger', JSON.stringify(ledger)); }, [ledger]);
  useEffect(() => { localStorage.setItem('taskbd_deposits', JSON.stringify(depositRequests)); }, [depositRequests]);
  useEffect(() => { localStorage.setItem('taskbd_withdrawals', JSON.stringify(withdrawalRequests)); }, [withdrawalRequests]);
  useEffect(() => { localStorage.setItem('taskbd_verifications', JSON.stringify(verificationRequests)); }, [verificationRequests]);
  useEffect(() => { localStorage.setItem('taskbd_publishing_requests', JSON.stringify(publishingRequests)); }, [publishingRequests]);
  useEffect(() => { localStorage.setItem('taskbd_jobs', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('taskbd_job_applications', JSON.stringify(jobApplications)); }, [jobApplications]);
  useEffect(() => { localStorage.setItem('taskbd_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('taskbd_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('taskbd_disputes', JSON.stringify(disputes)); }, [disputes]);
  useEffect(() => { localStorage.setItem('taskbd_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('taskbd_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('taskbd_email_logs', JSON.stringify(emailLogs)); }, [emailLogs]);
  useEffect(() => { localStorage.setItem('taskbd_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('taskbd_security_events', JSON.stringify(securityEvents)); }, [securityEvents]);
  useEffect(() => { localStorage.setItem('taskbd_payment_methods', JSON.stringify(paymentMethods)); }, [paymentMethods]);
  useEffect(() => { localStorage.setItem('taskbd_fee_settings', JSON.stringify(feeSettings)); }, [feeSettings]);
  useEffect(() => { localStorage.setItem('taskbd_conversations', JSON.stringify(conversations)); }, [conversations]);
  useEffect(() => { localStorage.setItem('taskbd_chat_messages', JSON.stringify(chatMessages)); }, [chatMessages]);

  // Current user derived getters
  const currentUserId = currentUser?.id || 'TBD-78241';

  const userWallet: Wallet = wallets[currentUserId] || {
    userId: currentUserId,
    availableBalance: 0,
    pendingBalance: 0,
    withdrawableBalance: 0,
    totalEarned: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
  };

  const userTransactions = transactions.filter((t) => t.userId === currentUserId);
  const userNotifications = notifications.filter((n) => n.userId === currentUserId || n.userId === 'ALL');
  const userOrders = orders.filter((o) => o.buyerId === currentUserId);
  const userReceivedOrders = orders.filter((o) => o.sellerId === currentUserId);
  const userJobs = jobs.filter((j) => j.publisherId === currentUserId);
  const userServices = services.filter((s) => s.providerId === currentUserId);
  const userApplications = jobApplications.filter((a) => a.applicantId === currentUserId);
  const userInvoices = invoices.filter((i) => i.userId === currentUserId);
  const unreadNotificationCount = userNotifications.filter((n) => !n.isRead).length;

  // Helper to dispatch email + notification
  const sendEmailAndNotification = (
    userId: string,
    recipientEmail: string,
    recipientName: string,
    subject: string,
    event: string,
    refId: string,
    amount: string | undefined,
    body: string,
    notifTitle: string,
    notifMessage: string,
    notifLink?: string
  ) => {
    const newEmail: EmailLog = {
      id: `EML-${Math.floor(1000 + Math.random() * 9000)}`,
      from: 'TaskBD System <no-reply@taskbd.com>',
      to: recipientEmail,
      recipientName,
      recipientUserId: userId,
      subject,
      event,
      referenceId: refId,
      amount,
      status: 'Delivered',
      bodyPreview: body,
      sentAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    const newNotification: NotificationItem = {
      id: `NOTIF-${Math.floor(10000 + Math.random() * 90000)}`,
      userId,
      type: 'payment',
      title: notifTitle,
      message: notifMessage,
      referenceId: refId,
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      link: notifLink,
    };

    setEmailLogs((prev) => [newEmail, ...prev]);
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Helper for audit logs
  const logAudit = (action: string, target: string, amount?: number, reason?: string, refId = `AUD-REF-${Date.now()}`) => {
    const entry: AuditLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      actor: 'Admin (task.b.d.mail@gmail.com)',
      actorType: 'admin',
      action,
      target,
      amount,
      reason,
      referenceId: refId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '103.112.54.21',
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // 1. Account Verification Request
  const submitVerificationRequest = async (method: 'bKash' | 'Nagad' | 'Rocket', senderNumber: string, trxId: string) => {
    if (!currentUser) return { success: false, message: 'Please login first.' };
    if (!senderNumber || !trxId) return { success: false, message: 'Sender number and TrxID are required.' };

    const reqId = `VER-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReq: VerificationRequest = {
      id: reqId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      amount: feeSettings.accountVerificationFee,
      paymentMethod: method,
      senderNumber,
      trxId,
      status: 'pending',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setVerificationRequests((prev) => [newReq, ...prev]);
    updateCurrentUserProfile({ verificationStatus: 'pending' });

    sendEmailAndNotification(
      currentUser.id,
      currentUser.email,
      currentUser.name,
      'Account Verification Submitted',
      'Verification Under Review',
      reqId,
      `৳${feeSettings.accountVerificationFee}`,
      `Your verification request (TrxID: ${trxId}) is under review by the TaskBD verification team.`,
      'Verification Submitted',
      'Your ৳15 account verification payment has been submitted for admin approval.',
      '/dashboard/verification'
    );

    return { success: true, message: 'Verification request submitted. Status: Under Review.' };
  };

  const adminApproveVerification = (requestId: string) => {
    const req = verificationRequests.find((r) => r.id === requestId);
    if (!req) return;

    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved', reviewedAt: new Date().toISOString().slice(0, 16) } : r))
    );

    if (currentUser && currentUser.id === req.userId) {
      updateCurrentUserProfile({ verificationStatus: 'approved' });
    }

    // Generate Verification Fee Invoice
    const invId = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newInvoice: Invoice = {
      id: invId,
      date: new Date().toISOString().split('T')[0],
      userId: req.userId,
      userName: req.userName,
      userEmail: req.userEmail,
      serviceOrItemTitle: 'Account Verification Fee (Verified Badge)',
      type: 'Verification',
      amount: req.amount,
      fee: 0,
      subtotal: req.amount,
      total: req.amount,
      paymentMethod: req.paymentMethod,
      trxRef: req.trxId,
      status: 'paid',
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    logAudit('Approve Verification', req.userId, req.amount, 'Account verified with blue tick badge', req.id);

    sendEmailAndNotification(
      req.userId,
      req.userEmail,
      req.userName,
      '🎉 Congratulations! Your Account is Verified',
      'Account Verified',
      req.id,
      `৳${req.amount}`,
      `Your TaskBD account has been verified successfully. Your verified badge is now active.`,
      'Account Verified!',
      'Your account verification is approved. Full marketplace features unlocked.',
      '/dashboard'
    );
  };

  const adminRejectVerification = (requestId: string, reason: string) => {
    const req = verificationRequests.find((r) => r.id === requestId);
    if (!req) return;

    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected', rejectionReason: reason } : r))
    );

    if (currentUser && currentUser.id === req.userId) {
      updateCurrentUserProfile({ verificationStatus: 'rejected', verificationRejectionReason: reason });
    }

    logAudit('Reject Verification', req.userId, req.amount, `Rejection reason: ${reason}`, req.id);

    sendEmailAndNotification(
      req.userId,
      req.userEmail,
      req.userName,
      'Account Verification Needs Attention',
      'Verification Rejected',
      req.id,
      `৳${req.amount}`,
      `Your verification request could not be approved. Reason: ${reason}. Please re-submit with accurate TrxID.`,
      'Verification Rejected',
      `Verification rejected: ${reason}`,
      '/dashboard/verification'
    );
  };

  // 2. Publishing Request
  const submitPublishingRequest = async (method: 'bKash' | 'Nagad' | 'Rocket', senderNumber: string, trxId: string) => {
    if (!currentUser) return { success: false, message: 'Please login first.' };

    const reqId = `PUB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReq: PublishingRequest = {
      id: reqId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      amount: feeSettings.publishingActivationFee,
      paymentMethod: method,
      senderNumber,
      trxId,
      status: 'pending',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setPublishingRequests((prev) => [newReq, ...prev]);
    updateCurrentUserProfile({ publishingStatus: 'pending' });

    sendEmailAndNotification(
      currentUser.id,
      currentUser.email,
      currentUser.name,
      'Publishing Activation Submitted',
      'Publishing Under Review',
      reqId,
      `৳${feeSettings.publishingActivationFee}`,
      `Your ৳50 publishing activation request has been submitted for review.`,
      'Publishing Activation Pending',
      'Publishing access will be activated once payment is confirmed.',
      '/dashboard/workspace'
    );

    return { success: true, message: 'Publishing activation request submitted.' };
  };

  const adminApprovePublishing = (requestId: string) => {
    const req = publishingRequests.find((r) => r.id === requestId);
    if (!req) return;

    setPublishingRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'active', reviewedAt: new Date().toISOString().slice(0, 16) } : r))
    );

    if (currentUser && currentUser.id === req.userId) {
      updateCurrentUserProfile({ publishingStatus: 'active' });
    }

    logAudit('Approve Publishing', req.userId, req.amount, 'Activated service/job publishing privilege', req.id);

    sendEmailAndNotification(
      req.userId,
      req.userEmail,
      req.userName,
      '🚀 Publishing Access Activated!',
      'Publishing Activated',
      req.id,
      `৳${req.amount}`,
      'You can now publish services and post microtasks in your workspace.',
      'Publishing Access Active',
      'Publishing privileges enabled in My Workspace.',
      '/dashboard/workspace'
    );
  };

  const adminRejectPublishing = (requestId: string, reason: string) => {
    const req = publishingRequests.find((r) => r.id === requestId);
    if (!req) return;

    setPublishingRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected', rejectionReason: reason } : r))
    );

    if (currentUser && currentUser.id === req.userId) {
      updateCurrentUserProfile({ publishingStatus: 'rejected', publishingRejectionReason: reason });
    }

    logAudit('Reject Publishing', req.userId, req.amount, reason, req.id);
  };

  // 3. Deposit Flow (Atomic Wallet Credit)
  const submitDeposit = async (amount: number, method: 'bKash' | 'Nagad' | 'Rocket', senderNumber: string, trxId: string) => {
    if (!currentUser) return { success: false, message: 'Please login first.' };
    if (amount < feeSettings.minDepositAmount) {
      return { success: false, message: `Minimum deposit is ৳${feeSettings.minDepositAmount}` };
    }

    const depId = `DEP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newDep: DepositRequest = {
      id: depId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      amount,
      paymentMethod: method,
      senderNumber,
      trxId,
      status: 'pending',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setDepositRequests((prev) => [newDep, ...prev]);

    // Record pending transaction
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxn: Transaction = {
      id: txnId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: 'deposit',
      amount,
      status: 'pending',
      reference: depId,
      method,
      accountNumber: senderNumber,
      trxId,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      description: `Deposit via ${method} (Under Review)`,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    sendEmailAndNotification(
      currentUser.id,
      currentUser.email,
      currentUser.name,
      `Deposit Request Received: ৳${amount}`,
      'Deposit Pending',
      depId,
      `৳${amount}`,
      `Your deposit request for ৳${amount} via ${method} (TrxID: ${trxId}) is under review.`,
      'Deposit Submitted',
      `৳${amount} deposit request submitted for admin review.`,
      '/dashboard/wallet'
    );

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    return { success: true, message: `Deposit of ৳${amount} submitted for admin verification.` };
  };

  const adminApproveDeposit = (depositId: string) => {
    const dep = depositRequests.find((d) => d.id === depositId);
    if (!dep || dep.status === 'approved') return;

    // 1. Update deposit status
    setDepositRequests((prev) =>
      prev.map((d) => (d.id === depositId ? { ...d, status: 'approved', reviewedAt: new Date().toISOString().slice(0, 16) } : d))
    );

    // 2. Atomic Wallet Credit
    setWallets((prev) => {
      const w = prev[dep.userId] || {
        userId: dep.userId,
        availableBalance: 0,
        pendingBalance: 0,
        withdrawableBalance: 0,
        totalEarned: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
      };

      const prevBal = w.availableBalance;
      const newBal = prevBal + dep.amount;

      // Add Ledger Entry
      const ledId = `LED-${Math.floor(1000 + Math.random() * 9000)}`;
      const ledgerEntry: LedgerEntry = {
        id: ledId,
        actor: 'Admin',
        actorType: 'admin',
        reference: dep.id,
        type: 'deposit',
        previousBalance: prevBal,
        amount: dep.amount,
        newBalance: newBal,
        reason: `Deposit approved via ${dep.paymentMethod} (TrxID: ${dep.trxId})`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      setLedger((l) => [ledgerEntry, ...l]);

      return {
        ...prev,
        [dep.userId]: {
          ...w,
          availableBalance: newBal,
          withdrawableBalance: w.withdrawableBalance + dep.amount,
          totalDeposited: w.totalDeposited + dep.amount,
        },
      };
    });

    // 3. Update Transaction to Approved & generate invoice
    const invId = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setTransactions((prev) =>
      prev.map((t) =>
        t.reference === depositId
          ? { ...t, status: 'approved', invoiceId: invId, description: `Deposit of ৳${dep.amount} via ${dep.paymentMethod} Approved` }
          : t
      )
    );

    const newInvoice: Invoice = {
      id: invId,
      date: new Date().toISOString().split('T')[0],
      userId: dep.userId,
      userName: dep.userName,
      userEmail: dep.userEmail,
      serviceOrItemTitle: `Wallet Deposit via ${dep.paymentMethod}`,
      type: 'Deposit',
      amount: dep.amount,
      fee: 0,
      subtotal: dep.amount,
      total: dep.amount,
      paymentMethod: dep.paymentMethod,
      trxRef: dep.trxId,
      status: 'paid',
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    logAudit('Approve Deposit', dep.userId, dep.amount, `TrxID: ${dep.trxId}`, dep.id);

    sendEmailAndNotification(
      dep.userId,
      dep.userEmail,
      dep.userName,
      `Deposit Confirmed: ৳${dep.amount} credited`,
      'Deposit Approved',
      dep.id,
      `৳${dep.amount}`,
      `Your deposit of ৳${dep.amount} via ${dep.paymentMethod} has been approved and added to your available balance.`,
      'Deposit Approved!',
      `৳${dep.amount} has been added to your wallet balance.`,
      '/dashboard/wallet'
    );
  };

  const adminRejectDeposit = (depositId: string, reason: string) => {
    const dep = depositRequests.find((d) => d.id === depositId);
    if (!dep) return;

    setDepositRequests((prev) =>
      prev.map((d) => (d.id === depositId ? { ...d, status: 'rejected', rejectionReason: reason } : d))
    );

    setTransactions((prev) =>
      prev.map((t) => (t.reference === depositId ? { ...t, status: 'rejected', description: `Deposit Rejected: ${reason}` } : t))
    );

    logAudit('Reject Deposit', dep.userId, dep.amount, reason, dep.id);

    sendEmailAndNotification(
      dep.userId,
      dep.userEmail,
      dep.userName,
      `Deposit Request Rejected`,
      'Deposit Rejected',
      dep.id,
      `৳${dep.amount}`,
      `Your deposit of ৳${dep.amount} was rejected. Reason: ${reason}.`,
      'Deposit Rejected',
      `Deposit of ৳${dep.amount} rejected: ${reason}`,
      '/dashboard/wallet'
    );
  };

  // 4. Withdrawal Flow
  const submitWithdrawal = async (amount: number, method: 'bKash' | 'Nagad' | 'Rocket', accountNumber: string) => {
    if (!currentUser) return { success: false, message: 'Please login first.' };
    if (amount < feeSettings.minWithdrawalAmount) {
      return { success: false, message: `Minimum withdrawal amount is ৳${feeSettings.minWithdrawalAmount}` };
    }

    const currentBal = userWallet.withdrawableBalance;
    if (currentBal < amount) {
      return { success: false, message: 'Insufficient withdrawable balance in your wallet.' };
    }

    const fee = Math.round((amount * feeSettings.withdrawalFeePercentage) / 100);
    const netAmount = amount - fee;
    const wthId = `WTH-${Math.floor(10000 + Math.random() * 90000)}`;

    // Atomic debit
    setWallets((prev) => {
      const w = prev[currentUser.id];
      const prevBal = w.availableBalance;
      const newBal = prevBal - amount;

      const ledgerEntry: LedgerEntry = {
        id: `LED-${Math.floor(1000 + Math.random() * 9000)}`,
        actor: currentUser.name,
        actorType: 'user',
        reference: wthId,
        type: 'withdrawal',
        previousBalance: prevBal,
        amount: -amount,
        newBalance: newBal,
        reason: `Withdrawal request to ${method} (${accountNumber})`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      setLedger((l) => [ledgerEntry, ...l]);

      return {
        ...prev,
        [currentUser.id]: {
          ...w,
          availableBalance: newBal,
          withdrawableBalance: w.withdrawableBalance - amount,
          pendingBalance: w.pendingBalance + amount,
        },
      };
    });

    const newReq: WithdrawalRequest = {
      id: wthId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      amount,
      fee,
      netAmount,
      paymentMethod: method,
      accountNumber,
      status: 'pending',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setWithdrawalRequests((prev) => [newReq, ...prev]);

    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxn: Transaction = {
      id: txnId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: 'withdrawal',
      amount,
      fee,
      status: 'pending',
      reference: wthId,
      method,
      accountNumber,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      description: `Withdrawal to ${method} ${accountNumber} (Processing)`,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    sendEmailAndNotification(
      currentUser.id,
      currentUser.email,
      currentUser.name,
      `Withdrawal Requested: ৳${amount}`,
      'Withdrawal Pending',
      wthId,
      `৳${netAmount} (Net)`,
      `Your withdrawal request of ৳${amount} (Net payout ৳${netAmount} after ৳${fee} fee) to ${accountNumber} is being processed.`,
      'Withdrawal Submitted',
      `৳${amount} payout requested via ${method}.`,
      '/dashboard/wallet'
    );

    return { success: true, message: `Withdrawal request for ৳${amount} submitted.` };
  };

  const adminApproveWithdrawal = (withdrawalId: string) => {
    const wth = withdrawalRequests.find((w) => w.id === withdrawalId);
    if (!wth) return;

    setWithdrawalRequests((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'completed', processedAt: new Date().toISOString().slice(0, 16) } : w))
    );

    setWallets((prev) => {
      const w = prev[wth.userId];
      if (!w) return prev;
      return {
        ...prev,
        [wth.userId]: {
          ...w,
          pendingBalance: Math.max(0, w.pendingBalance - wth.amount),
          totalWithdrawn: w.totalWithdrawn + wth.amount,
        },
      };
    });

    const invId = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setTransactions((prev) =>
      prev.map((t) =>
        t.reference === withdrawalId
          ? { ...t, status: 'completed', invoiceId: invId, description: `Withdrawal of ৳${wth.amount} Sent to ${wth.paymentMethod}` }
          : t
      )
    );

    const newInvoice: Invoice = {
      id: invId,
      date: new Date().toISOString().split('T')[0],
      userId: wth.userId,
      userName: wth.userName,
      userEmail: wth.userEmail,
      serviceOrItemTitle: `Payout via ${wth.paymentMethod} (${wth.accountNumber})`,
      type: 'Withdrawal',
      amount: wth.amount,
      fee: wth.fee,
      subtotal: wth.netAmount,
      total: wth.netAmount,
      paymentMethod: wth.paymentMethod,
      trxRef: wth.id,
      status: 'paid',
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    logAudit('Approve Withdrawal', wth.userId, wth.amount, `Paid to ${wth.accountNumber}`, wth.id);

    sendEmailAndNotification(
      wth.userId,
      wth.userEmail,
      wth.userName,
      `Payout Sent: ৳${wth.netAmount} Dispatched`,
      'Withdrawal Completed',
      wth.id,
      `৳${wth.netAmount}`,
      `Your withdrawal of ৳${wth.amount} (Net ৳${wth.netAmount}) has been sent to your ${wth.paymentMethod} account ${wth.accountNumber}.`,
      'Payout Completed',
      `৳${wth.netAmount} successfully sent to ${wth.paymentMethod}.`,
      '/dashboard/wallet'
    );
  };

  const adminRejectWithdrawal = (withdrawalId: string, reason: string) => {
    const wth = withdrawalRequests.find((w) => w.id === withdrawalId);
    if (!wth) return;

    setWithdrawalRequests((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'rejected', rejectionReason: reason } : w))
    );

    // Refund back to available balance
    setWallets((prev) => {
      const w = prev[wth.userId];
      if (!w) return prev;
      return {
        ...prev,
        [wth.userId]: {
          ...w,
          availableBalance: w.availableBalance + wth.amount,
          withdrawableBalance: w.withdrawableBalance + wth.amount,
          pendingBalance: Math.max(0, w.pendingBalance - wth.amount),
        },
      };
    });

    setTransactions((prev) =>
      prev.map((t) => (t.reference === withdrawalId ? { ...t, status: 'rejected', description: `Withdrawal Rejected: ${reason}` } : t))
    );

    logAudit('Reject Withdrawal', wth.userId, wth.amount, reason, wth.id);

    sendEmailAndNotification(
      wth.userId,
      wth.userEmail,
      wth.userName,
      `Withdrawal Request Returned`,
      'Withdrawal Rejected',
      wth.id,
      `৳${wth.amount}`,
      `Your withdrawal request was rejected (${reason}) and the full amount of ৳${wth.amount} has been refunded to your wallet.`,
      'Withdrawal Rejected & Refunded',
      `৳${wth.amount} returned to your available balance.`,
      '/dashboard/wallet'
    );
  };

  // 5. Job Creation & Applications
  const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'applicationsCount' | 'status' | 'publisherId' | 'publisherName' | 'publisherVerified'>) => {
    if (!currentUser) return { success: false, message: 'Please login first.' };
    if (currentUser.verificationStatus !== 'approved') {
      return { success: false, message: 'Account verification required before posting jobs.' };
    }

    const jobId = `JOB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newJob: Job = {
      ...jobData,
      id: jobId,
      publisherId: currentUser.id,
      publisherName: currentUser.name,
      publisherVerified: true,
      status: 'active',
      applicationsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setJobs((prev) => [newJob, ...prev]);

    sendEmailAndNotification(
      currentUser.id,
      currentUser.email,
      currentUser.name,
      `Job Published: ${newJob.title}`,
      'Job Created',
      jobId,
      `৳${newJob.budget}`,
      `Your job has been published on the TaskBD marketplace. Freelancers can now submit proposals.`,
      'Job Published',
      `"${newJob.title}" is now live in the marketplace.`,
      `/dashboard/jobs/${jobId}`
    );

    return { success: true, message: 'Job successfully created and published!', job: newJob };
  };

  const applyForJob = async (jobId: string, proposal: string, days: number, exp: string) => {
    if (!currentUser) return { success: false, message: 'Please login first.' };
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found.' };

    const appId = `APP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newApp: JobApplication = {
      id: appId,
      jobId,
      jobTitle: job.title,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantVerified: currentUser.verificationStatus === 'approved',
      proposal,
      expectedDeliveryDays: days,
      experienceSummary: exp,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'pending',
    };

    setJobApplications((prev) => [newApp, ...prev]);
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, applicationsCount: j.applicationsCount + 1 } : j)));

    sendEmailAndNotification(
      job.publisherId,
      'publisher@taskbd.com',
      job.publisherName,
      `New Application for Job: ${job.title}`,
      'Job Application',
      jobId,
      `৳${job.budget}`,
      `${currentUser.name} submitted a proposal for "${job.title}".`,
      'New Job Application',
      `${currentUser.name} applied for "${job.title}".`,
      `/dashboard/workspace/my-jobs/${jobId}`
    );

    return { success: true, message: 'Application submitted successfully to publisher.' };
  };

  const selectJobWorker = (jobId: string, applicationId: string) => {
    const app = jobApplications.find((a) => a.id === applicationId);
    if (!app) return;

    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'in_progress', selectedWorkerId: app.applicantId } : j))
    );
    setJobApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'accepted' } : a.jobId === jobId ? { ...a, status: 'rejected' } : a))
    );

    sendEmailAndNotification(
      app.applicantId,
      'worker@taskbd.com',
      app.applicantName,
      `You Were Hired for Job: ${app.jobTitle}`,
      'Job Assigned',
      jobId,
      undefined,
      `Your application was accepted! You may now begin working on the assignment.`,
      'Job Assigned to You!',
      `You have been selected for "${app.jobTitle}".`,
      `/dashboard/jobs/${jobId}`
    );
  };

  const submitJobWork = async (jobId: string, message: string, linksOrFiles: string) => {
    if (!currentUser) return { success: false, message: 'Please login.' };
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found.' };

    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              submissionDetails: {
                workerId: currentUser.id,
                workerName: currentUser.name,
                submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                message,
                linksOrFiles,
              },
            }
          : j
      )
    );

    sendEmailAndNotification(
      job.publisherId,
      'publisher@taskbd.com',
      job.publisherName,
      `Work Submitted for Job: ${job.title}`,
      'Job Work Submitted',
      jobId,
      `৳${job.budget}`,
      `${currentUser.name} has submitted the completed work for review.`,
      'Work Submitted for Review',
      `${currentUser.name} submitted work for "${job.title}".`,
      `/dashboard/workspace/my-jobs/${jobId}`
    );

    return { success: true, message: 'Work files submitted successfully for publisher review.' };
  };

  const approveJobWorkAndPayout = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job || !job.submissionDetails) return;

    const workerId = job.submissionDetails.workerId;
    const commission = Math.round((job.budget * feeSettings.jobCommissionPercentage) / 100);
    const workerPayout = job.budget - commission;

    // Credit worker wallet
    setWallets((prev) => {
      const w = prev[workerId] || {
        userId: workerId,
        availableBalance: 0,
        pendingBalance: 0,
        withdrawableBalance: 0,
        totalEarned: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
      };
      return {
        ...prev,
        [workerId]: {
          ...w,
          availableBalance: w.availableBalance + workerPayout,
          withdrawableBalance: w.withdrawableBalance + workerPayout,
          totalEarned: w.totalEarned + workerPayout,
        },
      };
    });

    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'completed' } : j))
    );

    // Record transaction
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxn: Transaction = {
      id: txnId,
      userId: workerId,
      type: 'job_payout',
      amount: workerPayout,
      fee: commission,
      status: 'completed',
      reference: jobId,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      description: `Payout for Job "${job.title}"`,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    sendEmailAndNotification(
      workerId,
      'worker@taskbd.com',
      job.submissionDetails.workerName,
      `Job Completed: ৳${workerPayout} Earned`,
      'Job Payout',
      jobId,
      `৳${workerPayout}`,
      `Your work on "${job.title}" was approved. ৳${workerPayout} has been credited to your wallet.`,
      'Job Payout Received!',
      `৳${workerPayout} credited for completing "${job.title}".`,
      '/dashboard/wallet'
    );
  };

  // 6. Service Marketplace & Orders
  const createService = async (serviceData: Omit<Service, 'id' | 'createdAt' | 'ordersCount' | 'reviewsCount' | 'providerRating' | 'providerId' | 'providerName' | 'status'>) => {
    if (!currentUser) return { success: false, message: 'Please login first.' };
    if (currentUser.publishingStatus !== 'active') {
      return { success: false, message: 'Publishing access required. Please activate in My Workspace.' };
    }

    const srvId = `SRV-${Math.floor(10000 + Math.random() * 90000)}`;
    const newService: Service = {
      ...serviceData,
      id: srvId,
      providerId: currentUser.id,
      providerName: currentUser.name,
      providerRating: 5.0,
      reviewsCount: 0,
      ordersCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setServices((prev) => [newService, ...prev]);

    sendEmailAndNotification(
      currentUser.id,
      currentUser.email,
      currentUser.name,
      `Service Published: ${newService.title}`,
      'Service Active',
      srvId,
      `৳${newService.price}`,
      `Your service is now active in the TaskBD marketplace.`,
      'Service Published',
      `"${newService.title}" is live for orders.`,
      `/dashboard/services/${srvId}`
    );

    return { success: true, message: 'Service successfully created!', service: newService };
  };

  const toggleServiceStatus = (serviceId: string, status: 'active' | 'paused') => {
    setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, status } : s)));
  };

  const createServiceOrder = async (serviceId: string, requirements: string) => {
    if (!currentUser) return { success: false, message: 'Please login first.' };
    const srv = services.find((s) => s.id === serviceId);
    if (!srv) return { success: false, message: 'Service not found.' };

    const totalCost = srv.price;
    if (userWallet.availableBalance < totalCost) {
      return { success: false, message: `Insufficient balance (Required: ৳${totalCost}, Available: ৳${userWallet.availableBalance}). Please deposit first.` };
    }

    // Atomic Escrow Deduction from Buyer
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const platformFee = Math.round((totalCost * feeSettings.serviceCommissionPercentage) / 100);
    const sellerEarning = totalCost - platformFee;

    setWallets((prev) => {
      const w = prev[currentUser.id];
      const prevBal = w.availableBalance;
      const newBal = prevBal - totalCost;

      const ledgerEntry: LedgerEntry = {
        id: `LED-${Math.floor(1000 + Math.random() * 9000)}`,
        actor: currentUser.name,
        actorType: 'user',
        reference: orderId,
        type: 'service_order',
        previousBalance: prevBal,
        amount: -totalCost,
        newBalance: newBal,
        reason: `Payment locked in Escrow for Order #${orderId}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      setLedger((l) => [ledgerEntry, ...l]);

      return {
        ...prev,
        [currentUser.id]: {
          ...w,
          availableBalance: newBal,
          withdrawableBalance: Math.max(0, w.withdrawableBalance - totalCost),
          pendingBalance: w.pendingBalance + totalCost,
        },
      };
    });

    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + srv.deliveryDays);

    const newOrder: ServiceOrder = {
      id: orderId,
      serviceId,
      serviceTitle: srv.title,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: srv.providerId,
      sellerName: srv.providerName,
      amount: totalCost,
      platformFee,
      sellerEarning,
      escrowAmount: totalCost,
      escrowStatus: 'secured',
      status: 'in_progress',
      orderDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      deadline: deadlineDate.toISOString().replace('T', ' ').slice(0, 16),
      buyerRequirementsText: requirements,
      progressPercentage: 20,
      progressNotes: 'Order started. Reviewing project requirements and specifications.',
      progressUpdatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      milestones: [
        { id: 'm1', title: 'Requirements & Brief Confirmation', completed: true, completedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) },
        { id: 'm2', title: 'Initial Draft & Concept Work', completed: false },
        { id: 'm3', title: 'Production, Revisions & Polish', completed: false },
        { id: 'm4', title: 'Quality Assurance & Deliverables Packaging', completed: false },
        { id: 'm5', title: 'Final Handover & Client Approval', completed: false },
      ],
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Record Transaction
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxn: Transaction = {
      id: txnId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: 'service_order',
      amount: totalCost,
      status: 'completed',
      reference: orderId,
      method: 'Escrow',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      description: `Escrow Secured for Order #${orderId} (${srv.title})`,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    // Update service order count
    setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, ordersCount: s.ordersCount + 1 } : s)));

    // Send Buyer Confirmation Email
    sendEmailAndNotification(
      currentUser.id,
      currentUser.email,
      currentUser.name,
      `Order Placed & Escrow Secured: #${orderId}`,
      'Order Created',
      orderId,
      `৳${totalCost}`,
      `Your order for "${srv.title}" is in progress. ৳${totalCost} is safely held in TaskBD Escrow.`,
      'Order Placed Successfully',
      `Order #${orderId} is active. Seller has been notified.`,
      '/dashboard/workspace/orders'
    );

    // Send Seller Notification Email
    sendEmailAndNotification(
      srv.providerId,
      'seller@taskbd.com',
      srv.providerName,
      `🔔 New Order Received: #${orderId}`,
      'New Order',
      orderId,
      `৳${totalCost}`,
      `A buyer placed an order for "${srv.title}". Escrow payment of ৳${totalCost} is secured.`,
      'New Order Received!',
      `You received a new order for "${srv.title}".`,
      '/dashboard/workspace/received-orders'
    );

    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    return { success: true, message: `Order #${orderId} placed! ৳${totalCost} secured in Escrow.`, orderId };
  };

  const updateOrderProgress = async (orderId: string, percentage: number, note?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              progressPercentage: clamped,
              progressNotes: note !== undefined ? note : o.progressNotes,
              progressUpdatedAt: now,
            }
          : o
      )
    );

    sendEmailAndNotification(
      order.buyerId,
      'buyer@taskbd.com',
      order.buyerName,
      `📈 Order Progress: #${order.id} is ${clamped}% Complete`,
      'Order Progress',
      order.id,
      undefined,
      `Freelancer ${order.sellerName} updated project completion to ${clamped}%: "${note || 'Work is on schedule.'}"`,
      'Progress Updated',
      `Order #${order.id} is now ${clamped}% complete.`,
      '/dashboard/workspace'
    );

    return { success: true, message: `Progress updated to ${clamped}% successfully!` };
  };

  const toggleOrderMilestone = async (orderId: string, milestoneId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    const existingMilestones =
      order.milestones && order.milestones.length > 0
        ? order.milestones
        : [
            { id: 'm1', title: 'Requirements & Brief Confirmation', completed: true },
            { id: 'm2', title: 'Initial Draft & Concept Work', completed: false },
            { id: 'm3', title: 'Production, Revisions & Polish', completed: false },
            { id: 'm4', title: 'Quality Assurance & Deliverables Packaging', completed: false },
            { id: 'm5', title: 'Final Handover & Client Approval', completed: false },
          ];

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const updatedMilestones = existingMilestones.map((m) =>
      m.id === milestoneId
        ? { ...m, completed: !m.completed, completedAt: !m.completed ? now : undefined }
        : m
    );

    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const calculatedPercentage = Math.round((completedCount / updatedMilestones.length) * 100);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              milestones: updatedMilestones,
              progressPercentage: calculatedPercentage,
              progressUpdatedAt: now,
            }
          : o
      )
    );

    return { success: true, message: 'Milestone updated!' };
  };

  const deliverServiceOrder = async (orderId: string, message: string, attachment?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    const now = Date.now();
    const autoRelease = new Date(now + 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 16);
    const timeStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const updatedMilestones = (order.milestones || []).map((m, idx) =>
      idx < 4 ? { ...m, completed: true, completedAt: m.completedAt || timeStr } : m
    );

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'delivered',
              deliveryMessage: message,
              deliveryAttachment: attachment || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
              deliveryDate: timeStr,
              deliveredAtTimestamp: now,
              autoReleaseDeadline: autoRelease,
              progressPercentage: 90,
              progressNotes: 'Deliverables submitted for buyer review. 24h auto-release countdown active.',
              progressUpdatedAt: timeStr,
              milestones: updatedMilestones,
            }
          : o
      )
    );

    sendEmailAndNotification(
      order.buyerId,
      'buyer@taskbd.com',
      order.buyerName,
      `📦 Work Delivered for Order #${order.id}`,
      'Order Delivered',
      order.id,
      `৳${order.amount}`,
      `The seller has delivered the work for "${order.serviceTitle}". You have 24 hours to review and approve.`,
      'Order Delivered!',
      `Work delivered for Order #${order.id}. Please review within 24 hours.`,
      '/dashboard/workspace/orders'
    );

    return { success: true, message: 'Order delivered! 24-hour review timer initiated.' };
  };

  const buyerApproveOrder = async (orderId: string, rating = 5, review = 'Great work!') => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    const timeStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const allMilestonesCompleted = (order.milestones || []).map((m) => ({
      ...m,
      completed: true,
      completedAt: m.completedAt || timeStr,
    }));

    // 1. Mark Order Completed & Escrow Released
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'completed',
              escrowStatus: 'released',
              completedAt: timeStr,
              rating,
              review,
              progressPercentage: 100,
              progressNotes: 'Order completed, approved, and escrow payment released.',
              progressUpdatedAt: timeStr,
              milestones: allMilestonesCompleted,
            }
          : o
      )
    );

    // 2. Release Escrow from Buyer's pending to Seller's available balance
    setWallets((prev) => {
      const buyerW = prev[order.buyerId];
      const sellerW = prev[order.sellerId] || {
        userId: order.sellerId,
        availableBalance: 0,
        pendingBalance: 0,
        withdrawableBalance: 0,
        totalEarned: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
      };

      const updatedBuyer = buyerW
        ? {
            ...buyerW,
            pendingBalance: Math.max(0, buyerW.pendingBalance - order.amount),
          }
        : buyerW;

      const updatedSeller = {
        ...sellerW,
        availableBalance: sellerW.availableBalance + order.sellerEarning,
        withdrawableBalance: sellerW.withdrawableBalance + order.sellerEarning,
        totalEarned: sellerW.totalEarned + order.sellerEarning,
      };

      return {
        ...prev,
        [order.buyerId]: updatedBuyer,
        [order.sellerId]: updatedSeller,
      };
    });

    // 3. Generate Invoices
    const invId = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const buyerInvoice: Invoice = {
      id: invId,
      date: new Date().toISOString().split('T')[0],
      userId: order.buyerId,
      userName: order.buyerName,
      userEmail: 'buyer@taskbd.com',
      serviceOrItemTitle: order.serviceTitle,
      type: 'Service Order',
      amount: order.amount,
      fee: order.platformFee,
      subtotal: order.amount,
      total: order.amount,
      paymentMethod: 'TaskBD Escrow',
      trxRef: order.id,
      status: 'paid',
    };
    setInvoices((prev) => [buyerInvoice, ...prev]);

    // Record Payout Transaction
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxn: Transaction = {
      id: txnId,
      userId: order.sellerId,
      userName: order.sellerName,
      type: 'order_payout',
      amount: order.sellerEarning,
      fee: order.platformFee,
      status: 'completed',
      reference: order.id,
      method: 'Wallet',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      description: `Escrow Released for Order #${order.id}`,
      invoiceId: invId,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    sendEmailAndNotification(
      order.sellerId,
      'seller@taskbd.com',
      order.sellerName,
      `💰 Payment Released: ৳${order.sellerEarning} Added`,
      'Escrow Released',
      order.id,
      `৳${order.sellerEarning}`,
      `Buyer approved Order #${order.id}. ৳${order.sellerEarning} has been deposited to your wallet balance.`,
      'Payment Released!',
      `৳${order.sellerEarning} credited for Order #${order.id}.`,
      '/dashboard/wallet'
    );

    sendEmailAndNotification(
      order.buyerId,
      'buyer@taskbd.com',
      order.buyerName,
      `Order #${order.id} Completed`,
      'Order Finished',
      order.id,
      `৳${order.amount}`,
      `Thank you! Order #${order.id} is marked complete. Your invoice #${invId} is available.`,
      'Order Completed',
      `Invoice generated for Order #${order.id}.`,
      `/dashboard/invoices`
    );

    try {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    return { success: true, message: `Order #${orderId} approved and payment released to seller.` };
  };

  const openDispute = async (orderId: string, reason: string, description: string) => {
    if (!currentUser) return { success: false, message: 'Please login.' };
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    const dispId = `DISP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newDispute: Dispute = {
      id: dispId,
      orderId,
      serviceTitle: order.serviceTitle,
      openedByUserId: currentUser.id,
      openedByName: currentUser.name,
      openedAgainstUserId: currentUser.id === order.buyerId ? order.sellerId : order.buyerId,
      openedAgainstName: currentUser.id === order.buyerId ? order.sellerName : order.buyerName,
      amount: order.amount,
      reason,
      description,
      status: 'open',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setDisputes((prev) => [newDispute, ...prev]);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'disputed', escrowStatus: 'disputed' } : o)));

    logAudit('Open Dispute', orderId, order.amount, `Dispute opened: ${reason}`, dispId);

    sendEmailAndNotification(
      'TBD-ADMIN-01',
      'task.b.d.mail@gmail.com',
      'TaskBD Arbitration Team',
      `⚠️ Dispute Opened for Order #${orderId}`,
      'Dispute Raised',
      dispId,
      `৳${order.amount}`,
      `Dispute opened by ${currentUser.name}. Reason: ${reason}.`,
      'Dispute Opened',
      `Dispute #${dispId} opened for Order #${orderId}.`,
      '/admin/dashboard/disputes'
    );

    return { success: true, message: `Dispute #${dispId} submitted. Admin will review within 24 hours.` };
  };

  const adminResolveDispute = (disputeId: string, resolution: 'buyer' | 'seller', notes: string) => {
    const disp = disputes.find((d) => d.id === disputeId);
    if (!disp) return;

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: resolution === 'buyer' ? 'resolved_buyer' : 'resolved_seller',
              resolutionNotes: notes,
            }
          : d
      )
    );

    if (resolution === 'buyer') {
      // Refund buyer
      setOrders((prev) => prev.map((o) => (o.id === disp.orderId ? { ...o, status: 'cancelled', escrowStatus: 'refunded' } : o)));
      setWallets((prev) => {
        const buyerW = prev[disp.openedByUserId];
        if (!buyerW) return prev;
        return {
          ...prev,
          [disp.openedByUserId]: {
            ...buyerW,
            availableBalance: buyerW.availableBalance + disp.amount,
            withdrawableBalance: buyerW.withdrawableBalance + disp.amount,
            pendingBalance: Math.max(0, buyerW.pendingBalance - disp.amount),
          },
        };
      });
      logAudit('Resolve Dispute (Refund Buyer)', disp.openedByUserId, disp.amount, notes, disp.id);
    } else {
      // Release to seller
      setOrders((prev) => prev.map((o) => (o.id === disp.orderId ? { ...o, status: 'completed', escrowStatus: 'released' } : o)));
      logAudit('Resolve Dispute (Favor Seller)', disp.openedAgainstUserId, disp.amount, notes, disp.id);
    }
  };

  // 7. Chat messages
  const sendChatMessage = (conversationId: string, message: string, attachment?: string) => {
    if (!currentUser || !message.trim()) return;

    const msgId = `MSG-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: msgId,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      message,
      attachmentUrl: attachment,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setChatMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: message,
              lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : c
      )
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const updatePaymentMethods = (methods: PaymentMethodConfig[]) => {
    setPaymentMethods(methods);
    logAudit('Update Payment Methods', 'System Settings', undefined, 'Modified gateway numbers');
  };

  const updateFeeSettings = (fees: FeeSettings) => {
    setFeeSettings(fees);
    logAudit('Update Fee Settings', 'System Settings', undefined, 'Updated commission and fees');
  };

  const adminToggleUserSuspension = (userId: string) => {
    logAudit('Toggle User Suspension', userId, undefined, 'Admin manual action');
  };

  return (
    <DataContext.Provider
      value={{
        wallets,
        transactions,
        ledger,
        depositRequests,
        withdrawalRequests,
        verificationRequests,
        publishingRequests,
        jobs,
        jobApplications,
        services,
        orders,
        disputes,
        invoices,
        notifications,
        emailLogs,
        auditLogs,
        securityEvents,
        paymentMethods,
        feeSettings,
        conversations,
        chatMessages,

        userWallet,
        userTransactions,
        userNotifications,
        userOrders,
        userReceivedOrders,
        userJobs,
        userServices,
        userApplications,
        userInvoices,
        unreadNotificationCount,

        submitVerificationRequest,
        adminApproveVerification,
        adminRejectVerification,
        submitPublishingRequest,
        adminApprovePublishing,
        adminRejectPublishing,
        submitDeposit,
        adminApproveDeposit,
        adminRejectDeposit,
        submitWithdrawal,
        adminApproveWithdrawal,
        adminRejectWithdrawal,
        createJob,
        applyForJob,
        selectJobWorker,
        submitJobWork,
        approveJobWorkAndPayout,
        createService,
        toggleServiceStatus,
        createServiceOrder,
        updateOrderProgress,
        toggleOrderMilestone,
        deliverServiceOrder,
        buyerApproveOrder,
        openDispute,
        adminResolveDispute,
        sendChatMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updatePaymentMethods,
        updateFeeSettings,
        adminToggleUserSuspension,

        selectedInvoice,
        setSelectedInvoice,
        selectedEmail,
        setSelectedEmail,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
