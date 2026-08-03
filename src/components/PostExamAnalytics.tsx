import React from 'react';
import { ExamAttempt } from '../types';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

interface PostExamAnalyticsProps {
  attempt: ExamAttempt;
  onRetake: () => void;
  onGoToQBank: () => void;
}

export const PostExamAnalytics: React.FC<PostExamAnalyticsProps> = ({
  attempt,
  onRetake,
  onGoToQBank
}) => {
  const isPassed = attempt.scorePercentage >= 60;

  const benchmarkData = [
    { name: 'National Avg', score: attempt.nationalAverageBenchmark || 51, fill: '#64748B' },
    { name: 'Your Score', score: attempt.scorePercentage, fill: isPassed ? '#10B981' : '#EF4444' },
    { name: 'Top 10% Cutoff', score: attempt.topRankBenchmark || 82, fill: '#F59E0B' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Top Celebration / Score Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
        isPassed
          ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border-emerald-700/60'
          : 'bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950 border-rose-800/60'
      }`}>
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isPassed ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700' : 'bg-rose-900/80 text-rose-300 border border-rose-700'
            }`}>
              {isPassed ? 'BCPS / BSMMU Target Passed' : 'Needs Practice Review'}
            </span>
            <span className="text-xs text-slate-400">BCPS & BSMMU Pattern</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {attempt.examTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300">
            Completed on {new Date(attempt.completedAt).toLocaleString()} | Time Spent: {Math.floor(attempt.timeSpentSeconds / 60)}m {attempt.timeSpentSeconds % 60}s
          </p>
        </div>

        {/* Score Ring / Card */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 min-w-[160px] text-center shadow-inner">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Final Score</span>
          <span className={`text-4xl font-extrabold mt-1 ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
            {attempt.scorePercentage}%
          </span>
          <span className="text-[10px] text-slate-300 font-semibold mt-1">
            {attempt.correctCount} / {attempt.totalQuestions} Correct
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Correct Answers</p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{attempt.correctCount}</p>
            <span className="text-[10px] text-slate-500 mt-0.5 inline-block">+1.0 Mark each</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Wrong Answers</p>
            <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{attempt.wrongCount}</p>
            <span className="text-[10px] text-rose-500 mt-0.5 inline-block">-0.25 Negative Deduction</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <XCircle size={24} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Skipped Questions</p>
            <p className="text-2xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">{attempt.skippedCount}</p>
            <span className="text-[10px] text-slate-500 mt-0.5 inline-block">0 Penalty</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500">
            <Clock size={24} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg Pace / Question</p>
            <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">
              {Math.round(attempt.timeSpentSeconds / (attempt.totalQuestions || 1))}s
            </p>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5 inline-block">Optimal Pace</span>
          </div>
          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <TrendingUp size={24} />
          </div>
        </div>

      </div>

      {/* Analytics Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* National Control Group Benchmark Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 size={18} className="text-emerald-500" />
              <span>National Control Group Benchmark</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Compared with the 51% national average score for candidates taking this exam.
            </p>
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
        </div>

        {/* Topic Weakness Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              <span>Topic-wise Weakness Analysis</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Specific topics requiring revision prior to the final BCPS / BSMMU exam.
            </p>
          </div>

          <div className="space-y-3">
            {attempt.topicBreakdown.map((t, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{t.topic}</span>
                  <span className={t.percentage >= 70 ? 'text-emerald-500' : 'text-amber-500'}>
                    {t.correct} / {t.total} ({t.percentage}%)
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      t.percentage >= 70 ? 'bg-emerald-500' : t.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${t.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
        <button
          onClick={onRetake}
          className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-2"
        >
          <RotateCcw size={16} />
          <span>Retake Mock Simulator</span>
        </button>

        <button
          onClick={onGoToQBank}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-900/30"
        >
          <BookOpen size={16} />
          <span>Revise Weak Topics in Q-Bank</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
};
