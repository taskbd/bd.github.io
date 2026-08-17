import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Send, X, Bot, User as UserIcon, Volume2, VolumeX, RefreshCw, MessageSquare } from 'lucide-react';

interface MayaAssistantProps {
  embedded?: boolean;
}

export const MayaAssistant: React.FC<MayaAssistantProps> = ({ embedded = false }) => {
  const { currentUser } = useAuth();
  const { userWallet } = useData();
  const { language } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'maya'; text: string; time: string }>>([
    {
      sender: 'maya',
      text:
        language === 'bn'
          ? `নমস্কার ${currentUser ? currentUser.name : ''}! আমি **মায়া**, TaskBD-এর স্মার্ট এআই সহকারী।\n\nআপনার ওয়ালেট ব্যালেন্স, ডিপোজিট, উইথড্রয়াল, জব পোস্ট বা সার্ভিস সম্পর্কিত যেকোনো প্রশ্ন আমাকে করতে পারেন। আমি কীভাবে সাহায্য করতে পারি?`
          : `Hello ${currentUser ? currentUser.name : ''}! I am **Maya**, the official AI Assistant for TaskBD.\n\nAsk me anything about deposits, withdrawals, verification, orders, or how escrow protects your money!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickQuestions =
    language === 'bn'
      ? [
          'আমার ওয়ালেট ব্যালেন্স কত?',
          'ডিপোজিট করার নিয়ম কী?',
          'অ্যাকাউন্ট ভেরিফাই কীভাবে করব?',
          'TaskBD এসক্রো কীভাবে কাজ করে?',
          'সার্ভিস পাবলিশ করতে কী লাগবে?',
        ]
      : [
          'What is my wallet balance?',
          'How do I deposit funds via bKash?',
          'How do I verify my account for ৳15?',
          'How does the 24h Escrow safeguard work?',
          'How to publish services in Workspace?',
        ];

  const handleSend = async (promptToSend?: string) => {
    const query = promptToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/maya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          language,
          context: {
            userName: currentUser?.name,
            userId: currentUser?.id,
            verified: currentUser?.verificationStatus,
            publishing: currentUser?.publishingStatus,
            availableBalance: userWallet?.availableBalance || 0,
            pendingBalance: userWallet?.pendingBalance || 0,
          },
        }),
      });

      const data = await res.json();
      const botMsg = {
        sender: 'maya' as const,
        text: data.reply || 'মায়া উত্তর প্রস্তুত করতে পারেনি। দয়া করে আবার চেষ্টা করুন।',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);

      // Read aloud if speech enabled
      if (isSpeaking && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = botMsg.text.replace(/[*#_•]/g, '');
        const utter = new SpeechSynthesisUtterance(cleanText);
        utter.lang = language === 'bn' ? 'bn-BD' : 'en-US';
        window.speechSynthesis.speak(utter);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'maya',
          text: language === 'bn' ? 'সার্ভার সংযোগে ত্রুটি হয়েছে। কিছুক্ষণের মধ্যে পুনরায় চেষ্টা করুন।' : 'Connection error. Please try again shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
    }
  };

  if (embedded) {
    return (
      <div className="flex flex-col h-[700px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Assistant Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 via-sky-700 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white border border-white/30 shadow-inner">
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">MAYA AI</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Intelligent Agent
                </span>
              </div>
              <p className="text-xs text-sky-100">Official TaskBD Assistant • Powered by Gemini 3.7</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSpeech}
              title={isSpeaking ? 'Mute Speech' : 'Enable Voice Readout'}
              className={`p-2 rounded-lg transition-colors ${
                isSpeaking ? 'bg-white text-blue-700' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() =>
                setMessages([
                  {
                    sender: 'maya',
                    text:
                      language === 'bn'
                        ? 'চ্যাট হিস্ট্রি রিসেট করা হয়েছে। আপনাকে কীভাবে সাহায্য করতে পারি?'
                        : 'Chat reset. How may I assist you today?',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ])
              }
              title="Reset Chat"
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'maya' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                }`}
              >
                {m.text}
                <span
                  className={`block text-[10px] mt-1.5 font-mono ${
                    m.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-2 text-xs font-medium text-slate-500">Maya is typing...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-100/60 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 text-slate-700 dark:text-slate-300 transition-colors shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'bn' ? 'মায়াকে আপনার প্রশ্ন লিখুন...' : 'Ask Maya anything about TaskBD...'}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium disabled:opacity-50 transition-all shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // Floating Widget Mode
  return (
    <>
      {/* Floating Maya Button */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 p-3.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white dark:border-slate-800"
          aria-label="Open Maya AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white"></span>
          </div>
          <span className="hidden md:inline font-bold text-xs tracking-wide uppercase pr-1">Maya AI</span>
        </button>
      </div>

      {/* Floating Dialog Panel */}
      {isOpen && (
        <div className="fixed bottom-24 md:bottom-20 right-4 md:right-6 w-[92vw] sm:w-[420px] h-[550px] z-50 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col animate-slideUp">
          {/* Top Bar */}
          <div className="p-3.5 bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">MAYA AI ASSISTANT</h4>
                <p className="text-[10px] text-sky-100">TaskBD Instant Support</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleSpeech}
                className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isSpeaking ? 'Mute' : 'Speak'}
              >
                {isSpeaking ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'maya' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs whitespace-pre-wrap leading-relaxed shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-8">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px]">Maya is thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick chips */}
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'bn' ? 'মায়াকে জিজ্ঞেস করুন...' : 'Ask Maya...'}
              className="flex-1 px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
