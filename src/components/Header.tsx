import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  Search,
  Sun,
  Moon,
  ShieldCheck,
  Crown,
  User,
  LogOut,
  Bell,
  CheckCircle2,
  Lock,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  onOpenAuth: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const {
    candidate,
    themeMode,
    toggleTheme,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isAdminLoggedIn,
    logoutAdmin
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white px-4 lg:px-8 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-2 text-white shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition duration-200 flex items-center justify-center">
              <Stethoscope size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">Med<span className="text-emerald-400">Exam</span></span>
                <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 uppercase">
                  BD Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Postgraduate Medical Examination Portal</p>
            </div>
          </div>
        </div>

        {/* Center Quick Search Bar */}
        <div className="flex-1 max-w-md hidden md:block relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search recall questions, topics (e.g. Cholecystitis, Graves, FCPS Jan 2025)..."
            className="w-full bg-slate-800/90 dark:bg-slate-900/90 text-slate-200 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2 border border-slate-700/80 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Active Subscription Badge Indicator */}
          {candidate.hasActiveSubscription ? (
            <div
              onClick={() => setActiveTab('subscriptions')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/40 text-emerald-300 text-xs font-medium cursor-pointer hover:border-emerald-400 transition shadow-sm"
              title={`Active Pass: ${candidate.activeSubscriptionTier}`}
            >
              <Crown size={14} className="text-amber-400 fill-amber-400" />
              <span className="max-w-[140px] truncate">{candidate.activeSubscriptionTier || 'Active Subscriber'}</span>
              <CheckCircle2 size={13} className="text-emerald-400 ml-0.5" />
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('subscriptions')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition"
            >
              <Lock size={13} />
              <span>Upgrade Pass</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle dark/light theme"
          >
            {themeMode === 'light' ? <Moon size={19} /> : <Sun size={19} className="text-amber-400" />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition relative"
              aria-label="View notifications"
            >
              <Bell size={19} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-ping" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-xs text-slate-200 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-semibold text-slate-100">
                  <span>Portal Notifications</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/50">BCPS & BSMMU</span>
                </div>
                <div className="space-y-3 mt-3">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <p className="font-semibold text-emerald-300">FCPS Part I Recall Bank Updated!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">35 new January 2025 Surgery & Medicine recall SBAs added with Bailey & Love citations.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <p className="font-semibold text-blue-300">New Study Group Chat Active</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Prof. Dr. Jalil posted a new Pancreatitis MCQ in the FCPS Surgery Recall Lounge.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Candidate Profile Avatar Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div
              onClick={() => setActiveTab('profile_settings')}
              className="flex items-center gap-2 cursor-pointer group"
              title="Candidate Settings & BMDC Record"
            >
              <div className="relative">
                <img
                  src={candidate.avatarUrl}
                  alt={candidate.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/60 group-hover:ring-emerald-400 transition"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>

              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition truncate max-w-[130px]">
                  {candidate.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                  {candidate.bmdcRegNo || 'BMDC Candidate'}
                </p>
              </div>
            </div>

            {isAdminLoggedIn && (
              <button
                onClick={logoutAdmin}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 transition ml-1"
                title="Logout Admin"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
