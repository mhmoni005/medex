import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExamSpecialtyItem, MobileBankingGateway } from '../types';
import {
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Download,
  Smartphone,
  PhoneCall,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';

export const SubscriptionPortalView: React.FC = () => {
  const {
    candidate,
    examSpecialties,
    transactions,
    submitPaymentTransaction,
    setActiveTab
  } = useApp();

  // Top Sub-tabs: 'billing' | 'subscriptions'
  const [activeSubTab, setActiveSubTab] = useState<'billing' | 'subscriptions'>('billing');

  // Checkout Step state for Billing Panel: 1 (Package) | 2 (Duration) | 3 (Operator) | 4 (Security) | 5 (Result)
  const [checkoutStep, setCheckoutStep] = useState<number>(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<ExamSpecialtyItem | null>(null);
  
  // Step 2: Duration selection
  const [selectedDuration, setSelectedDuration] = useState<{
    months: number;
    title: string;
    priceBDT: number;
    monthlyPrice: number;
    savingsTag?: string;
  }>({
    months: 1,
    title: '1 Month Access Pass',
    priceBDT: 600,
    monthlyPrice: 600
  });

  // Step 3: Payment Operator selection
  const [gateway, setGateway] = useState<MobileBankingGateway | 'SSLCommerz'>('bKash');

  // Step 4: Security Verification form
  const [accountNumber, setAccountNumber] = useState(candidate.phone || '01712345678');
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper description generator for specialty packages
  const getSpecialtyDescription = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('ms residency') || lower.includes('surgery faculty')) {
      return 'Surgery Faculty postgraduate residency preparation pack';
    }
    if (lower.includes('md residency') && lower.includes('medicine')) {
      return 'Medicine Faculty specialty postgrad residency preparation pack';
    }
    if (lower.includes('basic & paraclinical')) {
      return 'Basic & Paraclinical sciences licensing mock bundle';
    }
    if (lower.includes('mrcp')) {
      return 'MRCP Royal College clinical knowledge license';
    }
    if (lower.includes('mrcs')) {
      return 'MRCS Royal College surgical anatomy & practices license';
    }
    if (lower.includes('fcps p-1') || lower.includes('fcps part')) {
      return 'Medicine Faculty specialty postgrad residency preparation pack';
    }
    if (lower.includes('diploma')) {
      return 'Medicine Faculty specialty postgrad residency preparation pack';
    }
    return 'Complete dynamic specialty license simulation pack';
  };

  const handleSelectSpecialty = (spec: ExamSpecialtyItem) => {
    setSelectedSpecialty(spec);
    setCheckoutStep(2);
    setFeedbackMsg(null);
  };

  const handleConfirmVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim() || trxId.length < 5) {
      setFeedbackMsg({ type: 'error', text: 'Please enter a valid Transaction ID (e.g. TXN-BK-991204 or 8N29X7K9L).' });
      return;
    }

    setIsSubmitting(true);
    const mockTierId = selectedSpecialty ? `tier_${selectedSpecialty.id}` : 'tier_custom';
    
    // Fallback gateway to bKash if SSLCommerz selected
    const chosenGateway = gateway === 'SSLCommerz' ? 'bKash' : gateway;

    const res = await submitPaymentTransaction(
      mockTierId,
      chosenGateway,
      accountNumber,
      trxId.trim().toUpperCase(),
      {
        tierName: selectedSpecialty ? `${selectedSpecialty.name}` : 'Specialty License Pass',
        amountBDT: selectedDuration.priceBDT,
        durationMonths: selectedDuration.months
      }
    );
    setIsSubmitting(false);

    if (res.success) {
      setFeedbackMsg({ type: 'success', text: 'License successfully activated!' });
      setCheckoutStep(5);
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  const handleDownloadInvoice = (txn: any) => {
    alert(`Downloading Invoice PDF for Transaction ID: ${txn.trxId || txn.id}\nPackage: ${txn.tierName || txn.packageTitle}\nAmount: BDT ${txn.amountBDT}`);
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">

      {/* TOP SUB-TAB NAVIGATION */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 rounded-t-2xl px-6 pt-4">
        <div className="flex items-center justify-center gap-12 sm:gap-16">
          <button
            onClick={() => setActiveSubTab('billing')}
            className={`text-sm sm:text-base font-extrabold pb-3 transition-all relative ${
              activeSubTab === 'billing'
                ? 'text-blue-900 dark:text-blue-400 font-black'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Billing Panel
            {activeSubTab === 'billing' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('subscriptions')}
            className={`text-sm sm:text-base font-extrabold pb-3 transition-all relative ${
              activeSubTab === 'subscriptions'
                ? 'text-blue-900 dark:text-blue-400 font-black'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            My Subscriptions
            {activeSubTab === 'subscriptions' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: BILLING PANEL (IMAGE 1)
          ===================================================================== */}
      {activeSubTab === 'billing' && (
        <div className="space-y-6 animate-fadeIn">

          {/* 1. SECURE CHECKOUT CONSOLE HEADER */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-wide uppercase">
                  SECURE CHECKOUT CONSOLE
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  MedExam Pro Bangladesh Official Payment Gateway Pipeline (SSLCommerz)
                </p>
              </div>
            </div>

            {/* Step Progress Pipeline (1 Package -> 2 Duration -> 3 Operator -> 4 Security -> 5 Result) */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between max-w-3xl mx-auto relative px-2">
                
                {/* Connecting Line */}
                <div className="absolute top-4 left-10 right-10 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />

                {/* Step 1 */}
                <button
                  onClick={() => setCheckoutStep(1)}
                  className="flex flex-col items-center gap-1.5 z-10 group"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      checkoutStep === 1
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : checkoutStep > 1
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    1
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      checkoutStep === 1 ? 'text-slate-900 dark:text-white font-black' : 'text-slate-400'
                    }`}
                  >
                    Package
                  </span>
                </button>

                {/* Step 2 */}
                <button
                  onClick={() => selectedSpecialty && setCheckoutStep(2)}
                  disabled={!selectedSpecialty}
                  className="flex flex-col items-center gap-1.5 z-10 group"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      checkoutStep === 2
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : checkoutStep > 2
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      checkoutStep === 2 ? 'text-slate-900 dark:text-white font-black' : 'text-slate-400'
                    }`}
                  >
                    Duration
                  </span>
                </button>

                {/* Step 3 */}
                <button
                  onClick={() => selectedSpecialty && setCheckoutStep(3)}
                  disabled={!selectedSpecialty}
                  className="flex flex-col items-center gap-1.5 z-10 group"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      checkoutStep === 3
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : checkoutStep > 3
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    3
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      checkoutStep === 3 ? 'text-slate-900 dark:text-white font-black' : 'text-slate-400'
                    }`}
                  >
                    Operator
                  </span>
                </button>

                {/* Step 4 */}
                <button
                  onClick={() => selectedSpecialty && setCheckoutStep(4)}
                  disabled={!selectedSpecialty}
                  className="flex flex-col items-center gap-1.5 z-10 group"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      checkoutStep === 4
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : checkoutStep > 4
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    4
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      checkoutStep === 4 ? 'text-slate-900 dark:text-white font-black' : 'text-slate-400'
                    }`}
                  >
                    Security
                  </span>
                </button>

                {/* Step 5 */}
                <button
                  onClick={() => checkoutStep === 5}
                  disabled={checkoutStep !== 5}
                  className="flex flex-col items-center gap-1.5 z-10 group"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      checkoutStep === 5
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    5
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      checkoutStep === 5 ? 'text-slate-900 dark:text-white font-black' : 'text-slate-400'
                    }`}
                  >
                    Result
                  </span>
                </button>

              </div>
            </div>
          </div>

          {/* STEP 1: SELECT SPECIALTY LICENSE PACKAGE */}
          {checkoutStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                STEP 1: SELECT SPECIALTY LICENSE PACKAGE
              </h2>

              <div className="space-y-3">
                {examSpecialties.map(spec => (
                  <div
                    key={spec.id}
                    onClick={() => handleSelectSpecialty(spec)}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-2xl p-4 sm:p-5 flex items-center justify-between transition cursor-pointer shadow-2xs hover:shadow-md"
                  >
                    <div className="min-w-0 pr-4 space-y-1">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {spec.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {getSpecialtyDescription(spec.name)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-200">
                        From 600 BDT/Mo
                      </span>
                      <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT DURATION */}
          {checkoutStep === 2 && selectedSpecialty && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                    STEP 2: CHOOSE DURATION
                  </span>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedSpecialty.name}
                  </h2>
                </div>
                <button
                  onClick={() => setCheckoutStep(1)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white underline"
                >
                  Change Specialty
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { months: 1, title: '1 Month Access Pass', priceBDT: 600, monthlyPrice: 600 },
                  { months: 3, title: '3 Months Intensive Pass', priceBDT: 1500, monthlyPrice: 500, savingsTag: 'Save ৳ 300' },
                  { months: 6, title: '6 Months Complete Prep', priceBDT: 2500, monthlyPrice: 416, savingsTag: 'Save ৳ 1,100' },
                  { months: 12, title: '12 Months Full Residency Pass', priceBDT: 4500, monthlyPrice: 375, savingsTag: 'Best Value • Save ৳ 2,700' }
                ].map(plan => {
                  const isSelected = selectedDuration.months === plan.months;

                  return (
                    <div
                      key={plan.months}
                      onClick={() => setSelectedDuration(plan)}
                      className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {plan.title}
                          </h3>
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">
                            BDT {plan.priceBDT.toLocaleString()} total
                          </p>
                        </div>

                        {plan.savingsTag && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            {plan.savingsTag}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
                        <span>~ BDT {plan.monthlyPrice}/mo</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check size={12} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setCheckoutStep(3)}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                >
                  <span>Continue to Operator Selection</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT PAYMENT OPERATOR */}
          {checkoutStep === 3 && selectedSpecialty && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                    STEP 3: PAYMENT GATEWAY OPERATOR
                  </span>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedSpecialty.name} ({selectedDuration.title})
                  </h2>
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">
                    Payable Amount: BDT {selectedDuration.priceBDT.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setCheckoutStep(2)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
                >
                  Change Duration
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Mobile Financial Service or Card:
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'bKash', label: 'bKash', color: 'bg-[#D12053] text-white' },
                    { id: 'Nagad', label: 'Nagad', color: 'bg-[#F7931E] text-white' },
                    { id: 'Rocket', label: 'Rocket', color: 'bg-[#8C288E] text-white' },
                    { id: 'SSLCommerz', label: 'SSLCommerz / Card', color: 'bg-slate-800 text-white' }
                  ].map(op => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => setGateway(op.id as any)}
                      className={`p-4 rounded-xl text-xs font-black transition border flex flex-col items-center justify-center gap-2 ${
                        gateway === op.id
                          ? `${op.color} border-transparent ring-2 ring-blue-500 shadow-md`
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Smartphone size={20} />
                      <span>{op.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions Banner */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <p className="font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                  <PhoneCall size={14} />
                  <span>{gateway} Payment Steps:</span>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  <li>Open your <strong>{gateway} App</strong> or dial Mobile Banking USSD Code.</li>
                  <li>Select <strong>"Make Payment"</strong> or <strong>"Send Money"</strong>.</li>
                  <li>Merchant Account Number: <strong className="text-blue-600 font-mono">01700-000000</strong></li>
                  <li>Enter Payable Amount: <strong className="text-emerald-600 font-bold">BDT {selectedDuration.priceBDT}</strong></li>
                  <li>Copy the 8 to 10 character <strong>TrxID</strong> from your receipt SMS.</li>
                </ol>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setCheckoutStep(4)}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                >
                  <span>Proceed to Security Verification</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SECURITY & TRANSACTION VERIFICATION */}
          {checkoutStep === 4 && selectedSpecialty && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                    STEP 4: SECURITY & TRANSACTION VERIFICATION
                  </span>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Confirm Payment Details
                  </h2>
                </div>
                <button
                  onClick={() => setCheckoutStep(3)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
                >
                  Back to Operators
                </button>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedSpecialty.name}</p>
                  <p className="text-slate-500">{selectedDuration.title} • Gateway: {gateway}</p>
                </div>
                <span className="text-base font-black text-emerald-600">
                  BDT {selectedDuration.priceBDT.toLocaleString()}
                </span>
              </div>

              {feedbackMsg && (
                <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  feedbackMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {feedbackMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{feedbackMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleConfirmVerification} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Mobile Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Transaction ID (TrxID)
                  </label>
                  <input
                    type="text"
                    value={trxId}
                    onChange={e => setTrxId(e.target.value.toUpperCase())}
                    placeholder="e.g. TXN-BK-991204 or 8N29X7K9L"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-mono font-bold tracking-wider text-xs uppercase rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={16} />
                    <span>{isSubmitting ? 'Verifying Pipeline...' : 'Verify TrxID & Activate Specialty License'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 5: RESULT & RECEIPT */}
          {checkoutStep === 5 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xs text-center space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  License Activated Successfully!
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your postgraduate exam specialty package has been unlocked in the MedExam Pro pipeline.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2 font-medium">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">TrxID Reference:</span>
                  <span className="font-mono font-extrabold text-emerald-600">{trxId || 'TXN-BK-991204'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">Package:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedSpecialty?.name || 'MS Residency'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Paid Amount:</span>
                  <span className="font-extrabold text-blue-600">BDT {selectedDuration.priceBDT.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('qbank')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition"
                >
                  Start Solving Q-Bank
                </button>

                <button
                  onClick={() => setActiveSubTab('subscriptions')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 font-extrabold text-xs transition"
                >
                  View My Subscriptions
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =====================================================================
          TAB 2: MY SUBSCRIPTIONS (IMAGE 2)
          ===================================================================== */}
      {activeSubTab === 'subscriptions' && (
        <div className="space-y-6 animate-fadeIn">

          {/* 1. MY EXAM LICENSES & RECEIPTS HEADER */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-1">
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-wide uppercase">
              MY EXAM LICENSES & RECEIPTS
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Examine active registrations, remaining access counts, and billing history
            </p>
          </div>

          {/* 2. ACTIVE DISCIPLINE LICENSES SECTION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              ACTIVE DISCIPLINE LICENSES
            </h2>

            {candidate.hasActiveSubscription ? (
              <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 uppercase">
                      Active
                    </span>
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                      {candidate.activeSubscriptionTier || 'FCPS Part I Special Pack'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Full MCQ & SBA Question Bank Access • Expiry: {candidate.subscriptionExpiryDate || '2026-12-31'}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('qbank')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-xs"
                >
                  Access Q-Bank
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                No active specialty registrations detected. Standard question banks unlocked. Subscribe to access premium test-live mock exams.
              </div>
            )}
          </div>

          {/* 3. HISTORIC PAYMENT RECORDS SECTION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              HISTORIC PAYMENT RECORDS
            </h2>

            <div className="space-y-3">
              {transactions.map(txn => (
                <div
                  key={txn.id}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition"
                >
                  {/* Left Column: TxnID, Package Title, Date & Gateway */}
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white font-mono">
                      {txn.trxId || txn.id}
                    </h3>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {txn.tierName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Date: {txn.timestamp} ({txn.gateway})
                    </p>
                  </div>

                  {/* Right Column: Status badge, Price, Download Invoice */}
                  <div className="flex flex-col sm:items-end gap-1 shrink-0">
                    <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Successful
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      BDT {txn.amountBDT.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDownloadInvoice(txn)}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>Download Invoice PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
