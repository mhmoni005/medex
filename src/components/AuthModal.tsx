import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MedicalSpecialty } from '../types';
import {
  X,
  Stethoscope,
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    updateCandidate,
    candidate,
    loginCandidate,
    loginAdmin,
    adminEmail,
    setActiveTab
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isAuthModalOpen;
  const handleClose = propOnClose || closeAuthModal;

  const [mode, setMode] = useState<'login' | 'admin' | 'register' | 'otp'>('login');
  
  // Sync initial mode with context if modal opens
  useEffect(() => {
    if (authModalMode === 'admin') {
      setMode('admin');
    } else if (authModalMode === 'register') {
      setMode('register');
    } else if (isOpen) {
      setMode('login');
    }
  }, [authModalMode, isOpen]);

  // Candidate Login state
  const [identifier, setIdentifier] = useState(candidate.phone || candidate.email || '+8801712345678');
  const [candidatePassword, setCandidatePassword] = useState('candidate123');

  // Admin Login state
  const [inputAdminEmail, setInputAdminEmail] = useState(adminEmail || 'mhmoni005@gmail.com');
  const [adminPassword, setAdminPassword] = useState('mhmoni005');

  // Register state
  const [name, setName] = useState(candidate.name || 'Dr. Candidate');
  const [designation, setDesignation] = useState(candidate.designation || 'Medical Officer');
  const [specialty, setSpecialty] = useState<MedicalSpecialty>(candidate.specialty || 'FCPS Part I (Surgery)');
  const [bmdcRegNo, setBmdcRegNo] = useState(candidate.bmdcRegNo || 'A-102938');

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

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

  // Handler for Candidate Login
  const handleCandidateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier) {
      setErrorMsg('Please enter your Candidate Email or Bangladeshi Mobile Number.');
      return;
    }

    loginCandidate(identifier);
    setSuccessMsg(`Logged in successfully as Candidate (${candidate.name})!`);
    setTimeout(() => {
      setSuccessMsg('');
      handleClose();
    }, 1000);
  };

  // Handler for Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!inputAdminEmail) {
      setErrorMsg('Please enter your Admin Mail ID.');
      return;
    }

    const success = loginAdmin(inputAdminEmail, adminPassword);
    if (success) {
      setSuccessMsg(`Admin Login Verified! Redirecting to Admin Dashboard...`);
      setTimeout(() => {
        setSuccessMsg('');
        handleClose();
        setActiveTab('admin');
      }, 1000);
    } else {
      setErrorMsg(`Invalid Admin Mail ID or password. Use email: ${adminEmail}`);
    }
  };

  // Handler for Fill Admin Credentials Shortcut
  const handleFillAdminCredentials = () => {
    setInputAdminEmail('mhmoni005@gmail.com');
    setAdminPassword('mhmoni005');
    setErrorMsg('');
  };

  // Handler for Fill Candidate Credentials Shortcut
  const handleFillCandidateCredentials = () => {
    setIdentifier('dr.candidate@medexam.bd');
    setCandidatePassword('candidate123');
    setErrorMsg('');
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier) {
      setErrorMsg('Please enter your Email or Bangladeshi Mobile Number.');
      return;
    }
    setOtpCode('123456'); // Auto-filled for quick demo
    setMode('otp');
  };

  const handleVerifyOTPAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456' && otpCode.length !== 6) {
      setErrorMsg('Invalid OTP code. Please enter 123456.');
      return;
    }

    updateCandidate({
      name: name || 'Dr. Candidate',
      phone: identifier.includes('@') ? candidate.phone : identifier,
      email: identifier.includes('@') ? identifier : candidate.email,
      designation,
      specialty,
      bmdcRegNo
    });

    loginCandidate(identifier);
    setSuccessMsg('Account registered and authenticated successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      handleClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-3 text-white shadow-lg flex items-center justify-center shrink-0">
            <Stethoscope size={28} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">MedExam Login Portal</h2>
            <p className="text-xs text-slate-400">Postgraduate Medical Candidate & Admin Access</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Mode Switch Tabs (Candidate Login / Admin Login / Register) */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-800/90 mb-6 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`py-2 px-2 rounded-xl transition text-center ${
              mode === 'login' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Candidate Sign In
          </button>
          
          <button
            type="button"
            onClick={() => { setMode('admin'); setErrorMsg(''); }}
            className={`py-2 px-2 rounded-xl transition text-center flex items-center justify-center gap-1 ${
              mode === 'admin' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert size={12} />
            <span>Admin Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`py-2 px-2 rounded-xl transition text-center ${
              mode === 'register' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Profile
          </button>
        </div>

        {/* 1. CANDIDATE LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleCandidateLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Candidate Mail ID or Phone (+880)
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. dr.candidate@medexam.bd or +8801712345678"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password / Access Key
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={candidatePassword}
                  onChange={e => setCandidatePassword(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Remember me on this device</span>
              </label>
              <button
                type="button"
                onClick={handleFillCandidateCredentials}
                className="text-emerald-400 hover:underline font-bold text-[11px]"
              >
                Auto-fill Candidate
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:from-emerald-500 hover:to-teal-500 transition shadow-lg shadow-emerald-900/40"
            >
              Sign In as Medical Candidate
            </button>
          </form>
        )}

        {/* 2. ADMIN LOGIN FORM */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/60 text-xs text-amber-200">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                <ShieldAlert size={15} />
                <span>Admin Login Credentials</span>
              </div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                Log in with Admin Mail ID: <strong className="text-white font-mono">mhmoni005@gmail.com</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Mail ID
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                <input
                  type="email"
                  value={inputAdminEmail}
                  onChange={e => setInputAdminEmail(e.target.value)}
                  placeholder="mhmoni005@gmail.com"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-amber-500/50 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Security Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="mhmoni005"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-amber-500/50 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] text-slate-400">Distinguished Faculty Access</span>
              <button
                type="button"
                onClick={handleFillAdminCredentials}
                className="text-amber-400 hover:underline font-bold text-[11px]"
              >
                Auto-fill Admin (mhmoni005@gmail.com)
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs hover:from-amber-500 hover:to-amber-600 transition shadow-lg shadow-amber-950/60"
            >
              Sign In to Admin Dashboard
            </button>
          </form>
        )}

        {/* 3. CANDIDATE REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleSendOTP} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Dr. Ayesha Rahman"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">BMDC Reg. Number</label>
                <input
                  type="text"
                  value={bmdcRegNo}
                  onChange={e => setBmdcRegNo(e.target.value)}
                  placeholder="e.g. A-102938"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Designation & Institution</label>
              <input
                type="text"
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                placeholder="e.g. Medical Officer, Dhaka Medical College Hospital"
                className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Primary Exam Specialty Target</label>
              <select
                value={specialty}
                onChange={e => setSpecialty(e.target.value as MedicalSpecialty)}
                className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:border-emerald-500"
              >
                {specialtiesList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email or Phone Number (+880)</label>
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="+8801700000000"
                className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:from-emerald-500 hover:to-teal-500 transition shadow-lg shadow-emerald-900/40 mt-2"
            >
              Continue to OTP Verification
            </button>
          </form>
        )}

        {/* 4. OTP VERIFICATION */}
        {mode === 'otp' && (
          <form onSubmit={handleVerifyOTPAndSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
              <ShieldCheck size={32} className="mx-auto text-emerald-400 mb-2" />
              <p className="text-xs text-slate-300 font-semibold">Enter 6-Digit SMS / Email Security OTP</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Sent to <span className="text-emerald-300 font-medium">{identifier}</span>
              </p>
              <p className="text-[10px] text-amber-300 mt-1">Demo Auto-filled OTP: 123456</p>
            </div>

            <div>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-slate-800 text-slate-100 text-center font-mono tracking-widest text-lg rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:from-emerald-500 hover:to-teal-500 transition shadow-lg shadow-emerald-900/40"
            >
              Verify OTP & Complete Setup
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
