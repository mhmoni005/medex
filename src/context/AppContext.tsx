import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdminProfile,
  CandidateProfile,
  Question,
  SubscriptionTier,
  PaymentTransaction,
  StudyGroup,
  ChatMessage,
  ForumPost,
  ExamAttempt,
  ExamSpecialtyItem,
  HelplineContact
} from '../types';
import {
  initialAdminProfile,
  initialCandidateProfile,
  initialExamSpecialties,
  subscriptionTiers as defaultTiers,
  mockQuestions as defaultQuestions,
  studyGroups as defaultGroups,
  initialChatMessages as defaultMessages,
  initialForumPosts as defaultPosts,
  sampleExamHistory as defaultHistory
} from '../data/mockData';

interface AppContextType {
  themeMode: 'light' | 'dark';
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  candidate: CandidateProfile;
  updateCandidate: (updated: Partial<CandidateProfile>) => void;
  updateProfile: (updated: Partial<CandidateProfile>) => void;
  
  adminProfile: AdminProfile;
  updateAdminProfile: (updated: Partial<AdminProfile>) => void;
  
  questions: Question[];
  addRecallQuestion: (newQ: Omit<Question, 'id' | 'status'>) => void;
  approveRecallQuestion: (id: string) => void;
  rejectRecallQuestion: (id: string) => void;

  studyGroups: StudyGroup[];
  joinedGroupIds: string[];
  joinGroup: (groupId: string) => { success: boolean; message?: string };
  leaveGroup: (groupId: string) => void;
  createStudyGroup: (group: Omit<StudyGroup, 'id' | 'memberCount' | 'activeNowCount'>) => void;
  deleteStudyGroup: (groupId: string) => void;
  addCandidateToGroup: (groupId: string, candidateId: string) => void;
  removeCandidateFromGroup: (groupId: string, candidateId: string) => void;

  candidateDirectory: CandidateProfile[];
  addCandidateToDirectory: (candidate: Omit<CandidateProfile, 'id' | 'createdAt'>) => void;
  removeCandidateFromDirectory: (candidateId: string) => void;

  helplineContacts: HelplineContact[];
  addHelplineContact: (contact: Omit<HelplineContact, 'id'>) => void;
  removeHelplineContact: (id: string) => void;
  toggleHelplineContact: (id: string) => void;

  chatMessages: Record<string, ChatMessage[]>;
  sendChatMessage: (groupId: string, messageData: { text?: string; imageUrl?: string; embeddedQuestion?: Question }) => void;

  forumPosts: ForumPost[];
  addForumPost: (title: string, content: string, facultyTag: any, specialtyTag: string) => void;
  upvoteForumPost: (postId: string) => void;
  addForumReply: (postId: string, content: string) => void;

  subscriptionTiers: SubscriptionTier[];
  transactions: PaymentTransaction[];
  submitPaymentTransaction: (
    tierId: string,
    gateway: any,
    accountNumber: string,
    trxId: string,
    customDetails?: {
      tierName?: string;
      amountBDT?: number;
      durationMonths?: number;
    }
  ) => Promise<{ success: boolean; message: string }>;
  approveTransaction: (trxId: string) => void;

  examHistory: ExamAttempt[];
  recordExamAttempt: (attempt: Omit<ExamAttempt, 'id' | 'completedAt'>) => void;

  examSpecialties: ExamSpecialtyItem[];
  addExamSpecialty: (specialty: Omit<ExamSpecialtyItem, 'id'>) => void;
  updateExamSpecialty: (id: string, updated: Partial<ExamSpecialtyItem>) => void;
  deleteExamSpecialty: (id: string) => void;
  toggleExamSpecialtyLock: (id: string) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // UI Drawer & Auth Modal
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthModalOpen: boolean;
  authModalMode: 'candidate' | 'admin' | 'register';
  openAuthModal: (mode?: 'candidate' | 'admin' | 'register') => void;
  closeAuthModal: () => void;

  // Candidate Auth
  isCandidateLoggedIn: boolean;
  loginCandidate: (identifier: string) => boolean;
  logoutCandidate: () => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminEmail: string;
  loginAdmin: (identifierOrPasscode: string, password?: string) => boolean;
  logoutAdmin: () => void;

  // Unified Login
  unifiedLogin: (identifier: string, password?: string) => 'admin' | 'candidate';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme Mode
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('medexam_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('medexam_theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Active Navigation Tab & UI Drawer State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'candidate' | 'admin' | 'register'>('candidate');

  const openAuthModal = (mode: 'candidate' | 'admin' | 'register' = 'candidate') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Candidate Auth State
  const [isCandidateLoggedIn, setIsCandidateLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('medexam_candidate_logged_in') === 'true';
  });

  const loginCandidate = (identifier: string) => {
    setIsCandidateLoggedIn(true);
    localStorage.setItem('medexam_candidate_logged_in', 'true');
    // Clear admin session when logging in as candidate
    setIsAdminLoggedIn(false);
    localStorage.removeItem('medexam_admin');
    if (activeTab === 'admin') {
      setActiveTab('dashboard');
    }
    // Also if identifier provided, update profile email/phone if appropriate
    if (identifier.includes('@')) {
      updateCandidate({ email: identifier });
    } else if (identifier.length >= 8) {
      updateCandidate({ phone: identifier });
    }
    return true;
  };

  const logoutCandidate = () => {
    setIsCandidateLoggedIn(false);
    localStorage.removeItem('medexam_candidate_logged_in');
    if (activeTab === 'profile_settings' || activeTab === 'profile') {
      setActiveTab('dashboard');
    }
  };

  // Admin Profile State & Auth
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    const saved = localStorage.getItem('medexam_admin_profile');
    return saved ? JSON.parse(saved) : initialAdminProfile;
  });

  useEffect(() => {
    localStorage.setItem('medexam_admin_profile', JSON.stringify(adminProfile));
  }, [adminProfile]);

  const updateAdminProfile = (updated: Partial<AdminProfile>) => {
    setAdminProfile(prev => ({ ...prev, ...updated }));
  };

  const adminEmail = adminProfile.email || 'mhmoni005@gmail.com';
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('medexam_admin') === 'true';
  });

  const loginAdmin = (identifierOrPasscode: string, password?: string) => {
    const cleanId = (identifierOrPasscode || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Check if logging in via email + password, or direct passcode
    if (
      cleanId === 'mhmoni005@gmail.com' ||
      cleanId === 'admin' ||
      cleanId === 'medadmin2026' ||
      cleanPass === 'mhmoni005' ||
      cleanPass === 'medadmin2026' ||
      cleanPass === 'admin' ||
      cleanPass === 'admin123'
    ) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('medexam_admin', 'true');
      // Clear candidate session when logging in as admin
      setIsCandidateLoggedIn(false);
      localStorage.removeItem('medexam_candidate_logged_in');
      setActiveTab('admin');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('medexam_admin');
    if (activeTab === 'admin') {
      setActiveTab('dashboard');
    }
  };

  // Unified Login Handler
  const unifiedLogin = (identifier: string, password?: string): 'admin' | 'candidate' => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Check if credentials match admin
    if (
      cleanId === 'mhmoni005@gmail.com' ||
      cleanId === 'admin' ||
      cleanId === 'medadmin2026' ||
      cleanPass === 'mhmoni005'
    ) {
      loginAdmin(identifier, password);
      return 'admin';
    } else {
      loginCandidate(identifier);
      return 'candidate';
    }
  };

  // Candidate Profile State
  const [candidate, setCandidate] = useState<CandidateProfile>(() => {
    const saved = localStorage.getItem('medexam_candidate');
    return saved ? JSON.parse(saved) : initialCandidateProfile;
  });

  useEffect(() => {
    localStorage.setItem('medexam_candidate', JSON.stringify(candidate));
  }, [candidate]);

  const updateCandidate = (updated: Partial<CandidateProfile>) => {
    setCandidate(prev => ({ ...prev, ...updated }));
  };

  // Questions State
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('medexam_questions');
    return saved ? JSON.parse(saved) : defaultQuestions;
  });

  useEffect(() => {
    localStorage.setItem('medexam_questions', JSON.stringify(questions));
  }, [questions]);

  const addRecallQuestion = (newQ: Omit<Question, 'id' | 'status'>) => {
    const id = 'q_custom_' + Date.now();
    const createdQ: Question = {
      ...newQ,
      id,
      status: 'pending_approval',
      submittedBy: candidate.name
    } as Question;

    setQuestions(prev => [createdQ, ...prev]);

    // Automatically update MCQ count for matching Exam Specialty
    if (newQ.specialtyTag) {
      const tagClean = newQ.specialtyTag.trim().toLowerCase();
      setExamSpecialties(prev =>
        prev.map(s => {
          if (s.name.trim().toLowerCase() === tagClean || tagClean.includes(s.name.trim().toLowerCase())) {
            return { ...s, mcqCount: s.mcqCount + 1 };
          }
          return s;
        })
      );
    }
  };

  const approveRecallQuestion = (id: string) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, status: 'approved' } : q))
    );
  };

  const rejectRecallQuestion = (id: string) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, status: 'rejected' } : q))
    );
  };

  // Candidate Directory State for Admin & Group Management
  const [candidateDirectory, setCandidateDirectory] = useState<CandidateProfile[]>(() => {
    const saved = localStorage.getItem('medexam_candidate_directory');
    if (saved) return JSON.parse(saved);
    return [
      initialCandidateProfile,
      {
        id: 'cand_102',
        candidateId: 'CAND-84920',
        name: 'Dr. Tanvir Ahmed',
        email: 'tanvir.med@gmail.com',
        phone: '+8801722223333',
        designation: 'HMO, Surgery',
        collegeHospital: 'Dhaka Medical College',
        specialty: 'FCPS Part I (Surgery)',
        bmdcRegNo: 'A-84920',
        avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
        role: 'candidate',
        createdAt: '2025-02-12',
        hasActiveSubscription: true,
        activeSubscriptionTier: 'FCPS Part 1 Surgery Pass'
      },
      {
        id: 'cand_103',
        candidateId: 'CAND-91023',
        name: 'Dr. Nusrat Jahan',
        email: 'dr.nusrat@yahoo.com',
        phone: '+8801833334444',
        designation: 'MO, Gynae',
        collegeHospital: 'Chittagong Medical College',
        specialty: 'FCPS Part I (Gynae & Obs)',
        bmdcRegNo: 'A-91023',
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
        role: 'candidate',
        createdAt: '2025-03-01',
        hasActiveSubscription: false,
        activeSubscriptionTier: 'Free Trial Pass'
      },
      {
        id: 'cand_104',
        candidateId: 'CAND-77201',
        name: 'Dr. Mahmudul Hasan',
        email: 'mahmud.med@gmail.com',
        phone: '+8801911112222',
        designation: 'Medical Officer',
        collegeHospital: 'Shaheed Suhrawardy Medical College',
        specialty: 'MS General Surgery',
        bmdcRegNo: 'A-77201',
        avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
        role: 'candidate',
        createdAt: '2025-03-10',
        hasActiveSubscription: true,
        activeSubscriptionTier: 'MS / MD Residency Pass'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('medexam_candidate_directory', JSON.stringify(candidateDirectory));
  }, [candidateDirectory]);

  const addCandidateToDirectory = (newCand: Omit<CandidateProfile, 'id' | 'createdAt'>) => {
    const created: CandidateProfile = {
      ...newCand,
      id: 'cand_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCandidateDirectory(prev => [created, ...prev]);
  };

  const removeCandidateFromDirectory = (candId: string) => {
    setCandidateDirectory(prev => prev.filter(c => c.id !== candId));
  };

  // Helpline Contacts State (Admin managed WhatsApp & Email helpline)
  const [helplineContacts, setHelplineContacts] = useState<HelplineContact[]>(() => {
    const saved = localStorage.getItem('medexam_helpline_contacts');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'hlp_wa_1',
        type: 'whatsapp',
        label: '24/7 Academic & Question Recall Helpline',
        value: '+8801700001122',
        isActive: true
      },
      {
        id: 'hlp_wa_2',
        type: 'whatsapp',
        label: 'Exam Admission & Pass Verification Support',
        value: '+8801800003344',
        isActive: true
      },
      {
        id: 'hlp_em_1',
        type: 'email',
        label: 'Official Candidate Support Desk',
        value: 'support@medexambd.org',
        isActive: true
      },
      {
        id: 'hlp_em_2',
        type: 'email',
        label: 'Faculty Administrator Contact',
        value: 'admin@medexambd.org',
        isActive: true
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('medexam_helpline_contacts', JSON.stringify(helplineContacts));
  }, [helplineContacts]);

  const addHelplineContact = (contact: Omit<HelplineContact, 'id'>) => {
    const created: HelplineContact = {
      ...contact,
      id: 'hlp_' + Date.now()
    };
    setHelplineContacts(prev => [created, ...prev]);
  };

  const removeHelplineContact = (id: string) => {
    setHelplineContacts(prev => prev.filter(h => h.id !== id));
  };

  const toggleHelplineContact = (id: string) => {
    setHelplineContacts(prev =>
      prev.map(h => (h.id === id ? { ...h, isActive: !h.isActive } : h))
    );
  };

  // Study Groups & Membership State
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('medexam_study_groups');
    return saved ? JSON.parse(saved) : defaultGroups;
  });

  useEffect(() => {
    localStorage.setItem('medexam_study_groups', JSON.stringify(studyGroups));
  }, [studyGroups]);

  const createStudyGroup = (groupData: Omit<StudyGroup, 'id' | 'memberCount' | 'activeNowCount'>) => {
    const newGroupId = 'grp_' + Date.now();
    const newGroup: StudyGroup = {
      ...groupData,
      id: newGroupId,
      memberCount: groupData.memberCandidateIds ? groupData.memberCandidateIds.length : 1,
      activeNowCount: 1,
      facultySupervisor: groupData.facultySupervisor || adminProfile.name || 'Dr. M. H. Moni',
      adminId: groupData.adminId || adminProfile.adminId || 'ADM-SUPER-001',
      adminName: groupData.adminName || adminProfile.name || 'Dr. M. H. Moni',
      recentActivity: groupData.recentActivity || 'Group created by Faculty Admin',
      memberCandidateIds: groupData.memberCandidateIds || [candidate.id]
    };

    setStudyGroups(prev => [newGroup, ...prev]);
    setJoinedGroupIds(prev => (prev.includes(newGroupId) ? prev : [...prev, newGroupId]));
  };

  const deleteStudyGroup = (groupId: string) => {
    setStudyGroups(prev => prev.filter(g => g.id !== groupId));
    setJoinedGroupIds(prev => prev.filter(id => id !== groupId));
  };

  const addCandidateToGroup = (groupId: string, candidateId: string) => {
    setStudyGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          const currentMembers = g.memberCandidateIds || [];
          if (!currentMembers.includes(candidateId)) {
            const updatedMembers = [...currentMembers, candidateId];
            return {
              ...g,
              memberCandidateIds: updatedMembers,
              memberCount: Math.max(g.memberCount + 1, updatedMembers.length)
            };
          }
        }
        return g;
      })
    );

    if (candidateId === candidate.id && !joinedGroupIds.includes(groupId)) {
      setJoinedGroupIds(prev => [...prev, groupId]);
    }
  };

  const removeCandidateFromGroup = (groupId: string, candidateId: string) => {
    setStudyGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          const currentMembers = g.memberCandidateIds || [];
          const updatedMembers = currentMembers.filter(id => id !== candidateId);
          return {
            ...g,
            memberCandidateIds: updatedMembers,
            memberCount: Math.max(0, g.memberCount - 1)
          };
        }
        return g;
      })
    );

    if (candidateId === candidate.id) {
      setJoinedGroupIds(prev => prev.filter(id => id !== groupId));
    }
  };

  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('medexam_joined_groups');
    return saved ? JSON.parse(saved) : ['grp_surgery', 'grp_ms_surgery'];
  });

  useEffect(() => {
    localStorage.setItem('medexam_joined_groups', JSON.stringify(joinedGroupIds));
  }, [joinedGroupIds]);

  const joinGroup = (groupId: string): { success: boolean; message?: string } => {
    const targetGroup = studyGroups.find(g => g.id === groupId);
    if (!targetGroup) return { success: false, message: 'Group not found.' };

    // Subscribed Specialty Enforcement: Check if candidate specialty or subscription allows joining
    // Allow if candidate has active subscription AND specialty matches OR All-Access Pass
    const specTag = targetGroup.specialtyTag || '';
    const candSpec = candidate?.specialty || '';
    const isSubscribedSpecialty =
      candidate?.hasActiveSubscription &&
      (candidate?.activeSubscriptionTier?.includes('All-Access') ||
        (specTag && candidate?.activeSubscriptionTier?.includes(specTag.substring(0, 8))) ||
        specTag.toLowerCase().includes(candSpec.toLowerCase().substring(0, 6)));

    if (!isSubscribedSpecialty && !joinedGroupIds.includes(groupId)) {
      return {
        success: false,
        message: `Access Restricted: Joining "${targetGroup.name}" requires an active subscription to ${targetGroup.specialtyTag}.`
      };
    }

    if (!joinedGroupIds.includes(groupId)) {
      setJoinedGroupIds(prev => [...prev, groupId]);
    }
    return { success: true };
  };

  const leaveGroup = (groupId: string) => {
    setJoinedGroupIds(prev => prev.filter(id => id !== groupId));
  };

  // Chat Messages State
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('medexam_chat_messages');
    return saved ? JSON.parse(saved) : defaultMessages;
  });

  useEffect(() => {
    localStorage.setItem('medexam_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const sendChatMessage = (
    groupId: string,
    messageData: { text?: string; imageUrl?: string; embeddedQuestion?: Question }
  ) => {
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      groupId,
      senderId: candidate.id,
      senderName: candidate.name,
      senderDesignation: candidate.designation,
      senderAvatar: candidate.avatarUrl,
      isFaculty: candidate.role === 'faculty_admin',
      text: messageData.text,
      imageUrl: messageData.imageUrl,
      embeddedQuestion: messageData.embeddedQuestion,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), newMsg]
    }));
  };

  // Forum Posts State
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem('medexam_forum');
    return saved ? JSON.parse(saved) : defaultPosts;
  });

  useEffect(() => {
    localStorage.setItem('medexam_forum', JSON.stringify(forumPosts));
  }, [forumPosts]);

  const addForumPost = (title: string, content: string, facultyTag: any, specialtyTag: string) => {
    const newPost: ForumPost = {
      id: 'post_' + Date.now(),
      authorName: candidate.name,
      authorDesignation: candidate.designation,
      authorAvatar: candidate.avatarUrl,
      title,
      content,
      facultyTag,
      specialtyTag,
      upvotes: 1,
      isUpvoted: true,
      repliesCount: 0,
      timestamp: 'Just now',
      replies: []
    };
    setForumPosts(prev => [newPost, ...prev]);
  };

  const upvoteForumPost = (postId: string) => {
    setForumPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isUp = p.isUpvoted;
          return {
            ...p,
            upvotes: isUp ? p.upvotes - 1 : p.upvotes + 1,
            isUpvoted: !isUp
          };
        }
        return p;
      })
    );
  };

  const addForumReply = (postId: string, content: string) => {
    const replyObj = {
      id: 'rep_' + Date.now(),
      authorName: candidate.name,
      authorDesignation: candidate.designation,
      authorAvatar: candidate.avatarUrl,
      isFaculty: candidate.role === 'faculty_admin',
      content,
      timestamp: 'Just now'
    };

    setForumPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            repliesCount: p.repliesCount + 1,
            replies: [...p.replies, replyObj]
          };
        }
        return p;
      })
    );
  };

  // Subscriptions & Payment Transactions State
  const [subscriptionTiers] = useState<SubscriptionTier[]>(defaultTiers);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('medexam_transactions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'trx_1001',
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidatePhone: candidate.phone,
        tierId: 'tier_fcps_part1',
        tierName: 'FCPS Part I Special Pack',
        gateway: 'bKash',
        accountNumber: '01712345678',
        trxId: 'TXN-BK-991204',
        amountBDT: 2500,
        status: 'active',
        timestamp: '2026-05-15 14:32:00'
      },
      {
        id: 'trx_1002',
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidatePhone: candidate.phone,
        tierId: 'tier_mrcp',
        tierName: 'MRCP Part I Quick Prep',
        gateway: 'Nagad',
        accountNumber: '01812345678',
        trxId: 'TXN-NG-770381',
        amountBDT: 4000,
        status: 'active',
        timestamp: '2026-04-10 11:15:00'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('medexam_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const submitPaymentTransaction = async (
    tierId: string,
    gateway: any,
    accountNumber: string,
    trxId: string,
    customDetails?: {
      tierName?: string;
      amountBDT?: number;
      durationMonths?: number;
    }
  ): Promise<{ success: boolean; message: string }> => {
    const tier = subscriptionTiers.find(t => t.id === tierId);

    const resolvedTierName = customDetails?.tierName || tier?.name || 'Specialty License Pass';
    const resolvedAmountBDT = customDetails?.amountBDT !== undefined ? customDetails.amountBDT : (tier?.priceBDT || 600);
    const resolvedDuration = customDetails?.durationMonths !== undefined ? customDetails.durationMonths : (tier?.durationMonths || 1);

    const newTrx: PaymentTransaction = {
      id: 'trx_' + Date.now(),
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidatePhone: candidate.phone,
      tierId: tier?.id || tierId || 'tier_custom',
      tierName: resolvedTierName,
      gateway,
      accountNumber,
      trxId: (trxId || '').trim().toUpperCase(),
      amountBDT: resolvedAmountBDT,
      status: 'active', // Instant simulation activation
      timestamp: new Date().toLocaleString()
    };

    setTransactions(prev => [newTrx, ...prev]);

    // Update candidate's subscription state immediately
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + resolvedDuration);

    updateCandidate({
      hasActiveSubscription: true,
      activeSubscriptionTier: resolvedTierName,
      subscriptionExpiryDate: expiry.toISOString()
    });

    return {
      success: true,
      message: `Transaction ${(trxId || '').toUpperCase()} verified! Your "${resolvedTierName}" is now ACTIVE.`
    };
  };

  const approveTransaction = (trxIdVal: string) => {
    setTransactions(prev =>
      prev.map(t => (t.trxId === trxIdVal ? { ...t, status: 'active' } : t))
    );
  };

  // Exam History State
  const [examHistory, setExamHistory] = useState<ExamAttempt[]>(() => {
    const saved = localStorage.getItem('medexam_history');
    return saved ? JSON.parse(saved) : defaultHistory;
  });

  useEffect(() => {
    localStorage.setItem('medexam_history', JSON.stringify(examHistory));
  }, [examHistory]);

  const recordExamAttempt = (attempt: Omit<ExamAttempt, 'id' | 'completedAt'>) => {
    const newAttempt: ExamAttempt = {
      ...attempt,
      id: 'attempt_' + Date.now(),
      completedAt: new Date().toISOString()
    };
    setExamHistory(prev => [newAttempt, ...prev]);
  };

  // Exam Specialties State
  const [examSpecialties, setExamSpecialties] = useState<ExamSpecialtyItem[]>(() => {
    const saved = localStorage.getItem('medexam_specialties');
    return saved ? JSON.parse(saved) : initialExamSpecialties;
  });

  useEffect(() => {
    localStorage.setItem('medexam_specialties', JSON.stringify(examSpecialties));
  }, [examSpecialties]);

  const addExamSpecialty = (item: Omit<ExamSpecialtyItem, 'id'>) => {
    const newSpecialty: ExamSpecialtyItem = {
      ...item,
      id: 'spec_' + Date.now()
    };
    setExamSpecialties(prev => [...prev, newSpecialty]);
  };

  const updateExamSpecialty = (id: string, updated: Partial<ExamSpecialtyItem>) => {
    setExamSpecialties(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const deleteExamSpecialty = (id: string) => {
    setExamSpecialties(prev => prev.filter(s => s.id !== id));
  };

  const toggleExamSpecialtyLock = (id: string) => {
    setExamSpecialties(prev =>
      prev.map(s => (s.id === id ? { ...s, isLocked: !s.isLocked } : s))
    );
  };

  return (
    <AppContext.Provider
      value={{
        themeMode,
        theme: themeMode,
        toggleTheme,
        candidate,
        updateCandidate,
        updateProfile: updateCandidate,
        adminProfile,
        updateAdminProfile,
        questions,
        addRecallQuestion,
        approveRecallQuestion,
        rejectRecallQuestion,
        studyGroups,
        joinedGroupIds,
        joinGroup,
        leaveGroup,
        createStudyGroup,
        deleteStudyGroup,
        addCandidateToGroup,
        removeCandidateFromGroup,
        candidateDirectory,
        addCandidateToDirectory,
        removeCandidateFromDirectory,
        helplineContacts,
        addHelplineContact,
        removeHelplineContact,
        toggleHelplineContact,
        chatMessages,
        sendChatMessage,
        forumPosts,
        addForumPost,
        upvoteForumPost,
        addForumReply,
        subscriptionTiers,
        transactions,
        submitPaymentTransaction,
        approveTransaction,
        examHistory,
        recordExamAttempt,
        examSpecialties,
        addExamSpecialty,
        updateExamSpecialty,
        deleteExamSpecialty,
        toggleExamSpecialtyLock,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        mobileMenuOpen,
        setMobileMenuOpen,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        isCandidateLoggedIn,
        loginCandidate,
        logoutCandidate,
        isAdminLoggedIn,
        adminEmail,
        loginAdmin,
        logoutAdmin,
        unifiedLogin
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
