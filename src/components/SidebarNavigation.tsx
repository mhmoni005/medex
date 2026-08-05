import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  Clock,
  PlusCircle,
  MessageSquare,
  Users,
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Award,
  BookMarked,
  LogOut,
  Headset
} from 'lucide-react';

interface SidebarNavigationProps {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  mobileMenuOpen: customMobileMenuOpen,
  setMobileMenuOpen: customSetMobileMenuOpen
}) => {
  const {
    activeTab,
    setActiveTab,
    candidate,
    isAdminLoggedIn,
    adminProfile,
    isCandidateLoggedIn,
    logoutCandidate,
    logoutAdmin,
    mobileMenuOpen: contextMobileOpen,
    setMobileMenuOpen: contextSetMobileOpen
  } = useApp();

  const isMobileOpen = customMobileMenuOpen !== undefined ? customMobileMenuOpen : contextMobileOpen;
  const setMobileOpen = customSetMobileMenuOpen || contextSetMobileOpen;

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'qbank', label: 'Subject Question Bank', icon: BookOpen, badge: '8,500+ SBAs' },
    { id: 'mock_exam', label: 'Mock Exam Simulator', icon: Clock, badge: 'BCPS/BSMMU' },
    { id: 'add_recall', label: 'Recall Question Creator', icon: PlusCircle, badge: 'Easy Add' },
    { id: 'chat_groups', label: 'Specialty Study Groups', icon: MessageSquare, badge: 'Chat' },
    { id: 'forum', label: 'Discussion Forum', icon: Users },
    { id: 'subscriptions', label: 'Subscription & Gateway', icon: CreditCard, highlight: true },
    { id: 'profile_settings', label: 'Candidate Profile & BMDC', icon: UserCheck, candidateOnly: true },
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert, badge: 'Active Cabinet', adminOnly: true }
  ];

  // Strictly filter items based on role:
  // Admin sees Admin Dashboard, NO Candidate Profile.
  // Candidate sees Candidate Profile, NO Admin Dashboard.
  const navItems = allNavItems.filter(item => {
    if (item.adminOnly && !isAdminLoggedIn) return false;
    if (item.candidateOnly && isAdminLoggedIn) return false;
    return true;
  });

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-[65px] left-0 z-30 h-[calc(100vh-65px)] w-64 bg-slate-900 dark:bg-slate-950 border-r border-slate-800 text-slate-300 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Role Status Box */}
        <div className="space-y-4">
          {isAdminLoggedIn ? (
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/60 shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={adminProfile.avatarUrl || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'}
                  alt={adminProfile.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{adminProfile.name}</p>
                  <p className="text-[10px] text-amber-300 font-mono font-semibold truncate">{adminProfile.phone || 'ADM-SUPER-001'}</p>
                </div>
              </div>
              <div className="text-[10px] text-amber-300/80 flex items-center justify-between pt-1.5 border-t border-amber-800/50">
                <span className="truncate">{adminProfile.role || 'Superuser'}</span>
                <span className="text-emerald-400 font-medium shrink-0">Active</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-800/80 dark:bg-slate-900/90 border border-slate-700/60 shadow-inner">
              <div className="flex items-center gap-2 mb-1">
                <Award size={16} className="text-emerald-400" />
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Candidate Specialty</span>
              </div>
              <p className="text-xs font-semibold text-white truncate">{candidate.specialty}</p>
              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between pt-1.5 border-t border-slate-700/50">
                <span>BMDC: {candidate.bmdcRegNo}</span>
                <span className="text-emerald-400 font-medium">Verified</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40'
                      : item.highlight
                      ? 'text-amber-300 hover:bg-amber-500/10 hover:text-amber-200'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-800/80 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  logoutAdmin();
                } else {
                  logoutCandidate();
                }
                if (setMobileOpen) setMobileOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition duration-150 mt-2 border border-rose-900/40"
              title="Logout from system"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} className="text-rose-400" />
                <span>Logout ({isAdminLoggedIn ? 'Admin' : isCandidateLoggedIn ? candidate.name : 'Doctor'})</span>
              </div>
              <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded-full border border-rose-800/50">
                Exit
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Quick Help Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-800/40 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Headset size={16} className="text-emerald-300 animate-pulse" />
              <span>Candidate Helpline</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
              WA & Email
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Need 24/7 academic recall or subscription pass support?
          </p>
          <button
            onClick={() => {
              const helplineBtn = document.querySelector('button[title*="Helpline"]') as HTMLButtonElement;
              if (helplineBtn) helplineBtn.click();
            }}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] transition shadow-md shadow-emerald-950/50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Headset size={14} />
            <span>Open Helpline Desk</span>
          </button>
        </div>
      </aside>
    </>
  );
};
