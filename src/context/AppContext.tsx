import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CandidateProfile,
  Question,
  SubscriptionTier,
  PaymentTransaction,
  StudyGroup,
  ChatMessage,
  ForumPost,
  ExamAttempt
} from '../types';
import {
  initialCandidateProfile,
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
  
  questions: Question[];
  addRecallQuestion: (newQ: Omit<Question, 'id' | 'status'>) => void;
  approveRecallQuestion: (id: string) => void;
  rejectRecallQuestion: (id: string) => void;

  studyGroups: StudyGroup[];
  joinedGroupIds: string[];
  joinGroup: (groupId: string) => { success: boolean; message?: string };
  leaveGroup: (groupId: string) => void;

  chatMessages: Record<string, ChatMessage[]>;
  sendChatMessage: (groupId: string, messageData: { text?: string; imageUrl?: string; embeddedQuestion?: Question }) => void;

  forumPosts: ForumPost[];
  addForumPost: (title: string, content: string, facultyTag: any, specialtyTag: string) => void;
  upvoteForumPost: (postId: string) => void;
  addForumReply: (postId: string, content: string) => void;

  subscriptionTiers: SubscriptionTier[];
  transactions: PaymentTransaction[];
  submitPaymentTransaction: (tierId: string, gateway: any, accountNumber: string, trxId: string) => Promise<{ success: boolean; message: string }>;
  approveTransaction: (trxId: string) => void;

  examHistory: ExamAttempt[];
  recordExamAttempt: (attempt: Omit<ExamAttempt, 'id' | 'completedAt'>) => void;

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
  };

  // Admin Auth State & Mail ID
  const adminEmail = 'mhmoni005@gmail.com';
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('medexam_admin') === 'true';
  });

  const loginAdmin = (identifierOrPasscode: string, password?: string) => {
    const cleanId = identifierOrPasscode.trim().toLowerCase();
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

  // Study Groups & Membership State
  const [studyGroups] = useState<StudyGroup[]>(defaultGroups);
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
    const isSubscribedSpecialty =
      candidate.hasActiveSubscription &&
      (candidate.activeSubscriptionTier?.includes('All-Access') ||
        candidate.activeSubscriptionTier?.includes(targetGroup.specialtyTag.substring(0, 8)) ||
        targetGroup.specialtyTag.toLowerCase().includes(candidate.specialty.toLowerCase().substring(0, 6)));

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
        tierId: 'tier_ms_residency',
        tierName: 'MS / MD Residency Entrance Pass',
        gateway: 'bKash',
        accountNumber: '01712345678',
        trxId: '8N29X7K9L',
        amountBDT: 3000,
        status: 'active',
        timestamp: '2025-01-10 10:00 AM'
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
    trxId: string
  ): Promise<{ success: boolean; message: string }> => {
    const tier = subscriptionTiers.find(t => t.id === tierId);
    if (!tier) return { success: false, message: 'Invalid subscription tier selected.' };

    const newTrx: PaymentTransaction = {
      id: 'trx_' + Date.now(),
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidatePhone: candidate.phone,
      tierId: tier.id,
      tierName: tier.name,
      gateway,
      accountNumber,
      trxId: trxId.trim().toUpperCase(),
      amountBDT: tier.priceBDT,
      status: 'active', // Instant simulation activation
      timestamp: new Date().toLocaleString()
    };

    setTransactions(prev => [newTrx, ...prev]);

    // Update candidate's subscription state immediately
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + tier.durationMonths);

    updateCandidate({
      hasActiveSubscription: true,
      activeSubscriptionTier: tier.name,
      subscriptionExpiryDate: expiry.toISOString()
    });

    return {
      success: true,
      message: `Transaction ${trxId.toUpperCase()} verified! Your "${tier.name}" is now ACTIVE.`
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

  return (
    <AppContext.Provider
      value={{
        themeMode,
        theme: themeMode,
        toggleTheme,
        candidate,
        updateCandidate,
        updateProfile: updateCandidate,
        questions,
        addRecallQuestion,
        approveRecallQuestion,
        rejectRecallQuestion,
        studyGroups,
        joinedGroupIds,
        joinGroup,
        leaveGroup,
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
