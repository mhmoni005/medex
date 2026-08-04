import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { SidebarNavigation } from './components/SidebarNavigation';
import { BottomNavigation } from './components/BottomNavigation';
import { AuthModal } from './components/AuthModal';

import { DashboardView } from './components/DashboardView';
import { QuestionBankView } from './components/QuestionBankView';
import { MockExamSimulator } from './components/MockExamSimulator';
import { RecallCreatorView } from './components/RecallCreatorView';
import { StudyGroupsChatView } from './components/StudyGroupsChatView';
import { CommunityForumView } from './components/CommunityForumView';
import { SubscriptionPortalView } from './components/SubscriptionPortalView';
import { CandidateProfileView } from './components/CandidateProfileView';
import { AdminDashboardView } from './components/AdminDashboardView';

const MainAppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'qbank':
        return <QuestionBankView />;
      case 'mock_exam':
        return <MockExamSimulator />;
      case 'add_recall':
        return <RecallCreatorView />;
      case 'chat_groups':
        return <StudyGroupsChatView />;
      case 'forum':
        return <CommunityForumView />;
      case 'subscriptions':
        return <SubscriptionPortalView />;
      case 'profile':
      case 'profile_settings':
        return <CandidateProfileView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Fixed Header */}
      <Header />

      {/* Main Layout Body */}
      <div className="flex pt-16 min-h-screen">
        
        {/* Desktop Sidebar Navigation */}
        <SidebarNavigation />

        {/* Main Workspace Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Auth / Registration Modal */}
      <AuthModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
