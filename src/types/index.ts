export type Role = 'candidate' | 'faculty_admin';

export type MedicalSpecialty =
  | 'FCPS Part I (Medicine)'
  | 'FCPS Part I (Surgery)'
  | 'FCPS Part I (Gynae & Obs)'
  | 'MS General Surgery'
  | 'MS Orthopedics'
  | 'MD Cardiology'
  | 'MD Pediatrics'
  | 'MRCS Part A'
  | 'MRCP Part 1'
  | 'MBBS Final Professional Exam';

export type FacultyName =
  | 'Surgery'
  | 'Medicine'
  | 'Gynecology & Obstetrics'
  | 'Pediatrics'
  | 'Basic Medical Sciences';

export interface ExamSpecialtyItem {
  id: string;
  name: string;
  mcqCount: number;
  chapterCount: number;
  iconType: string;
  isLocked?: boolean;
}

export interface AdminProfile {
  adminId: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: string;
  designation?: string;
  department?: string;
}

export interface CandidateProfile {
  id: string;
  candidateId?: string; // e.g. "CAND-108294"
  name: string;
  email: string;
  phone: string;
  designation: string; // e.g., "Dr. Ayesha Rahman, MBBS"
  collegeHospital?: string; // e.g., "Dhaka Medical College & Hospital"
  specialty: MedicalSpecialty;
  bmdcRegNo: string; // e.g. "A-108294"
  avatarUrl: string;
  role: Role;
  createdAt: string;
  hasActiveSubscription: boolean;
  activeSubscriptionTier?: string;
  subscriptionExpiryDate?: string;
  password?: string;
}

export type QuestionType = 'SBA' | 'MCQ';

export interface SBAQuestion {
  id: string;
  type: 'SBA';
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  highYieldKeyPoints?: string[];
  textbookReference: string;
  faculty: FacultyName;
  topic: string;
  specialtyTag?: string;
  facultyTag?: string;
  examSessionTag?: string;
  textbookCitation?: string;
  yearTag?: string; // e.g. "BCPS FCPS Jan 2025 Recall"
  status: 'approved' | 'pending_approval' | 'rejected';
  submittedBy?: string;
}

export interface MCQStem {
  id: string;
  text: string;
  isTrue: boolean;
}

export interface MCQQuestion {
  id: string;
  type: 'MCQ';
  stem: string;
  stems: MCQStem[];
  explanation: string;
  highYieldKeyPoints?: string[];
  textbookReference: string;
  faculty: FacultyName;
  topic: string;
  specialtyTag?: string;
  facultyTag?: string;
  examSessionTag?: string;
  textbookCitation?: string;
  yearTag?: string;
  status: 'approved' | 'pending_approval' | 'rejected';
  submittedBy?: string;
}

export type Question = SBAQuestion | MCQQuestion;

export interface TopicScore {
  topic: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface ExamAttempt {
  id: string;
  examTitle: string;
  specialty: MedicalSpecialty | string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  answersRecord: Record<string, any>; // questionId -> answer
  topicBreakdown: TopicScore[];
  nationalAverageBenchmark: number; // e.g. 51%
  topRankBenchmark: number; // e.g. 82%
}

export interface SubscriptionTier {
  id: string;
  name: string;
  specialtyTag: MedicalSpecialty | 'All-Access Pass';
  priceBDT: number;
  originalPriceBDT?: number;
  durationMonths: number;
  popularBadge?: boolean;
  features: string[];
}

export type MobileBankingGateway = 'bKash' | 'Nagad' | 'Rocket';

export interface PaymentTransaction {
  id: string;
  candidateId: string;
  candidateName: string;
  candidatePhone: string;
  tierId: string;
  tierName: string;
  gateway: MobileBankingGateway;
  accountNumber: string;
  trxId: string;
  amountBDT: number;
  status: 'active' | 'pending' | 'rejected';
  timestamp: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  specialtyTag: MedicalSpecialty;
  description: string;
  iconEmoji: string;
  memberCount: number;
  activeNowCount: number;
  isPrivate: boolean;
  facultySupervisor: string;
  adminId?: string;
  adminName?: string;
  recentActivity: string;
  memberCandidateIds?: string[];
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderDesignation: string;
  senderAvatar: string;
  isFaculty?: boolean;
  text?: string;
  imageUrl?: string;
  embeddedQuestion?: Question;
  timestamp: string;
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorDesignation: string;
  authorAvatar: string;
  isFaculty: boolean;
  content: string;
  timestamp: string;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorDesignation: string;
  authorAvatar: string;
  title: string;
  content: string;
  facultyTag: FacultyName;
  specialtyTag: string;
  upvotes: number;
  isUpvoted?: boolean;
  repliesCount: number;
  timestamp: string;
  replies: ForumReply[];
}

export interface HelplineContact {
  id: string;
  type: 'whatsapp' | 'email';
  label: string;
  value: string;
  isActive: boolean;
}
