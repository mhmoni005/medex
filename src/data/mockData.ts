import {
  CandidateProfile,
  Question,
  SubscriptionTier,
  StudyGroup,
  ChatMessage,
  ForumPost,
  ExamAttempt
} from '../types';

export const initialCandidateProfile: CandidateProfile = {
  id: 'cand_101',
  name: 'Dr. Tanvir Hossain',
  email: 'tanvir.hossain@dmc.edu.bd',
  phone: '+8801712345678',
  designation: 'Medical Officer, Dhaka Medical College Hospital',
  specialty: 'MS General Surgery',
  bmdcRegNo: 'A-89420',
  avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  role: 'candidate',
  createdAt: '2025-01-10T10:00:00Z',
  hasActiveSubscription: true,
  activeSubscriptionTier: 'MS General Surgery & Residency Pass',
  subscriptionExpiryDate: '2026-11-30T23:59:59Z'
};

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'tier_fcps',
    name: 'FCPS Part I Preparation Package',
    specialtyTag: 'FCPS Part I (Surgery)',
    priceBDT: 2500,
    originalPriceBDT: 3500,
    durationMonths: 6,
    popularBadge: true,
    features: [
      'Full Access to 8,500+ Subject-wise FCPS Part I Recall SBAs',
      '50+ Realistic BCPS Pattern Mock Tests with Negative Marking',
      'Instant Answer Rationale with Bailey & Love / Davidson Citations',
      'Exclusive Subscribed Candidate Recall Group Chat',
      'AI High-Yield Note Explainer & Concept Tutor',
      'National Rank & Benchmark Performance Analytics'
    ]
  },
  {
    id: 'tier_ms_residency',
    name: 'MS / MD Residency Entrance Pass',
    specialtyTag: 'MS General Surgery',
    priceBDT: 3000,
    originalPriceBDT: 4200,
    durationMonths: 6,
    popularBadge: false,
    features: [
      'BSMMU, DMC, SSMC & Chittagong Medical College Pattern Mock Exams',
      '6,000+ Basic Medical Science (Anatomy, Physiology, Pathology) MCQs',
      'Subject & Faculty Wise Weakness Radar Analysis',
      'Subscribed MS/MD Residency Peer Recall Study Lounge',
      'Past 10 Years BSMMU Recall Solved Question Bank',
      'Instant Mobile Banking Activation (bKash/Nagad/Rocket)'
    ]
  },
  {
    id: 'tier_mrcs',
    name: 'MRCS Part A & MRCP Part 1 International Pass',
    specialtyTag: 'MRCS Part A',
    priceBDT: 4500,
    originalPriceBDT: 6000,
    durationMonths: 6,
    popularBadge: false,
    features: [
      'Royal College Pattern Applied Basic Science & Principles Questions',
      'Anatomy Diagrams, Surgical Pathology & Radiology Recall Bank',
      'UK Royal College Standard Score Benchmark',
      'MRCS / MRCP International Peer Discussion Lounge',
      'Faculty Supervisor Verified Explanations & Citations'
    ]
  },
  {
    id: 'tier_mbbs',
    name: 'MBBS Final Professional Exam Package',
    specialtyTag: 'MBBS Final Professional Exam',
    priceBDT: 1800,
    originalPriceBDT: 2500,
    durationMonths: 4,
    popularBadge: false,
    features: [
      'Medicine, Surgery & Gynae Long Case/Short Case High-Yield Prep',
      'Ospe & VIVA Examination Board Question Stems',
      'Curated SBAs for DU, Chittagong, Rajshahi & Sylhet Medical Univ',
      'Undergraduate Final Prof Peer Study Group Access'
    ]
  },
  {
    id: 'tier_all_access',
    name: 'All-Access Postgraduate Grand Pass',
    specialtyTag: 'All-Access Pass',
    priceBDT: 5500,
    originalPriceBDT: 8000,
    durationMonths: 12,
    popularBadge: true,
    features: [
      'Unlimited Access to FCPS, MS, MD, MRCS, MRCP & Diploma Banks',
      'Priority Access to All Specialty Study Group Chats',
      'Unlimited AI Explanations & Custom Recall Question Generators',
      '1-on-1 Faculty Supervisor Discussion Board',
      'Certificate of Excellence for Top 10% National Rankers'
    ]
  }
];

export const mockQuestions: Question[] = [
  {
    id: 'q_sba_01',
    type: 'SBA',
    question: 'A 45-year-old male presents with severe right upper quadrant pain radiating to the right shoulder blade, fever with chills, and mild jaundice. Ultrasound shows thickened gallbladder wall (>4mm), pericolecystic fluid, and acoustic shadowing. What is the most definitive immediate surgical procedure recommended for acute calculous cholecystitis in FCPS Surgery protocol?',
    options: [
      'A. Percutaneous transhepatic gallbladder drainage (PTGBD)',
      'B. Early Laparoscopic Cholecystectomy (within 72 hours of admission)',
      'C. Open Cholecystostomy under local anesthesia',
      'D. Delayed Laparoscopic Cholecystectomy after 6 weeks of intravenous antibiotics',
      'E. Endoscopic Retrograde Cholangiopancreatography (ERCP) alone'
    ],
    correctOptionIndex: 1,
    explanation: 'According to Bailey & Love (28th Ed) and Tokyo Guidelines, early laparoscopic cholecystectomy performed within 72 hours (or up to 7 days) of presentation is the gold standard definitive management for acute calculous cholecystitis. It reduces overall hospital stay, complication rates, and eliminates the risk of recurrent attacks during the waiting period.',
    highYieldKeyPoints: [
      'Early Lap Chole (within 72 hours) is superior to delayed cholecystectomy.',
      'Murphy sign is clinically positive when inspiration halts on RUQ deep palpation.',
      'Ultrasound findings: GB wall thickness > 4mm, pericolecystic fluid, sonographic Murphy sign.'
    ],
    textbookReference: "Bailey & Love's Short Practice of Surgery, 28th Edition, Chapter 67: The Gallbladder and Bile Ducts",
    faculty: 'Surgery',
    topic: 'Hepatobiliary & Pancreatic Surgery',
    yearTag: 'FCPS Part I Jan 2025 Recall',
    status: 'approved'
  },
  {
    id: 'q_sba_02',
    type: 'SBA',
    question: 'A 28-year-old female medical student presents with palpitations, tremors, heat intolerance, weight loss despite increased appetite, and bilateral prominent eyes (exophthalmos). Thyroid function test reveals TSH < 0.01 mIU/L and elevated Free T4. Which serum autoantibody is most specific for confirming the diagnosis of Graves Disease?',
    options: [
      'A. Anti-Thyroid Peroxidase Antibody (Anti-TPO)',
      'B. Anti-Thyroglobulin Antibody (Anti-Tg)',
      'C. TSH Receptor Antibodies (TRAb / TSI)',
      'D. Anti-Smooth Muscle Antibody (ASMA)',
      'E. Anti-Nuclear Antibody (ANA)'
    ],
    correctOptionIndex: 2,
    explanation: 'TSH Receptor Autoantibodies (TRAb), specifically Thyroid-Stimulating Immunoglobulins (TSI), stimulate the TSH receptor directly, causing hyperthyroidism and Graves ophthalmopathy. While Anti-TPO is often positive in Graves, TRAb is the most specific diagnostic biomarker.',
    highYieldKeyPoints: [
      'TRAb is pathognomonic for Graves Disease.',
      'Anti-TPO is most elevated in Hashimoto Thyroiditis.',
      'Pretibial myxedema and exophthalmos are specific extrathyroidal features of Graves.'
    ],
    textbookReference: "Davidson's Principles & Practice of Medicine, 24th Edition, Chapter 20: Endocrine Disease",
    faculty: 'Medicine',
    topic: 'Endocrinology & Metabolism',
    yearTag: 'BSMMU MS/MD Residency 2024',
    status: 'approved'
  },
  {
    id: 'q_mcq_03',
    type: 'MCQ',
    stem: 'Regarding Fluid and Electrolyte management in surgical patients (FCPS / Residency High-Yield), state whether True or False:',
    stems: [
      { id: 'stem_1', text: 'A. Normal Saline (0.9% NaCl) contains 154 mmol/L of Sodium and 154 mmol/L of Chloride.', isTrue: true },
      { id: 'stem_2', text: 'B. Ringer lactate solution is contraindicated in hyperkalemic patients.', isTrue: true },
      { id: 'stem_3', text: 'C. Daily baseline adult potassium maintenance requirement is 1 to 2 mmol/kg/day.', isTrue: true },
      { id: 'stem_4', text: 'D. Hyperchloremic metabolic acidosis is a recognized complication of massive Normal Saline resuscitation.', isTrue: true },
      { id: 'stem_5', text: 'E. Hartman solution lactate is metabolized in the kidney to produce bicarbonate.', isTrue: false }
    ],
    explanation: 'A is TRUE: 0.9% NaCl contains 154 mmol/L Na and Cl. B is TRUE: Ringer lactate contains 4 mmol/L Potassium and should be used cautiously in hyperkalemia. C is TRUE: Baseline K+ requirement is 1-2 mmol/kg/24h. D is TRUE: High chloride content (154 mmol/L vs normal plasma 100 mmol/L) causes hyperchloremic non-anion gap metabolic acidosis. E is FALSE: Lactate in Hartmann solution is metabolized primarily in the LIVER (not kidney) to bicarbonate.',
    highYieldKeyPoints: [
      'Normal Saline hyperchloremia causes vasoconstriction and metabolic acidosis.',
      'Lactate is hepatic conversion to HCO3-.',
      'Daily adult maintenance: Water 25-30 ml/kg/day, Na+ 1-2 mmol/kg, K+ 1 mmol/kg.'
    ],
    textbookReference: "Bailey & Love 28th Ed, Chapter 2: Shock and Fluid Resuscitation & Guyton Physiology Ch 25",
    faculty: 'Basic Medical Sciences',
    topic: 'Fluid, Electrolytes & Acid-Base',
    yearTag: 'BCPS FCPS Part 1 July 2024',
    status: 'approved'
  },
  {
    id: 'q_sba_04',
    type: 'SBA',
    question: 'A 32-year-old Primigravida at 34 weeks of gestation presents with severe headache, epigastric pain, and visual scotoma. Blood pressure is 170/110 mmHg on two occasions 4 hours apart. Dipstick urine demonstrates 3+ proteinuria. Platelet count is 80,000/mcL and serum ALT is elevated. What is the definitive management?',
    options: [
      'A. Immediate IV Labetalol infusion and expectant management until 37 weeks',
      'B. Administration of IV Magnesium Sulfate and urgent delivery regardless of gestational age',
      'C. Oral Nifedipine, Bed rest, and discharge home with weekly monitoring',
      'D. Emergency Low Transverse Cesarean Section without maternal stabilization',
      'E. Oral Methyldopa and low-dose Aspirin therapy alone'
    ],
    correctOptionIndex: 1,
    explanation: 'This patient has Severe Preeclampsia with HELLP syndrome features (headache, BP > 160/110, epigastric pain, thrombocytopenia, elevated liver enzymes). Definitive treatment for severe preeclampsia/eclampsia is DELIVERY of the fetus and placenta. Maternal stabilization with IV Magnesium Sulfate (prophylaxis against seizures) and antihypertensives is performed prior to or during expedited delivery.',
    highYieldKeyPoints: [
      'Definitive cure for severe preeclampsia is delivery.',
      'Magnesium Sulfate loading dose: 4g IV over 10-15 mins + 10g IM or maintenance IV.',
      'Antidote for MgSO4 toxicity: 10% Calcium Gluconate (10 ml IV over 10 mins).'
    ],
    textbookReference: "Berek & Novak's Gynecology 16th Ed & Jeffcoate's Principles of Gynaecology 9th Ed",
    faculty: 'Gynecology & Obstetrics',
    topic: 'Obstetrics & Maternal-Fetal Medicine',
    yearTag: 'FCPS Gynae & Obs Jan 2025',
    status: 'approved'
  },
  {
    id: 'q_sba_05',
    type: 'SBA',
    question: 'A 3-year-old child is brought to the pediatric emergency with high fever, barking cough, hoarseness of voice, and inspiratory stridor that worsens when agitation occurs. Soft tissue neck X-ray exhibits the classic "Steeple Sign". What is the most likely pathogen responsible for this condition?',
    options: [
      'A. Haemophilus influenzae type b',
      'B. Parainfluenza Virus Type 1',
      'C. Respiratory Syncytial Virus (RSV)',
      'D. Streptococcus pneumoniae',
      'E. Corynebacterium diphtheriae'
    ],
    correctOptionIndex: 1,
    explanation: 'The clinical scenario describes Acute Laryngotracheobronchitis (Croup), characterized by barking cough, inspiratory stridor, and the subglottic narrowing known as the "Steeple Sign" on anteroposterior neck radiograph. Human Parainfluenza Virus Type 1 is the single most common cause (75% of cases).',
    highYieldKeyPoints: [
      'Parainfluenza type 1 causes viral croup.',
      'Steeple sign = subglottic tracheal narrowing on AP X-ray.',
      'Thumbprint sign = Epiglottitis (caused by H. influenzae b).'
    ],
    textbookReference: "Nelson Textbook of Pediatrics, 21st Edition, Chapter 412: Croup",
    faculty: 'Pediatrics',
    topic: 'Pediatric Pulmonology',
    yearTag: 'MD Pediatrics Entrance 2024',
    status: 'approved'
  },
  {
    id: 'q_mcq_06',
    type: 'MCQ',
    stem: 'Concerning the inguinal canal anatomy and direct vs indirect hernia (FCPS Surgery & MRCS Part A), mark True or False:',
    stems: [
      { id: 'stem_6a', text: 'A. The deep inguinal ring lies 1.25 cm above the midinguinal point.', isTrue: false },
      { id: 'stem_6b', text: 'B. The inferior epigastric artery lies lateral to the neck of a direct inguinal hernia.', isTrue: true },
      { id: 'stem_6c', text: 'C. Indirect inguinal hernia enters the canal via the deep inguinal ring lateral to inferior epigastric vessels.', isTrue: true },
      { id: 'stem_6d', text: 'D. Hesselbach triangle medial boundary is the lateral border of rectus abdominis muscle.', isTrue: true },
      { id: 'stem_6e', text: 'E. The ilioinguinal nerve passes through the deep inguinal ring.', isTrue: false }
    ],
    explanation: 'A is FALSE: Deep inguinal ring lies 1.25 cm above the MID-INGUINAL POINT is false; it lies 1.25 cm above the MIDPOINT OF THE INGUINAL LIGAMENT. B is TRUE: Direct hernia passes through Hesselbach triangle, medial to inferior epigastric artery, so the artery is lateral. C is TRUE: Indirect hernia is lateral to inferior epigastric artery. D is TRUE: Hesselbach triangle is bounded medially by rectus abdominis, laterally by inferior epigastric artery, inferiorly by inguinal ligament. E is FALSE: Ilioinguinal nerve pierces internal oblique and enters the canal, but does NOT pass through the deep ring.',
    highYieldKeyPoints: [
      'Midpoint of Inguinal Ligament = Deep Ring position (ASIS to Pubic Tubercle).',
      'Midinguinal Point = Femoral Artery palpation point (ASIS to Pubic Symphysis).',
      'Ilioinguinal nerve travels in canal outside the spermatic cord.'
    ],
    textbookReference: "Last's Anatomy 12th Ed & Bailey & Love 28th Ed, Chapter 65",
    faculty: 'Basic Medical Sciences',
    topic: 'Surgical Anatomy',
    yearTag: 'MRCS Part A / FCPS Surgery 2024',
    status: 'approved'
  }
];

export const studyGroups: StudyGroup[] = [
  {
    id: 'grp_surgery',
    name: 'FCPS & MS Surgery Recall Club',
    specialtyTag: 'FCPS Part I (Surgery)',
    description: 'Daily high-yield surgical recall MCQs, Bailey & Love chapter discussions, and clinical viva tips for BCPS & BSMMU examinees.',
    iconEmoji: '🔪',
    memberCount: 1420,
    activeNowCount: 84,
    isPrivate: false,
    facultySupervisor: 'Prof. Dr. M. A. Jalil, FRCS, FCPS',
    recentActivity: 'New recall question posted: Acute pancreatitis Ranson criteria'
  },
  {
    id: 'grp_medicine',
    name: 'FCPS & MD Medicine High-Yield Lounge',
    specialtyTag: 'FCPS Part I (Medicine)',
    description: 'Davidson-based topic highlights, ECG & Radiology cases, BSMMU MD Residency questions, and MRCP Part 1 drills.',
    iconEmoji: '🩺',
    memberCount: 1890,
    activeNowCount: 112,
    isPrivate: false,
    facultySupervisor: 'Dr. Sharmin Akter, FCPS (Med), MD',
    recentActivity: 'Discussion on hyperkalemia ECG findings in progress'
  },
  {
    id: 'grp_ms_surgery',
    name: 'MS General Surgery & Ortho Lounge',
    specialtyTag: 'MS General Surgery',
    description: 'Residency Entrance exam surgical anatomy, general principles, fluid resuscitation, and BSMMU mock discussions.',
    iconEmoji: '🏥',
    memberCount: 950,
    activeNowCount: 45,
    isPrivate: false,
    facultySupervisor: 'Dr. Shahriar Chowdhury, MS (Surgery)',
    recentActivity: 'Recall breakdown: Inguinal hernia anatomy'
  },
  {
    id: 'grp_gynae',
    name: 'FCPS Gynae & Obs Peer Group',
    specialtyTag: 'FCPS Part I (Gynae & Obs)',
    description: 'Maternal-fetal medicine, operative gynecology, hormone therapy, and Jeffcoate / Berek Novak key points.',
    iconEmoji: '👶',
    memberCount: 1150,
    activeNowCount: 62,
    isPrivate: false,
    facultySupervisor: 'Prof. Dr. Farhana Begum, FCPS (Gynae)',
    recentActivity: 'Case discussion: Severe Preeclampsia MgSO4 regimen'
  },
  {
    id: 'grp_mrcs',
    name: 'MRCS Part A & B International Drill',
    specialtyTag: 'MRCS Part A',
    description: 'Royal College UK standard basic sciences, surgical pathology, anatomy spotters, and eMRCS recall question breakdown.',
    iconEmoji: '🇬🇧',
    memberCount: 680,
    activeNowCount: 29,
    isPrivate: false,
    facultySupervisor: 'Dr. Arifur Rahman, MRCS (Eng), FCPS',
    recentActivity: 'eMRCS Recall #412: Brachial plexus lesions'
  },
  {
    id: 'grp_pediatrics',
    name: 'MD & FCPS Pediatrics Study Circle',
    specialtyTag: 'MD Pediatrics',
    description: 'Nelson pediatrics high-yield topics, neonatology, developmental milestones, and IMCI clinical algorithms.',
    iconEmoji: '🧸',
    memberCount: 810,
    activeNowCount: 38,
    isPrivate: false,
    facultySupervisor: 'Dr. Nusrat Jahan, MD (Pediatrics)',
    recentActivity: 'Recall SBA: Viral croup Steeple sign vs Epiglottitis'
  },
  {
    id: 'grp_mbbs',
    name: 'MBBS Final Prof Clinical Mastermind',
    specialtyTag: 'MBBS Final Professional Exam',
    description: 'Long cases, short cases, OSPE stations, VIVA board questions, and university exam recall questions.',
    iconEmoji: '🎓',
    memberCount: 2400,
    activeNowCount: 150,
    isPrivate: false,
    facultySupervisor: 'Dr. Kazi Imran, MO (Medicine)',
    recentActivity: 'OSPE station guide: Thyroid gland examination steps'
  }
];

export const initialChatMessages: Record<string, ChatMessage[]> = {
  grp_surgery: [
    {
      id: 'm1',
      groupId: 'grp_surgery',
      senderId: 'fac_1',
      senderName: 'Prof. Dr. M. A. Jalil',
      senderDesignation: 'Senior Surgical Faculty, FCPS Course Director',
      senderAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
      isFaculty: true,
      text: 'Assalamu Alaikum examinees! Let us review an extremely high-yield Bailey & Love 28th Ed topic today: Acute Pancreatitis prognosis and Ranson Criteria.',
      timestamp: '10:15 AM'
    },
    {
      id: 'm2',
      groupId: 'grp_surgery',
      senderId: 'cand_102',
      senderName: 'Dr. Rafiqul Islam',
      senderDesignation: 'HMO, SSMC',
      senderAvatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&auto=format&fit=crop&q=80',
      text: 'Sir, what is the most sensitive marker for predicting early severe acute pancreatitis within the first 24 hours?',
      timestamp: '10:18 AM'
    },
    {
      id: 'm3',
      groupId: 'grp_surgery',
      senderId: 'fac_1',
      senderName: 'Prof. Dr. M. A. Jalil',
      senderDesignation: 'Senior Surgical Faculty',
      senderAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
      isFaculty: true,
      text: 'Serum C-Reactive Protein (CRP > 150 mg/L) at 48 hours is the gold standard biochemically, but hematocrit > 44% at admission indicates hemoconcentration and severe pancreatic necrosis risk!',
      timestamp: '10:21 AM'
    },
    {
      id: 'm4',
      groupId: 'grp_surgery',
      senderId: 'fac_1',
      senderName: 'Prof. Dr. M. A. Jalil',
      senderDesignation: 'Senior Surgical Faculty',
      senderAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
      isFaculty: true,
      text: 'Here is a quick recall SBA for everyone to solve right here in chat:',
      embeddedQuestion: mockQuestions[0],
      timestamp: '10:25 AM'
    }
  ],
  grp_ms_surgery: [
    {
      id: 'm_ms1',
      groupId: 'grp_ms_surgery',
      senderId: 'fac_2',
      senderName: 'Dr. Shahriar Chowdhury',
      senderDesignation: 'Assistant Professor (Surgery), BSMMU',
      senderAvatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&auto=format&fit=crop&q=80',
      isFaculty: true,
      text: 'Welcome MS Residency Aspirants! In inguinal canal anatomy, remember the deep ring lies 1.25 cm ABOVE the midpoint of the inguinal ligament (NOT midinguinal point).',
      timestamp: '09:00 AM'
    },
    {
      id: 'm_ms2',
      groupId: 'grp_ms_surgery',
      senderId: 'cand_101',
      senderName: 'Dr. Tanvir Hossain',
      senderDesignation: 'Medical Officer, DMCH',
      senderAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
      text: 'Thank you Sir! That distinction between Midpoint of Inguinal Ligament and Midinguinal Point appeared in BSMMU 2024!',
      timestamp: '09:05 AM'
    }
  ]
};

export const initialForumPosts: ForumPost[] = [
  {
    id: 'post_1',
    authorName: 'Dr. Nusrat Zahan',
    authorDesignation: 'HMO, Chittagong Medical College Hospital',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
    title: 'How to prepare basic anatomy & physiology for FCPS Part I Surgery in 3 months?',
    content: 'Dear seniors and colleagues, I am appearing in FCPS Part I Surgery in January 2026. What should be my strategy regarding BRS Physiology vs Ganong, and Last Anatomy vs Snell? Please guide regarding high-yield chapters.',
    facultyTag: 'Basic Medical Sciences',
    specialtyTag: 'FCPS Part I (Surgery)',
    upvotes: 38,
    isUpvoted: false,
    repliesCount: 3,
    timestamp: '2 hours ago',
    replies: [
      {
        id: 'rep_1',
        authorName: 'Prof. Dr. M. A. Jalil',
        authorDesignation: 'Senior Surgical Faculty, FCPS Director',
        authorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
        isFaculty: true,
        content: 'Dr. Nusrat, focus 60% on Surgical Anatomy (Abdomen, Head & Neck, Pelvis) from Last Anatomy or BRS Anatomy. For Physiology, BRS Physiology Costanzo + Guyton chapters on Fluid/Electrolytes and GI system are sufficient. Solve at least 3,000 past recall SBAs on MedExam portal!',
        timestamp: '1 hour ago'
      },
      {
        id: 'rep_2',
        authorName: 'Dr. Tanvir Hossain',
        authorDesignation: 'MO, DMCH',
        authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
        isFaculty: false,
        content: 'I agree with Sir! Also make sure to attempt the Mock Tests here on MedExam — the national rank analysis showed me exactly where my nerve injury anatomy was weak.',
        timestamp: '45 mins ago'
      }
    ]
  },
  {
    id: 'post_2',
    authorName: 'Dr. Mahmudul Hasan',
    authorDesignation: 'Medical Officer, Shaheed Suhrawardy Medical College',
    authorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
    title: 'BSMMU MS Residency March 2025 Recall Analysis: Negative Marking Strategy',
    content: 'In BSMMU MS Residency entrance, each wrong answer deducts 0.25 marks. Should we guess options when 2 options are eliminated in SBAs?',
    facultyTag: 'Surgery',
    specialtyTag: 'MS General Surgery',
    upvotes: 52,
    isUpvoted: true,
    repliesCount: 2,
    timestamp: '5 hours ago',
    replies: [
      {
        id: 'rep_21',
        authorName: 'Dr. Shahriar Chowdhury',
        authorDesignation: 'Assistant Prof (Surgery), BSMMU',
        authorAvatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&auto=format&fit=crop&q=80',
        isFaculty: true,
        content: 'Mathematically, if you can confidently eliminate 3 out of 5 options in an SBA, the expected statistical payoff is positive (+1 for correct vs -0.25 for wrong). Always calculate calculated risk during Mock Simulator practice!',
        timestamp: '3 hours ago'
      }
    ]
  }
];

export const sampleExamHistory: ExamAttempt[] = [
  {
    id: 'attempt_901',
    examTitle: 'FCPS Part I Surgery Grand Mock Test #04',
    specialty: 'FCPS Part I (Surgery)',
    totalQuestions: 25,
    correctCount: 19,
    wrongCount: 5,
    skippedCount: 1,
    scorePercentage: 76,
    timeSpentSeconds: 1420,
    completedAt: '2026-08-01T15:30:00Z',
    answersRecord: {},
    topicBreakdown: [
      { topic: 'Hepatobiliary & Pancreas', total: 6, correct: 5, percentage: 83 },
      { topic: 'Surgical Anatomy & Nerve Supply', total: 8, correct: 6, percentage: 75 },
      { topic: 'Fluid & Electrolyte Resuscitation', total: 6, correct: 5, percentage: 83 },
      { topic: 'Systemic Pathology & Neoplasia', total: 5, correct: 3, percentage: 60 }
    ],
    nationalAverageBenchmark: 51,
    topRankBenchmark: 82
  }
];
