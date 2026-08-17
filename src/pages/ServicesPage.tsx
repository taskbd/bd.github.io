import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Filter,
  Star,
  Clock,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  PlusCircle,
  Eye,
  X,
  AlertCircle,
} from 'lucide-react';
import { Service } from '../types';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
  onOpenOrderModal?: (service: Service) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { services, createServiceOrder, userWallet } = useData();
  const { language } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderRequirements, setOrderRequirements] = useState('');
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  const categories = [
    'All',
    'Web Development',
    'Graphic Design',
    'Video Editing',
    'Content Writing',
    'Digital Marketing',
    'AI & Automation',
  ];

  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === 'All' || srv.category === selectedCategory;
    const matchesSearch =
      srv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.providerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && srv.status === 'active';
  });

  const handleStartOrder = (srv: Service) => {
    setSelectedService(srv);
    setIsOrdering(true);
    setOrderRequirements('');
    setOrderError('');
    setOrderSuccess(false);
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    if (!currentUser) {
      onNavigate('/login');
      return;
    }
    if (!orderRequirements.trim()) {
      setOrderError('Please outline your project instructions or requirements.');
      return;
    }

    if (userWallet.availableBalance < selectedService.price) {
      setOrderError(
        `Insufficient balance. You need ৳${selectedService.price.toLocaleString()}, but your wallet has ৳${userWallet.availableBalance.toLocaleString()}. Please deposit first.`
      );
      return;
    }

    const res = await createServiceOrder(selectedService.id, orderRequirements.trim());
    if (res.success) {
      setOrderSuccess(true);
      setCreatedOrderId(res.orderId || '');
    } else {
      setOrderError(res.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'bn' ? 'প্রফেশনাল সার্ভিস মার্কেটপ্লেস' : 'Professional Services Marketplace'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'bn'
              ? 'টাস্কবিডির ভেরিফায়েড ফ্রিল্যান্সারদের থেকে নিশ্চিন্তে সার্ভিস কিনুন (২৪ ঘণ্টার এসক্রো প্রোটেকশনসহ)।'
              : 'Hire verified Bangladeshi creators & developers with guaranteed 24-hour escrow protection.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser?.publishingStatus === 'active' ? (
            <button
              onClick={() => onNavigate('/dashboard/workspace')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Gig</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('/dashboard/publishing')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Become a Seller (৳50)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services, skills, or sellers..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredServices.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No services match your query</p>
            <p className="text-xs text-slate-400">Try adjusting your keyword search or category filter.</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={service.thumbnail}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                    ৳{service.price.toLocaleString()}
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-blue-600/90 text-white text-[10px] font-semibold">
                    {service.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                      {service.providerName}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{service.providerRating.toFixed(1)}</span>
                      <span className="text-slate-400 text-[10px]">({service.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 mt-3 pt-3">
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{service.deliveryDays} Days</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold"
                    title="Quick Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleStartOrder(service)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                  >
                    <span>Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Service Detail Modal */}
      {selectedService && !isOrdering && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={selectedService.thumbnail}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  {selectedService.category}
                </span>
                <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                  ৳{selectedService.price.toLocaleString()}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedService.title}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedService.description}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <p className="font-bold text-slate-900 dark:text-white">Buyer Requirements:</p>
                <p className="text-slate-600 dark:text-slate-400">{selectedService.requirements}</p>
              </div>

              {selectedService.faqs && selectedService.faqs.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Frequently Asked Questions:</p>
                  {selectedService.faqs.map((faq, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Q: {faq.question}</p>
                      <p className="text-slate-500">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Protected by TaskBD 24h Escrow Vault</span>
              </div>

              <button
                onClick={() => setIsOrdering(true)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Proceed to Order (৳{selectedService.price})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Placement Modal with Escrow Confirmation */}
      {selectedService && isOrdering && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsOrdering(false);
                setSelectedService(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            {orderSuccess ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  Order <strong>#{createdOrderId}</strong> is now created. ৳{selectedService.price} has been securely locked in TaskBD Escrow.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsOrdering(false);
                      setSelectedService(null);
                      onNavigate('/dashboard/workspace');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
                  >
                    View Order in Workspace
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmOrder} className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Place Escrow-Protected Order
                  </h2>
                  <p className="text-xs text-slate-500">
                    Service: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedService.title}</span>
                  </p>
                </div>

                {orderError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{orderError}</span>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 text-xs space-y-2">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Order Total:</span>
                    <span className="font-mono font-bold">৳{selectedService.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Your Wallet Balance:</span>
                    <span className="font-mono font-bold">৳{userWallet.availableBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-blue-700 dark:text-blue-300 pt-1.5 border-t border-blue-200 dark:border-blue-800">
                    <span>Escrow Hold:</span>
                    <span>৳{selectedService.price.toLocaleString()} (Locked until delivery approval)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Requirements & Project Instructions
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={orderRequirements}
                    onChange={(e) => setOrderRequirements(e.target.value)}
                    placeholder="Provide full details, brand colors, text content, or asset links for the seller..."
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Your payment will only be released to the seller after you inspect the submitted files and approve the order. If they fail to deliver, you get a full 100% refund.
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOrdering(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Confirm & Lock Escrow (৳{selectedService.price})
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
