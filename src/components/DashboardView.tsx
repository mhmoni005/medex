import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  BookOpen,
  Clock,
  Flame,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Users,
  PlusCircle,
  BarChart3,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    candidate,
    setActiveTab,
    examHistory,
    questions,
    studyGroups,
    forumPosts
  } = useApp();

  const latestExam = examHistory[0];

  // National Benchmark comparison chart data
  const benchmarkData = [
    { name: 'National Avg', score: 51, fill: '#64748B' },
    { name: 'Your Score', score: latestExam ? latestExam.scorePercentage : 76, fill: '#10B981' },
    { name: 'Top 10% Cutoff', score: 82, fill: '#F59E0B' }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-[28px] bg-slate-950 border border-slate-800 text-slate-100 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 uppercase tracking-wider">
                Bangladesh Postgraduate Medical Portal
              </span>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40">
                <Flame size={14} className="fill-amber-400" />
                <span>12 Day Prep Streak</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-emerald-400">{candidate.name}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Targeting <span className="font-semibold text-emerald-300">{candidate.specialty}</span> | BMDC Reg: <span className="font-mono text-slate-200">{candidate.bmdcRegNo}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('qbank')}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/40"
            >
              <BookOpen size={16} />
              <span>Practice Questions</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => setActiveTab('mock_exam')}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700/80 transition"
            >
              <Clock size={16} className="text-amber-400" />
              <span>Mock Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Quick Cards - Bento Grid Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="p-2.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-[28px] shadow-sm">
          <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Recall Questions</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-500 transition-colors">{questions.length * 150}+</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-block">
                SBA + Multiple T/F
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <BookOpen size={22} />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-2.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-[28px] shadow-sm">
          <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Latest Mock Score</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-teal-500 transition-colors">
                {latestExam ? `${latestExam.scorePercentage}%` : '76%'}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-block">
                +25% Above National Avg
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-2.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-[28px] shadow-sm">
          <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Specialty Study Groups</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-blue-500 transition-colors">{studyGroups.length}</p>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-1 inline-block">
                Active Candidate Lounge
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-2.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-[28px] shadow-sm">
          <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Subscription Status</p>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 truncate max-w-[130px]">
                {candidate.hasActiveSubscription ? 'Active Pass' : 'Trial Version'}
              </p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 inline-block">
                {candidate.hasActiveSubscription ? 'Expires Nov 2026' : 'Upgrade Required'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <ShieldCheck size={22} />
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Benchmark Graph & High Yield Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* National Benchmark Card */}
          <div className="p-2.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-[28px] shadow-sm">
            <div className="p-6 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="flex items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 size={18} className="text-emerald-500 shrink-0" />
                    <span>National Control Group Benchmark Comparison</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Comparing your mock exam performance against the national 51% average for {candidate.specialty}.
                  </p>
                </div>

                <span className="shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-3.5 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Top 15% Rank
                </span>
              </div>

              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={benchmarkData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(val: number) => [`${val}%`, 'Score Percentage']}
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                    />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                      {benchmarkData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px]">National Average</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">51%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60">
                  <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">Your Score</p>
                  <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    {latestExam ? `${latestExam.scorePercentage}%` : '76%'}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60">
                  <p className="text-amber-600 dark:text-amber-400 text-[10px] font-bold">Top Rank Cutoff</p>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">82%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Exam Launcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-2.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-[28px] shadow-sm">
              <div
                onClick={() => setActiveTab('qbank')}
                className="p-5 rounded-[20px] bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800/60 text-white cursor-pointer hover:border-emerald-500 transition group h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300">
                      <BookOpen size={22} />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-700/50">
                      Practice Engine
                    </span>
                  </div>
                  <h3 className="text-base font-bold group-hover:text-emerald-300 transition">Subject-wise Practice</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Filter by Faculty (Surgery, Medicine, Gynae, Pediatrics) & solve questions with instant Bailey & Love / Davidson citations.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span>Start Practice</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-[28px] shadow-sm">
              <div
                onClick={() => setActiveTab('mock_exam')}
                className="p-5 rounded-[20px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-white cursor-pointer hover:border-slate-700 transition group h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                      <Clock size={22} />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800/50">
                      BCPS / BSMMU Pattern
                    </span>
                  </div>
                  <h3 className="text-base font-bold group-hover:text-amber-300 transition">Full Mock Test Simulator</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Countdown timer, question palette navigator, flag-for-review, and negative marking calculator.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <span>Launch Mock Test</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Recall Creator & Study Groups Widget */}
        <div className="space-y-6">
          
          {/* Recall Creator CTA */}
          <div className="p-2.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-[28px] shadow-sm">
            <div className="p-5 rounded-[20px] bg-slate-950 border border-slate-800 text-white">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide mb-1">
                <PlusCircle size={16} />
                <span>Community Recall Creator</span>
              </div>
              <h3 className="text-base font-bold text-white">Easily Add Exam Recall Questions</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Did you recently take an FCPS Part I or BSMMU exam? Submit exam recall questions to our senior faculty approval queue!
              </p>
              <button
                onClick={() => setActiveTab('add_recall')}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <PlusCircle size={15} />
                <span>Add Exam Recall Question</span>
              </button>
            </div>
          </div>

          {/* Specialty Study Group Widget */}
          <div className="p-2.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-[28px] shadow-sm">
            <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users size={16} className="text-emerald-500" />
                  <span>Specialty Group Chat</span>
                </h3>
                <button
                  onClick={() => setActiveTab('chat_groups')}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {studyGroups.slice(0, 3).map(grp => (
                  <div
                    key={grp.id}
                    onClick={() => setActiveTab('chat_groups')}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:border-emerald-500 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{grp.iconEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{grp.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{grp.recentActivity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* High-Yield Forum Post Widget */}
          <div className="p-2.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-[28px] shadow-sm">
            <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" />
                  <span>Faculty Forum Queries</span>
                </h3>
                <button
                  onClick={() => setActiveTab('forum')}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Open Forum
                </button>
              </div>

              {forumPosts[0] && (
                <div
                  onClick={() => setActiveTab('forum')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:border-amber-500 transition space-y-1.5"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                    {forumPosts[0].title}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                    {forumPosts[0].content}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 pt-1 font-medium">
                    <span>Faculty Verified Response</span>
                    <span>{forumPosts[0].upvotes} Upvotes</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
