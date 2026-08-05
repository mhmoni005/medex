import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  Pill,
  Microscope,
  Globe,
  Wrench,
  GraduationCap,
  BookOpen,
  Award,
  Zap,
  Clock,
  Lock,
  Unlock,
  Heart,
  WifiOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    candidate,
    setActiveTab,
    examHistory,
    examSpecialties,
    questions
  } = useApp();

  const totalExams = examHistory.length;
  const avgScore = examHistory.length > 0
    ? Math.round(examHistory.reduce((acc, curr) => acc + curr.scorePercentage, 0) / examHistory.length)
    : 0;

  // Automatically construct dynamic candidate display name (e.g., Dr. Tanvir Hossain)
  const candidateNameTrimmed = candidate?.name ? candidate.name.trim() : '';
  const welcomeDisplayName = candidateNameTrimmed && candidateNameTrimmed.toLowerCase() !== 'doctor'
    ? (/^dr\.?\s+/i.test(candidateNameTrimmed) ? candidateNameTrimmed : `Dr. ${candidateNameTrimmed}`)
    : 'Doctor';

  // Helper function to render specialty icon
  const renderSpecialtyIcon = (iconType: string) => {
    switch (iconType) {
      case 'stethoscope':
        return <Stethoscope className="w-5 h-5 text-blue-500" />;
      case 'capsule':
        return <Pill className="w-5 h-5 text-teal-500" />;
      case 'microscope':
        return <Microscope className="w-5 h-5 text-indigo-500" />;
      case 'globe':
        return <Globe className="w-5 h-5 text-sky-500" />;
      case 'tools':
        return <Wrench className="w-5 h-5 text-amber-500" />;
      case 'gradcap':
        return <GraduationCap className="w-5 h-5 text-purple-500" />;
      case 'book':
        return <BookOpen className="w-5 h-5 text-emerald-500" />;
      default:
        return <Award className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      
      {/* 1. MAIN HERO BLUE CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-blue-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Tag & Badges Row */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            <span className="text-xs font-semibold text-blue-200/80 tracking-widest uppercase">
              BMU • BCPS • BCS • Royal College
            </span>
          </div>

          {/* Heading and Subtitle */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Welcome, Doctor 🩺
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
              Master medical MCQs & SBAs with instant clinical explanations and performance analytics.
            </p>
          </div>

          {/* 3 Glassy Stats Cards Container */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-start justify-center">
              <span className="text-xs font-medium text-blue-200">Exams Completed</span>
              <span className="text-2xl font-extrabold text-white mt-1">{totalExams}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-start justify-center">
              <span className="text-xs font-medium text-blue-200">Avg Score</span>
              <span className="text-2xl font-extrabold text-white mt-1">{avgScore}%</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-start justify-center">
              <span className="text-xs font-medium text-blue-200">Active Course</span>
              <span className="text-sm font-bold text-emerald-300 mt-1 truncate w-full">
                {candidate.specialty || 'MS Residency'}
              </span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('qbank')}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-98"
            >
              <span>Practice MCQs</span>
              <Zap size={16} className="fill-slate-950" />
            </button>

            <button
              onClick={() => setActiveTab('mock_exam')}
              className="px-6 py-3 rounded-2xl bg-blue-900/60 hover:bg-blue-800/80 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 border border-blue-500/40 transition active:scale-98"
            >
              <span>Real Exam</span>
              <Clock size={16} className="text-blue-300" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. OFFLINE REVISION LOCKER CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-[11px] flex items-center gap-1.5 uppercase tracking-wide border border-amber-500/30">
              <WifiOff size={14} />
              <span>OFFLINE REVISION LOCKER</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
              4 Qs Cached
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Poor internet? Review your last viewed set offline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Keep studying even without signal. Your practice is fully preserved locally.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <button
            onClick={() => setActiveTab('qbank')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition active:scale-98"
          >
            <span>Resume Offline</span>
            <Zap size={15} className="fill-white" />
          </button>
        </div>
      </div>

      {/* 3. EXAM SPECIALTIES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            EXAM SPECIALTIES
          </h2>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wide"
          >
            VIEW PREMIUM PLAN
          </button>
        </div>

        {/* 2-Column Grid of Specialties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {examSpecialties.map(spec => (
            <div
              key={spec.id}
              onClick={() => setActiveTab('qbank')}
              className={`group cursor-pointer bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-center justify-between transition-all shadow-xs hover:shadow-md ${
                !spec.isLocked
                  ? 'border-blue-400/80 dark:border-blue-600/80 ring-1 ring-blue-400/20'
                  : 'border-slate-200/90 dark:border-slate-800 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors">
                  {renderSpecialtyIcon(spec.iconType)}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {spec.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {spec.mcqCount.toLocaleString()} MCQs • {spec.chapterCount} Ch
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                {spec.isLocked ? (
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                    <Lock size={15} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. STARRED REVISION NOTEBOOK / FOCUSED STUDY HUB */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-rose-500 uppercase tracking-wider">
                📌 FOCUSED STUDY HUB
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              STARRED REVISION NOTEBOOK
            </h3>
          </div>

          <div className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-extrabold text-xs flex items-center gap-1.5">
            <Heart size={14} className="fill-rose-500 text-rose-500" />
            <span>0</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Practice questions you marked as difficult or flagged for review. Use these to target your weakness prior to mock testing.
        </p>

        {/* Quick Tip Box */}
        <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-center text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          💡 Quick Tip: Tap the heart icon (🤍) when solving MCQs in the library to save complex questions here for rapid active recall review.
        </div>
      </div>

    </div>
  );
};
