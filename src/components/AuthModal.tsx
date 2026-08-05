import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Stethoscope,
  ShieldCheck,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowRight,
  KeyRound,
  Shield,
  RefreshCw
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
    adminEmail,
    unifiedLogin,
    setActiveTab
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isAuthModalOpen;
  const handleClose = propOnClose || closeAuthModal;

  const [tabMode, setTabMode] = useState<'login' | 'register' | 'otp'>('login');

  // Unified Login state
  const [loginIdentifier, setLoginIdentifier] = useState(candidate.email || '+8801712345678');
  const [loginPassword, setLoginPassword] = useState('candidate123');

  // Simplified Register state (Name, Email/Phone & Password)
  const [regCandidateName, setRegCandidateName] = useState('');
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // OTP Verification state
  const [otpCode, setOtpCode] = useState('123456');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (authModalMode === 'register') {
      setTabMode('register');
    } else if (isOpen) {
      setTabMode('login');
    }
  }, [authModalMode, isOpen]);

  if (!isOpen) return null;

  // Handler for Unified Login (Candidate & Admin share the exact same login option)
  const handleUnifiedLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your Email or Phone Number.');
      return;
    }

    if (!loginPassword.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    // Call unified login
    const userRole = unifiedLogin(loginIdentifier, loginPassword);

    if (userRole === 'admin') {
      setSuccessMsg(`Welcome Admin (${adminEmail})! Opening Admin Dashboard...`);
      setTimeout(() => {
        setSuccessMsg('');
        handleClose();
        setActiveTab('admin');
      }, 1000);
    } else {
      setSuccessMsg(`Logged in successfully as Candidate (${candidate.name || loginIdentifier})!`);
      setTimeout(() => {
        setSuccessMsg('');
        handleClose();
      }, 1000);
    }
  };

  // Step 1: Handle initial Register form submission -> proceed to OTP
  const handleRegisterNextToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanId = regIdentifier.trim();
    if (!cleanId) {
      setErrorMsg('Please enter your Phone Number or Email Address.');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    // Transition to OTP verification step
    setOtpCode('123456'); // Pre-fill default demo OTP for fast testing
    setSuccessMsg(`OTP Code sent to ${cleanId}! Please enter the 6-digit code below.`);
    setTabMode('otp');
  };

  // Step 2: Handle OTP verification and final registration
  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP code.');
      return;
    }

    const cleanId = regIdentifier.trim();
    const isEmailInput = cleanId.includes('@');

    // Save initial credentials
    updateCandidate({
      id: 'cand_' + Date.now(),
      candidateId: 'CAND-' + Math.floor(100000 + Math.random() * 900000),
      email: isEmailInput ? cleanId : (candidate.email || 'doctor@medexam.bd'),
      phone: !isEmailInput ? cleanId : (candidate.phone || '+8801700000000'),
      password: regPassword,
      name: regCandidateName.trim() || ''
    });

    // Automatically log candidate in
    loginCandidate(cleanId);

    setSuccessMsg('OTP Verified! Account created successfully. Opening Profile Settings...');
    setTimeout(() => {
      setSuccessMsg('');
      handleClose();
      setActiveTab('profile_settings');
    }, 1200);
  };

  // Resend OTP trigger
  const handleResendOtp = () => {
    setOtpCode('123456');
    setErrorMsg('');
    setSuccessMsg(`A new 6-digit OTP code has been sent to ${regIdentifier.trim() || 'your phone/email'}.`);
  };

  // Shortcut helpers
  const handleFillCandidateDemo = () => {
    setLoginIdentifier('dr.candidate@medexam.bd');
    setLoginPassword('candidate123');
    setErrorMsg('');
  };

  const handleFillAdminDemo = () => {
    setLoginIdentifier('mhmoni005@gmail.com');
    setLoginPassword('mhmoni005');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        {/* Portal Branding Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-3 text-white shadow-lg flex items-center justify-center shrink-0">
            <Stethoscope size={28} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">MedExam Login Portal</h2>
            <p className="text-xs text-slate-400">Candidate & Admin Unified Access</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Unified Tab Selector (Sign In vs Register) */}
        <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-slate-800/90 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setTabMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 px-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 ${
              tabMode === 'login' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User size={14} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setTabMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 px-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 ${
              tabMode === 'register' || tabMode === 'otp' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Create Account</span>
          </button>
        </div>

        {/* 1. UNIFIED LOGIN FORM (BOTH CANDIDATE & ADMIN USE THIS SAME FORM) */}
        {tabMode === 'login' && (
          <form onSubmit={handleUnifiedLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={e => setLoginIdentifier(e.target.value)}
                  placeholder="mhmoni005@gmail.com or +8801712345678"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-[11px]">
              <div className="flex items-center justify-between text-slate-400 font-medium">
                <span>Quick Fill Credentials:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleFillCandidateDemo}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-left truncate font-mono text-[10px] border border-emerald-700/60 transition flex items-center justify-between gap-1"
                >
                  <span className="font-bold">Candidate</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-900 text-emerald-200">CAND-108294</span>
                </button>
                <button
                  type="button"
                  onClick={handleFillAdminDemo}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-left truncate font-mono text-[10px] border border-amber-700/60 transition flex items-center justify-between gap-1"
                >
                  <span className="font-bold">Admin</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-900 text-amber-200">ADM-SUPER-001</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* 2. SIMPLIFIED REGISTER FORM (ONLY PHONE/EMAIL & PASSWORD REQUIRED) */}
        {tabMode === 'register' && (
          <form onSubmit={handleRegisterNextToOtp} className="space-y-4">
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-[11px] text-emerald-300 leading-relaxed">
              ⚡ Quick Registration: Enter your Candidate Name, Phone or Email, & Password.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Full Candidate Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={regCandidateName}
                  onChange={e => setRegCandidateName(e.target.value)}
                  placeholder="e.g. Dr. Tanvir Hossain"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Phone Number (+880) or Email Address
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={regIdentifier}
                  onChange={e => setRegIdentifier(e.target.value)}
                  placeholder="e.g. +8801700000000 or doctor@medexam.bd"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
            >
              <span>Get OTP & Continue</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* 3. OTP VERIFICATION STEP */}
        {tabMode === 'otp' && (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto mb-1">
                <KeyRound size={20} />
              </div>
              <p className="text-xs font-bold text-slate-200">OTP Security Verification</p>
              <p className="text-[11px] text-slate-400">
                Code sent to <span className="font-semibold text-emerald-400">{regIdentifier || 'your account'}</span>
              </p>
              <p className="text-[10px] text-emerald-300 font-mono mt-1">Demo OTP Code: 123456</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-center">
                Enter 6-Digit OTP Code
              </label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-slate-800 text-slate-100 text-center font-mono tracking-widest text-lg rounded-xl pl-10 pr-4 py-3 border border-emerald-500/80 focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => { setTabMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-slate-400 hover:text-slate-200 font-medium"
              >
                ← Back to Edit
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
              >
                <RefreshCw size={12} />
                <span>Resend OTP</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
            >
              <span>Verify OTP & Complete Account</span>
              <CheckCircle2 size={16} />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
