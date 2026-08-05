import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Headset, X, CheckCircle2, ShieldCheck, MessageSquare, Mail, ExternalLink } from 'lucide-react';

interface CandidateHelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateHelplineModal: React.FC<CandidateHelplineModalProps> = ({ isOpen, onClose }) => {
  const { helplineContacts } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'whatsapp' | 'email'>('all');

  if (!isOpen) return null;

  // Filter active helpline contacts
  const availableHelplines = (helplineContacts || []).filter(h => h.isActive);
  const filteredHelplines = availableHelplines.filter(h => {
    if (activeFilter === 'whatsapp') return h.type === 'whatsapp';
    if (activeFilter === 'email') return h.type === 'email';
    return true;
  });

  const handleWhatsAppConnect = (phoneValue: string, label: string) => {
    // Sanitize phone number (remove +, spaces, dashes)
    const cleanNumber = phoneValue.replace(/[^\d]/g, '');
    const message = encodeURIComponent(`Hello MedExam Support! I am a Candidate seeking assistance regarding: ${label}`);
    const waUrl = `https://wa.me/${cleanNumber}?text=${message}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleEmailConnect = (emailValue: string, label: string) => {
    const subject = encodeURIComponent(`Candidate Helpline Request - ${label}`);
    const body = encodeURIComponent(`Respected Faculty Support Team,\n\nI need assistance with: ${label}.\n\nThank you.`);
    const mailtoUrl = `mailto:${emailValue}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner shrink-0">
              <Headset size={26} className="text-emerald-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight">Candidate Support Helpline</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Official Service
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Instant help via WhatsApp & Email for Postgraduate Medical Exams
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Security & Confidentiality Badge */}
        <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
          <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
          <span>Click any helpline channel logo below to directly connect with our Faculty Desk.</span>
        </div>

        {/* Channel Filters */}
        <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-emerald-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Channels ({availableHelplines.length})
          </button>

          <button
            onClick={() => setActiveFilter('whatsapp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeFilter === 'whatsapp'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            {/* WhatsApp Logo SVG */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.236.376-1.003 3.666 3.753-.984.357.204z"/>
            </svg>
            <span>WhatsApp Helpline</span>
          </button>

          <button
            onClick={() => setActiveFilter('email')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeFilter === 'email'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
            }`}
          >
            <Mail size={14} />
            <span>Email Support</span>
          </button>
        </div>

        {/* Helpline List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {filteredHelplines.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No active helpline channels available in this category currently.
            </div>
          ) : (
            filteredHelplines.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                  item.type === 'whatsapp'
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-400'
                    : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60 hover:border-blue-400'
                }`}
              >
                {/* Channel Details (Label & Logo only, NO raw phone number or email string shown) */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      item.type === 'whatsapp'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {item.type === 'whatsapp' ? (
                      /* WhatsApp Brand Logo Icon */
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.236.376-1.003 3.666 3.753-.984.357.204z"/>
                      </svg>
                    ) : (
                      <Mail size={22} />
                    )}
                  </div>

                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide mb-1 ${
                        item.type === 'whatsapp'
                          ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                          : 'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200'
                      }`}
                    >
                      {item.type === 'whatsapp' ? 'Official WhatsApp Service' : 'Official Email Service'}
                    </span>
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                      {item.label}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      <span>Direct Faculty Routing • Instant Response</span>
                    </p>
                  </div>
                </div>

                {/* Direct Action Button with Brand Logo */}
                <div className="shrink-0 pt-2 sm:pt-0">
                  {item.type === 'whatsapp' ? (
                    <button
                      onClick={() => handleWhatsAppConnect(item.value, item.label)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <svg className="w-4 h-4 fill-current group-hover:scale-110 transition" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.236.376-1.003 3.666 3.753-.984.357.204z"/>
                      </svg>
                      <span>Connect on WhatsApp</span>
                      <ExternalLink size={13} className="opacity-70" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEmailConnect(item.value, item.label)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <Mail size={15} className="group-hover:scale-110 transition" />
                      <span>Send Email Support</span>
                      <ExternalLink size={13} className="opacity-70" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Helpline active for candidate queries regarding FCPS, MS, MD, MRCS & Final Prof MBBS preparation.
          </p>
        </div>

      </div>
    </div>
  );
};
