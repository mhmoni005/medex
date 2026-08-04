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
  AlertCircle,
  Zap,
  Folder,
  Book,
  Clock,
  Bell,
  Settings,
  Key,
  DollarSign,
  Sparkles,
  FileText,
  Target,
  Cloud,
  Smile,
  ChevronDown,
  PlusCircle,
  BrainCircuit,
  Send,
  Layers,
  HelpCircle,
  BarChart3
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
    openAuthModal,
    setActiveTab,
    addRecallQuestion
  } = useApp();

  // Top header tabs
  const [topNavTab, setTopNavTab] = useState<'billing' | 'subscriptions' | 'admin'>('admin');

  // Control cabinet active tab
  const [activeCabinetTab, setActiveCabinetTab] = useState<
    'questions' | 'chapters' | 'mock_exams' | 'fcm' | 'gateways' | 'users' | 'revenues' | 'admin_accounts'
  >('questions');

  // Question Builder state
  const [targetSpecialty, setTargetSpecialty] = useState('MS Residency (surgery faculty)');
  const [subjectUnit, setSubjectUnit] = useState('General High-Yield');
  const [aiNotesInput, setAiNotesInput] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGenSuccess, setAiGenSuccess] = useState('');

  // Admin login credentials state
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

  // AI Question Auto-Generation Simulation
  const handleGenerateAiQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiNotesInput.trim()) return;

    setIsGeneratingAi(true);
    setAiGenSuccess('');

    setTimeout(() => {
      // Draft a new question based on input
      addRecallQuestion({
        stem: `[Gemini Auto-Draft] Based on notes: "${aiNotesInput.slice(0, 70)}..." - Which of the following is the first-line treatment recommendation?`,
        options: [
          { id: '1', text: 'Immediate IV Antibiotics & Resuscitation', isCorrect: true },
          { id: '2', text: 'Oral Analgesics & Discharge', isCorrect: false },
          { id: '3', text: 'Emergency Open Laparotomy without Workup', isCorrect: false },
          { id: '4', text: 'Observation for 48 Hours', isCorrect: false },
          { id: '5', text: 'Topical Steroids Only', isCorrect: false }
        ],
        type: 'SBA',
        explanation: 'According to clinical guidelines, resuscitation and IV antibiotics are indicated immediately.',
        facultyTag: 'Surgery Faculty',
        specialtyTag: targetSpecialty,
        examSessionTag: 'July 2026',
        textbookCitation: 'Bailey & Love Short Practice of Surgery, 28th Ed.'
      });

      setIsGeneratingAi(false);
      setAiGenSuccess('✨ Gemini AI draft created and added to the Question Bank Approval Queue below!');
      setAiNotesInput('');
      setTimeout(() => setAiGenSuccess(''), 4000);
    }, 1200);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 -m-4 sm:-m-6 p-4 sm:p-6 space-y-6">
      
      {/* TOP HEADER BAR (Matching Exact Visual Layout in Image) */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Admin Badge & Doctor Name */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wider text-slate-800 dark:text-slate-200 uppercase">
                PRIMARY ADMIN
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            </div>
            <p className="text-xs font-semibold text-rose-500 cursor-pointer hover:underline">
              Set Doctor Name
            </p>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center space-x-8 text-xs font-bold">
          <button
            onClick={() => { setTopNavTab('billing'); setActiveTab('subscriptions'); }}
            className={`pb-1 transition ${topNavTab === 'billing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Billing Panel
          </button>

          <button
            onClick={() => { setTopNavTab('subscriptions'); setActiveTab('subscriptions'); }}
            className={`pb-1 transition ${topNavTab === 'subscriptions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            My Subscriptions
          </button>

          <button
            onClick={() => setTopNavTab('admin')}
            className={`pb-1 border-b-2 transition ${topNavTab === 'admin' ? 'text-blue-600 border-blue-600 font-extrabold' : 'border-transparent text-slate-500'}`}
          >
            Admin Dashboard
          </button>
        </nav>

        {/* Right Side: Quick Icon Tools */}
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            <Cloud size={18} />
          </button>
          <button className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 transition">
            <Smile size={18} />
          </button>
          <button className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 transition">
            <Search size={18} />
          </button>
        </div>

      </header>

      {/* ADMIN CONTROL CABINET MAIN CONTAINER */}
      <main className="space-y-6">
        
        {/* Title Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
              <Zap size={22} className="text-amber-500 fill-amber-500" />
              <span>ADMIN CONTROL CABINET</span>
            </h1>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              Admin: (Primary Superuser)
            </p>
          </div>

          <button
            onClick={logoutAdmin}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-sm"
          >
            Exit Panel
          </button>
        </div>

        {/* ADMIN CATEGORY BUTTONS ROW (Matches image exactly) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveCabinetTab('questions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              activeCabinetTab === 'questions'
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Folder size={15} className={activeCabinetTab === 'questions' ? 'fill-amber-300 text-amber-300' : 'text-blue-500'} />
            <span>Questions</span>
          </button>

          <button
            onClick={() => setActiveCabinetTab('chapters')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              activeCabinetTab === 'chapters'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Book size={15} className="text-emerald-500" />
            <span>Chapters & PDFs</span>
          </button>

          <button
            onClick={() => setActiveCabinetTab('mock_exams')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              activeCabinetTab === 'mock_exams'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Clock size={15} className="text-indigo-500" />
            <span>Mock Exams</span>
          </button>

          <button
            onClick={() => setActiveCabinetTab('fcm')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              activeCabinetTab === 'fcm'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Bell size={15} className="text-rose-500" />
            <span>FCM Alerts</span>
          </button>

          <button
            onClick={() => setActiveCabinetTab('gateways')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              activeCabinetTab === 'gateways'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Settings size={15} className="text-teal-500" />
            <span>Gateways</span>
          </button>

          <button
            onClick={() => setActiveCabinetTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              activeCabinetTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Users size={15} className="text-purple-500" />
            <span>Users</span>
          </button>

          <button
            onClick={() => setActiveCabinetTab('revenues')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              activeCabinetTab === 'revenues'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <CreditCard size={15} className="text-amber-500" />
            <span>Revenues</span>
          </button>

          <button
            onClick={() => setActiveCabinetTab('admin_accounts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              activeCabinetTab === 'admin_accounts'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Key size={15} className="text-amber-600" />
            <span>Admin Accounts</span>
          </button>
        </div>

        {/* SECTION 1: QUESTIONS TAB (QUICK QUESTION BUILDER WITH GEMINI AI) */}
        {activeCabinetTab === 'questions' && (
          <div className="space-y-6">
            
            {/* GEMINI AI SUBHEADING */}
            <h2 className="text-sm font-black text-blue-600 dark:text-blue-400 flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles size={16} className="text-amber-500 fill-amber-500" />
              <span>GEMINI AI & EASY MCQ INSTANT SCRIBE</span>
            </h2>

            {/* QUICK QUESTION BUILDER CARD */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Quick Question Builder</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Scribe manually, or paste raw notes to auto-draft using Gemini AI
                  </p>
                </div>
              </div>

              {/* TARGET SPECIALTY & CHAPTER TOPIC CONTAINER */}
              <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-200/80 dark:border-slate-700/80 space-y-3">
                
                <h4 className="text-xs font-black text-blue-900 dark:text-blue-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Target size={16} className="text-rose-500" />
                  <span>TARGET SPECIALTY & CHAPTER TOPIC</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Destination Course / Specialty
                    </label>
                    <div className="relative">
                      <select
                        value={targetSpecialty}
                        onChange={e => setTargetSpecialty(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl px-4 py-3 border border-slate-300 dark:border-slate-700 appearance-none focus:outline-none focus:border-blue-500"
                      >
                        <option value="MS Residency (surgery faculty)">MS Residency (surgery faculty)</option>
                        <option value="FCPS Part I (Surgery)">FCPS Part I (Surgery)</option>
                        <option value="FCPS Part I (Medicine)">FCPS Part I (Medicine)</option>
                        <option value="MD Cardiology">MD Cardiology</option>
                        <option value="FCPS Part I (Gynae & Obs)">FCPS Part I (Gynae & Obs)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Chapter / Subject Unit
                    </label>
                    <input
                      type="text"
                      value={subjectUnit}
                      onChange={e => setSubjectUnit(e.target.value)}
                      placeholder="General High-Yield"
                      className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl px-4 py-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

              </div>

              {/* OPTION 1: AI INSTANT GENERATOR */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative">
                
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-blue-800 dark:text-blue-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Zap size={16} className="text-amber-500 fill-amber-500" />
                    <span>OPTION 1: AI INSTANT GENERATOR</span>
                  </h4>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Gemini Powered
                  </span>
                </div>

                {aiGenSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>{aiGenSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleGenerateAiQuestion} className="space-y-3">
                  <textarea
                    rows={4}
                    value={aiNotesInput}
                    onChange={e => setAiNotesInput(e.target.value)}
                    placeholder="Paste clinical guidelines, textbook paragraphs, lecture notes, or topics like: 'Management of acute cholangitis'"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-4 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 resize-y"
                  />

                  <button
                    type="submit"
                    disabled={isGeneratingAi || !aiNotesInput.trim()}
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-md flex items-center gap-2"
                  >
                    {isGeneratingAi ? (
                      <>
                        <BrainCircuit size={16} className="animate-spin text-amber-300" />
                        <span>Gemini AI Drafting SBA Question...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} className="text-amber-300" />
                        <span>Generate Question using Gemini AI</span>
                      </>
                    )}
                  </button>
                </form>

              </div>

            </div>

            {/* PENDING APPROVAL QUEUE */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck size={18} className="text-emerald-500" />
                  <span>Question Bank Moderation Queue ({pendingQuestions.length} Items)</span>
                </h3>

                <span className="text-xs text-slate-500">
                  Approved Total: {approvedQuestions.length} Questions
                </span>
              </div>

              {pendingQuestions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs space-y-1">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    All submitted questions reviewed!
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Use the Gemini AI Question Builder above to auto-generate new MCQs.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingQuestions.map(q => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            {q.facultyTag} • {q.specialtyTag}
                          </span>
                          <h4 className="font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                            {q.stem}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => approveRecallQuestion(q.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectRecallQuestion(q.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-rose-600 hover:text-white text-slate-700 dark:text-slate-200 font-bold text-xs transition"
                          >
                            Reject
                          </button>
                        </div>
                      </div>

                      {q.textbookCitation && (
                        <p className="text-[11px] font-serif text-slate-500 italic">
                          Citation: {q.textbookCitation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* OTHER TABS SIMULATED CONTENT */}
        {activeCabinetTab === 'chapters' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Book size={18} className="text-emerald-500" />
              <span>Chapters & PDF Materials Management</span>
            </h3>
            <p className="text-xs text-slate-500">
              Upload textbook lecture notes, high-yield PDFs, and reference materials for MS/FCPS candidates.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
              📁 Bailey & Love 28th Edition Summary Notes (12 Chapters Active)
            </div>
          </div>
        )}

        {activeCabinetTab === 'gateways' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard size={18} className="text-emerald-500" />
              <span>bKash / Nagad Payment Gateways Queue</span>
            </h3>

            {pendingTransactions.length === 0 ? (
              <p className="text-xs text-slate-500">No pending payments awaiting verification.</p>
            ) : (
              <div className="space-y-3">
                {pendingTransactions.map(trx => (
                  <div key={trx.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{trx.candidateName} • TrxID: {trx.transactionId}</p>
                      <p className="text-[10px] text-slate-500">{trx.gateway.toUpperCase()} • ৳{trx.amountBDT}</p>
                    </div>
                    <button
                      onClick={() => approveTransaction(trx.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                    >
                      Approve Pass
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeCabinetTab === 'users' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-purple-500" />
              <span>Registered Candidate Roster</span>
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img src={candidate.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{candidate.name}</p>
                  <p className="text-[10px] text-slate-500">BMDC: {candidate.bmdcRegNo} • {candidate.designation}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Active Subscriber
              </span>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
