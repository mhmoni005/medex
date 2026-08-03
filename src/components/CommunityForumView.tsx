import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FacultyName } from '../types';
import {
  Users,
  Search,
  PlusCircle,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  Send,
  Sparkles,
  Filter,
  X
} from 'lucide-react';

export const CommunityForumView: React.FC = () => {
  const { forumPosts, addForumPost, upvoteForumPost, addForumReply, candidate } = useApp();

  const [selectedFaculty, setSelectedFaculty] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  // New Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postFaculty, setPostFaculty] = useState<FacultyName>('Surgery');

  // Active Reply State: postId -> string text
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    addForumPost(postTitle, postContent, postFaculty, candidate.specialty);
    setPostTitle('');
    setPostContent('');
    setShowPostModal(false);
  };

  const handleSendReply = (postId: string) => {
    const text = replyInputs[postId];
    if (!text || !text.trim()) return;

    addForumReply(postId, text.trim());
    setReplyInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const filteredPosts = forumPosts.filter(p => {
    if (selectedFaculty !== 'All' && p.facultyTag !== selectedFaculty) return false;
    if (searchFilter) {
      const matchText = p.title + p.content + p.facultyTag;
      if (!matchText.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 uppercase">
              Community Discussion Forum
            </span>
            <span className="text-xs text-slate-400">Postgraduate Peer Exchange</span>
          </div>
          <h1 className="text-2xl font-bold">Candidate Discussion Board</h1>
          <p className="text-xs text-slate-300 mt-1">
            Ask high-yield exam queries, share study strategies, and read faculty-verified answers.
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/40 flex items-center gap-2"
        >
          <PlusCircle size={16} />
          <span>Post High-Yield Query</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 pr-1">
            <Filter size={14} />
            <span>Faculty:</span>
          </span>
          {['All', 'Surgery', 'Medicine', 'Gynecology & Obstetrics', 'Pediatrics', 'Basic Medical Sciences'].map(fac => (
            <button
              key={fac}
              onClick={() => setSelectedFaculty(fac)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedFaculty === fac
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {fac}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search discussion queries..."
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            {/* Author Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/50"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{post.authorName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {post.specialtyTag}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{post.authorDesignation} • {post.timestamp}</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {post.facultyTag}
              </span>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{post.title}</h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{post.content}</p>
            </div>

            {/* Upvote & Comment Action */}
            <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => upvoteForumPost(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                  post.isUpvoted
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700'
                }`}
              >
                <ThumbsUp size={14} />
                <span>{post.upvotes} Upvotes</span>
              </button>

              <span className="text-slate-500 flex items-center gap-1 font-medium">
                <MessageSquare size={14} />
                <span>{post.repliesCount} Responses</span>
              </span>
            </div>

            {/* Replies List */}
            {post.replies && post.replies.length > 0 && (
              <div className="space-y-2.5 pt-3 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
                {post.replies.map(rep => (
                  <div
                    key={rep.id}
                    className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                      rep.isFaculty
                        ? 'bg-slate-900 text-slate-100 border border-amber-500/40 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {rep.authorName}
                        {rep.isFaculty && (
                          <span className="px-2 py-0.2 rounded text-[10px] bg-amber-500 text-slate-950 font-extrabold">
                            FACULTY SUPERVISOR
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">{rep.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{rep.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Box */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={replyInputs[post.id] || ''}
                onChange={e => setReplyInputs({ ...replyInputs, [post.id]: e.target.value })}
                placeholder="Write a response or clinical rationale..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSendReply(post.id)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow"
              >
                Reply
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Post New Query Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-4">
            
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold">Post New High-Yield Discussion Query</h2>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Select Faculty Tag</label>
                <select
                  value={postFaculty}
                  onChange={e => setPostFaculty(e.target.value as FacultyName)}
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 border border-slate-700 focus:border-emerald-500"
                >
                  <option value="Surgery">Surgery</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Gynecology & Obstetrics">Gynecology & Obstetrics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Basic Medical Sciences">Basic Medical Sciences</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Query Headline / Topic</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  placeholder="e.g. How to differentiate Graves Disease from Toxic Multinodular Goiter?"
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 border border-slate-700 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Detailed Discussion Query</label>
                <textarea
                  rows={4}
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="Elaborate on your question or textbook dilemma..."
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl p-3 border border-slate-700 focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/40"
              >
                Post Query to Community Forum
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
