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
  BarChart3,
  Trash2,
  Edit3,
  Download,
  Eye,
  EyeOff,
  UserPlus,
  RefreshCw,
  CheckSquare,
  Lock,
  Unlock,
  Building,
  TrendingUp,
  Smartphone
} from 'lucide-react';

interface ChapterItem {
  id: string;
  title: string;
  specialty: string;
  pages: number;
  pdfUrl: string;
  downloads: number;
  isFree: boolean;
  isVisible: boolean;
}

interface MockExamItem {
  id: string;
  title: string;
  specialty: string;
  durationMins: number;
  questionsCount: number;
  passPercentage: number;
  enrolledCount: number;
  status: 'active' | 'draft';
  targetDate: string;
}

interface FcmAlertItem {
  id: string;
  title: string;
  body: string;
  targetSpecialty: string;
  priority: 'high' | 'normal';
  sentTimestamp: string;
  recipientCount: number;
  deliveredRate: string;
}

interface GatewayConfig {
  id: string;
  name: string;
  merchantNumber: string;
  chargePercentage: number;
  isAutoVerify: boolean;
  isActive: boolean;
}

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
    addRecallQuestion,
    updateCandidate
  } = useApp();

  // Top header tabs
  const [topNavTab, setTopNavTab] = useState<'billing' | 'subscriptions' | 'admin'>('admin');

  // Control cabinet active tab
  const [activeCabinetTab, setActiveCabinetTab] = useState<
    'questions' | 'chapters' | 'mock_exams' | 'fcm' | 'gateways' | 'users' | 'revenues' | 'admin_accounts'
  >('questions');

  // --- 1. QUESTIONS TAB STATE ---
  const [targetSpecialty, setTargetSpecialty] = useState('MS Residency (surgery faculty)');
  const [subjectUnit, setSubjectUnit] = useState('General High-Yield');
  const [aiNotesInput, setAiNotesInput] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGenSuccess, setAiGenSuccess] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionStatusFilter, setQuestionStatusFilter] = useState<'all' | 'pending_approval' | 'approved' | 'rejected'>('all');

  // Manual Question Creator State
  const [manualStem, setManualStem] = useState('');
  const [manualOpt1, setManualOpt1] = useState('');
  const [manualOpt2, setManualOpt2] = useState('');
  const [manualOpt3, setManualOpt3] = useState('');
  const [manualOpt4, setManualOpt4] = useState('');
  const [manualOpt5, setManualOpt5] = useState('');
  const [correctOptIdx, setCorrectOptIdx] = useState(0);
  const [manualExplanation, setManualExplanation] = useState('');
  const [manualCitation, setManualCitation] = useState('');
  const [isManualBuilderOpen, setIsManualBuilderOpen] = useState(false);

  // --- 2. CHAPTERS & PDFS STATE ---
  const [chaptersList, setChaptersList] = useState<ChapterItem[]>([
    {
      id: 'ch_1',
      title: 'Bailey & Love 28th Ed. High-Yield Surgery Summary Notes',
      specialty: 'MS Residency (surgery faculty)',
      pages: 142,
      pdfUrl: 'https://medexam.bd/docs/bailey_love_surgery_summary.pdf',
      downloads: 1240,
      isFree: false,
      isVisible: true
    },
    {
      id: 'ch_2',
      title: 'Davidson Medicine Part I Cardiology & Vascular Recall PDF',
      specialty: 'FCPS Part I (Medicine)',
      pages: 98,
      pdfUrl: 'https://medexam.bd/docs/davidson_cardiology.pdf',
      downloads: 890,
      isFree: true,
      isVisible: true
    },
    {
      id: 'ch_3',
      title: 'Gynae & Obs High Yield Recall Notes (Berek & Novak)',
      specialty: 'FCPS Part I (Gynae & Obs)',
      pages: 85,
      pdfUrl: 'https://medexam.bd/docs/gynae_obs_berek.pdf',
      downloads: 610,
      isFree: false,
      isVisible: true
    }
  ]);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterSpecialty, setNewChapterSpecialty] = useState('MS Residency (surgery faculty)');
  const [newChapterPages, setNewChapterPages] = useState(50);
  const [newChapterPdfUrl, setNewChapterPdfUrl] = useState('');
  const [newChapterIsFree, setNewChapterIsFree] = useState(false);
  const [chapterMsg, setChapterMsg] = useState('');

  // --- 3. MOCK EXAMS STATE ---
  const [mockExamsList, setMockExamsList] = useState<MockExamItem[]>([
    {
      id: 'me_1',
      title: 'FCPS Part I Surgery Grand Mock Session 01',
      specialty: 'FCPS Part I (Surgery)',
      durationMins: 100,
      questionsCount: 100,
      passPercentage: 70,
      enrolledCount: 342,
      status: 'active',
      targetDate: '2026-08-15'
    },
    {
      id: 'me_2',
      title: 'MS Residency Surgery High-Yield Final Prof Mock',
      specialty: 'MS Residency (surgery faculty)',
      durationMins: 90,
      questionsCount: 80,
      passPercentage: 65,
      enrolledCount: 518,
      status: 'active',
      targetDate: '2026-08-20'
    },
    {
      id: 'me_3',
      title: 'FCPS Medicine Emergency & Intensive Care Mock',
      specialty: 'FCPS Part I (Medicine)',
      durationMins: 60,
      questionsCount: 50,
      passPercentage: 70,
      enrolledCount: 195,
      status: 'draft',
      targetDate: '2026-09-01'
    }
  ]);
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamSpecialty, setNewExamSpecialty] = useState('MS Residency (surgery faculty)');
  const [newExamDuration, setNewExamDuration] = useState(90);
  const [newExamQCount, setNewExamQCount] = useState(50);
  const [mockExamMsg, setMockExamMsg] = useState('');

  // --- 4. FCM ALERTS STATE ---
  const [fcmAlertsList, setFcmAlertsList] = useState<FcmAlertItem[]>([
    {
      id: 'fcm_101',
      title: '⚡ FCPS Part 1 July 2026 Recall Questions Updated!',
      body: 'Check out 25 newly added verified Surgery faculty recall questions now in the Question Bank.',
      targetSpecialty: 'FCPS Part I (Surgery)',
      priority: 'high',
      sentTimestamp: 'Today at 09:30 AM',
      recipientCount: 1420,
      deliveredRate: '99.4%'
    },
    {
      id: 'fcm_102',
      title: '📢 Grand Mock Exam Schedule Released',
      body: 'MS Residency Surgery Grand Mock is set for August 20. Enrolment is now open.',
      targetSpecialty: 'MS Residency (surgery faculty)',
      priority: 'normal',
      sentTimestamp: 'Yesterday at 04:15 PM',
      recipientCount: 2150,
      deliveredRate: '98.8%'
    }
  ]);
  const [fcmTitle, setFcmTitle] = useState('');
  const [fcmBody, setFcmBody] = useState('');
  const [fcmSpecialty, setFcmSpecialty] = useState('All Candidates');
  const [fcmPriority, setFcmPriority] = useState<'high' | 'normal'>('high');
  const [fcmSuccessMsg, setFcmSuccessMsg] = useState('');

  // --- 5. GATEWAYS STATE ---
  const [gatewaysList, setGatewaysList] = useState<GatewayConfig[]>([
    { id: 'gw_bkash', name: 'bKash Merchant', merchantNumber: '01712345678', chargePercentage: 1.5, isAutoVerify: true, isActive: true },
    { id: 'gw_nagad', name: 'Nagad Personal/Merchant', merchantNumber: '01812345678', chargePercentage: 1.0, isAutoVerify: true, isActive: true },
    { id: 'gw_rocket', name: 'Rocket Merchant', merchantNumber: '01912345678', chargePercentage: 1.2, isAutoVerify: false, isActive: true },
    { id: 'gw_upay', name: 'Upay Pay', merchantNumber: '01612345678', chargePercentage: 1.0, isAutoVerify: false, isActive: false }
  ]);
  const [gatewaySearchTrx, setGatewaySearchTrx] = useState('');
  const [gatewayMsg, setGatewayMsg] = useState('');

  // --- 6. USERS STATE ---
  const [usersSearch, setUsersSearch] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [candidateList, setCandidateList] = useState([
    {
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      bmdcRegNo: candidate.bmdcRegNo,
      specialty: candidate.specialty,
      hasActiveSubscription: candidate.hasActiveSubscription,
      activeSubscriptionTier: candidate.activeSubscriptionTier || 'MS / MD Residency Pass',
      joinedDate: '2025-01-05'
    },
    {
      id: 'cand_102',
      name: 'Dr. Tanvir Ahmed',
      email: 'tanvir.med@gmail.com',
      phone: '+8801722223333',
      bmdcRegNo: 'A-84920',
      specialty: 'FCPS Part I (Surgery)',
      hasActiveSubscription: true,
      activeSubscriptionTier: 'FCPS Part 1 Surgery Pass',
      joinedDate: '2025-02-12'
    },
    {
      id: 'cand_103',
      name: 'Dr. Nusrat Jahan',
      email: 'dr.nusrat@yahoo.com',
      phone: '+8801833334444',
      bmdcRegNo: 'A-91023',
      specialty: 'FCPS Part I (Gynae & Obs)',
      hasActiveSubscription: false,
      activeSubscriptionTier: 'Free Trial',
      joinedDate: '2025-03-01'
    }
  ]);

  // --- 7. ADMIN ACCOUNTS STATE ---
  const [adminMailState, setAdminMailState] = useState(adminEmail);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [adminPassMsg, setAdminPassMsg] = useState('');
  const [subAdminEmail, setSubAdminEmail] = useState('');
  const [subAdminRole, setSubAdminRole] = useState('Senior Faculty Reviewer');
  const [subAdminsList, setSubAdminsList] = useState([
    { id: 'adm_1', email: adminEmail, role: 'Primary Superuser', status: 'Active Now' },
    { id: 'adm_2', email: 'prof.surgery@medexam.bd', role: 'Surgery Faculty Reviewer', status: 'Active' }
  ]);

  // Login handler
  const [passcodeInput, setPasscodeInput] = useState('');
  const [emailInput, setEmailInput] = useState(adminEmail);
  const [passError, setPassError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    const ok = loginAdmin(emailInput, passcodeInput);
    if (!ok) {
      setPassError(`Invalid credentials. Admin email is ${adminEmail}`);
    }
  };

  // --- AI QUESTION GENERATOR ---
  const handleGenerateAiQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiNotesInput.trim()) return;

    setIsGeneratingAi(true);
    setAiGenSuccess('');

    setTimeout(() => {
      addRecallQuestion({
        stem: `[Gemini Auto-Draft] Based on notes: "${aiNotesInput.slice(0, 80)}..." - Which of the following is the definitive initial diagnostic test?`,
        options: [
          { id: '1', text: 'Contrast-Enhanced CT Scan of Abdomen & Pelvis', isCorrect: true },
          { id: '2', text: 'Plain Abdominal X-Ray Erect View', isCorrect: false },
          { id: '3', text: 'Diagnostic Peritoneal Lavage', isCorrect: false },
          { id: '4', text: 'Serum Amylase & Lipase Level', isCorrect: false },
          { id: '5', text: 'Ultrasound of Whole Abdomen', isCorrect: false }
        ],
        type: 'SBA',
        explanation: 'Contrast CT scan provides high sensitivity and specificity for definitive evaluation.',
        facultyTag: 'Surgery Faculty',
        specialtyTag: targetSpecialty,
        examSessionTag: 'July 2026',
        textbookCitation: 'Bailey & Love Short Practice of Surgery, 28th Ed.'
      });

      setIsGeneratingAi(false);
      setAiGenSuccess('✨ Gemini AI question drafted and added to Question Bank queue below!');
      setAiNotesInput('');
      setTimeout(() => setAiGenSuccess(''), 4000);
    }, 1000);
  };

  // --- MANUAL QUESTION SUBMIT ---
  const handleManualQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualStem.trim() || !manualOpt1.trim() || !manualOpt2.trim()) return;

    addRecallQuestion({
      stem: manualStem,
      options: [
        { id: '1', text: manualOpt1, isCorrect: correctOptIdx === 0 },
        { id: '2', text: manualOpt2, isCorrect: correctOptIdx === 1 },
        { id: '3', text: manualOpt3 || 'Option C', isCorrect: correctOptIdx === 2 },
        { id: '4', text: manualOpt4 || 'Option D', isCorrect: correctOptIdx === 3 },
        { id: '5', text: manualOpt5 || 'Option E', isCorrect: correctOptIdx === 4 }
      ],
      type: 'SBA',
      explanation: manualExplanation || 'Detailed clinical explanation as reviewed by faculty.',
      facultyTag: 'Surgery Faculty',
      specialtyTag: targetSpecialty,
      examSessionTag: 'July 2026',
      textbookCitation: manualCitation || 'Standard Textbook Reference'
    });

    setManualStem('');
    setManualOpt1('');
    setManualOpt2('');
    setManualOpt3('');
    setManualOpt4('');
    setManualOpt5('');
    setManualExplanation('');
    setManualCitation('');
    setIsManualBuilderOpen(false);
    setAiGenSuccess('Manual MCQ added to Question Bank Queue!');
    setTimeout(() => setAiGenSuccess(''), 3000);
  };

  // --- CHAPTER ACTIONS ---
  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;

    const newCh: ChapterItem = {
      id: 'ch_' + Date.now(),
      title: newChapterTitle,
      specialty: newChapterSpecialty,
      pages: newChapterPages,
      pdfUrl: newChapterPdfUrl || 'https://medexam.bd/docs/sample_highyield.pdf',
      downloads: 0,
      isFree: newChapterIsFree,
      isVisible: true
    };

    setChaptersList(prev => [newCh, ...prev]);
    setNewChapterTitle('');
    setNewChapterPdfUrl('');
    setChapterMsg('New Chapter / PDF Material uploaded successfully!');
    setTimeout(() => setChapterMsg(''), 3000);
  };

  const toggleChapterVisibility = (id: string) => {
    setChaptersList(prev =>
      prev.map(c => (c.id === id ? { ...c, isVisible: !c.isVisible } : c))
    );
  };

  const deleteChapter = (id: string) => {
    setChaptersList(prev => prev.filter(c => c.id !== id));
  };

  // --- MOCK EXAM ACTIONS ---
  const handleAddMockExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim()) return;

    const newExam: MockExamItem = {
      id: 'me_' + Date.now(),
      title: newExamTitle,
      specialty: newExamSpecialty,
      durationMins: newExamDuration,
      questionsCount: newExamQCount,
      passPercentage: 70,
      enrolledCount: 0,
      status: 'active',
      targetDate: '2026-08-30'
    };

    setMockExamsList(prev => [newExam, ...prev]);
    setNewExamTitle('');
    setMockExamMsg('New Mock Exam session created and active for candidates!');
    setTimeout(() => setMockExamMsg(''), 3000);
  };

  const toggleMockStatus = (id: string) => {
    setMockExamsList(prev =>
      prev.map(m => (m.id === id ? { ...m, status: m.status === 'active' ? 'draft' : 'active' } : m))
    );
  };

  const deleteMockExam = (id: string) => {
    setMockExamsList(prev => prev.filter(m => m.id !== id));
  };

  // --- FCM ACTIONS ---
  const handleSendFcmAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fcmTitle.trim() || !fcmBody.trim()) return;

    const newAlert: FcmAlertItem = {
      id: 'fcm_' + Date.now(),
      title: fcmTitle,
      body: fcmBody,
      targetSpecialty: fcmSpecialty,
      priority: fcmPriority,
      sentTimestamp: 'Just now',
      recipientCount: fcmSpecialty === 'All Candidates' ? 3850 : 1240,
      deliveredRate: '100%'
    };

    setFcmAlertsList(prev => [newAlert, ...prev]);
    setFcmTitle('');
    setFcmBody('');
    setFcmSuccessMsg('🔥 FCM Broadcast Push Notification sent to all candidate devices!');
    setTimeout(() => setFcmSuccessMsg(''), 4000);
  };

  const deleteFcmAlert = (id: string) => {
    setFcmAlertsList(prev => prev.filter(f => f.id !== id));
  };

  // --- GATEWAY ACTIONS ---
  const toggleGatewayActive = (id: string) => {
    setGatewaysList(prev =>
      prev.map(g => (g.id === id ? { ...g, isActive: !g.isActive } : g))
    );
  };

  const toggleGatewayAutoVerify = (id: string) => {
    setGatewaysList(prev =>
      prev.map(g => (g.id === id ? { ...g, isAutoVerify: !g.isAutoVerify } : g))
    );
  };

  // --- USER ACTIONS ---
  const handleGrantSubscription = (userId: string) => {
    setCandidateList(prev =>
      prev.map(u => (u.id === userId ? { ...u, hasActiveSubscription: true, activeSubscriptionTier: 'MS / MD Residency Full Pass' } : u))
    );
    if (userId === candidate.id) {
      updateCandidate({
        hasActiveSubscription: true,
        activeSubscriptionTier: 'MS / MD Residency Full Pass'
      });
    }
    setUserMsg('Subscription Pass granted to candidate!');
    setTimeout(() => setUserMsg(''), 3000);
  };

  const handleRevokeSubscription = (userId: string) => {
    setCandidateList(prev =>
      prev.map(u => (u.id === userId ? { ...u, hasActiveSubscription: false, activeSubscriptionTier: 'Expired' } : u))
    );
    setUserMsg('Candidate subscription revoked.');
    setTimeout(() => setUserMsg(''), 3000);
  };

  // --- ADMIN PASS UPDATE ---
  const handleUpdateAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassMsg('');

    if (currentPassInput !== 'mhmoni005' && currentPassInput !== 'admin') {
      setAdminPassMsg('❌ Current password incorrect. Initial admin password is: mhmoni005');
      return;
    }

    if (!newPassInput || newPassInput.length < 4) {
      setAdminPassMsg('❌ New password must be at least 4 characters long.');
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setAdminPassMsg('❌ Passwords do not match.');
      return;
    }

    setAdminPassMsg('✅ Admin Security Password updated successfully!');
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
    setTimeout(() => setAdminPassMsg(''), 4000);
  };

  const handleAddSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subAdminEmail.trim()) return;

    setSubAdminsList(prev => [
      ...prev,
      { id: 'adm_' + Date.now(), email: subAdminEmail.trim(), role: subAdminRole, status: 'Active' }
    ]);
    setSubAdminEmail('');
    setAdminPassMsg(`✅ Added ${subAdminRole} (${subAdminEmail}) to faculty access list.`);
    setTimeout(() => setAdminPassMsg(''), 4000);
  };

  // Filtered Questions for Moderation Queue
  const filteredQuestions = questions.filter(q => {
    const stemText = (q as any).stem || (q as any).question || '';
    const specText = (q as any).specialtyTag || (q as any).facultyTag || (q as any).faculty || (q as any).topic || '';
    const searchLow = (questionSearch || '').toLowerCase();
    const matchesSearch = stemText.toLowerCase().includes(searchLow) ||
      specText.toLowerCase().includes(searchLow);
    const matchesStatus = questionStatusFilter === 'all' ? true : q.status === questionStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = questions.filter(q => q.status === 'pending_approval').length;
  const approvedCount = questions.filter(q => q.status === 'approved').length;

  // Filtered Transactions
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const filteredTransactions = transactions.filter(t => {
    const searchLow = (gatewaySearchTrx || '').toLowerCase();
    return (t?.trxId || '').toLowerCase().includes(searchLow) ||
      (t?.candidateName || '').toLowerCase().includes(searchLow);
  });

  // If Admin NOT logged in
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 p-3 text-white shadow-lg flex items-center justify-center">
            <ShieldAlert size={32} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-white">Faculty Admin Authentication Required</h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Restricted to Faculty Supervisors. Password for <strong className="text-amber-300 font-mono">{adminEmail}</strong> is <strong className="text-emerald-400 font-mono">mhmoni005</strong>
            </p>
          </div>

          {passError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Email ID
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Security Passcode
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
              Sign In to Admin Cabinet
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Or open standard modal:</span>
            <button
              onClick={() => openAuthModal('admin')}
              className="text-amber-400 hover:underline font-bold"
            >
              Open Sign In Modal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 -m-4 sm:-m-6 p-4 sm:p-6 space-y-6">
      
      {/* TOP HEADER BAR (Matching Exact Visual Layout) */}
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
            className={`pb-1 transition ${topNavTab === 'billing' ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Billing Panel
          </button>

          <button
            onClick={() => { setTopNavTab('subscriptions'); setActiveTab('subscriptions'); }}
            className={`pb-1 transition ${topNavTab === 'subscriptions' ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
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
          <button className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Cloud Sync Status">
            <Cloud size={18} />
          </button>
          <button className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 transition" title="Faculty Live Status">
            <Smile size={18} />
          </button>
          <button className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 transition" title="Search Medical Database">
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
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <LogOut size={14} />
            <span>Exit Panel</span>
          </button>
        </div>

        {/* ADMIN CATEGORY BUTTONS ROW (8 CABINET TABS) */}
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
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-900 font-extrabold">
                {pendingCount}
              </span>
            )}
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
            {pendingTransactions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-extrabold">
                {pendingTransactions.length}
              </span>
            )}
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

        {/* =========================================================================
            TAB 1: QUESTIONS TAB (QUICK QUESTION BUILDER & MODERATION QUEUE)
           ========================================================================= */}
        {activeCabinetTab === 'questions' && (
          <div className="space-y-6">
            
            {/* GEMINI AI SUBHEADING */}
            <h2 className="text-sm font-black text-blue-600 dark:text-blue-400 flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles size={16} className="text-amber-500 fill-amber-500" />
              <span>GEMINI AI & EASY MCQ INSTANT SCRIBE</span>
            </h2>

            {/* QUICK QUESTION BUILDER CARD */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              
              <div className="flex items-center justify-between">
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

                <button
                  onClick={() => setIsManualBuilderOpen(!isManualBuilderOpen)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <PlusCircle size={15} className="text-blue-500" />
                  <span>{isManualBuilderOpen ? 'Close Form' : 'Manual Form Scribe'}</span>
                </button>
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

              {/* MANUAL BUILDER FORM (COLLAPSIBLE) */}
              {isManualBuilderOpen && (
                <form onSubmit={handleManualQuestionSubmit} className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-4 animate-fade-in">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                    <Edit3 size={15} className="text-emerald-500" />
                    <span>Manual Question Scribe</span>
                  </h4>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Question Stem / Clinical Scenario
                    </label>
                    <textarea
                      rows={2}
                      value={manualStem}
                      onChange={e => setManualStem(e.target.value)}
                      placeholder="Enter clinical vignette or recall stem..."
                      className="w-full bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 rounded-xl p-3 border border-slate-300 dark:border-slate-700"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: manualOpt1, setVal: setManualOpt1, idx: 0, label: 'Option A' },
                      { val: manualOpt2, setVal: setManualOpt2, idx: 1, label: 'Option B' },
                      { val: manualOpt3, setVal: setManualOpt3, idx: 2, label: 'Option C' },
                      { val: manualOpt4, setVal: setManualOpt4, idx: 3, label: 'Option D' },
                      { val: manualOpt5, setVal: setManualOpt5, idx: 4, label: 'Option E' }
                    ].map(opt => (
                      <div key={opt.idx} className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                        <input
                          type="radio"
                          name="correctOpt"
                          checked={correctOptIdx === opt.idx}
                          onChange={() => setCorrectOptIdx(opt.idx)}
                          className="accent-emerald-500"
                        />
                        <input
                          type="text"
                          value={opt.val}
                          onChange={e => opt.setVal(e.target.value)}
                          placeholder={`${opt.label}`}
                          className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                          required={opt.idx < 2}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={manualExplanation}
                      onChange={e => setManualExplanation(e.target.value)}
                      placeholder="Clinical Explanation..."
                      className="w-full bg-white dark:bg-slate-900 text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700"
                    />
                    <input
                      type="text"
                      value={manualCitation}
                      onChange={e => setManualCitation(e.target.value)}
                      placeholder="Textbook Citation (e.g. Bailey & Love)"
                      className="w-full bg-white dark:bg-slate-900 text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
                  >
                    Save Manual Question
                  </button>
                </form>
              )}

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
                    rows={3}
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

            {/* QUESTION BANK MODERATION & LIST QUEUE */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileCheck size={18} className="text-emerald-500" />
                    <span>Question Bank Repository ({questions.length} Total MCQs)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Approved: {approvedCount} • Pending Review: {pendingCount}</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={questionSearch}
                      onChange={e => setQuestionSearch(e.target.value)}
                      placeholder="Search question..."
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-lg pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700"
                    />
                  </div>

                  <select
                    value={questionStatusFilter}
                    onChange={e => setQuestionStatusFilter(e.target.value as any)}
                    className="bg-slate-50 dark:bg-slate-800 text-xs rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="pending_approval">Pending ({pendingCount})</option>
                    <option value="approved">Approved ({approvedCount})</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {filteredQuestions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs space-y-1">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    No questions found matching criteria.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQuestions.map(q => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                              {q.facultyTag || (q as any).faculty || 'Faculty'} • {q.specialtyTag || (q as any).topic || 'General'}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              q.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : q.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {q.status}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 dark:text-white leading-snug">
                            {q.stem || (q as any).question || 'No question text available'}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {q.status !== 'approved' && (
                            <button
                              onClick={() => approveRecallQuestion(q.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                            >
                              Approve
                            </button>
                          )}
                          {q.status !== 'rejected' && (
                            <button
                              onClick={() => rejectRecallQuestion(q.id)}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-rose-600 hover:text-white text-slate-700 dark:text-slate-200 font-bold text-xs transition"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </div>

                      {q.explanation && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                          💡 <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}

                      {(q.textbookCitation || (q as any).textbookReference) && (
                        <p className="text-[10px] font-serif text-slate-400 italic">
                          Citation: {q.textbookCitation || (q as any).textbookReference}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: CHAPTERS & PDFS MANAGEMENT
           ========================================================================= */}
        {activeCabinetTab === 'chapters' && (
          <div className="space-y-6">
            
            {/* ADD NEW CHAPTER FORM */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Book size={18} className="text-emerald-500" />
                  <span>Upload High-Yield Chapter & PDF Notes</span>
                </h3>
                <span className="text-xs text-slate-500">{chaptersList.length} Chapters Published</span>
              </div>

              {chapterMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{chapterMsg}</span>
                </div>
              )}

              <form onSubmit={handleAddChapter} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Chapter / PDF Module Title
                  </label>
                  <input
                    type="text"
                    value={newChapterTitle}
                    onChange={e => setNewChapterTitle(e.target.value)}
                    placeholder="e.g. Bailey & Love Surgery Chapter 12 - Hepatobiliary System"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Specialty Faculty
                  </label>
                  <select
                    value={newChapterSpecialty}
                    onChange={e => setNewChapterSpecialty(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="MS Residency (surgery faculty)">MS Residency (surgery faculty)</option>
                    <option value="FCPS Part I (Surgery)">FCPS Part I (Surgery)</option>
                    <option value="FCPS Part I (Medicine)">FCPS Part I (Medicine)</option>
                    <option value="FCPS Part I (Gynae & Obs)">FCPS Part I (Gynae & Obs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    PDF Resource Link URL
                  </label>
                  <input
                    type="text"
                    value={newChapterPdfUrl}
                    onChange={e => setNewChapterPdfUrl(e.target.value)}
                    placeholder="https://medexam.bd/docs/surgery_ch12.pdf"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-mono rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newChapterIsFree}
                      onChange={e => setNewChapterIsFree(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 accent-emerald-500"
                    />
                    <span>Free Access Preview (Non-subscribers)</span>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={16} />
                    <span>Publish Chapter PDF</span>
                  </button>
                </div>
              </form>
            </div>

            {/* CHAPTERS ROSTER */}
            <div className="space-y-3">
              {chaptersList.map(ch => (
                <div key={ch.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {ch.specialty}
                      </span>
                      {ch.isFree ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          Free Access
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                          Subscriber VIP
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{ch.title}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>📄 {ch.pages} Pages</span>
                      <span>📥 {ch.downloads} Candidate Downloads</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleChapterVisibility(ch.id)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
                      title={ch.isVisible ? 'Hide Chapter' : 'Show Chapter'}
                    >
                      {ch.isVisible ? <Eye size={16} className="text-emerald-500" /> : <EyeOff size={16} className="text-rose-400" />}
                    </button>

                    <a
                      href={ch.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 hover:bg-slate-200 transition"
                      title="Download PDF"
                    >
                      <Download size={16} />
                    </a>

                    <button
                      onClick={() => deleteChapter(ch.id)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100 transition"
                      title="Delete Chapter"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: MOCK EXAMS CONTROL CENTER
           ========================================================================= */}
        {activeCabinetTab === 'mock_exams' && (
          <div className="space-y-6">
            
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock size={18} className="text-indigo-500" />
                  <span>Create Live Mock Exam Session</span>
                </h3>
                <span className="text-xs text-slate-500">{mockExamsList.length} Active Presets</span>
              </div>

              {mockExamMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{mockExamMsg}</span>
                </div>
              )}

              <form onSubmit={handleAddMockExam} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Mock Exam Title
                  </label>
                  <input
                    type="text"
                    value={newExamTitle}
                    onChange={e => setNewExamTitle(e.target.value)}
                    placeholder="e.g. FCPS Part I Surgery Grand Mock 02"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Specialty Faculty
                  </label>
                  <select
                    value={newExamSpecialty}
                    onChange={e => setNewExamSpecialty(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="MS Residency (surgery faculty)">MS Residency (surgery faculty)</option>
                    <option value="FCPS Part I (Surgery)">FCPS Part I (Surgery)</option>
                    <option value="FCPS Part I (Medicine)">FCPS Part I (Medicine)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={newExamDuration}
                    onChange={e => setNewExamDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Questions Count
                  </label>
                  <input
                    type="number"
                    value={newExamQCount}
                    onChange={e => setNewExamQCount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={16} />
                    <span>Launch Mock Exam</span>
                  </button>
                </div>
              </form>
            </div>

            {/* MOCK EXAMS LIST */}
            <div className="space-y-3">
              {mockExamsList.map(me => (
                <div key={me.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                        {me.specialty}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        me.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {me.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{me.title}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>⏱️ {me.durationMins} Mins</span>
                      <span>❓ {me.questionsCount} Questions</span>
                      <span>👥 {me.enrolledCount} Candidates Enrolled</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleMockStatus(me.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                        me.status === 'active'
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {me.status === 'active' ? 'Set Draft' : 'Activate Live'}
                    </button>

                    <button
                      onClick={() => deleteMockExam(me.id)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 4: FCM BROADCAST ALERTS STUDIO
           ========================================================================= */}
        {activeCabinetTab === 'fcm' && (
          <div className="space-y-6">
            
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell size={18} className="text-rose-500" />
                  <span>Dispatch Firebase Cloud Messaging (FCM) Push Broadcast</span>
                </h3>
                <span className="text-xs text-rose-500 font-bold">⚡ Instant Push to Android & Web</span>
              </div>

              {fcmSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{fcmSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSendFcmAlert} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Notification Headline Title
                  </label>
                  <input
                    type="text"
                    value={fcmTitle}
                    onChange={e => setFcmTitle(e.target.value)}
                    placeholder="e.g. ⚡ Recall Questions Updated for Surgery Faculty"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Notification Body Text
                  </label>
                  <textarea
                    rows={2}
                    value={fcmBody}
                    onChange={e => setFcmBody(e.target.value)}
                    placeholder="Enter short, high-impact alert message for candidates..."
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl p-3 border border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Target Candidate Audience
                    </label>
                    <select
                      value={fcmSpecialty}
                      onChange={e => setFcmSpecialty(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                    >
                      <option value="All Candidates">All Registered Candidates</option>
                      <option value="MS Residency (surgery faculty)">MS Residency Surgery</option>
                      <option value="FCPS Part I (Surgery)">FCPS Part I Surgery</option>
                      <option value="FCPS Part I (Medicine)">FCPS Part I Medicine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Priority Level
                    </label>
                    <select
                      value={fcmPriority}
                      onChange={e => setFcmPriority(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                    >
                      <option value="high">High Priority (Immediate Sound Alert)</option>
                      <option value="normal">Normal Priority</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <Send size={16} />
                  <span>Send Broadcast FCM Alert</span>
                </button>
              </form>
            </div>

            {/* FCM HISTORY */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase">
                Recent Sent FCM Push Broadcasts
              </h4>
              {fcmAlertsList.map(alert => (
                <div key={alert.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        {alert.targetSpecialty}
                      </span>
                      <span className="text-[10px] text-slate-400">{alert.sentTimestamp}</span>
                    </div>
                    <h5 className="font-extrabold text-slate-900 dark:text-white">{alert.title}</h5>
                    <p className="text-slate-600 dark:text-slate-300">{alert.body}</p>
                    <p className="text-[10px] text-emerald-500 font-mono">
                      Sent to {alert.recipientCount} devices • Delivery rate: {alert.deliveredRate}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteFcmAlert(alert.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 5: PAYMENT GATEWAYS & TRANSACTIONS
           ========================================================================= */}
        {activeCabinetTab === 'gateways' && (
          <div className="space-y-6">
            
            {/* GATEWAY CONFIGURATIONS */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Settings size={18} className="text-teal-500" />
                <span>bKash / Nagad / Rocket Payment Gateway Configs</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gatewaysList.map(gw => (
                  <div key={gw.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">{gw.name}</span>
                      <button
                        onClick={() => toggleGatewayActive(gw.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          gw.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {gw.isActive ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    </div>

                    <div className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      <p>Merchant #: <strong>{gw.merchantNumber}</strong></p>
                      <p>Charge: <strong>{gw.chargePercentage}%</strong></p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px]">
                      <span>Auto-Verify TrxID:</span>
                      <button
                        onClick={() => toggleGatewayAutoVerify(gw.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          gw.isAutoVerify ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {gw.isAutoVerify ? 'ON' : 'MANUAL'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRANSACTIONS QUEUE */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard size={18} className="text-amber-500" />
                  <span>Subscription Payment Verification Queue ({transactions.length})</span>
                </h3>

                <input
                  type="text"
                  value={gatewaySearchTrx}
                  onChange={e => setGatewaySearchTrx(e.target.value)}
                  placeholder="Search TrxID / Candidate..."
                  className="bg-slate-50 dark:bg-slate-800 text-xs rounded-lg px-3 py-1.5 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-3">
                {filteredTransactions.map(trx => (
                  <div key={trx.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white">{trx.candidateName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-800">
                          {trx.gateway.toUpperCase()} • {trx.accountNumber}
                        </span>
                      </div>
                      <p className="font-mono text-slate-500 text-[11px]">
                        TrxID: <strong className="text-emerald-500">{trx.trxId}</strong> • Amount: <strong>৳{trx.amountBDT} BDT</strong>
                      </p>
                      <p className="text-[10px] text-slate-400">Pass: {trx.tierName} • {trx.timestamp}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        trx.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {trx.status}
                      </span>
                      {trx.status !== 'active' && (
                        <button
                          onClick={() => approveTransaction(trx.trxId)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                        >
                          Approve Pass
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 6: USERS & CANDIDATE ROSTER
           ========================================================================= */}
        {activeCabinetTab === 'users' && (
          <div className="space-y-6">
            
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users size={18} className="text-purple-500" />
                    <span>Registered Candidates & Doctors Roster ({candidateList.length})</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Manage candidate access, BMDC registration, & passes</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={usersSearch}
                    onChange={e => setUsersSearch(e.target.value)}
                    placeholder="Search doctor or BMDC..."
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {userMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{userMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                {candidateList
                  .filter(u => {
                    const searchLow = (usersSearch || '').toLowerCase();
                    return (u?.name || '').toLowerCase().includes(searchLow) || (u?.bmdcRegNo || '').toLowerCase().includes(searchLow);
                  })
                  .map(u => (
                    <div key={u.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {(u?.name || 'DR').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{u.name}</h4>
                          <p className="text-[11px] text-slate-500">
                            BMDC: <strong className="text-purple-600 dark:text-purple-400">{u.bmdcRegNo}</strong> • {u.specialty}
                          </p>
                          <p className="text-[10px] text-slate-400">Phone: {u.phone} • Email: {u.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {u.hasActiveSubscription ? (
                          <>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              Active Pass
                            </span>
                            <button
                              onClick={() => handleRevokeSubscription(u.id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 hover:bg-rose-200 font-bold text-xs"
                            >
                              Revoke
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleGrantSubscription(u.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                          >
                            Grant VIP Pass
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 7: REVENUES & ANALYTICS
           ========================================================================= */}
        {activeCabinetTab === 'revenues' && (
          <div className="space-y-6">
            
            {/* REVENUE STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <p className="text-xs text-slate-500 font-bold uppercase">Total Revenue Collected</p>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">৳ 1,48,500 BDT</h3>
                <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <TrendingUp size={12} />
                  <span>+24.8% growth vs last month</span>
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <p className="text-xs text-slate-500 font-bold uppercase">Active VIP Subscriptions</p>
                <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">342 Doctors</h3>
                <p className="text-[10px] text-slate-400">Avg. ৳3,000 / subscription</p>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <p className="text-xs text-slate-500 font-bold uppercase">Top Payment Gateway</p>
                <h3 className="text-2xl font-black text-pink-600 dark:text-pink-400">bKash (68%)</h3>
                <p className="text-[10px] text-slate-400">Nagad: 24% • Rocket: 8%</p>
              </div>
            </div>

            {/* FINANCIAL TRANSACTIONS LEDGER */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <BarChart3 size={18} className="text-amber-500" />
                <span>Verified Subscription Sales Ledger</span>
              </h3>

              <div className="space-y-2">
                {transactions.map(t => (
                  <div key={t.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-mono">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white font-sans">{t.candidateName} • {t.tierName}</p>
                      <p className="text-[11px] text-slate-500">{t.gateway.toUpperCase()} TrxID: {t.trxId} • {t.timestamp}</p>
                    </div>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      +৳{t.amountBDT} BDT
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 8: ADMIN ACCOUNTS & SECURITY
           ========================================================================= */}
        {activeCabinetTab === 'admin_accounts' && (
          <div className="space-y-6">
            
            {/* SUPERUSER CREDENTIALS & PASSWORD UPDATE */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Key size={18} className="text-amber-500" />
                <span>Primary Admin Security & Password Manager</span>
              </h3>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <p className="font-bold">Current Active Admin Mail ID: <span className="font-mono">{adminEmail}</span></p>
                <p className="text-[11px] opacity-90">Default passcode is set to <strong className="font-mono">mhmoni005</strong>. You can change your password below.</p>
              </div>

              {adminPassMsg && (
                <div className={`p-3 rounded-xl text-xs font-bold ${
                  adminPassMsg.startsWith('✅')
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                }`}>
                  {adminPassMsg}
                </div>
              )}

              <form onSubmit={handleUpdateAdminPassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Current Admin Password
                    </label>
                    <input
                      type="password"
                      value={currentPassInput}
                      onChange={e => setCurrentPassInput(e.target.value)}
                      placeholder="mhmoni005"
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-mono rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassInput}
                      onChange={e => setNewPassInput(e.target.value)}
                      placeholder="At least 4 chars"
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-mono rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassInput}
                      onChange={e => setConfirmPassInput(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-mono rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition"
                >
                  Update Admin Password
                </button>
              </form>
            </div>

            {/* ADD CO-FACULTY ADMIN */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <UserPlus size={18} className="text-blue-500" />
                <span>Grant Faculty / Moderator Access</span>
              </h3>

              <form onSubmit={handleAddSubAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Faculty Email Address
                  </label>
                  <input
                    type="email"
                    value={subAdminEmail}
                    onChange={e => setSubAdminEmail(e.target.value)}
                    placeholder="doctor@faculty.medexam.bd"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Access Role
                  </label>
                  <select
                    value={subAdminRole}
                    onChange={e => setSubAdminRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Senior Faculty Reviewer">Senior Faculty Reviewer</option>
                    <option value="Question Bank Moderator">Question Bank Moderator</option>
                    <option value="Finance & Payment Verifier">Finance & Payment Verifier</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-2"
                  >
                    <UserPlus size={16} />
                    <span>Add Faculty Admin</span>
                  </button>
                </div>
              </form>

              {/* LIST OF ADMIN ACCOUNTS */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Active Faculty Administrators</h4>
                {subAdminsList.map(adm => (
                  <div key={adm.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{adm.email}</p>
                      <p className="text-[10px] text-slate-500">{adm.role}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {adm.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
