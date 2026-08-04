import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Question, FacultyName, SBAQuestion, MCQQuestion } from '../types';
import {
  BookOpen,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookMarked,
  Award,
  ChevronRight,
  RefreshCw,
  Lightbulb,
  FileText
} from 'lucide-react';

export const QuestionBankView: React.FC = () => {
  const { questions, candidate } = useApp();

  const [selectedFaculty, setSelectedFaculty] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  
  // Active Question state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // SBA selected option index
  const [sbaSelection, setSbaSelection] = useState<number | null>(null);
  
  // MCQ T/F selections: stemIndex -> boolean
  const [mcqSelections, setMcqSelections] = useState<Record<number, boolean>>({});
  
  // Submitted state for active question
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // AI Explanation State
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<{
    rationale?: string;
    highYieldKeyPoints?: string[];
    textbookCitation?: string;
    examTip?: string;
  } | null>(null);

  const faculties: string[] = [
    'All',
    'Surgery',
    'Medicine',
    'Gynecology & Obstetrics',
    'Pediatrics',
    'Basic Medical Sciences'
  ];

  // Filtered Questions
  const filteredQuestions = questions.filter(q => {
    if (q.status !== 'approved' && q.status !== undefined) return false;
    if (selectedFaculty !== 'All' && q.faculty !== selectedFaculty) return false;
    if (selectedType !== 'All' && q.type !== selectedType) return false;
    if (searchFilter) {
      const qText = (q as any).question || (q as any).stem || '';
      const text = qText + ((q as any).topic || '') + ((q as any).yearTag || '');
      if (!text.toLowerCase().includes((searchFilter || '').toLowerCase())) return false;
    }
    return true;
  });

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectSbaOption = (idx: number) => {
    if (isSubmitted) return;
    setSbaSelection(idx);
  };

  const handleSelectMcqStem = (stemIdx: number, val: boolean) => {
    if (isSubmitted) return;
    setMcqSelections(prev => ({ ...prev, [stemIdx]: val }));
  };

  const handleSubmitAnswer = () => {
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    setIsSubmitted(false);
    setSbaSelection(null);
    setMcqSelections({});
    setAiExplanation(null);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Call Server Gemini API Endpoint `/api/gemini/explain`
  const handleFetchAiExplanation = async () => {
    if (!currentQ) return;
    setAiLoading(true);
    setAiExplanation(null);

    try {
      const qText = currentQ.type === 'SBA' ? currentQ.question : currentQ.stem;
      const qOpts = currentQ.type === 'SBA' ? currentQ.options : currentQ.stems.map(s => `${s.text} (${s.isTrue ? 'True' : 'False'})`);
      const qAns = currentQ.type === 'SBA' ? currentQ.options[currentQ.correctOptionIndex] : 'Multiple T/F Key';

      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: qText,
          options: qOpts,
          correctAnswer: qAns,
          specialty: candidate.specialty,
          userContext: 'High-yield postgraduate medical exam rationale request'
        })
      });

      const data = await res.json();
      if (data && !data.error) {
        setAiExplanation(data);
      } else {
        setAiExplanation({
          rationale: currentQ.explanation,
          highYieldKeyPoints: currentQ.highYieldKeyPoints,
          textbookCitation: currentQ.textbookReference,
          examTip: 'Note: AI Server explanation fallback. Reference standard textbooks.'
        });
      }
    } catch (err) {
      setAiExplanation({
        rationale: currentQ.explanation,
        highYieldKeyPoints: currentQ.highYieldKeyPoints,
        textbookCitation: currentQ.textbookReference,
        examTip: 'High-yield exam tip: Always eliminate distractors before selecting the single best option.'
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 uppercase">
              Subject-wise Practice Engine
            </span>
            <span className="text-xs text-slate-400">FCPS • MS • MD • MRCS</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Postgraduate Medical Question Bank</h1>
          <p className="text-xs text-slate-300 mt-1">
            Practice with instant answer rationale, Bailey & Love / Davidson citations, and AI Explainer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400">Available Practice Pool</p>
            <p className="text-lg font-bold text-emerald-400">{filteredQuestions.length} Questions</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Faculty Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 pr-2">
            <Filter size={14} />
            <span>Faculty:</span>
          </span>
          {faculties.map(fac => (
            <button
              key={fac}
              onClick={() => {
                setSelectedFaculty(fac);
                setCurrentIndex(0);
                setIsSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedFaculty === fac
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {fac}
            </button>
          ))}
        </div>

        {/* Search & Type Select */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={e => {
              setSelectedType(e.target.value);
              setCurrentIndex(0);
              setIsSubmitted(false);
            }}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="All">All Types (SBA + MCQ)</option>
            <option value="SBA">SBA (Single Best Answer)</option>
            <option value="MCQ">MCQ (Multiple True/False)</option>
          </select>

          <div className="relative flex-1 md:w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Filter topics..."
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </div>
        </div>

      </div>

      {/* Main Question Display Card */}
      {!currentQ ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <HelpCircle size={48} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No questions found matching your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try switching faculty or clearing your topic search filter.</p>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          
          {/* Question Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {currentQ.faculty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {currentQ.topic}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                {currentQ.type === 'SBA' ? 'SBA (Single Best)' : 'MCQ (Multiple True/False)'}
              </span>
              {currentQ.yearTag && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                  {currentQ.yearTag}
                </span>
              )}
            </div>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Question {currentIndex + 1} of {filteredQuestions.length}
            </span>
          </div>

          {/* Question Stem / Text */}
          <div className="space-y-2">
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
              {currentQ.type === 'SBA' ? (currentQ as SBAQuestion).question : (currentQ as MCQQuestion).stem}
            </p>
          </div>

          {/* ENGINE 1: Single Best Answer (SBA) Engine */}
          {currentQ.type === 'SBA' && (
            <div className="space-y-3">
              {(currentQ as SBAQuestion).options.map((opt, idx) => {
                const isSelected = sbaSelection === idx;
                const isCorrect = idx === (currentQ as SBAQuestion).correctOptionIndex;

                let btnStyle = 'border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200';

                if (isSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectSbaOption(idx)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && isCorrect && <CheckCircle2 size={18} className="text-emerald-500 shrink-0 ml-2" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle size={18} className="text-rose-500 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* ENGINE 2: Multiple True/False (MCQ) Engine */}
          {currentQ.type === 'MCQ' && (
            <div className="space-y-3">
              {(currentQ as MCQQuestion).stems.map((stem, sIdx) => {
                const userVal = mcqSelections[sIdx];
                const isCorrect = isSubmitted && userVal === stem.isTrue;
                const isWrong = isSubmitted && userVal !== undefined && userVal !== stem.isTrue;

                return (
                  <div
                    key={stem.id || sIdx}
                    className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSubmitted
                        ? isCorrect
                          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40'
                          : isWrong
                          ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40'
                          : 'border-slate-200 dark:border-slate-800'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                      {stem.text}
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleSelectMcqStem(sIdx, true)}
                        disabled={isSubmitted}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                          userVal === true
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white'
                        }`}
                      >
                        TRUE
                      </button>

                      <button
                        onClick={() => handleSelectMcqStem(sIdx, false)}
                        disabled={isSubmitted}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                          userVal === false
                            ? 'bg-rose-600 text-white shadow'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-500 hover:text-white'
                        }`}
                      >
                        FALSE
                      </button>

                      {isSubmitted && (
                        <span className="ml-2 text-xs font-bold">
                          Key: <span className={stem.isTrue ? 'text-emerald-500' : 'text-rose-500'}>{stem.isTrue ? 'TRUE' : 'FALSE'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={currentQ.type === 'SBA' && sbaSelection === null}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/30"
              >
                Submit Answer & View Rationale
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-2 shadow-md"
                >
                  <span>Next Question</span>
                  <ChevronRight size={16} />
                </button>

                <button
                  onClick={handleFetchAiExplanation}
                  disabled={aiLoading}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-teal-900/30"
                >
                  <Sparkles size={16} className="text-amber-300 animate-spin" />
                  <span>{aiLoading ? 'Generating AI Reasoning...' : 'AI High-Yield Explainer'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Answer Rationale & Textbook Citations Box */}
          {isSubmitted && (
            <div className="space-y-4 pt-4 animate-fade-in">
              
              {/* Default Rationale Card */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wide">
                  <BookMarked size={18} />
                  <span>Faculty Answer Rationale & Textbook Reference</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  {currentQ.explanation}
                </p>

                {currentQ.highYieldKeyPoints && currentQ.highYieldKeyPoints.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Lightbulb size={15} className="text-amber-500" />
                      <span>High-Yield Examination Pearls:</span>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {currentQ.highYieldKeyPoints.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <FileText size={15} className="text-emerald-500" />
                  <span>Citation: {currentQ.textbookReference}</span>
                </div>
              </div>

              {/* AI Generated Gemini Explanation Card */}
              {aiExplanation && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-teal-950 border border-teal-600/50 text-slate-100 space-y-3 shadow-xl">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wide">
                    <Sparkles size={18} className="fill-amber-300" />
                    <span>Server-side Gemini AI High-Yield Clinical Tutor</span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                    {aiExplanation.rationale}
                  </p>

                  {aiExplanation.highYieldKeyPoints && aiExplanation.highYieldKeyPoints.length > 0 && (
                    <div className="pt-2 border-t border-teal-800/60">
                      <p className="text-xs font-bold text-emerald-300 mb-1">AI Exam Pearls:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                        {aiExplanation.highYieldKeyPoints.map((k, kIdx) => (
                          <li key={kIdx}>{k}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiExplanation.examTip && (
                    <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-200 text-xs">
                      <strong className="text-emerald-400">BCPS / BSMMU Exam Tip: </strong>
                      {aiExplanation.examTip}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};
