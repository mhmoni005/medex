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
  UserCheck,
  Award,
  BookMarked
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
    mobileMenuOpen: contextMobileOpen,
    setMobileMenuOpen: contextSetMobileOpen,
    openAuthModal
  } = useApp();

  const isMobileOpen = customMobileMenuOpen !== undefined ? customMobileMenuOpen : contextMobileOpen;
  const setMobileOpen = customSetMobileMenuOpen || contextSetMobileOpen;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'qbank', label: 'Subject Question Bank', icon: BookOpen, badge: '8,500+ SBAs' },
    { id: 'mock_exam', label: 'Mock Exam Simulator', icon: Clock, badge: 'BCPS/BSMMU' },
    { id: 'add_recall', label: 'Recall Question Creator', icon: PlusCircle, badge: 'Easy Add' },
    { id: 'chat_groups', label: 'Specialty Study Groups', icon: MessageSquare, badge: 'Chat' },
    { id: 'forum', label: 'Discussion Forum', icon: Users },
    { id: 'subscriptions', label: 'Subscription & Gateway', icon: CreditCard, highlight: true },
    { id: 'profile_settings', label: 'Candidate Profile & BMDC', icon: UserCheck },
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert, badge: isAdminLoggedIn ? 'Active' : 'Faculty Admin' }
  ];

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
        {/* Top Candidate Target Box */}
        <div className="space-y-4">
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
          </nav>
        </div>

        {/* Bottom Quick Help Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-800/40 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
            <BookMarked size={16} />
            <span>Postgraduate Hotline</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Need subscription activation help or exam syllabus guidance?
          </p>
          <a
            href="tel:+8801700000000"
            className="inline-block mt-2 text-[11px] font-semibold text-emerald-400 hover:underline"
          >
            +880 1700-000000 (bKash Helpline)
          </a>
        </div>
      </aside>
    </>
  );
};
