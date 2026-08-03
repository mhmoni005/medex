import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  ShieldCheck,
  Award,
  BookOpen,
  Crown,
  Moon,
  Sun,
  History,
  CheckCircle2,
  Lock,
  Edit2,
  Save,
  Building2,
  FileText
} from 'lucide-react';

export const CandidateProfileView: React.FC = () => {
  const { candidate, updateProfile, examHistory, theme, toggleTheme, setActiveTab } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(candidate.name);
  const [bmdcRegNo, setBmdcRegNo] = useState(candidate.bmdcRegNo);
  const [specialty, setSpecialty] = useState(candidate.specialty);
  const [designation, setDesignation] = useState(candidate.designation);
  const [collegeHospital, setCollegeHospital] = useState(candidate.collegeHospital);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      bmdcRegNo,
      specialty,
      designation,
      collegeHospital
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Top Banner Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img
            src={candidate.avatarUrl}
            alt={candidate.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500/50 shadow-lg"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                BMDC Reg: {candidate.bmdcRegNo}
              </span>
              <span className="text-xs text-slate-400">{candidate.designation}</span>
            </div>
            <h1 className="text-2xl font-bold">{candidate.name}</h1>
            <p className="text-xs text-slate-300 mt-1">{candidate.collegeHospital}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 transition border border-slate-700"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
            {candidate.hasActiveSubscription ? candidate.activeSubscriptionTier : 'Free Trial'}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Edit Form */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User size={16} className="text-emerald-500" />
              <span>Doctor Credentials</span>
            </h3>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-slate-500 hover:underline"
              >
                Cancel
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Full Doctor Name</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{candidate.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">BMDC Registration No.</p>
                <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{candidate.bmdcRegNo}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Target Exam Specialty</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{candidate.specialty}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Designation / Role</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{candidate.designation}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Medical College / Hospital</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{candidate.collegeHospital}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">BMDC Reg. No.</label>
                <input
                  type="text"
                  value={bmdcRegNo}
                  onChange={e => setBmdcRegNo(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Specialty</label>
                <input
                  type="text"
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medical College</label>
                <input
                  type="text"
                  value={collegeHospital}
                  onChange={e => setCollegeHospital(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow"
              >
                <Save size={14} />
                <span>Save Changes</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Exam History Log */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History size={16} className="text-emerald-500" />
              <span>Mock Examination Log & Score History</span>
            </h3>

            <button
              onClick={() => setActiveTab('mock_exam')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Take New Test
            </button>
          </div>

          {examHistory.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No mock exams taken yet. Launch the Mock Simulator to record score analytics!
            </div>
          ) : (
            <div className="space-y-3">
              {examHistory.map(hist => (
                <div
                  key={hist.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{hist.examTitle}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {new Date(hist.completedAt).toLocaleString()} • {hist.correctCount} / {hist.totalQuestions} Correct
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-base font-extrabold ${hist.scorePercentage >= 60 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                      {hist.scorePercentage}%
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {hist.scorePercentage >= 60 ? 'PASSED' : 'REVISION'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
