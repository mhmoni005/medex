import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Question, ExamAttempt, SBAQuestion, MCQQuestion } from '../types';
import { PostExamAnalytics } from './PostExamAnalytics';
import confetti from 'canvas-confetti';
import {
  Clock,
  Flag,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Award,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const MockExamSimulator: React.FC = () => {
  const { questions, candidate, recordExamAttempt, setActiveTab } = useApp();

  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examCompleted, setExamCompleted] = useState<boolean>(false);
  const [activeAttempt, setActiveAttempt] = useState<ExamAttempt | null>(null);

  // Exam Config
  const [selectedFaculty, setSelectedFaculty] = useState<string>('Surgery');
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  // User Answers Record: questionId -> SBA option index OR MCQ stem boolean map
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  // Flagged for Review Set
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());

  // Timer: seconds left
  const [timeLeft, setTimeLeft] = useState<number>(1200); // 20 mins default
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Start Exam Setup
  const handleStartExam = () => {
    // Filter questions
    let pool = questions.filter(q => q.faculty === selectedFaculty || selectedFaculty === 'All');
    if (pool.length === 0) pool = questions;

    setExamQuestions(pool);
    setCurrentIdx(0);
    setAnswers({});
    setFlaggedIds(new Set());
    setTimeLeft(1200);
    setIsTimerPaused(false);
    setExamStarted(true);
    setExamCompleted(false);
  };

  // Timer Effect
  useEffect(() => {
    if (!examStarted || examCompleted || isTimerPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examCompleted, isTimerPaused]);

  const toggleFlag = (qId: string) => {
    setFlaggedIds(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleSelectSbaOption = (qId: string, optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSelectMcqStem = (qId: string, stemIdx: number, val: boolean) => {
    setAnswers(prev => {
      const currentMcqMap = prev[qId] || {};
      return {
        ...prev,
        [qId]: { ...currentMcqMap, [stemIdx]: val }
      };
    });
  };

  const handleFinishExam = () => {
    // Calculate scoring
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    examQuestions.forEach(q => {
      const ans = answers[q.id];

      if (q.type === 'SBA') {
        if (ans === undefined || ans === null) {
          skippedCount++;
        } else if (ans === q.correctOptionIndex) {
          correctCount++;
        } else {
          wrongCount++;
        }
      } else {
        // MCQ T/F partial scoring
        if (!ans || Object.keys(ans).length === 0) {
          skippedCount++;
        } else {
          let qCorrectStems = 0;
          q.stems.forEach((stem, sIdx) => {
            if (ans[sIdx] === stem.isTrue) qCorrectStems++;
          });
          if (qCorrectStems === 5) {
            correctCount++;
          } else if (qCorrectStems >= 3) {
            correctCount += 0.5;
          } else {
            wrongCount++;
          }
        }
      }
    });

    // Score calculation with -0.25 negative marking for SBA
    const rawScore = Math.max(0, correctCount - wrongCount * 0.25);
    const scorePercentage = Math.round((rawScore / (examQuestions.length || 1)) * 100);

    const timeSpentSeconds = 1200 - timeLeft;

    const attemptObj: ExamAttempt = {
      id: 'attempt_' + Date.now(),
      examTitle: `BCPS & BSMMU Pattern ${selectedFaculty} Grand Mock Exam`,
      specialty: candidate.specialty,
      totalQuestions: examQuestions.length,
      correctCount: Math.round(correctCount),
      wrongCount: Math.round(wrongCount),
      skippedCount,
      scorePercentage,
      timeSpentSeconds,
      completedAt: new Date().toISOString(),
      answersRecord: answers,
      topicBreakdown: [
        { topic: 'General Principles & Clinical Rationale', total: Math.ceil(examQuestions.length / 2), correct: Math.floor(correctCount / 2), percentage: scorePercentage },
        { topic: 'Surgical Anatomy & High-Yield Pathology', total: Math.floor(examQuestions.length / 2), correct: Math.ceil(correctCount / 2), percentage: Math.min(100, scorePercentage + 5) }
      ],
      nationalAverageBenchmark: 51,
      topRankBenchmark: 82
    };

    recordExamAttempt(attemptObj);
    setActiveAttempt(attemptObj);
    setExamCompleted(true);

    // Confetti celebration if passed
    if (scorePercentage >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const currentQ = examQuestions[currentIdx];

  if (examCompleted && activeAttempt) {
    return (
      <PostExamAnalytics
        attempt={activeAttempt}
        onRetake={handleStartExam}
        onGoToQBank={() => setActiveTab('qbank')}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Setup Screen before Exam Launch */}
      {!examStarted ? (
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-bold">
              <Clock size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Realistic Postgraduate Mock Simulator</h1>
              <p className="text-xs text-slate-300">
                BCPS FCPS Part I & BSMMU MS/MD Residency Pattern Exam Simulator with Negative Marking
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 text-xs text-slate-300">
            <h3 className="font-bold text-amber-300 flex items-center gap-2 text-sm">
              <ShieldCheck size={18} />
              <span>Standard BCPS / BSMMU Examination Rules:</span>
            </h3>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              <li>Each correct Single Best Answer (SBA) earns <strong className="text-emerald-400">+1.0 Mark</strong>.</li>
              <li>Incorrect SBA choices deduct <strong className="text-rose-400">-0.25 Negative Marking</strong> penalty.</li>
              <li>Multiple True/False (MCQ) stems are evaluated individually with partial credit.</li>
              <li>Use the question palette to flag tough questions for review.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Select Exam Specialty Faculty:</label>
            <select
              value={selectedFaculty}
              onChange={e => setSelectedFaculty(e.target.value)}
              className="w-full sm:w-80 bg-slate-800 text-slate-100 text-xs rounded-xl px-4 py-3 border border-slate-700 focus:border-emerald-500"
            >
              <option value="Surgery">Surgery & Surgical Specialties (BCPS / MS)</option>
              <option value="Medicine">Medicine & Allied Specialties (FCPS / MD)</option>
              <option value="Gynecology & Obstetrics">Gynecology & Obstetrics</option>
              <option value="Pediatrics">Pediatrics & Child Health</option>
              <option value="Basic Medical Sciences">Basic Medical Sciences (Anatomy, Physio, Path)</option>
            </select>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2"
          >
            <Play size={18} className="fill-white" />
            <span>Launch Realistic Timed Mock Simulator</span>
          </button>
        </div>
      ) : (
        /* Active Timed Exam Environment */
        <div className="space-y-6">
          
          {/* Top Timer Bar & Navigator Header */}
          <div className="sticky top-[68px] z-20 p-4 rounded-2xl bg-slate-900/95 backdrop-blur border border-slate-800 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                {selectedFaculty} Mock Test
              </span>
              <span className="text-xs font-semibold text-slate-300">
                Q {currentIdx + 1} of {examQuestions.length}
              </span>
            </div>

            {/* Countdown Clock Display */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                <Clock size={16} className={timeLeft < 180 ? 'text-rose-400 animate-ping' : 'text-amber-400'} />
                <span className={`font-mono text-base font-bold ${timeLeft < 180 ? 'text-rose-400' : 'text-amber-300'}`}>
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <button
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
              >
                {isTimerPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>

              <button
                onClick={handleFinishExam}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow"
              >
                Submit Exam
              </button>
            </div>

          </div>

          {/* Main Exam Content & Palette Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left 3 Cols: Question Viewer */}
            <div className="lg:col-span-3 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Topic: {currentQ.topic}
                </span>

                <button
                  onClick={() => toggleFlag(currentQ.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    flaggedIds.has(currentQ.id)
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Flag size={14} className={flaggedIds.has(currentQ.id) ? 'fill-slate-950' : ''} />
                  <span>{flaggedIds.has(currentQ.id) ? 'Flagged for Review' : 'Flag Question'}</span>
                </button>
              </div>

              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                {currentQ.type === 'SBA' ? (currentQ as SBAQuestion).question : (currentQ as MCQQuestion).stem}
              </p>

              {/* SBA Options */}
              {currentQ.type === 'SBA' && (
                <div className="space-y-3">
                  {(currentQ as SBAQuestion).options.map((opt, oIdx) => {
                    const isSelected = answers[currentQ.id] === oIdx;

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectSbaOption(currentQ.id, oIdx)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 size={18} className="text-emerald-500 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* MCQ Stems */}
              {currentQ.type === 'MCQ' && (
                <div className="space-y-3">
                  {(currentQ as MCQQuestion).stems.map((stem, sIdx) => {
                    const currentMcqAns = answers[currentQ.id] || {};
                    const selectedVal = currentMcqAns[sIdx];

                    return (
                      <div
                        key={stem.id || sIdx}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                          {stem.text}
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleSelectMcqStem(currentQ.id, sIdx, true)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                              selectedVal === true
                                ? 'bg-emerald-600 text-white shadow'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            TRUE
                          </button>
                          <button
                            onClick={() => handleSelectMcqStem(currentQ.id, sIdx, false)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                              selectedVal === false
                                ? 'bg-rose-600 text-white shadow'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            FALSE
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Question Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setCurrentIdx(prev => Math.min(examQuestions.length - 1, prev + 1))}
                  disabled={currentIdx === examQuestions.length - 1}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-bold text-white transition flex items-center gap-1 shadow"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>

            </div>

            {/* Right Col: Question Palette Navigator */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Question Palette Navigator
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {examQuestions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isFlagged = flaggedIds.has(q.id);
                  const isCurrent = idx === currentIdx;

                  let boxStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';

                  if (isCurrent) {
                    boxStyle = 'ring-2 ring-emerald-500 bg-emerald-500 text-white font-extrabold';
                  } else if (isFlagged) {
                    boxStyle = 'bg-amber-500 text-slate-950 font-bold';
                  } else if (isAnswered) {
                    boxStyle = 'bg-emerald-600 text-white font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-9 rounded-xl border text-xs flex items-center justify-center transition ${boxStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Flagged for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span>Unanswered</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
