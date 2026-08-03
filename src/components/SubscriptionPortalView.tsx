import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubscriptionTier, MobileBankingGateway } from '../types';
import {
  CreditCard,
  CheckCircle2,
  Crown,
  Lock,
  Sparkles,
  ShieldCheck,
  X,
  Smartphone,
  PhoneCall,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const SubscriptionPortalView: React.FC = () => {
  const {
    subscriptionTiers,
    candidate,
    submitPaymentTransaction
  } = useApp();

  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gateway, setGateway] = useState<MobileBankingGateway>('bKash');
  const [accountNumber, setAccountNumber] = useState(candidate.phone || '01712345678');
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleOpenGateway = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setTrxId('');
    setFeedbackMsg(null);
    setIsModalOpen(true);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier) return;

    if (!trxId.trim() || trxId.length < 6) {
      setFeedbackMsg({ type: 'error', text: 'Please enter a valid Transaction ID (e.g., 8N29X7K9L).' });
      return;
    }

    setIsSubmitting(true);
    const res = await submitPaymentTransaction(selectedTier.id, gateway, accountNumber, trxId);
    setIsSubmitting(false);

    if (res.success) {
      setFeedbackMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1800);
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  const gatewayColors: Record<MobileBankingGateway, { bg: string; text: string; border: string }> = {
    bKash: { bg: 'bg-[#D12053]', text: 'text-white', border: 'border-[#D12053]' },
    Nagad: { bg: 'bg-[#F7931E]', text: 'text-white', border: 'border-[#F7931E]' },
    Rocket: { bg: 'bg-[#8C288E]', text: 'text-white', border: 'border-[#8C288E]' }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown size={18} className="text-amber-400 fill-amber-400" />
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 uppercase">
              Subscription Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold">Postgraduate Exam Packages</h1>
          <p className="text-xs text-slate-300 mt-1">
            Unlock 8,500+ Recall SBAs, BCPS/BSMMU Pattern Mock Simulator, and Exclusive Specialty Peer Chat Lounge.
          </p>
        </div>

        {candidate.hasActiveSubscription && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-0.5">
              <CheckCircle2 size={16} />
              <span>Active Subscription</span>
            </div>
            <p className="text-[11px] text-slate-300">{candidate.activeSubscriptionTier}</p>
          </div>
        )}
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionTiers.map(tier => {
          const isCurrentActive = candidate.activeSubscriptionTier === tier.name;

          return (
            <div
              key={tier.id}
              className={`relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border transition shadow-md flex flex-col justify-between ${
                tier.popularBadge
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {tier.popularBadge && (
                <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md uppercase tracking-wider">
                  Most Popular Pass
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {tier.specialtyTag}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    {tier.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    ৳ {tier.priceBDT.toLocaleString()}
                  </span>
                  {tier.originalPriceBDT && (
                    <span className="text-xs text-slate-400 line-through">
                      ৳ {tier.originalPriceBDT.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    / {tier.durationMonths} Months
                  </span>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                {isCurrentActive ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    <span>Current Active Package</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenGateway(tier)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
                  >
                    <Smartphone size={16} />
                    <span>Pay with bKash / Nagad / Rocket</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Local Mobile Banking Gateway Modal */}
      {isModalOpen && selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-3 text-white shadow-lg flex items-center justify-center">
                <Smartphone size={28} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Mobile Banking Payment Gateway</h2>
                <p className="text-xs text-slate-400">Instant Subscription Activation | MedExam Portal</p>
              </div>
            </div>

            {/* Selected Package Summary */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-400">{selectedTier.name}</p>
                <p className="text-[11px] text-slate-400">{selectedTier.durationMonths} Months Full Access</p>
              </div>
              <span className="text-xl font-extrabold text-white">৳ {selectedTier.priceBDT.toLocaleString()}</span>
            </div>

            {/* Gateway Selection Tabs */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-bold text-slate-300">Select Payment Method:</label>
              <div className="grid grid-cols-3 gap-3">
                {(['bKash', 'Nagad', 'Rocket'] as MobileBankingGateway[]).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGateway(g)}
                    className={`py-3 px-3 rounded-2xl text-xs font-extrabold transition border flex flex-col items-center justify-center gap-1 ${
                      gateway === g
                        ? `${gatewayColors[g].bg} ${gatewayColors[g].text} ${gatewayColors[g].border} shadow-lg ring-2 ring-white/20`
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <span>{g}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Instructions Box */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-2 mb-6">
              <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                <PhoneCall size={14} />
                <span>{gateway} Payment Instructions:</span>
              </p>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                <li>Open your <strong>{gateway} App</strong> or dial Mobile Banking Code.</li>
                <li>Select <strong>"Make Payment"</strong> or <strong>"Send Money"</strong>.</li>
                <li>Enter Merchant Account Number: <strong className="text-amber-300 font-mono">01700-000000</strong></li>
                <li>Enter Amount: <strong className="text-emerald-300 font-bold">৳ {selectedTier.priceBDT}</strong></li>
                <li>Copy the 8 to 10 digit <strong>TrxID</strong> (Transaction ID) from your SMS receipt.</li>
              </ol>
            </div>

            {feedbackMsg && (
              <div className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
                feedbackMsg.type === 'success' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' : 'bg-rose-950 border border-rose-800 text-rose-300'
              }`}>
                {feedbackMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your {gateway} Account Mobile Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  placeholder="01712345678"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3.5 py-3 border border-slate-700 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Transaction ID (TrxID)</label>
                <input
                  type="text"
                  value={trxId}
                  onChange={e => setTrxId(e.target.value.toUpperCase())}
                  placeholder="e.g. 8N29X7K9L"
                  className="w-full bg-slate-800 text-emerald-400 font-mono tracking-widest text-sm uppercase rounded-xl px-3.5 py-3 border border-slate-700 focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/40"
              >
                {isSubmitting ? 'Verifying Transaction...' : 'Verify TrxID & Activate Subscription'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
