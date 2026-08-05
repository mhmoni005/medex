import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExamSpecialtyItem } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCheck,
  CreditCard,
  Users,
  User,
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
  UserMinus,
  Crown,
  RefreshCw,
  CheckSquare,
  Lock,
  Unlock,
  Building,
  TrendingUp,
  Smartphone,
  Headset
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
    adminProfile,
    updateAdminProfile,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    openAuthModal,
    setActiveTab,
    addRecallQuestion,
    updateCandidate,
    examSpecialties,
    addExamSpecialty,
    updateExamSpecialty,
    deleteExamSpecialty,
    toggleExamSpecialtyLock,
    studyGroups,
    createStudyGroup,
    deleteStudyGroup,
    addCandidateToGroup,
    removeCandidateFromGroup,
    candidateDirectory,
    helplineContacts,
    addHelplineContact,
    removeHelplineContact,
    toggleHelplineContact
  } = useApp();

  // Admin Account Edit Modal State
  const [isAdminEditModalOpen, setIsAdminEditModalOpen] = useState(false);
  const [adminEditForm, setAdminEditForm] = useState({
    name: adminProfile?.name || 'Dr. M. H. Moni',
    phone: adminProfile?.phone || '+8801700000000',
    email: adminProfile?.email || 'mhmoni005@gmail.com',
    avatarUrl: adminProfile?.avatarUrl || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    designation: adminProfile?.designation || 'Senior Faculty & Controller of Examinations',
    department: adminProfile?.department || 'Medical Education & Academic Standards'
  });
  const [adminEditSuccessMsg, setAdminEditSuccessMsg] = useState('');

  // Sync edit form with stored admin profile
  React.useEffect(() => {
    if (adminProfile) {
      setAdminEditForm({
        name: adminProfile.name || 'Dr. M. H. Moni',
        phone: adminProfile.phone || '+8801700000000',
        email: adminProfile.email || 'mhmoni005@gmail.com',
        avatarUrl: adminProfile.avatarUrl || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
        designation: adminProfile.designation || 'Senior Faculty & Controller of Examinations',
        department: adminProfile.department || 'Medical Education & Academic Standards'
      });
    }
  }, [adminProfile]);

  const PRESET_AVATARS = [
    { label: 'Senior Doctor (Male 1)', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80' },
    { label: 'Senior Doctor (Female 1)', url: 'https://images.unsplash.com/photo-1594824813566-78a93272d3d9?w=150&auto=format&fit=crop&q=80' },
    { label: 'Surgeon Admin (Male 2)', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
    { label: 'Consultant Admin (Female 2)', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' }
  ];

  const handleAdminAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAdminEditForm(prev => ({ ...prev, avatarUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAdminProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({
      name: adminEditForm.name,
      phone: adminEditForm.phone,
      email: adminEditForm.email,
      avatarUrl: adminEditForm.avatarUrl,
      designation: adminEditForm.designation,
      department: adminEditForm.department
    });
    setAdminEditSuccessMsg('Admin profile updated successfully!');
    setTimeout(() => setAdminEditSuccessMsg(''), 4000);
    setIsAdminEditModalOpen(false);
  };

  // Top header tabs
  const [topNavTab, setTopNavTab] = useState<'billing' | 'subscriptions' | 'admin'>('admin');

  // Control cabinet active tab
  const [activeCabinetTab, setActiveCabinetTab] = useState<
    'questions' | 'chapters' | 'mock_exams' | 'fcm' | 'gateways' | 'users' | 'study_groups' | 'helpline' | 'revenues' | 'admin_accounts' | 'specialties'
  >('questions');

  // --- HELPLINE MANAGEMENT TAB STATE ---
  const [newHelplineType, setNewHelplineType] = useState<'whatsapp' | 'email'>('whatsapp');
  const [newHelplineLabel, setNewHelplineLabel] = useState('');
  const [newHelplineValue, setNewHelplineValue] = useState('');
  const [helplineMsg, setHelplineMsg] = useState('');

  // --- STUDY GROUPS MANAGEMENT TAB STATE ---
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupSpecialty, setNewGroupSpecialty] = useState<any>('FCPS Part I (Surgery)');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupEmoji, setNewGroupEmoji] = useState('🩺');
  const [newGroupSupervisor, setNewGroupSupervisor] = useState(adminProfile?.name || 'Dr. M. H. Moni');
  const [selectedCandidateIdsForNewGroup, setSelectedCandidateIdsForNewGroup] = useState<string[]>([]);
  const [studyGroupMsg, setStudyGroupMsg] = useState('');
  const [selectedGroupForCandAdd, setSelectedGroupForCandAdd] = useState<string | null>(null);
  const [candToAddId, setCandToAddId] = useState<string>('');

  // --- EXAM SPECIALTIES TAB STATE ---
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecMcqCount, setNewSpecMcqCount] = useState<number | ''>(1500);
  const [newSpecChapterCount, setNewSpecChapterCount] = useState<number | ''>(12);
  const [newSpecIconType, setNewSpecIconType] = useState('stethoscope');
  const [newSpecIsLocked, setNewSpecIsLocked] = useState(false);
  const [specialtySuccessMsg, setSpecialtySuccessMsg] = useState('');

  const handleAddSpecialtySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecName.trim()) return;

    addExamSpecialty({
      name: newSpecName.trim(),
      mcqCount: Number(newSpecMcqCount) || 1000,
      chapterCount: Number(newSpecChapterCount) || 10,
      iconType: newSpecIconType,
      isLocked: newSpecIsLocked
    });

    setSpecialtySuccessMsg(`Exam Specialty "${newSpecName.trim()}" added to control cabinet!`);
    setTimeout(() => setSpecialtySuccessMsg(''), 4000);

    setNewSpecName('');
    setNewSpecMcqCount(1500);
    setNewSpecChapterCount(12);
    setNewSpecIconType('stethoscope');
    setNewSpecIsLocked(false);
  };

  const [editingSpecialtyId, setEditingSpecialtyId] = useState<string | null>(null);
  const [editSpecialtyForm, setEditSpecialtyForm] = useState<{
    name: string;
    mcqCount: number | '';
    chapterCount: number | '';
    iconType: string;
    isLocked: boolean;
  }>({
    name: '',
    mcqCount: 0,
    chapterCount: 0,
    iconType: 'stethoscope',
    isLocked: false
  });

  const handleStartEditSpecialty = (spec: ExamSpecialtyItem) => {
    setEditingSpecialtyId(spec.id);
    setEditSpecialtyForm({
      name: spec.name,
      mcqCount: spec.mcqCount,
      chapterCount: spec.chapterCount,
      iconType: spec.iconType || 'stethoscope',
      isLocked: !!spec.isLocked
    });
  };

  const handleSaveEditSpecialty = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editSpecialtyForm.name.trim()) return;
    updateExamSpecialty(id, {
      name: editSpecialtyForm.name.trim(),
      mcqCount: Number(editSpecialtyForm.mcqCount) || 0,
      chapterCount: Number(editSpecialtyForm.chapterCount) || 0,
      iconType: editSpecialtyForm.iconType,
      isLocked: editSpecialtyForm.isLocked
    });
    setEditingSpecialtyId(null);
    setSpecialtySuccessMsg(`Exam Specialty "${editSpecialtyForm.name.trim()}" updated successfully!`);
    setTimeout(() => setSpecialtySuccessMsg(''), 4000);
  };

  // --- 1. QUESTIONS TAB STATE ---
  const [targetSpecialty, setTargetSpecialty] = useState('MS Residency (surgery faculty)');
  const [subjectUnit, setSubjectUnit] = useState('General High-Yield');
  const [aiNotesInput, setAiNotesInput] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGenSuccess, setAiGenSuccess] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionStatusFilter, setQuestionStatusFilter] = useState<'all' | 'pending_approval' | 'approved' | 'rejected'>('all');

  // Manual Question Creator State
  const [questionFormatType, setQuestionFormatType] = useState<'SBA' | 'SBA (4 Options)' | 'True or False'>('SBA');
  const [manualStem, setManualStem] = useState('');
  const [manualOpt1, setManualOpt1] = useState('');
  const [manualOpt2, setManualOpt2] = useState('');
  const [manualOpt3, setManualOpt3] = useState('');
  const [manualOpt4, setManualOpt4] = useState('');
  const [manualOpt5, setManualOpt5] = useState('');
  const [correctOptIdx, setCorrectOptIdx] = useState(0);
  const [manualExplanation, setManualExplanation] = useState('');
  const [manualCitation, setManualCitation] = useState('');
  const [isManualBuilderOpen, setIsManualBuilderOpen] = useState(true);

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

  // --- 5. GATEWAYS & FEE ENGINE STATE ---
  const [bkashMerchantNumber, setBkashMerchantNumber] = useState('01712345678');
  const [nagadMerchantNumber, setNagadMerchantNumber] = useState('01887654321');
  const [visaTerminalDetails, setVisaTerminalDetails] = useState('4532-7112-9023-4568');
  const [mastercardTerminalDetails, setMastercardTerminalDetails] = useState('5412-7519-8834-1129');
  const [amexTerminalDetails, setAmexTerminalDetails] = useState('3782-4567-8901-2345');
  const [merchantSaveSuccessMsg, setMerchantSaveSuccessMsg] = useState('');

  const [selectedExamSpecialty, setSelectedExamSpecialty] = useState('MS Residency (surgery faculty)');
  const [fee1M, setFee1M] = useState('600');
  const [fee3M, setFee3M] = useState('1500');
  const [fee6M, setFee6M] = useState('2800');
  const [fee12M, setFee12M] = useState('5000');
  const [feeSaveSuccessMsg, setFeeSaveSuccessMsg] = useState('');

  const [newSpecialtyInput, setNewSpecialtyInput] = useState('');
  const [managedSpecialties, setManagedSpecialties] = useState<string[]>([
    'MS Residency (surgery faculty)',
    'MD Residency (medicine faculty)',
    'MD Residency (Basic & paraclinical Faculty)',
    'FCPS P-1(medicine faculty)',
    'MRCS',
    'FCPS P-1 (Gynae & Obs)',
    'Diploma (Dentistry)'
  ]);
  const [specialtyMsg, setSpecialtyMsg] = useState('');

  const [gatewaysList, setGatewaysList] = useState<GatewayConfig[]>([
    { id: 'gw_bkash', name: 'bKash Merchant', merchantNumber: '01712345678', chargePercentage: 1.5, isAutoVerify: true, isActive: true },
    { id: 'gw_nagad', name: 'Nagad Personal/Merchant', merchantNumber: '01887654321', chargePercentage: 1.0, isAutoVerify: true, isActive: true },
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
      candidateId: candidate.candidateId || 'CAND-108294',
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
      candidateId: 'CAND-84920',
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
      candidateId: 'CAND-91023',
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
    { id: 'adm_1', adminId: 'ADM-SUPER-001', email: adminEmail, role: 'Primary Superuser', status: 'Active Now' },
    { id: 'adm_2', adminId: 'ADM-701', email: 'prof.surgery@medexam.bd', role: 'Surgery Faculty Reviewer', status: 'Active' }
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
    if (!manualStem.trim()) return;

    const optionsList = [
      { id: '1', text: manualOpt1 || 'Option A', isCorrect: correctOptIdx === 0 },
      { id: '2', text: manualOpt2 || 'Option B', isCorrect: correctOptIdx === 1 },
      { id: '3', text: manualOpt3 || 'Option C', isCorrect: correctOptIdx === 2 },
      { id: '4', text: manualOpt4 || 'Option D', isCorrect: correctOptIdx === 3 }
    ];

    if (questionFormatType === 'SBA') {
      optionsList.push({ id: '5', text: manualOpt5 || 'Option E', isCorrect: correctOptIdx === 4 });
    }

    addRecallQuestion({
      stem: manualStem,
      options: optionsList,
      type: questionFormatType === 'True or False' ? 'TF' : 'SBA',
      explanation: manualExplanation || 'Detailed clinical explanation as reviewed by faculty.',
      facultyTag: targetSpecialty.includes('Surgery') ? 'Surgery Faculty' : targetSpecialty.includes('Medicine') ? 'Medicine Faculty' : 'General Faculty',
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
    setAiGenSuccess('✨ Scribed New Question instantly and published to Question Bank!');
    setTimeout(() => setAiGenSuccess(''), 4000);
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

  // --- GATEWAY & MERCHANT ACTIONS ---
  const handleSaveMerchantChannels = (e: React.FormEvent) => {
    e.preventDefault();
    setGatewaysList(prev => prev.map(gw => {
      if (gw.id === 'gw_bkash') return { ...gw, merchantNumber: bkashMerchantNumber };
      if (gw.id === 'gw_nagad') return { ...gw, merchantNumber: nagadMerchantNumber };
      return gw;
    }));
    setMerchantSaveSuccessMsg('✅ Merchant channels updated and published live to checkout screen!');
    setTimeout(() => setMerchantSaveSuccessMsg(''), 4000);
  };

  const handleSaveAdjustedFees = (e: React.FormEvent) => {
    e.preventDefault();
    setFeeSaveSuccessMsg(`✅ Adjusted subscription fees saved for ${selectedExamSpecialty}!`);
    setTimeout(() => setFeeSaveSuccessMsg(''), 4000);
  };

  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecialtyInput.trim()) return;
    const cleanName = newSpecialtyInput.trim();
    if (!examSpecialties.some(s => s.name.toLowerCase() === cleanName.toLowerCase())) {
      addExamSpecialty({
        name: cleanName,
        mcqCount: 1500,
        chapterCount: 12,
        iconType: 'stethoscope',
        isLocked: false
      });
    }
    setNewSpecialtyInput('');
    setSpecialtyMsg('✨ Specialty / Course added to control cabinet & directory successfully!');
    setTimeout(() => setSpecialtyMsg(''), 3000);
  };

  const handleDeleteSpecialty = (name: string) => {
    const target = examSpecialties.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (target) {
      deleteExamSpecialty(target.id);
    }
    setSpecialtyMsg('Specialty removed from control cabinet.');
    setTimeout(() => setSpecialtyMsg(''), 3000);
  };

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

    const newAdminNum = 700 + subAdminsList.length;
    setSubAdminsList(prev => [
      ...prev,
      {
        id: 'adm_' + Date.now(),
        adminId: `ADM-${newAdminNum}`,
        email: subAdminEmail.trim(),
        role: subAdminRole,
        status: 'Active'
      }
    ]);
    setSubAdminEmail('');
    setAdminPassMsg(`✅ Added ${subAdminRole} (${subAdminEmail}) with Admin ID [ADM-${newAdminNum}] to faculty access list.`);
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
          <div
            onClick={() => setIsAdminEditModalOpen(true)}
            className="relative cursor-pointer group shrink-0"
            title="Click to edit admin picture, name & phone"
          >
            <img
              src={adminProfile?.avatarUrl || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'}
              alt={adminProfile?.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 shadow-md group-hover:brightness-90 transition"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
              <Edit3 size={10} />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black tracking-wider text-slate-800 dark:text-slate-200 uppercase">
                {adminProfile?.name || 'Dr. M. H. Moni'}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center gap-1 shadow-xs">
                <ShieldCheck size={11} className="text-amber-600 dark:text-amber-400" />
                {adminProfile?.adminId || 'ADM-SUPER-001'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
              <span>📞 <strong className="text-slate-800 dark:text-slate-200 font-mono">{adminProfile?.phone || '+8801700000000'}</strong></span>
              <span>• ✉️ <strong className="text-amber-600 dark:text-amber-400 font-mono">{adminProfile?.email || adminEmail}</strong></span>
              <button
                onClick={() => setIsAdminEditModalOpen(true)}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 ml-1"
              >
                <Edit3 size={12} />
                <span>Edit Profile</span>
              </button>
            </div>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
              <Zap size={22} className="text-amber-500 fill-amber-500" />
              <span>ADMIN CONTROL CABINET</span>
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 inline-flex items-center gap-1">
                <ShieldCheck size={12} className="text-amber-600 dark:text-amber-400" />
                ADMIN ID: {adminProfile?.adminId || 'ADM-SUPER-001'}
              </span>
              <span className="text-xs text-slate-500 font-semibold">• {adminProfile?.name || 'Primary Superuser'} ({adminProfile?.email || adminEmail})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminEditModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <Edit3 size={14} />
              <span>Edit Admin Profile</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Exit Panel</span>
            </button>
          </div>
        </div>

        {adminEditSuccessMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{adminEditSuccessMsg}</span>
            </div>
            <button onClick={() => setAdminEditSuccessMsg('')} className="text-emerald-400 hover:text-emerald-200">
              <XCircle size={15} />
            </button>
          </div>
        )}

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
            onClick={() => setActiveCabinetTab('study_groups')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              activeCabinetTab === 'study_groups'
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Users size={15} className="text-emerald-500" />
            <span>Study Groups</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold">
              {studyGroups.length}
            </span>
          </button>

          <button
            onClick={() => setActiveCabinetTab('helpline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              activeCabinetTab === 'helpline'
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Headset size={15} className="text-emerald-400" />
            <span>Candidate Helpline</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold">
              {helplineContacts ? helplineContacts.length : 0}
            </span>
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

          <button
            onClick={() => setActiveCabinetTab('specialties')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              activeCabinetTab === 'specialties'
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Layers size={15} className="text-sky-500" />
            <span>Exam Specialties</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300 font-extrabold">
              {examSpecialties.length}
            </span>
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

            {/* QUICK QUESTION BUILDER CARD (SCRIBE MCQ FORM PARAMETERS) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-blue-900 dark:text-blue-300 tracking-tight uppercase">
                  Scribe MCQ Form Parameters
                </h3>
                {aiGenSuccess && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={14} /> {aiGenSuccess}
                  </span>
                )}
              </div>

              <form onSubmit={handleManualQuestionSubmit} className="space-y-4">
                {/* 1. Specialty Category */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Specialty Category
                  </label>
                  <div className="relative">
                    <select
                      value={targetSpecialty}
                      onChange={e => setTargetSpecialty(e.target.value)}
                      className="w-full bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-semibold rounded-2xl px-5 py-3.5 border border-slate-200 dark:border-slate-700 appearance-none focus:outline-none focus:border-blue-600"
                    >
                      {examSpecialties.map(spec => (
                        <option key={spec.id} value={spec.name}>
                          {spec.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Question Format Type */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Question Format Type
                  </label>
                  <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-2xl">
                    {(['SBA', 'SBA (4 Options)', 'True or False'] as const).map(fmt => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setQuestionFormatType(fmt)}
                        className={`py-3.5 px-4 rounded-xl text-xs font-bold transition text-center ${
                          questionFormatType === fmt
                            ? 'bg-[#0066cc] text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Chapter / Subject Topic */}
                <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-400">
                    Chapter / Subject Topic
                  </label>
                  <input
                    type="text"
                    value={subjectUnit}
                    onChange={e => setSubjectUnit(e.target.value)}
                    placeholder="Trauma"
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* 4. Question Stem Text */}
                <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-400">
                    Question Stem Text
                  </label>
                  <textarea
                    rows={2}
                    value={manualStem}
                    onChange={e => setManualStem(e.target.value)}
                    placeholder="Question Stem Text"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 resize-none"
                    required
                  />
                </div>

                {/* 5 & 6. Option A & Option B */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-400">
                      Option A
                    </label>
                    <input
                      type="text"
                      value={manualOpt1}
                      onChange={e => setManualOpt1(e.target.value)}
                      placeholder="Option A"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-400">
                      Option B
                    </label>
                    <input
                      type="text"
                      value={manualOpt2}
                      onChange={e => setManualOpt2(e.target.value)}
                      placeholder="Option B"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* 7 & 8. Option C & Option D */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-400">
                      Option C
                    </label>
                    <input
                      type="text"
                      value={manualOpt3}
                      onChange={e => setManualOpt3(e.target.value)}
                      placeholder="Option C"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-400">
                      Option D
                    </label>
                    <input
                      type="text"
                      value={manualOpt4}
                      onChange={e => setManualOpt4(e.target.value)}
                      placeholder="Option D"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* 9. Option E (Full width if SBA standard 5 options) */}
                {questionFormatType === 'SBA' && (
                  <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-400">
                      Option E
                    </label>
                    <input
                      type="text"
                      value={manualOpt5}
                      onChange={e => setManualOpt5(e.target.value)}
                      placeholder="Option E"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                )}

                {/* 10. Correct Option */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Correct Option
                  </label>
                  <div className="flex items-center gap-2">
                    {(questionFormatType === 'SBA' ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D']).map((letter, idx) => (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => setCorrectOptIdx(idx)}
                        className={`w-8 h-8 rounded-full font-extrabold text-xs flex items-center justify-center transition ${
                          correctOptIdx === idx
                            ? 'bg-[#0066cc] text-white shadow-sm ring-2 ring-blue-600/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 11. Explanation details */}
                <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-400">
                    Explanation details
                  </label>
                  <textarea
                    rows={2}
                    value={manualExplanation}
                    onChange={e => setManualExplanation(e.target.value)}
                    placeholder="Explanation details"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 resize-none"
                  />
                </div>

                {/* 12. Standard Textbook reference citation source */}
                <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-400">
                    Standard Textbook reference citation source
                  </label>
                  <input
                    type="text"
                    value={manualCitation}
                    onChange={e => setManualCitation(e.target.value)}
                    placeholder="Standard Textbook reference citation source"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#007a40] hover:bg-[#006635] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow transition flex items-center justify-center gap-2 mt-2"
                >
                  Scribe New Question instantly
                </button>
              </form>

            </div>

            {/* BATCH EXPORT & BULK WORKBOOK EXCEL/CSV PARSER & GEMINI AI DRAFTER */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span>📁 BATCH EXPORT & BULK WORKBOOK EXCEL/CSV PARSER</span>
              </h3>

              {/* Gemini AI Auto-draft Collapsible / Option */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-blue-900 dark:text-blue-300 flex items-center gap-1.5 uppercase">
                    <Sparkles size={16} className="text-amber-500 fill-amber-500" />
                    <span>OPTIONAL: GEMINI AI PARSER & AUTO-DRAFT</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    Gemini 1.5 Pro
                  </span>
                </div>

                <form onSubmit={handleGenerateAiQuestion} className="space-y-3">
                  <textarea
                    rows={2}
                    value={aiNotesInput}
                    onChange={e => setAiNotesInput(e.target.value)}
                    placeholder="Paste clinical guidelines, textbook paragraphs, or lecture notes..."
                    className="w-full bg-white dark:bg-slate-900 text-xs rounded-xl p-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isGeneratingAi || !aiNotesInput.trim()}
                    className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-2"
                  >
                    {isGeneratingAi ? (
                      <>
                        <BrainCircuit size={15} className="animate-spin text-amber-300" />
                        <span>Gemini AI Drafting SBA Question...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} className="text-amber-300" />
                        <span>Generate Question with Gemini AI</span>
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
                    {examSpecialties.map(spec => (
                      <option key={spec.id} value={spec.name}>
                        {spec.name}
                      </option>
                    ))}
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
                    {examSpecialties.map(spec => (
                      <option key={spec.id} value={spec.name}>
                        {spec.name}
                      </option>
                    ))}
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
                      {examSpecialties.map(spec => (
                        <option key={spec.id} value={spec.name}>
                          {spec.name}
                        </option>
                      ))}
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
          <div className="space-y-8 animate-fade-in">
            
            {/* 1. CONFIGURE PAYMENT GATEWAY CHANNELS */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>⚙ CONFIGURE PAYMENT GATEWAY CHANNELS</span>
                </h3>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Configures the phone numbers/card routing terminals visible to students in the checkout screen in real time.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                {merchantSaveSuccessMsg && (
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{merchantSaveSuccessMsg}</span>
                  </p>
                )}

                <form onSubmit={handleSaveMerchantChannels} className="space-y-4">
                  {/* bKash */}
                  <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      bKash Merchant/Send Money Number
                    </label>
                    <input
                      type="text"
                      value={bkashMerchantNumber}
                      onChange={e => setBkashMerchantNumber(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* Nagad */}
                  <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Nagad Merchant/Send Money Number
                    </label>
                    <input
                      type="text"
                      value={nagadMerchantNumber}
                      onChange={e => setNagadMerchantNumber(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* Visa */}
                  <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Visa Terminal Account Details
                    </label>
                    <input
                      type="text"
                      value={visaTerminalDetails}
                      onChange={e => setVisaTerminalDetails(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* Mastercard */}
                  <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Mastercard Terminal Account Details
                    </label>
                    <input
                      type="text"
                      value={mastercardTerminalDetails}
                      onChange={e => setMastercardTerminalDetails(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* Amex */}
                  <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      American Express (Amex) Terminal Account
                    </label>
                    <input
                      type="text"
                      value={amexTerminalDetails}
                      onChange={e => setAmexTerminalDetails(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#007a40] hover:bg-[#006635] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm"
                  >
                    SAVE MERCHANT CHANNELS
                  </button>
                </form>
              </div>
            </div>

            {/* 2. CONFIGURE EXAM SUBSCRIPTION FEE ENGINE */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>📊 CONFIGURE EXAM SUBSCRIPTION FEE ENGINE</span>
                </h3>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Set and modify prices (BDT) dynamically for all 13 specialties based on duration.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                {feeSaveSuccessMsg && (
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{feeSaveSuccessMsg}</span>
                  </p>
                )}

                <form onSubmit={handleSaveAdjustedFees} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-blue-900 dark:text-blue-300">
                      Choose Exam Specialty to Adjust:
                    </label>
                    <div className="relative">
                      <select
                        value={selectedExamSpecialty}
                        onChange={e => setSelectedExamSpecialty(e.target.value)}
                        className="w-full bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-white text-xs font-bold rounded-2xl px-5 py-3.5 border border-slate-200 dark:border-slate-700 appearance-none focus:outline-none focus:border-blue-600"
                      >
                        {managedSpecialties.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        1 Month (BDT)
                      </label>
                      <input
                        type="text"
                        value={fee1M}
                        onChange={e => setFee1M(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        3 Months (BDT)
                      </label>
                      <input
                        type="text"
                        value={fee3M}
                        onChange={e => setFee3M(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        6 Months (BDT)
                      </label>
                      <input
                        type="text"
                        value={fee6M}
                        onChange={e => setFee6M(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        12 Months (BDT)
                      </label>
                      <input
                        type="text"
                        value={fee12M}
                        onChange={e => setFee12M(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm"
                  >
                    SAVE ADJUSTED FEES
                  </button>
                </form>
              </div>
            </div>

            {/* 3. MANAGE EXAM SPECIALTIES DIRECTORY */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>🩺 MANAGE EXAM SPECIALTIES DIRECTORY</span>
                </h3>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Add or delete medical specialties and courses dynamically. These changes will reflect immediately across all student screens and dropdown selectors.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                {specialtyMsg && (
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{specialtyMsg}</span>
                  </p>
                )}

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-blue-900 dark:text-blue-300">
                    Add New Specialty / Course:
                  </label>
                  <form onSubmit={handleAddSpecialty} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-2.5 bg-white dark:bg-slate-900 focus-within:border-blue-600">
                      <input
                        type="text"
                        value={newSpecialtyInput}
                        onChange={e => setNewSpecialtyInput(e.target.value)}
                        placeholder="e.g. FCPS P-1 (Gynae & Obs)"
                        className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#007a40] hover:bg-[#006635] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shrink-0"
                    >
                      ADD
                    </button>
                  </form>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-[11px] font-bold text-blue-900 dark:text-blue-300">
                    Active Specialties & Delete Panel:
                  </label>
                  <div className="space-y-2">
                    {examSpecialties.map((specItem) => (
                      <div
                        key={specItem.id}
                        className="p-3.5 px-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                      >
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{specItem.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSpecialty(specItem.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                          title="Delete Specialty"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. LIVE RATE CARD DISCOVERY */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                LIVE RATE CARD DISCOVERY
              </h4>
              <div className="space-y-3 bg-slate-50/60 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                {examSpecialties.map((specItem) => (
                  <div key={specItem.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-blue-900 dark:text-blue-400">{specItem.name}</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                      1M: {fee1M} | 3M: {fee3M} | 6M: {fee6M} | 12M: {fee12M}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. SUBSCRIPTION PAYMENT VERIFICATION QUEUE */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 pt-4">
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
            STUDY GROUPS MANAGEMENT TAB (ADMIN LEVEL)
           ========================================================================= */}
        {activeCabinetTab === 'study_groups' && (
          <div className="space-y-6">
            
            {studyGroupMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span>{studyGroupMsg}</span>
                </div>
                <button onClick={() => setStudyGroupMsg('')} className="text-emerald-400 hover:text-emerald-200">
                  <XCircle size={16} />
                </button>
              </div>
            )}

            {/* CREATE NEW STUDY GROUP FORM */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <PlusCircle size={18} className="text-emerald-500" />
                    <span>Create New Specialty Study Group</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Admin acts as Supervisor and can assign candidates to groups</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold border border-emerald-300 dark:border-emerald-800">
                  Admin Supervisor Access
                </span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newGroupName.trim()) return;
                  createStudyGroup({
                    name: newGroupName.trim(),
                    specialtyTag: newGroupSpecialty,
                    description: newGroupDesc.trim() || 'Specialty medical group managed by Faculty Admin.',
                    iconEmoji: newGroupEmoji || '🩺',
                    isPrivate: false,
                    facultySupervisor: newGroupSupervisor || adminProfile?.name || 'Dr. M. H. Moni',
                    adminId: adminProfile?.adminId || 'ADM-SUPER-001',
                    adminName: adminProfile?.name || 'Dr. M. H. Moni',
                    recentActivity: 'Created by Admin',
                    memberCandidateIds: selectedCandidateIdsForNewGroup.length > 0 ? selectedCandidateIdsForNewGroup : [candidate.id]
                  });
                  setStudyGroupMsg(`✨ Study Group "${newGroupName.trim()}" created! Admin (${adminProfile?.name || 'Dr. M. H. Moni'}) assigned as Supervisor.`);
                  setTimeout(() => setStudyGroupMsg(''), 4000);
                  setNewGroupName('');
                  setNewGroupDesc('');
                  setSelectedCandidateIdsForNewGroup([]);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1 lg:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Group Name / Title</label>
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={e => setNewGroupName(e.target.value)}
                      placeholder="e.g. FCPS Surgery Mastermind Circle"
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Specialty Tag</label>
                    <select
                      value={newGroupSpecialty}
                      onChange={e => setNewGroupSpecialty(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 font-bold text-emerald-600 dark:text-emerald-400"
                    >
                      {examSpecialties && examSpecialties.length > 0 ? (
                        examSpecialties.map(sp => (
                          <option key={sp.id} value={sp.name}>
                            {sp.iconEmoji} {sp.name} {sp.isLocked ? '(Premium Plan)' : '(Open Pass)'}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="FCPS Part I (Surgery)">FCPS Part I (Surgery)</option>
                          <option value="FCPS Part I (Medicine)">FCPS Part I (Medicine)</option>
                          <option value="FCPS Part I (Gynae & Obs)">FCPS Part I (Gynae & Obs)</option>
                          <option value="MS General Surgery">MS General Surgery</option>
                          <option value="MS Orthopedics">MS Orthopedics</option>
                          <option value="MD Cardiology">MD Cardiology</option>
                          <option value="MD Pediatrics">MD Pediatrics</option>
                          <option value="MRCS Part A">MRCS Part A</option>
                          <option value="MRCP Part 1">MRCP Part 1</option>
                          <option value="MBBS Final Professional Exam">MBBS Final Professional Exam</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Group Icon Emoji</label>
                    <select
                      value={newGroupEmoji}
                      onChange={e => setNewGroupEmoji(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="🩺">🩺 Stethoscope</option>
                      <option value="🔪">🔪 Surgery</option>
                      <option value="👶">👶 Gynae / Pediatrics</option>
                      <option value="🧠">🧠 Neurology / Anatomy</option>
                      <option value="🫀">🫀 Cardiology</option>
                      <option value="🩸">🩸 Hematology / Pathology</option>
                      <option value="💊">💊 Pharmacology / Medicine</option>
                      <option value="🎓">🎓 Final Prof MBBS</option>
                      <option value="🇬🇧">🇬🇧 MRCS / International</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Faculty Supervisor / Group Admin</label>
                    <input
                      type="text"
                      value={newGroupSupervisor}
                      onChange={e => setNewGroupSupervisor(e.target.value)}
                      placeholder="Dr. M. H. Moni"
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 font-bold text-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</label>
                    <input
                      type="text"
                      value={newGroupDesc}
                      onChange={e => setNewGroupDesc(e.target.value)}
                      placeholder="High-yield recall questions and case discussion for candidates."
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Candidate Selection for New Group */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Initial Candidate Members to Add to Group:</span>
                    <span className="text-[11px] text-emerald-500 font-mono font-normal">
                      {selectedCandidateIdsForNewGroup.length} candidates selected
                    </span>
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    {candidateDirectory.map(c => {
                      const isSelected = selectedCandidateIdsForNewGroup.includes(c.id);
                      return (
                        <label
                          key={c.id}
                          className={`flex items-center gap-2 p-2 rounded-xl text-xs cursor-pointer border transition ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCandidateIdsForNewGroup(prev => [...prev, c.id]);
                              } else {
                                setSelectedCandidateIdsForNewGroup(prev => prev.filter(id => id !== c.id));
                              }
                            }}
                            className="rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[11px] leading-tight font-bold">{c.name}</p>
                            <p className="truncate text-[9px] text-slate-400 font-mono">BMDC: {c.bmdcRegNo || 'A-108294'}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2"
                >
                  <PlusCircle size={16} />
                  <span>Create Study Group & Assign Candidates</span>
                </button>
              </form>
            </div>

            {/* EXISTING STUDY GROUPS ROSTER & CANDIDATE MANAGEMENT */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users size={18} className="text-purple-500" />
                    <span>Active Study Groups & Candidate Roster ({studyGroups.length})</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Admin is the supervisor and can add or remove any candidate from these groups</p>
                </div>
              </div>

              <div className="space-y-4">
                {studyGroups.map(grp => {
                  const currentMemberIds = grp.memberCandidateIds || [];
                  // Candidates in group
                  const groupCandidates = candidateDirectory.filter(c => currentMemberIds.includes(c.id));
                  // Candidates not in group
                  const nonGroupCandidates = candidateDirectory.filter(c => !currentMemberIds.includes(c.id));

                  return (
                    <div
                      key={grp.id}
                      className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4 shadow-xs"
                    >
                      {/* Group Summary Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
                            {grp.iconEmoji}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{grp.name}</h4>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                {grp.specialtyTag}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                                <Crown size={11} className="text-amber-500" />
                                Admin Supervisor: {grp.facultySupervisor || adminProfile?.name}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{grp.description}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Group ID: {grp.id} • Active Candidates: <strong className="text-emerald-500">{grp.memberCount} members</strong>
                            </p>
                          </div>
                        </div>

                        {/* Admin Action: Delete Study Group */}
                        <div className="shrink-0 flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete study group "${grp.name}"?`)) {
                                deleteStudyGroup(grp.id);
                                setStudyGroupMsg(`Study Group "${grp.name}" deleted successfully.`);
                                setTimeout(() => setStudyGroupMsg(''), 4000);
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 hover:bg-rose-200 border border-rose-300 dark:border-rose-800 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                            title="Delete Study Group"
                          >
                            <Trash2 size={14} />
                            <span>Delete Group</span>
                          </button>
                        </div>
                      </div>

                      {/* Candidate Management Section for this Group */}
                      <div className="space-y-3 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Users size={14} className="text-emerald-500" />
                            <span>Candidate Members Roster ({groupCandidates.length} enrolled)</span>
                          </span>

                          {/* Add Candidate Controls */}
                          {nonGroupCandidates.length > 0 && (
                            <div className="flex items-center gap-2">
                              <select
                                value={selectedGroupForCandAdd === grp.id ? candToAddId : ''}
                                onChange={e => {
                                  setSelectedGroupForCandAdd(grp.id);
                                  setCandToAddId(e.target.value);
                                }}
                                className="bg-white dark:bg-slate-800 text-xs rounded-xl px-3 py-1.5 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-emerald-500 max-w-[200px]"
                              >
                                <option value="">Select Candidate to Add...</option>
                                {nonGroupCandidates.map(c => (
                                  <option key={c.id} value={c.id}>
                                    {c.name} ({c.bmdcRegNo || c.specialty})
                                  </option>
                                ))}
                              </select>

                              <button
                                onClick={() => {
                                  if (selectedGroupForCandAdd === grp.id && candToAddId) {
                                    addCandidateToGroup(grp.id, candToAddId);
                                    const targetCand = candidateDirectory.find(c => c.id === candToAddId);
                                    setStudyGroupMsg(`Added candidate "${targetCand?.name || 'Doctor'}" to ${grp.name}!`);
                                    setTimeout(() => setStudyGroupMsg(''), 4000);
                                    setCandToAddId('');
                                  }
                                }}
                                disabled={selectedGroupForCandAdd !== grp.id || !candToAddId}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                              >
                                <UserPlus size={13} />
                                <span>Add Candidate</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Group Candidate Roster Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {groupCandidates.length === 0 ? (
                            <div className="col-span-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/40 text-center text-xs text-slate-400">
                              No candidates enrolled in this group yet. Use the dropdown above to add candidates.
                            </div>
                          ) : (
                            groupCandidates.map(c => (
                              <div
                                key={c.id}
                                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2 shadow-xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={c.avatarUrl}
                                    alt={c.name}
                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/50 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{c.name}</p>
                                    <p className="text-[10px] text-emerald-500 font-mono truncate">BMDC: {c.bmdcRegNo || 'A-108294'}</p>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    removeCandidateFromGroup(grp.id, c.id);
                                    setStudyGroupMsg(`Removed candidate "${c.name}" from group "${grp.name}".`);
                                    setTimeout(() => setStudyGroupMsg(''), 4000);
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 transition shrink-0"
                                  title={`Remove ${c.name} from this group`}
                                >
                                  <UserMinus size={14} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            CANDIDATE HELPLINE MANAGEMENT TAB (ADMIN LEVEL)
           ========================================================================= */}
        {activeCabinetTab === 'helpline' && (
          <div className="space-y-6">
            
            {helplineMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span>{helplineMsg}</span>
                </div>
                <button onClick={() => setHelplineMsg('')} className="text-emerald-400 hover:text-emerald-200">
                  <XCircle size={16} />
                </button>
              </div>
            )}

            {/* ADD NEW HELPLINE CHANNEL FORM */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <PlusCircle size={18} className="text-emerald-500" />
                    <span>Add New Candidate Helpline Channel</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Configure multiple WhatsApp numbers and Email addresses for candidate support
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold border border-emerald-300 dark:border-emerald-800">
                  Admin Managed
                </span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newHelplineLabel.trim() || !newHelplineValue.trim()) return;

                  addHelplineContact({
                    type: newHelplineType,
                    label: newHelplineLabel.trim(),
                    value: newHelplineValue.trim(),
                    isActive: true
                  });

                  setHelplineMsg(`✨ Added new ${newHelplineType === 'whatsapp' ? 'WhatsApp' : 'Email'} helpline: "${newHelplineLabel.trim()}"`);
                  setTimeout(() => setHelplineMsg(''), 4000);
                  setNewHelplineLabel('');
                  setNewHelplineValue('');
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Helpline Type</label>
                    <select
                      value={newHelplineType}
                      onChange={e => setNewHelplineType(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 font-bold"
                    >
                      <option value="whatsapp">💬 WhatsApp Number</option>
                      <option value="email">✉️ Email Support Address</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Support Desk Service Title / Label</label>
                    <input
                      type="text"
                      value={newHelplineLabel}
                      onChange={e => setNewHelplineLabel(e.target.value)}
                      placeholder={newHelplineType === 'whatsapp' ? 'e.g. 24/7 Academic Recall Helpline' : 'e.g. Official Candidate Helpdesk'}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {newHelplineType === 'whatsapp' ? 'WhatsApp Phone Number' : 'Email Support Address'}
                    </label>
                    <input
                      type={newHelplineType === 'whatsapp' ? 'tel' : 'email'}
                      value={newHelplineValue}
                      onChange={e => setNewHelplineValue(e.target.value)}
                      placeholder={newHelplineType === 'whatsapp' ? '+8801700001122' : 'support@medexambd.org'}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 font-mono font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-500 shrink-0" />
                  <span>
                    <strong>Privacy Assurance:</strong> Candidates will ONLY see the channel logo and title with a direct action button. The actual phone number or email address string remains hidden on candidate UI.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2"
                >
                  <PlusCircle size={16} />
                  <span>Add Helpline Channel to Candidate Desk</span>
                </button>
              </form>
            </div>

            {/* EXISTING HELPLINE CHANNELS ROSTER */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Headset size={18} className="text-emerald-500" />
                    <span>Configured Helpline Channels ({helplineContacts ? helplineContacts.length : 0})</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Admin can manage, toggle status, or delete helpline contacts anytime</p>
                </div>
              </div>

              <div className="space-y-3">
                {!helplineContacts || helplineContacts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                    No helpline channels added yet. Use the form above to add WhatsApp or Email helplines.
                  </div>
                ) : (
                  helplineContacts.map(item => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            item.type === 'whatsapp'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {item.type === 'whatsapp' ? (
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.236.376-1.003 3.666 3.753-.984.357.204z"/>
                            </svg>
                          ) : (
                            <Mail size={20} />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase ${
                                item.type === 'whatsapp'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              }`}
                            >
                              {item.type === 'whatsapp' ? 'WhatsApp' : 'Email'}
                            </span>

                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.isActive
                                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                              }`}
                            >
                              {item.isActive ? 'Active Channel' : 'Disabled'}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs mt-1">
                            {item.label}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            Target Value: <strong className="text-emerald-600 dark:text-emerald-400">{item.value}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            toggleHelplineContact(item.id);
                            setHelplineMsg(`Toggled status for "${item.label}".`);
                            setTimeout(() => setHelplineMsg(''), 3000);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                            item.isActive
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                          }`}
                        >
                          {item.isActive ? 'Disable Channel' : 'Enable Channel'}
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete helpline contact "${item.label}"?`)) {
                              removeHelplineContact(item.id);
                              setHelplineMsg(`Removed helpline contact "${item.label}".`);
                              setTimeout(() => setHelplineMsg(''), 4000);
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-200 border border-rose-300 dark:border-rose-800 transition"
                          title="Delete Helpline Contact"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
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
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{u.name}</h4>
                            <span className="px-2 py-0.5 rounded-md font-mono font-extrabold text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 shadow-2xs">
                              <User size={11} className="text-emerald-600 dark:text-emerald-400" />
                              CANDIDATE ID: {(u as any).candidateId || `CAND-${u.bmdcRegNo.replace(/[^0-9]/g, '') || u.id}`}
                            </span>
                          </div>
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
            
            {/* PRIMARY ADMIN PROFILE CARD */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={adminProfile?.avatarUrl || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'}
                      alt={adminProfile?.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-500/60 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-full border-2 border-slate-900 shadow">
                      <ShieldCheck size={12} />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-extrabold text-white">{adminProfile?.name || 'Dr. M. H. Moni'}</h3>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black bg-amber-500 text-slate-950 uppercase tracking-wide">
                        {adminProfile?.role || 'Superuser'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-amber-300 mt-0.5">{adminProfile?.designation || 'Controller of Examinations'}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap font-mono">
                      <span>📞 {adminProfile?.phone || '+8801700000000'}</span>
                      <span>✉️ {adminProfile?.email || adminEmail}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsAdminEditModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow transition flex items-center justify-center gap-2 shrink-0"
                >
                  <Edit3 size={15} />
                  <span>Edit Name, Phone & Picture</span>
                </button>
              </div>
            </div>

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
                <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Active Faculty Administrators Roster</h4>
                {subAdminsList.map(adm => (
                  <div key={adm.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-xl font-mono font-extrabold text-[11px] bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center gap-1.5 shadow-2xs">
                        <ShieldCheck size={13} className="text-amber-600 dark:text-amber-400" />
                        <span>{(adm as any).adminId || (adm.role.includes('Superuser') ? 'ADM-SUPER-001' : `ADM-${adm.id.replace(/[^0-9]/g, '') || '701'}`)}</span>
                      </span>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{adm.email}</span>
                          {adm.role.includes('Superuser') && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                              PRIMARY SUPERUSER
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">{adm.role}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      {adm.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 9: EXAM SPECIALTIES CONTROL CABINET (ADD / DELETE / LOCK SPECIALTIES)
            ========================================================================= */}
        {activeCabinetTab === 'specialties' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header & Description */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Layers size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Exam Specialties Control Cabinet
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Add new exam specialties or delete existing ones. Changes sync live with the main Candidate Portal Dashboard.
                    </p>
                  </div>
                </div>

                <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-2xs">
                  {examSpecialties.length} Active Specialties
                </span>
              </div>
            </div>

            {specialtySuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{specialtySuccessMsg}</span>
                </div>
                <button onClick={() => setSpecialtySuccessMsg('')} className="hover:opacity-75">
                  <XCircle size={15} />
                </button>
              </div>
            )}

            {/* ADD NEW SPECIALTY FORM */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <PlusCircle size={16} className="text-blue-600" />
                <span>Add New Exam Specialty</span>
              </h4>

              <form onSubmit={handleAddSpecialtySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Specialty Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newSpecName}
                      onChange={e => setNewSpecName(e.target.value)}
                      placeholder="e.g., FCPS P-1 (Ophthalmology) or Diploma (Cardiology)"
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      MCQ Question Count
                    </label>
                    <input
                      type="number"
                      value={newSpecMcqCount}
                      onChange={e => setNewSpecMcqCount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="1500"
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Chapter Count
                    </label>
                    <input
                      type="number"
                      value={newSpecChapterCount}
                      onChange={e => setNewSpecChapterCount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="12"
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Icon Theme
                    </label>
                    <select
                      value={newSpecIconType}
                      onChange={e => setNewSpecIconType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                    >
                      <option value="stethoscope">Stethoscope 🩺 (Surgery / Clinical)</option>
                      <option value="capsule">Capsule 💊 (Medicine / Pharma)</option>
                      <option value="microscope">Microscope 🔬 (Basic Sciences)</option>
                      <option value="globe">Globe 🌐 (International MRCP/MRCS)</option>
                      <option value="tools">Surgical Tools 🛠️ (MRCS / Operative)</option>
                      <option value="gradcap">Grad Cap 🎓 (Diploma / Degree)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Access Restriction
                    </label>
                    <select
                      value={newSpecIsLocked ? 'locked' : 'unlocked'}
                      onChange={e => setNewSpecIsLocked(e.target.value === 'locked')}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700"
                    >
                      <option value="unlocked">Unlocked (Open Practice)</option>
                      <option value="locked">Locked (Requires Subscription)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
                    >
                      <PlusCircle size={16} />
                      <span>Add Exam Specialty</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* LIST OF CURRENT EXAM SPECIALTIES WITH EDIT / DELETE / TOGGLE LOCK BUTTONS */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Active Exam Specialties Roster ({examSpecialties.length})
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Edit MCQ counts, chapter count, icon theme, access restriction, or delete specialties
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {examSpecialties.map(spec => {
                  const isEditingThis = editingSpecialtyId === spec.id;
                  if (isEditingThis) {
                    return (
                      <form
                        key={spec.id}
                        onSubmit={(e) => handleSaveEditSpecialty(e, spec.id)}
                        className="col-span-1 md:col-span-2 p-5 rounded-2xl border-2 border-blue-500 bg-blue-50/50 dark:bg-slate-800/90 shadow-md space-y-4 transition"
                      >
                        <div className="flex items-center justify-between border-b border-blue-200 dark:border-slate-700 pb-3">
                          <div className="flex items-center gap-2">
                            <Edit3 size={16} className="text-blue-600 dark:text-blue-400" />
                            <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                              Editing Exam Specialty: <span className="text-blue-600 dark:text-blue-400">{spec.name}</span>
                            </h5>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingSpecialtyId(null)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700 transition"
                            title="Cancel editing"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                          <div className="sm:col-span-2 md:col-span-1">
                            <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                              Specialty Title / Name
                            </label>
                            <input
                              type="text"
                              value={editSpecialtyForm.name}
                              onChange={e => setEditSpecialtyForm(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full bg-white dark:bg-slate-900 text-xs font-bold rounded-xl px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                              MCQ Question Count
                            </label>
                            <input
                              type="number"
                              value={editSpecialtyForm.mcqCount}
                              onChange={e => setEditSpecialtyForm(prev => ({ ...prev, mcqCount: e.target.value ? Number(e.target.value) : '' }))}
                              placeholder="e.g. 1500"
                              className="w-full bg-white dark:bg-slate-900 text-xs font-mono font-bold rounded-xl px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                              Chapter Count
                            </label>
                            <input
                              type="number"
                              value={editSpecialtyForm.chapterCount}
                              onChange={e => setEditSpecialtyForm(prev => ({ ...prev, chapterCount: e.target.value ? Number(e.target.value) : '' }))}
                              placeholder="e.g. 12"
                              className="w-full bg-white dark:bg-slate-900 text-xs font-mono font-bold rounded-xl px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                              Icon Theme
                            </label>
                            <select
                              value={editSpecialtyForm.iconType}
                              onChange={e => setEditSpecialtyForm(prev => ({ ...prev, iconType: e.target.value }))}
                              className="w-full bg-white dark:bg-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="stethoscope">Stethoscope 🩺 (Surgery / Clinical)</option>
                              <option value="capsule">Capsule 💊 (Medicine / Pharma)</option>
                              <option value="microscope">Microscope 🔬 (Basic Sciences)</option>
                              <option value="globe">Globe 🌐 (International MRCP/MRCS)</option>
                              <option value="tools">Surgical Tools 🛠️ (MRCS / Operative)</option>
                              <option value="gradcap">Grad Cap 🎓 (Diploma / Degree)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                              Access Restriction
                            </label>
                            <select
                              value={editSpecialtyForm.isLocked ? 'locked' : 'unlocked'}
                              onChange={e => setEditSpecialtyForm(prev => ({ ...prev, isLocked: e.target.value === 'locked' }))}
                              className="w-full bg-white dark:bg-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="unlocked">Unlocked (Open Practice)</option>
                              <option value="locked">Locked (Requires Subscription)</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2 md:col-span-1 flex items-end gap-2">
                            <button
                              type="submit"
                              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-sm shadow-blue-500/20 transition flex items-center justify-center gap-1.5"
                            >
                              <Check size={14} />
                              <span>Save Changes</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingSpecialtyId(null)}
                              className="py-2.5 px-3.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    );
                  }

                  return (
                    <div
                      key={spec.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-slate-300 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                          {spec.iconType === 'stethoscope' && '🩺'}
                          {spec.iconType === 'capsule' && '💊'}
                          {spec.iconType === 'microscope' && '🔬'}
                          {spec.iconType === 'globe' && '🌐'}
                          {spec.iconType === 'tools' && '🛠️'}
                          {spec.iconType === 'gradcap' && '🎓'}
                          {!['stethoscope', 'capsule', 'microscope', 'globe', 'tools', 'gradcap'].includes(spec.iconType) && '🎓'}
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {spec.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {spec.mcqCount.toLocaleString()} MCQs • {spec.chapterCount} Chapters
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleStartEditSpecialty(spec)}
                          className="p-2 rounded-xl text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-100/60 dark:hover:bg-blue-950/60 transition border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                          title="Edit Specialty details (MCQ count, chapter count, icon theme, lock status)"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          onClick={() => toggleExamSpecialtyLock(spec.id)}
                          className={`px-2.5 py-1.5 rounded-xl font-extrabold text-[11px] flex items-center gap-1 transition ${
                            spec.isLocked
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 hover:bg-amber-200'
                              : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200'
                          }`}
                          title="Click to toggle lock status"
                        >
                          {spec.isLocked ? (
                            <>
                              <Lock size={12} />
                              <span>Locked</span>
                            </>
                          ) : (
                            <>
                              <Unlock size={12} />
                              <span>Unlocked</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${spec.name}"?`)) {
                              deleteExamSpecialty(spec.id);
                            }
                          }}
                          className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition border border-transparent hover:border-rose-200 dark:hover:border-rose-800"
                          title="Delete Specialty"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* EDIT ADMIN ACCOUNT PROFILE MODAL */}
      {isAdminEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Edit Admin Account Details
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Update profile picture, name, phone number & designation
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAdminEditModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAdminProfileSubmit} className="space-y-5">
              
              {/* Profile Avatar Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Admin Profile Picture / Avatar
                </label>
                
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <img
                    src={adminEditForm.avatarUrl || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-400 shadow-sm shrink-0"
                  />
                  <div className="space-y-2 text-xs flex-1">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="admin-avatar-file-upload"
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] cursor-pointer shadow-xs transition inline-flex items-center gap-1.5"
                      >
                        <UserPlus size={13} />
                        <span>Upload Photo</span>
                      </label>
                      <input
                        id="admin-avatar-file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAdminAvatarFileUpload}
                        className="hidden"
                      />
                      <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, WebP</span>
                    </div>

                    <input
                      type="url"
                      value={adminEditForm.avatarUrl}
                      onChange={e => setAdminEditForm(prev => ({ ...prev, avatarUrl: e.target.value }))}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full bg-white dark:bg-slate-900 text-[11px] rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                {/* Preset Avatars */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Or choose a preset avatar:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAdminEditForm(prev => ({ ...prev, avatarUrl: av.url }))}
                        className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                          adminEditForm.avatarUrl === av.url
                            ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <img src={av.url} alt={av.label} className="w-10 h-10 rounded-full object-cover" />
                        <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 truncate w-full text-center">
                          {av.label.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input: Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={adminEditForm.name}
                  onChange={e => setAdminEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Dr. M. H. Moni"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Input: Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={adminEditForm.phone}
                  onChange={e => setAdminEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+8801700000000"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Input: Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={adminEditForm.email}
                  onChange={e => setAdminEditForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="mhmoni005@gmail.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-mono rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Input: Designation & Department Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Faculty Designation
                  </label>
                  <input
                    type="text"
                    value={adminEditForm.designation}
                    onChange={e => setAdminEditForm(prev => ({ ...prev, designation: e.target.value }))}
                    placeholder="Controller of Examinations"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Department
                  </label>
                  <input
                    type="text"
                    value={adminEditForm.department}
                    onChange={e => setAdminEditForm(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Medical Education & Standards"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Submit / Cancel Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdminEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition flex items-center gap-1.5"
                >
                  <CheckCircle2 size={16} />
                  <span>Save Profile Changes</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
