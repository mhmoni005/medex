import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FacultyName, QuestionType } from '../types';
import {
  PlusCircle,
  CheckCircle2,
  BookMarked,
  ShieldAlert,
  Send,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const RecallCreatorView: React.FC = () => {
  const { addRecallQuestion, candidate } = useApp();

  const [type, setType] = useState<QuestionType>('SBA');
  const [faculty, setFaculty] = useState<FacultyName>('Surgery');
  const [topic, setTopic] = useState('');
  const [yearTag, setYearTag] = useState('BCPS FCPS Part I Jan 2025 Recall');
  const [questionText, setQuestionText] = useState('');

  // SBA Options
  const [sbaOptions, setSbaOptions] = useState<string[]>([
    'A. Option 1',
    'B. Option 2',
    'C. Option 3',
    'D. Option 4',
    'E. Option 5'
  ]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);

  // MCQ Stems
  const [mcqStems, setMcqStems] = useState<{ text: string; isTrue: boolean }[]>([
    { text: 'A. Stem option 1', isTrue: true },
    { text: 'B. Stem option 2', isTrue: false },
    { text: 'C. Stem option 3', isTrue: true },
    { text: 'D. Stem option 4', isTrue: false },
    { text: 'E. Stem option 5', isTrue: true }
  ]);

  const [explanation, setExplanation] = useState('');
  const [highYieldKeyPoints, setHighYieldKeyPoints] = useState('');
  const [textbookReference, setTextbookReference] = useState("Bailey & Love's Short Practice of Surgery, 28th Ed");

  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSbaOptionChange = (idx: number, val: string) => {
    const updated = [...sbaOptions];
    updated[idx] = val;
    setSbaOptions(updated);
  };

  const handleMcqStemTextChange = (idx: number, val: string) => {
    const updated = [...mcqStems];
    updated[idx].text = val;
    setMcqStems(updated);
  };

  const handleMcqStemBoolChange = (idx: number, isTrue: boolean) => {
    const updated = [...mcqStems];
    updated[idx].isTrue = isTrue;
    setMcqStems(updated);
  };

  const handleSubmitRecall = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!questionText.trim()) {
      setErrorMsg('Please enter the question stem or scenario text.');
      return;
    }

    if (!explanation.trim()) {
      setErrorMsg('Please enter a clinical rationale or explanation.');
      return;
    }

    if (type === 'SBA') {
      addRecallQuestion({
        type: 'SBA',
        question: questionText,
        options: sbaOptions,
        correctOptionIndex,
        explanation,
        highYieldKeyPoints: highYieldKeyPoints.split('\n').filter(Boolean),
        textbookReference,
        faculty,
        topic: topic || 'General Practice',
        yearTag
      });
    } else {
      addRecallQuestion({
        type: 'MCQ',
        stem: questionText,
        stems: mcqStems.map((s, idx) => ({ id: `stem_${idx}`, text: s.text, isTrue: s.isTrue })),
        explanation,
        highYieldKeyPoints: highYieldKeyPoints.split('\n').filter(Boolean),
        textbookReference,
        faculty,
        topic: topic || 'General Practice',
        yearTag
      });
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setQuestionText('');
      setExplanation('');
      setTopic('');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
              Easy Add Recall Creator
            </span>
            <span className="text-xs text-slate-400">Postgraduate Peer Contribution</span>
          </div>
          <h1 className="text-2xl font-bold">Submit Exam Recall Question</h1>
          <p className="text-xs text-slate-300 mt-1">
            Help fellow candidate doctors prepare! Submissions are routed to senior faculty supervisors for verification.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
          <p className="font-bold">Contributor: {candidate.name}</p>
          <p className="text-[11px] text-slate-400">{candidate.bmdcRegNo}</p>
        </div>
      </div>

      {submittedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-3">
          <CheckCircle2 size={20} className="shrink-0" />
          <span>Recall Question Submitted! Sent to Senior Faculty Supervisor approval queue.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmitRecall} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        {/* Row 1: Type & Faculty */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Question Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as QuestionType)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-200 dark:border-slate-700 focus:border-emerald-500"
            >
              <option value="SBA">SBA (Single Best Answer)</option>
              <option value="MCQ">MCQ (Multiple True/False)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Faculty</label>
            <select
              value={faculty}
              onChange={e => setFaculty(e.target.value as FacultyName)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-200 dark:border-slate-700 focus:border-emerald-500"
            >
              <option value="Surgery">Surgery</option>
              <option value="Medicine">Medicine</option>
              <option value="Gynecology & Obstetrics">Gynecology & Obstetrics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Basic Medical Sciences">Basic Medical Sciences</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Exam Year / Recall Tag</label>
            <input
              type="text"
              value={yearTag}
              onChange={e => setYearTag(e.target.value)}
              placeholder="e.g. BCPS FCPS Jan 2025"
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-200 dark:border-slate-700 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Subject Topic Name</label>
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. Hepatobiliary Surgery, Acute Pancreatitis, Thyroid Autoantibodies"
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 focus:border-emerald-500"
            required
          />
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {type === 'SBA' ? 'Clinical Vignette / Question Stem' : 'Main MCQ Question Stem Statement'}
          </label>
          <textarea
            rows={3}
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            placeholder={
              type === 'SBA'
                ? 'A 45-year-old male presents with right upper quadrant pain radiating to shoulder blade...'
                : 'Regarding acute appendicitis clinical features and scoring, state True or False:'
            }
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 focus:border-emerald-500"
            required
          />
        </div>

        {/* SBA Options Editor */}
        {type === 'SBA' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              5 SBA Options (Select the Radio for Correct Answer Key):
            </label>

            {sbaOptions.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correct_sba"
                  checked={correctOptionIndex === idx}
                  onChange={() => setCorrectOptionIndex(idx)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  value={opt}
                  onChange={e => handleSbaOptionChange(idx, e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3.5 py-2 border border-slate-200 dark:border-slate-700 focus:border-emerald-500"
                  required
                />
              </div>
            ))}
          </div>
        )}

        {/* MCQ Stems Editor */}
        {type === 'MCQ' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              5 MCQ Stems A–E (Specify True or False Key):
            </label>

            {mcqStems.map((stem, sIdx) => (
              <div key={sIdx} className="flex flex-col sm:flex-row sm:items-center gap-2">
                <input
                  type="text"
                  value={stem.text}
                  onChange={e => handleMcqStemTextChange(sIdx, e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3.5 py-2 border border-slate-200 dark:border-slate-700 focus:border-emerald-500"
                  required
                />
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMcqStemBoolChange(sIdx, true)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      stem.isTrue ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    TRUE
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMcqStemBoolChange(sIdx, false)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      !stem.isTrue ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    FALSE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rationale & Textbook Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Detailed Answer Rationale</label>
            <textarea
              rows={3}
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              placeholder="Explain why the correct answer is right according to guidelines..."
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-3 border border-slate-200 dark:border-slate-700 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Standard Textbook Citation</label>
            <input
              type="text"
              value={textbookReference}
              onChange={e => setTextbookReference(e.target.value)}
              placeholder="e.g. Bailey & Love 28th Ed Ch 67 or Davidson Medicine 24th Ed"
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-200 dark:border-slate-700 focus:border-emerald-500"
              required
            />

            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-3 mb-1">
              High-Yield Key Points (One per line)
            </label>
            <textarea
              rows={2}
              value={highYieldKeyPoints}
              onChange={e => setHighYieldKeyPoints(e.target.value)}
              placeholder="Point 1&#10;Point 2"
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-3 border border-slate-200 dark:border-slate-700 focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
        >
          <Send size={16} />
          <span>Submit Recall Question to Faculty Queue</span>
        </button>

      </form>

    </div>
  );
};
