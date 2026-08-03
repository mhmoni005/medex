import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { updateCandidate, candidate } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'otp'>('login');
  const [identifier, setIdentifier] = useState(candidate.phone || '+8801712345678');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState(candidate.name);
  const [designation, setDesignation] = useState(candidate.designation);
  const [specialty, setSpecialty] = useState<MedicalSpecialty>(candidate.specialty);
  const [bmdcRegNo, setBmdcRegNo] = useState(candidate.bmdcRegNo);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
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

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier) {
      setErrorMsg('Please enter your Email or Bangladeshi Mobile Number (+880).');
      return;
    }
    setOtpSent(true);
    setOtpCode('123456'); // Auto-fill test code for immediate testing
    setMode('otp');
  };

  const handleVerifyOTPAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456' && otpCode.length !== 6) {
      setErrorMsg('Invalid OTP code. Please enter 123456.');
      return;
    }

    // Save profile update
    updateCandidate({
      name: name || 'Dr. Candidate',
      phone: identifier.includes('@') ? candidate.phone : identifier,
      email: identifier.includes('@') ? identifier : candidate.email,
      designation,
      specialty,
      bmdcRegNo
    });

    setSuccessMsg('Authentication verified successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-3 text-white shadow-lg flex items-center justify-center">
            <Stethoscope size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">MedExam Candidate Verification</h2>
            <p className="text-xs text-slate-400">Postgraduate Candidate Portal Login & BMDC Profile</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-800/80 mb-6 text-xs font-semibold">
          <button
            onClick={() => setMode('login')}
            className={`py-2 rounded-xl transition ${
              mode === 'login' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Candidate Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`py-2 rounded-xl transition ${
              mode === 'register' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Profile
          </button>
        </div>

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address or Bangladeshi Phone Number
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. tanvir@dmc.edu.bd or +8801712345678"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Candidate Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
                <span>Remember me on this browser</span>
              </label>
              <span className="text-emerald-400 hover:underline cursor-pointer">Forgot Password?</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:from-emerald-500 hover:to-teal-500 transition shadow-lg shadow-emerald-900/40"
            >
              Request OTP Code & Sign In
            </button>
          </form>
        )}

        {/* Register Form */}
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

        {/* OTP Verification Flow */}
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
