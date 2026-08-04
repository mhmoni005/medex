import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCheck,
  CreditCard,
  Users,
  Search,
  LogOut,
  Mail,
  Award,
  BookOpen,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    questions,
    approveRecallQuestion,
    rejectRecallQuestion,
    transactions,
    approveTransaction,
    candidate,
    adminEmail,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    openAuthModal
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'recalls' | 'payments' | 'candidates' | 'settings'>('recalls');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [emailInput, setEmailInput] = useState('mhmoni005@gmail.com');
  const [passError, setPassError] = useState('');

  // Filtering pending questions & transactions
  const pendingQuestions = questions.filter(q => q.status === 'pending_approval');
  const approvedQuestions = questions.filter(q => q.status === 'approved');
  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    const ok = loginAdmin(emailInput, passcodeInput);
    if (!ok) {
      setPassError(`Invalid login credentials. Admin Mail ID is ${adminEmail}`);
    }
  };

  // If Admin is NOT logged in, show Admin Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 p-3 text-white mb-4 shadow-lg flex items-center justify-center">
            <ShieldAlert size={32} />
          </div>

          <h1 className="text-xl font-extrabold text-white">Faculty Admin Authentication Required</h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Access restricted to Senior Faculty Supervisors and Portal Administrators. Log in with your Admin Mail ID (<strong className="text-amber-300 font-mono">{adminEmail}</strong>).
          </p>

          {passError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 mt-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Mail ID
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="mhmoni005@gmail.com"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password / Security Passcode
              </label>
              <input
                type="password"
                value={passcodeInput}
                onChange={e => setPasscodeInput(e.target.value)}
                placeholder="mhmoni005"
                className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs transition shadow-lg shadow-amber-950/50"
            >
              Sign In to Faculty Admin Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Or open standard login modal:</span>
            <button
              onClick={() => openAuthModal('admin')}
              className="text-amber-400 hover:underline font-bold"
            >
              Open Login Modal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Admin Top Welcome Card */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 border border-amber-900/40 text-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-700/60 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-amber-400" />
                Faculty Administrator Active
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {adminEmail}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-white">MedExam Postgraduate Admin Console</h1>
            <p className="text-xs text-slate-300 mt-1">
              Moderation queue for candidate recall questions, bKash / Nagad subscription activations, and Question Bank citations.
            </p>
          </div>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-rose-300 border border-slate-700 text-xs font-bold transition shrink-0"
          >
            <LogOut size={16} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Pending Recall Queue</p>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{pendingQuestions.length}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Awaiting faculty approval</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <FileCheck size={22} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Pending Payments</p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{pendingTransactions.length}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">bKash / Nagad verification</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CreditCard size={22} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Active Question Bank</p>
            <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">{approvedQuestions.length}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Verified SBAs & Multiple T/F</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <BookOpen size={22} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Admin Email</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate max-w-[130px]">{adminEmail}</p>
            <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">Verified Root Admin</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Users size={22} />
          </div>
        </div>

      </div>

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold space-x-6">
        <button
          onClick={() => setActiveAdminTab('recalls')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeAdminTab === 'recalls'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileCheck size={16} />
          <span>Recall Approval Queue ({pendingQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('payments')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeAdminTab === 'payments'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CreditCard size={16} />
          <span>Subscription Payments ({pendingTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('candidates')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeAdminTab === 'candidates'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users size={16} />
          <span>Candidate Roster</span>
        </button>
      </div>

      {/* TAB 1: RECALL APPROVAL QUEUE */}
      {activeAdminTab === 'recalls' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck size={18} className="text-emerald-500" />
              <span>Pending Recall Submissions Review</span>
            </h2>
            <span className="text-xs text-slate-500">
              {pendingQuestions.length} pending candidate items
            </span>
          </div>

          {pendingQuestions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <CheckCircle2 size={36} className="mx-auto text-emerald-500" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                All Candidate Recalls Approved!
              </p>
              <p className="text-xs text-slate-500">
                There are no pending recall questions awaiting moderation in the queue.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingQuestions.map(q => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          Pending Approval
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{q.facultyTag} • {q.specialtyTag}</span>
                        {q.examSessionTag && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {q.examSessionTag}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {q.stem}
                      </h3>
                      {q.submittedBy && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          Submitted by: <span className="font-semibold text-slate-300">{q.submittedBy}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => approveRecallQuestion(q.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition shadow"
                      >
                        <Check size={14} />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => rejectRecallQuestion(q.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-300 border border-slate-700 text-xs font-bold flex items-center gap-1 transition"
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Textbook Citation */}
                  {q.textbookCitation && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 font-serif">
                      <strong className="font-sans text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-0.5">
                        Textbook Citation:
                      </strong>
                      {q.textbookCitation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUBSCRIPTION PAYMENT VERIFICATIONS */}
      {activeAdminTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard size={18} className="text-emerald-500" />
              <span>bKash / Nagad Payment Verification Queue</span>
            </h2>
            <span className="text-xs text-slate-500">
              {pendingTransactions.length} pending activations
            </span>
          </div>

          {pendingTransactions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <CheckCircle2 size={36} className="mx-auto text-emerald-500" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Pending Payment Transactions
              </p>
              <p className="text-xs text-slate-500">
                All candidate subscription passes are activated and up to date.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTransactions.map(trx => (
                <div
                  key={trx.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{trx.candidateName}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                        {trx.gateway.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      Account: <span className="font-mono text-slate-700 dark:text-slate-200 font-semibold">{trx.accountNumber}</span> • TrxID: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{trx.transactionId}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Requested Tier: {trx.tierName} (BDT ৳{trx.amountBDT})
                    </p>
                  </div>

                  <button
                    onClick={() => approveTransaction(trx.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow shrink-0 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={15} />
                    <span>Approve Pass</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CANDIDATE ROSTER */}
      {activeAdminTab === 'candidates' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-emerald-500" />
              <span>Registered Candidate Database</span>
            </h2>

            <span className="text-xs text-slate-500 font-semibold">1 Active Candidate Session</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={candidate.avatarUrl}
                alt={candidate.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500"
              />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{candidate.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  BMDC: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{candidate.bmdcRegNo}</span> • {candidate.specialty}
                </p>
                <p className="text-[10px] text-slate-400">{candidate.collegeHospital}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {candidate.hasActiveSubscription ? candidate.activeSubscriptionTier : 'Free Trial'}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
