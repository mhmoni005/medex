import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MedicalSpecialty } from '../types';
import {
  User,
  Moon,
  Sun,
  History,
  CheckCircle2,
  Lock,
  Edit2,
  Save,
  Building2,
  Camera,
  KeyRound,
  AlertCircle,
  Stethoscope
} from 'lucide-react';

export const CandidateProfileView: React.FC = () => {
  const { candidate, updateProfile, examHistory, theme, toggleTheme, setActiveTab } = useApp();

  const [isEditing, setIsEditing] = useState(false);

  // Profile Edit fields
  const [name, setName] = useState(candidate.name || 'Dr. Candidate');
  const [bmdcRegNo, setBmdcRegNo] = useState(candidate.bmdcRegNo || 'A-108294');
  const [specialty, setSpecialty] = useState<MedicalSpecialty>(candidate.specialty || 'FCPS Part I (Surgery)');
  const [designation, setDesignation] = useState(candidate.designation || 'Medical Officer');
  const [collegeHospital, setCollegeHospital] = useState(candidate.collegeHospital || 'Dhaka Medical College & Hospital');
  const [avatarUrl, setAvatarUrl] = useState(candidate.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300');

  // Password Change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const specialtiesList: MedicalSpecialty[] = [
    'FCPS Part I (Surgery)',
    'FCPS Part I (Medicine)',
    'FCPS Part I (Gynae & Obs)',
    'MS General Surgery',
    'MS Orthopedics',
    'MD Cardiology',
    'MD Pediatrics',
    'MRCS Part A',
    'MRCP Part 1',
    'MBBS Final Professional Exam'
  ];

  // Preset Avatar Options
  const avatarPresets = [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1594824813566-88855ce78c80?auto=format&fit=crop&q=80&w=300'
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      bmdcRegNo,
      specialty,
      designation,
      collegeHospital,
      avatarUrl
    });
    setIsEditing(false);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!newPasswordInput || newPasswordInput.length < 4) {
      setPassError('New password must be at least 4 characters.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPassError('New password and confirm password do not match.');
      return;
    }

    updateProfile({
      password: newPasswordInput
    });

    setPassSuccess('Password updated successfully!');
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setTimeout(() => {
      setPassSuccess('');
      setShowPasswordChange(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Top Banner Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="relative group">
            <img
              src={candidate.avatarUrl}
              alt={candidate.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500/50 shadow-lg"
            />
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 shadow transition"
              title="Change Picture"
            >
              <Camera size={14} />
            </button>
          </div>

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
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
            {candidate.hasActiveSubscription ? candidate.activeSubscriptionTier : 'Free Trial Pass'}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Doctor Profile & Credentials Editor */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User size={16} className="text-emerald-500" />
              <span>Doctor Details & Picture</span>
            </h3>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
              >
                <Edit2 size={13} />
                <span>Edit Profile</span>
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
                <p className="text-[10px] text-slate-400 font-bold uppercase">Doctor Full Name</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{candidate.name}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">BMDC Registration No.</p>
                <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{candidate.bmdcRegNo}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Designation / Role</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{candidate.designation}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Institute / Medical College</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{candidate.collegeHospital}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Target Exam Specialty</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{candidate.specialty}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <KeyRound size={14} className="text-emerald-500" />
                  <span>{showPasswordChange ? 'Hide Password Settings' : 'Change Password'}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              
              {/* Avatar Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Profile Picture</label>
                <div className="flex items-center gap-2 mb-2">
                  {avatarPresets.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Preset avatar"
                      onClick={() => setAvatarUrl(url)}
                      className={`w-9 h-9 rounded-full object-cover cursor-pointer ring-2 transition ${
                        avatarUrl === url ? 'ring-emerald-500 scale-105' : 'ring-transparent opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  placeholder="Or paste image URL"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-[11px] rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Doctor Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Dr. Ayesha Rahman"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              {/* BMDC Registration Number */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">BMDC Registration No.</label>
                <input
                  type="text"
                  value={bmdcRegNo}
                  onChange={e => setBmdcRegNo(e.target.value)}
                  placeholder="A-108294"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 font-mono"
                  required
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  placeholder="Medical Officer"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              {/* Institute / Medical College */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Institute / Hospital</label>
                <input
                  type="text"
                  value={collegeHospital}
                  onChange={e => setCollegeHospital(e.target.value)}
                  placeholder="Dhaka Medical College Hospital"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Specialty</label>
                <select
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value as MedicalSpecialty)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
                >
                  {specialtiesList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow"
              >
                <Save size={14} />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

          {/* CHANGE PASSWORD FORM */}
          {showPasswordChange && !isEditing && (
            <form onSubmit={handleChangePasswordSubmit} className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-fade-in text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                <Lock size={14} className="text-emerald-500" />
                <span>Update Account Password</span>
              </h4>

              {passError && (
                <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[11px] flex items-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">New Password</label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={e => setNewPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPasswordInput}
                  onChange={e => setConfirmPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow"
              >
                Update Password
              </button>
            </form>
          )}

        </div>

        {/* Right Column: Mock Exam Analytics & History */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History size={16} className="text-emerald-500" />
              <span>Mock Examination Log & Performance Score</span>
            </h3>

            <button
              onClick={() => setActiveTab('mock_exam')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Launch Exam Simulator
            </button>
          </div>

          {examHistory.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs space-y-2">
              <Stethoscope size={32} className="mx-auto text-slate-400 opacity-60" />
              <p className="font-bold text-slate-700 dark:text-slate-300">No mock exams completed yet</p>
              <p className="text-[11px] text-slate-400">
                Launch a BCPS or University MS/MD mock exam from the simulator to track your performance stats!
              </p>
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
                    <p className="text-[10px] text-slate-400 font-bold">
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
