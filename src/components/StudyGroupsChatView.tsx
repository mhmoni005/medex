import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudyGroup, ChatMessage, Question, SBAQuestion } from '../types';
import {
  MessageSquare,
  Users,
  Search,
  Send,
  Image,
  Lock,
  Crown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  UserPlus,
  UserMinus,
  X,
  Sparkles,
  Info
} from 'lucide-react';

export const StudyGroupsChatView: React.FC = () => {
  const {
    studyGroups,
    joinedGroupIds,
    joinGroup,
    leaveGroup,
    chatMessages,
    sendChatMessage,
    candidate,
    setActiveTab,
    questions
  } = useApp();

  const [activeGroupId, setActiveGroupId] = useState<string>('grp_surgery');
  const [groupSearch, setGroupSearch] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showMemberDrawer, setShowMemberDrawer] = useState(false);
  const [showMcqEmbedModal, setShowMcqEmbedModal] = useState(false);

  // Access Restricted Modal state
  const [restrictedModalGroup, setRestrictedModalGroup] = useState<StudyGroup | null>(null);

  const activeGroup = studyGroups.find(g => g.id === activeGroupId) || studyGroups[0];
  const isJoined = joinedGroupIds.includes(activeGroup.id);
  const messagesList = chatMessages[activeGroup.id] || [];

  const handleSelectGroup = (grp: StudyGroup) => {
    // Subscribed Specialty Enforcement Check
    const specTag = grp?.specialtyTag || '';
    const candSpec = candidate?.specialty || '';
    const isSubscribed =
      candidate?.hasActiveSubscription &&
      (candidate?.activeSubscriptionTier?.includes('All-Access') ||
        (specTag && candidate?.activeSubscriptionTier?.includes(specTag.substring(0, 8))) ||
        specTag.toLowerCase().includes(candSpec.toLowerCase().substring(0, 6)));

    const isGroupJoined = joinedGroupIds.includes(grp.id);

    if (!isSubscribed && !isGroupJoined) {
      setRestrictedModalGroup(grp);
      return;
    }

    setActiveGroupId(grp.id);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    sendChatMessage(activeGroup.id, {
      text: messageInput.trim()
    });
    setMessageInput('');
  };

  const handleEmbedMcqInChat = (q: Question) => {
    sendChatMessage(activeGroup.id, {
      text: '📌 High-Yield Recall MCQ for Discussion:',
      embeddedQuestion: q
    });
    setShowMcqEmbedModal(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-4 pb-12">
      
      {/* Left Column: Group Channel List */}
      <div className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-col shadow-sm">
        
        {/* Header & Search */}
        <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare size={18} className="text-emerald-500" />
              <span>Study Groups</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Subscribed Access
            </span>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={groupSearch}
              onChange={e => setGroupSearch(e.target.value)}
              placeholder="Search specialty groups..."
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs rounded-xl pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Group Item List */}
        <div className="flex-1 overflow-y-auto space-y-2 pt-3">
          {studyGroups
            .filter(g => (g?.name || '').toLowerCase().includes((groupSearch || '').toLowerCase()))
            .map(grp => {
              const isActive = grp.id === activeGroupId;
              const joined = joinedGroupIds.includes(grp.id);

              return (
                <div
                  key={grp.id}
                  onClick={() => handleSelectGroup(grp)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-950 dark:text-emerald-100'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl shrink-0">{grp.iconEmoji}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{grp.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{grp.specialtyTag}</p>
                    </div>
                  </div>

                  {!joined && (
                    <Lock size={14} className="text-slate-400 shrink-0 ml-1" />
                  )}
                </div>
              );
            })}
        </div>

      </div>

      {/* Right Column: Chat Room Window */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col shadow-sm overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{activeGroup.iconEmoji}</span>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>{activeGroup.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  {activeGroup.memberCount} Members
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Supervisor: {activeGroup.facultySupervisor}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMcqEmbedModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
            >
              <Sparkles size={14} />
              <span>Embed Recall MCQ</span>
            </button>

            {isJoined ? (
              <button
                onClick={() => leaveGroup(activeGroup.id)}
                className="px-3 py-1.5 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900 text-xs font-bold transition flex items-center gap-1"
              >
                <UserMinus size={14} />
                <span className="hidden sm:inline">Leave</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const res = joinGroup(activeGroup.id);
                  if (!res.success && res.message) {
                    setRestrictedModalGroup(activeGroup);
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 shadow"
              >
                <UserPlus size={14} />
                <span>Join Group</span>
              </button>
            )}
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          
          <div className="text-center my-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Encrypted Specialty Candidate Discussion Room
            </span>
          </div>

          {messagesList.map(msg => {
            const isMe = msg.senderId === candidate.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/50"
                />

                <div className={`max-w-[85%] sm:max-w-[70%] space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{msg.senderName}</span>
                    {msg.isFaculty && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-extrabold border border-amber-500/30">
                        FACULTY
                      </span>
                    )}
                    <span>• {msg.timestamp}</span>
                  </div>

                  {/* Text Message Bubble */}
                  {msg.text && (
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                          : msg.isFaculty
                          ? 'bg-slate-900 border border-amber-500/40 text-slate-100 rounded-tl-none'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Interactive Embedded MCQ Card */}
                  {msg.embeddedQuestion && (
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 space-y-3 text-left shadow-lg mt-2">
                      <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                        <span>High-Yield Peer Recall Card</span>
                        <span>{msg.embeddedQuestion.faculty}</span>
                      </div>

                      <p className="text-xs font-bold leading-relaxed">
                        {msg.embeddedQuestion.type === 'SBA'
                          ? (msg.embeddedQuestion as SBAQuestion).question
                          : msg.embeddedQuestion.stem}
                      </p>

                      {msg.embeddedQuestion.type === 'SBA' && (
                        <div className="space-y-1.5">
                          {(msg.embeddedQuestion as SBAQuestion).options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className="p-2 rounded-xl bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 transition cursor-pointer"
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                        Reference: {msg.embeddedQuestion.textbookReference}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendText} className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            placeholder={`Message ${activeGroup.name}...`}
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shadow"
          >
            <Send size={16} />
          </button>
        </form>

      </div>

      {/* Access Restricted Modal */}
      {restrictedModalGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 text-center space-y-4">
            <button
              onClick={() => setRestrictedModalGroup(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 p-3 mx-auto flex items-center justify-center">
              <Lock size={28} />
            </div>

            <h3 className="text-lg font-bold">Access Restricted</h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Joining <strong className="text-emerald-400">"{restrictedModalGroup.name}"</strong> requires an active subscription pass to <strong className="text-amber-300">{restrictedModalGroup.specialtyTag}</strong>.
            </p>

            <button
              onClick={() => {
                setRestrictedModalGroup(null);
                setActiveTab('subscriptions');
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/40"
            >
              Upgrade Subscription Pass
            </button>
          </div>
        </div>
      )}

      {/* Embed MCQ Picker Modal */}
      {showMcqEmbedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                <span>Select Recall Question to Embed in Chat</span>
              </h3>
              <button onClick={() => setShowMcqEmbedModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {questions.map(q => (
                <div
                  key={q.id}
                  onClick={() => handleEmbedMcqInChat(q)}
                  className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer text-xs space-y-1 transition"
                >
                  <p className="font-bold text-emerald-300">{q.faculty} • {q.topic}</p>
                  <p className="text-slate-200 line-clamp-2">{q.type === 'SBA' ? (q as SBAQuestion).question : q.stem}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
