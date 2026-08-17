export type UserRole = 'user' | 'admin';

export type VerificationStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';
export type PublishingStatus = 'not_activated' | 'pending' | 'active' | 'rejected';

export interface User {
  id: string; // e.g. "TBD-88492"
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  verificationStatus: VerificationStatus;
  verificationRejectionReason?: string;
  publishingStatus: PublishingStatus;
  publishingRejectionReason?: string;
  referralCode: string;
  referredBy?: string;
  joinedDate: string;
  isSuspended?: boolean;
}

export interface Wallet {
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  withdrawableBalance: number;
  totalEarned: number;
  totalDeposited: number;
  totalWithdrawn: number;
}

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'service_order'
  | 'order_payout'
  | 'job_creation'
  | 'job_payout'
  | 'verification_fee'
  | 'publishing_fee'
  | 'platform_commission'
  | 'referral_reward'
  | 'refund';

export type TransactionStatus = 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'failed';

export interface Transaction {
  id: string; // e.g. "TXN-294819"
  userId: string;
  userName?: string;
  userEmail?: string;
  type: TransactionType;
  amount: number;
  fee?: number;
  status: TransactionStatus;
  reference: string;
  method?: 'bKash' | 'Nagad' | 'Rocket' | 'Wallet' | 'Escrow';
  accountNumber?: string;
  trxId?: string;
  date: string;
  description: string;
  invoiceId?: string;
}

export interface LedgerEntry {
  id: string;
  actor: string;
  actorType: 'user' | 'admin' | 'system';
  reference: string;
  type: TransactionType;
  previousBalance: number;
  amount: number;
  newBalance: number;
  reason: string;
  timestamp: string;
}

export interface DepositRequest {
  id: string; // e.g. "DEP-40918"
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
  senderNumber: string;
  trxId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface WithdrawalRequest {
  id: string; // e.g. "WTH-99412"
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  fee: number;
  netAmount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
  accountNumber: string;
  status: 'pending' | 'processing' | 'approved' | 'completed' | 'rejected';
  submittedAt: string;
  processedAt?: string;
  rejectionReason?: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number; // ৳15
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
  senderNumber: string;
  trxId: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface PublishingRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number; // ৳50
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
  senderNumber: string;
  trxId: string;
  status: PublishingStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface Job {
  id: string; // e.g. "JOB-77291"
  title: string;
  category: string;
  budget: number;
  deadline: string;
  publisherId: string;
  publisherName: string;
  publisherVerified: boolean;
  description: string;
  requirements: string[];
  attachments?: string[];
  status: 'active' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  createdAt: string;
  applicationsCount: number;
  selectedWorkerId?: string;
  submissionDetails?: {
    workerId: string;
    workerName: string;
    submittedAt: string;
    message: string;
    linksOrFiles: string;
    approvedAt?: string;
  };
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantVerified: boolean;
  proposal: string;
  expectedDeliveryDays: number;
  experienceSummary: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Service {
  id: string; // e.g. "SRV-5519"
  title: string;
  category: string;
  price: number;
  deliveryDays: number;
  providerId: string;
  providerName: string;
  providerRating: number;
  reviewsCount: number;
  ordersCount: number;
  description: string;
  requirements: string;
  faqs?: { question: string; answer: string }[];
  thumbnail: string;
  status: 'active' | 'pending' | 'paused' | 'rejected';
  createdAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'in_progress'
  | 'delivered'
  | 'waiting_approval'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export interface OrderMilestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface ServiceOrder {
  id: string; // e.g. "ORD-88219"
  serviceId: string;
  serviceTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  platformFee: number;
  sellerEarning: number;
  escrowAmount: number;
  escrowStatus: 'secured' | 'released' | 'refunded' | 'disputed';
  status: OrderStatus;
  orderDate: string;
  deadline: string;
  buyerRequirementsText?: string;
  deliveryDate?: string;
  deliveryMessage?: string;
  deliveryAttachment?: string;
  deliveredAtTimestamp?: number; // for 24-hour countdown
  autoReleaseDeadline?: string;
  completedAt?: string;
  rating?: number;
  review?: string;
  progressPercentage?: number; // 0 - 100
  progressNotes?: string;
  progressUpdatedAt?: string;
  milestones?: OrderMilestone[];
}

export interface Dispute {
  id: string;
  orderId: string;
  serviceTitle: string;
  openedByUserId: string;
  openedByName: string;
  openedAgainstUserId: string;
  openedAgainstName: string;
  amount: number;
  reason: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved_buyer' | 'resolved_seller' | 'rejected';
  createdAt: string;
  resolutionNotes?: string;
}

export interface Invoice {
  id: string; // e.g. "INV-2026-00421"
  date: string;
  userId: string;
  userName: string;
  userEmail: string;
  serviceOrItemTitle: string;
  type: string;
  amount: number;
  fee: number;
  subtotal: number;
  total: number;
  paymentMethod: string;
  trxRef: string;
  status: 'paid' | 'pending' | 'refunded';
}

export interface NotificationItem {
  id: string;
  userId: string;
  type:
    | 'deposit'
    | 'withdrawal'
    | 'verification'
    | 'publishing'
    | 'job'
    | 'application'
    | 'order'
    | 'payment'
    | 'referral'
    | 'message'
    | 'security'
    | 'invoice';
  title: string;
  message: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface EmailLog {
  id: string;
  from: string;
  to: string;
  recipientName: string;
  recipientUserId: string;
  subject: string;
  event: string;
  referenceId: string;
  amount?: string;
  status: string;
  bodyPreview: string;
  sentAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  actorType: 'admin' | 'system' | 'user';
  action: string;
  target: string;
  amount?: number;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  referenceId: string;
  timestamp: string;
  ipAddress?: string;
}

export interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'otp_attempt' | 'suspicious_activity' | 'password_change' | 'rate_limit';
  email: string;
  status: 'success' | 'failed' | 'blocked';
  ip: string;
  location: string;
  timestamp: string;
  details: string;
}

export interface PaymentMethodConfig {
  id: string;
  method: 'bKash' | 'Nagad' | 'Rocket';
  number: string;
  accountType: 'Merchant' | 'Personal' | 'Agent';
  accountName: string;
  instructions: string;
  isActive: boolean;
}

export interface FeeSettings {
  accountVerificationFee: number; // e.g. 15
  publishingActivationFee: number; // e.g. 50
  withdrawalFeePercentage: number; // e.g. 2%
  serviceCommissionPercentage: number; // e.g. 10%
  jobCommissionPercentage: number; // e.g. 5%
  referralRewardAmount: number; // e.g. 10
  minDepositAmount: number; // e.g. 50
  minWithdrawalAmount: number; // e.g. 100
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin' | 'system';
  message: string;
  attachmentUrl?: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  orderId?: string;
  jobId?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
