import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  MessageSquare,
  Send,
  User,
  Paperclip,
  Clock,
  ShieldCheck,
  CheckCheck,
} from 'lucide-react';

interface MessagesPageProps {
  onNavigate: (path: string) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = () => {
  const { currentUser } = useAuth();
  const { conversations, chatMessages, sendChatMessage } = useData();
  const { language } = useLanguage();

  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations.length > 0 ? conversations[0].id : ''
  );
  const [typedMessage, setTypedMessage] = useState('');

  const activeConversation = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const activeMessages = (activeConversation && chatMessages[activeConversation.id]) || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeConversation) return;

    sendChatMessage(activeConversation.id, typedMessage.trim());
    setTypedMessage('');
  };

  const getOtherParticipant = (conv: typeof activeConversation) => {
    if (!conv) return { name: 'Support', id: 'SUPPORT' };
    const other = conv.participants.find((p) => p.id !== currentUser?.id);
    return other || conv.participants[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {language === 'bn' ? 'মেসেজ ও ইনবক্স' : 'Direct Messages & Communications'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'bn'
            ? 'ক্লায়েন্ট এবং সেলারদের সাথে সরাসরি যোগাযোগ করুন।'
            : 'Secure direct messaging between buyers and sellers regarding orders and tasks.'}
        </p>
      </div>

      {/* Main Inbox Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
        {/* Left: Conversations List */}
        <div className="md:col-span-4 border-r border-slate-100 dark:border-slate-800 p-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Recent Conversations
          </h2>

          <div className="space-y-1">
            {conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const isSelected = conv.id === selectedConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {other.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold truncate">{other.name}</p>
                      <span className="text-[10px] text-slate-400">{conv.lastMessageTime.slice(11)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                    {conv.orderId && (
                      <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                        Order #{conv.orderId}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Message Stream */}
        <div className="md:col-span-8 flex flex-col justify-between h-full bg-slate-50/50 dark:bg-slate-900/50">
          {activeConversation ? (
            <>
              {/* Chat Top Bar */}
              <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {getOtherParticipant(activeConversation).name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {getOtherParticipant(activeConversation).name}
                    </h3>
                    {activeConversation.orderId && (
                      <p className="text-[10px] text-slate-400">Order: #{activeConversation.orderId}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Escrow Safe Chat</span>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[380px]">
                {activeMessages.map((msg) => {
                  const isMine = msg.senderId === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                          isMine
                            ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-xs'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.message}</p>
                        <div
                          className={`flex items-center justify-end gap-1 text-[10px] ${
                            isMine ? 'text-blue-200' : 'text-slate-400'
                          }`}
                        >
                          <span>{msg.timestamp.slice(11)}</span>
                          {isMine && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                />

                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-10 h-10 mb-2 opacity-40 mx-auto" />
              <p className="text-xs">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
