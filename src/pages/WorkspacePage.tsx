import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Layers,
  PlusCircle,
  Briefcase,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  Lock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Star,
  FileText,
  DollarSign,
} from 'lucide-react';
import { Service, Job, ServiceOrder } from '../types';
import { TaskProgressBar } from '../components/TaskProgressBar';
import { WorkspaceProgressOverview } from '../components/WorkspaceProgressOverview';

interface WorkspacePageProps {
  onNavigate: (path: string) => void;
  onOpenOrderDetail?: (orderId: string) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ onNavigate, onOpenOrderDetail }) => {
  const { currentUser } = useAuth();
  const {
    userServices,
    userJobs,
    userOrders,
    userReceivedOrders,
    createService,
    createJob,
    deliverServiceOrder,
    buyerApproveOrder,
    updateOrderProgress,
    toggleOrderMilestone,
    selectJobWorker,
    approveJobWorkAndPayout,
    openDispute,
    userWallet,
    feeSettings,
  } = useData();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'my_orders' | 'received_orders' | 'my_services' | 'my_jobs'>('my_orders');
  const [progressFilter, setProgressFilter] = useState<string>('all');

  // Modals
  const [showCreateService, setShowCreateService] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<ServiceOrder | null>(null);
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [deliveryLink, setDeliveryLink] = useState('');
  const [deliveryError, setDeliveryError] = useState('');

  // Dispute modal
  const [disputeOrder, setDisputeOrder] = useState<ServiceOrder | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');

  // Rating modal
  const [ratingOrder, setRatingOrder] = useState<ServiceOrder | null>(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingReview, setRatingReview] = useState('');

  // New Service Form
  const [srvTitle, setSrvTitle] = useState('');
  const [srvCategory, setSrvCategory] = useState('Web Development');
  const [srvPrice, setSrvPrice] = useState('2000');
  const [srvDays, setSrvDays] = useState('3');
  const [srvDesc, setSrvDesc] = useState('');
  const [srvReq, setSrvReq] = useState('');
  const [srvThumbnail, setSrvThumbnail] = useState('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80');
  const [srvError, setSrvError] = useState('');

  // New Job Form
  const [jobTitle, setJobTitle] = useState('');
  const [jobCategory, setJobCategory] = useState('Microtasks');
  const [jobBudget, setJobBudget] = useState('500');
  const [jobDeadline, setJobDeadline] = useState('2026-08-30');
  const [jobDesc, setJobDesc] = useState('');
  const [jobRequirementsList, setJobRequirementsList] = useState('1. Clear proof screenshot\n2. Real device activity');
  const [jobError, setJobError] = useState('');

  const isPublishingAllowed = currentUser?.publishingStatus === 'active';

  const handleCreateServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvTitle.trim() || !srvDesc.trim()) {
      setSrvError('Title and description are required.');
      return;
    }

    const res = await createService({
      title: srvTitle.trim(),
      category: srvCategory,
      price: parseFloat(srvPrice) || 500,
      deliveryDays: parseInt(srvDays) || 1,
      description: srvDesc.trim(),
      requirements: srvReq.trim(),
      thumbnail: srvThumbnail,
    });

    if (res.success) {
      setShowCreateService(false);
      setSrvTitle('');
      setSrvDesc('');
      setSrvReq('');
    } else {
      setSrvError(res.message);
    }
  };

  const handleCreateJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDesc.trim()) {
      setJobError('Title and description are required.');
      return;
    }

    const budgetNum = parseFloat(jobBudget) || 100;
    if (userWallet.availableBalance < budgetNum) {
      setJobError(`Insufficient balance. You need ৳${budgetNum} in your wallet to post this job.`);
      return;
    }

    const reqArray = jobRequirementsList
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const res = await createJob({
      title: jobTitle.trim(),
      category: jobCategory,
      budget: budgetNum,
      deadline: jobDeadline,
      description: jobDesc.trim(),
      requirements: reqArray,
    });

    if (res.success) {
      setShowCreateJob(false);
      setJobTitle('');
      setJobDesc('');
    } else {
      setJobError(res.message);
    }
  };

  const handleDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDelivery) return;
    if (!deliveryMessage.trim()) {
      setDeliveryError('Please describe the delivered deliverables.');
      return;
    }

    const res = await deliverServiceOrder(
      selectedOrderForDelivery.id,
      deliveryMessage.trim(),
      deliveryLink.trim()
    );

    if (res.success) {
      setSelectedOrderForDelivery(null);
      setDeliveryMessage('');
      setDeliveryLink('');
    } else {
      setDeliveryError(res.message);
    }
  };

  const handleOpenDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeOrder) return;
    if (!disputeReason.trim() || !disputeDescription.trim()) return;

    await openDispute(disputeOrder.id, disputeReason.trim(), disputeDescription.trim());
    setDisputeOrder(null);
    setDisputeReason('');
    setDisputeDescription('');
  };

  const handleConfirmBuyerApproval = async () => {
    if (!ratingOrder) return;
    await buyerApproveOrder(ratingOrder.id, ratingVal, ratingReview);
    setRatingOrder(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {language === 'bn' ? 'মাই ওয়ার্কস্পেস ও অর্ডার হাব' : 'My Workspace & Order Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'bn'
              ? 'সার্ভিস অর্ডার ট্র্যাক করুন, কাজ ডেলিভার দিন এবং এসক্রো ব্যালেন্স নিশ্চিত করুন।'
              : 'Real-time 24h escrow order tracker, job applicant reviews, and delivery management.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isPublishingAllowed ? (
            <>
              <button
                onClick={() => setShowCreateService(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Service</span>
              </button>

              <button
                onClick={() => setShowCreateJob(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Job</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('/dashboard/publishing')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enable Seller & Job Access (৳50)</span>
            </button>
          )}
        </div>
      </div>

      {/* Workspace Live Progress Pipeline Overview */}
      <WorkspaceProgressOverview
        orders={userOrders}
        receivedOrders={userReceivedOrders}
        jobs={userJobs}
        activeFilter={progressFilter}
        onSelectFilter={(filter) => {
          setProgressFilter(filter);
          if (filter === 'in_progress' || filter === 'delivered') {
            if (activeTab !== 'my_orders' && activeTab !== 'received_orders') {
              setActiveTab('received_orders');
            }
          }
        }}
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('my_orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'my_orders'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Purchased Orders ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('received_orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'received_orders'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Client Orders to Deliver ({userReceivedOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my_services')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'my_services'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Published Services ({userServices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my_jobs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'my_jobs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Posted Jobs ({userJobs.length})</span>
        </button>
      </div>

      {/* Tab 1: My Purchased Orders */}
      {activeTab === 'my_orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">You haven't placed any orders yet</p>
              <button
                onClick={() => onNavigate('/dashboard/services')}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            userOrders
              .filter((order) => {
                if (progressFilter === 'all') return true;
                if (progressFilter === 'in_progress') return order.status === 'in_progress';
                if (progressFilter === 'delivered') return order.status === 'delivered' || order.status === 'waiting_approval';
                if (progressFilter === 'completed') return order.status === 'completed';
                return true;
              })
              .map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">#{order.id}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'completed'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : order.status === 'delivered' || order.status === 'waiting_approval'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : order.status === 'disputed'
                            ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Seller: {order.sellerName}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs font-mono font-extrabold text-slate-900 dark:text-white">
                      ৳{order.amount.toLocaleString()}
                    </p>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Escrow Secured</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{order.serviceTitle}</h3>
                  {order.buyerRequirementsText && (
                    <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong>Your Requirements:</strong> {order.buyerRequirementsText}
                    </p>
                  )}
                </div>

                {/* Real-time Visual Progress Bar & Milestones */}
                <TaskProgressBar order={order} isSeller={false} />

                {/* Delivery review box */}
                {order.status === 'delivered' && (
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                        <span>Seller Delivered Work • 24-Hour Review Window Active</span>
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200 font-bold">
                        Auto-Release in 24h
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      <strong>Delivery Message:</strong> {order.deliveryMessage}
                    </p>
                    {order.deliveryAttachment && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        <strong>Deliverables Link:</strong>{' '}
                        <a href={order.deliveryAttachment} target="_blank" rel="noreferrer" className="underline font-mono">
                          {order.deliveryAttachment}
                        </a>
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setRatingOrder(order)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Work & Release Payout (৳{order.amount})</span>
                      </button>

                      <button
                        onClick={() => setDisputeOrder(order)}
                        className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 font-bold text-xs border border-red-200 dark:border-red-800"
                      >
                        Open Dispute
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Received Orders to Deliver */}
      {activeTab === 'received_orders' && (
        <div className="space-y-4">
          {userReceivedOrders.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No client orders yet</p>
              <p className="text-xs text-slate-400">Publish attractive gigs with competitive pricing to receive orders.</p>
            </div>
          ) : (
            userReceivedOrders
              .filter((order) => {
                if (progressFilter === 'all') return true;
                if (progressFilter === 'in_progress') return order.status === 'in_progress';
                if (progressFilter === 'delivered') return order.status === 'delivered' || order.status === 'waiting_approval';
                if (progressFilter === 'completed') return order.status === 'completed';
                return true;
              })
              .map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">#{order.id}</span>
                      <span className="text-xs text-slate-400">• Client: {order.buyerName}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Deadline: {order.deadline}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                      ৳{order.sellerEarning.toLocaleString()} Payout
                    </p>
                    <span className="text-[10px] text-slate-400">(Platform fee: ৳{order.platformFee})</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{order.serviceTitle}</h3>
                  <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <strong>Buyer Instructions:</strong> {order.buyerRequirementsText}
                  </p>
                </div>

                {/* Freelancer Interactive Visual Progress Bar with Instant Status Updates */}
                <TaskProgressBar
                  order={order}
                  isSeller={true}
                  onUpdateProgress={(pct, note) => updateOrderProgress(order.id, pct, note)}
                  onToggleMilestone={(mId) => toggleOrderMilestone(order.id, mId)}
                />

                <div className="flex items-center justify-between pt-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'completed'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : order.status === 'delivered'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {order.status.replace('_', ' ')}
                  </span>

                  {order.status === 'in_progress' && (
                    <button
                      onClick={() => {
                        setSelectedOrderForDelivery(order);
                        setDeliveryError('');
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Deliver Completed Work</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: My Published Services */}
      {activeTab === 'my_services' && (
        <div className="space-y-4">
          {userServices.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No gigs created yet</p>
              {isPublishingAllowed ? (
                <button
                  onClick={() => setShowCreateService(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Create First Gig
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('/dashboard/publishing')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Activate Seller Access (৳50)
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                      {srv.category}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">৳{srv.price}</span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">{srv.title}</h3>
                  <p className="text-[11px] text-slate-400">
                    Orders completed: {srv.ordersCount} • Rating: {srv.providerRating}★
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: My Posted Jobs */}
      {activeTab === 'my_jobs' && (
        <div className="space-y-4">
          {userJobs.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No jobs posted yet</p>
              {isPublishingAllowed ? (
                <button
                  onClick={() => setShowCreateJob(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  Post a Microtask
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('/dashboard/publishing')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Activate Job Posting (৳50)
                </button>
              )}
            </div>
          ) : (
            userJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{job.title}</h3>
                    <p className="text-xs text-slate-400">Budget: ৳{job.budget} • Proposals: {job.applicationsCount}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono">
                    {job.status.toUpperCase()}
                  </span>
                </div>

                {/* Microtask Visual Progress Bar */}
                {(() => {
                  const jobProgress =
                    job.status === 'completed'
                      ? 100
                      : job.submissionDetails
                      ? 75
                      : job.selectedWorkerId || job.status === 'in_progress'
                      ? 50
                      : 25;
                  return (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {jobProgress === 100
                            ? 'Task Completed & Payout Released'
                            : jobProgress === 75
                            ? 'Work Submitted — Pending Employer Review'
                            : jobProgress === 50
                            ? 'Worker Assigned & Work in Progress'
                            : 'Open for Freelancer Proposals'}
                        </span>
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                          {jobProgress}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${
                            jobProgress === 100
                              ? 'from-emerald-500 to-teal-500'
                              : jobProgress === 75
                              ? 'from-blue-500 to-indigo-500'
                              : jobProgress === 50
                              ? 'from-purple-500 to-indigo-500'
                              : 'from-amber-500 to-orange-500'
                          } transition-all duration-500`}
                          style={{ width: `${jobProgress}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}

                {job.submissionDetails ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Worker ({job.submissionDetails.workerName}) Submitted Task Proof:
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {job.submissionDetails.message}
                    </p>
                    {job.submissionDetails.linksOrFiles && (
                      <p className="text-xs text-blue-600 font-mono">
                        Proof link: {job.submissionDetails.linksOrFiles}
                      </p>
                    )}
                    {job.status !== 'completed' && (
                      <button
                        onClick={() => approveJobWorkAndPayout(job.id)}
                        className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        Approve & Release ৳{job.budget} Payout
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Waiting for worker submissions...</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Service Modal */}
      {showCreateService && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Publish New Service Gig</h2>
            
            {srvError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">{srvError}</div>
            )}

            <form onSubmit={handleCreateServiceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Gig Title</label>
                <input
                  type="text"
                  required
                  value={srvTitle}
                  onChange={(e) => setSrvTitle(e.target.value)}
                  placeholder="e.g. I will create a responsive landing page"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    value={srvCategory}
                    onChange={(e) => setSrvCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option>Web Development</option>
                    <option>Graphic Design</option>
                    <option>Video Editing</option>
                    <option>Content Writing</option>
                    <option>Digital Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Price (৳)</label>
                  <input
                    type="number"
                    min="100"
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Delivery (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={srvDays}
                    onChange={(e) => setSrvDays(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Gig Description</label>
                <textarea
                  rows={3}
                  required
                  value={srvDesc}
                  onChange={(e) => setSrvDesc(e.target.value)}
                  placeholder="Describe your skills and what deliverables you will provide..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Buyer Instructions / Requirements</label>
                <textarea
                  rows={2}
                  value={srvReq}
                  onChange={(e) => setSrvReq(e.target.value)}
                  placeholder="What info do you need from the client to start?"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateService(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Publish Gig
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Job Modal */}
      {showCreateJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Post a Job / Microtask</h2>
            
            {jobError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">{jobError}</div>
            )}

            <form onSubmit={handleCreateJobSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Test mobile app checkout and provide screenshot"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option>Microtasks</option>
                    <option>Data Entry</option>
                    <option>Video & Animation</option>
                    <option>Writing</option>
                    <option>Design</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Budget (৳)</label>
                  <input
                    type="number"
                    min="50"
                    value={jobBudget}
                    onChange={(e) => setJobBudget(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={jobDeadline}
                    onChange={(e) => setJobDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Job Description</label>
                <textarea
                  rows={3}
                  required
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Explain the task instructions clearly..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Requirements / Proof Needed (One per line)</label>
                <textarea
                  rows={2}
                  value={jobRequirementsList}
                  onChange={(e) => setJobRequirementsList(e.target.value)}
                  placeholder="1. Screenshot proof\n2. User ID"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateJob(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Post Job & Lock ৳{jobBudget}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deliver Order Modal */}
      {selectedOrderForDelivery && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Deliver Work Proof</h2>
            
            {deliveryError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">{deliveryError}</div>
            )}

            <form onSubmit={handleDeliverySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Delivery Description / Notes</label>
                <textarea
                  rows={4}
                  required
                  value={deliveryMessage}
                  onChange={(e) => setDeliveryMessage(e.target.value)}
                  placeholder="Describe what you completed, details, login info or instructions..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Deliverables Link (Google Drive / GitHub / URL)</label>
                <input
                  type="url"
                  value={deliveryLink}
                  onChange={(e) => setDeliveryLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForDelivery(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Submit Final Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {disputeOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-red-600 dark:text-red-400">Open Escrow Dispute</h2>
            <p className="text-xs text-slate-500">
              Disputed funds will be frozen until TaskBD Admin mediates and inspects proof.
            </p>

            <form onSubmit={handleOpenDispute} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Dispute Reason</label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="">Select reason</option>
                  <option value="Incomplete or wrong work">Incomplete or wrong work</option>
                  <option value="Seller unresponsive">Seller unresponsive</option>
                  <option value="Quality below agreed standard">Quality below agreed standard</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Explain the issue</label>
                <textarea
                  rows={4}
                  required
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  placeholder="Provide detailed breakdown of what went wrong..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDisputeOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold"
                >
                  Submit Dispute to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review / Rating Modal */}
      {ratingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Approve Order & Release Escrow
            </h2>
            <p className="text-xs text-slate-500">
              ৳{ratingOrder.sellerEarning} will be transferred to seller {ratingOrder.sellerName}.
            </p>

            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingVal(star)}
                  className="p-1 text-2xl focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= ratingVal
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <textarea
                rows={3}
                value={ratingReview}
                onChange={(e) => setRatingReview(e.target.value)}
                placeholder="Write an optional review for the seller..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRatingOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBuyerApproval}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                Confirm Approval & Release Funds
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
