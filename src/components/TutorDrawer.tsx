import React, { useState, useRef, useEffect } from 'react';
import { TutorMessage, DecisionStepId } from '../types';
import { askSocraticTutor } from '../services/tutorService';
import { Sparkles, Send, X, Bot, User, HelpCircle, Loader2 } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface TutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStepId: DecisionStepId;
  userLevel: string;
  userRole: string;
}

export const TutorDrawer: React.FC<TutorDrawerProps> = ({
  isOpen,
  onClose,
  currentStepId,
  userLevel,
  userRole,
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'init-1',
      role: 'tutor',
      text: "Merhaba nöbetçi mühendis. Ben SE Primer Sokratik rehberinim. Doğrudan cevabı arama; her mimari kararın bir bedeli vardır. Aklına takılan nedir?",
      timestamp: '08:01',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Hangi şıkkı seçmeliyim, A mı B mi?",
    "Veritabanı şeması geriye dönük uyumlu mu?",
    "Canlıda yama yaparsam pod restart'ında ne olur?",
    "Logları maskelemek vakit kaybı değil mi?",
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    playClickSound();
    const userMsg: TutorMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askSocraticTutor(textToSend, currentStepId, userLevel, userRole);
      const tutorMsg: TutorMessage = {
        id: `t-${Date.now()}`,
        role: 'tutor',
        text: response,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        isGuidingQuestion: true,
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `t-${Date.now()}`,
          role: 'tutor',
          text: "Geri dönmeden önce veritabanı şemasının değişip değişmediğini nasıl anlarsın?",
          timestamp: '08:05',
          isGuidingQuestion: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      data-testid="tutor-drawer"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full sm:max-w-md h-[80vh] sm:h-[650px] bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-100 font-serif-primer">
                  SE Primer Tutor
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  Sokratik
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Cevabı söylemez, doğru sorularla düşündürür
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div
          data-testid="tutor-message-list"
          className="flex-1 p-4 overflow-y-auto space-y-3 font-sans"
        >
          {messages.map((msg) => {
            const isTutor = msg.role === 'tutor';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isTutor ? 'justify-start' : 'justify-end'}`}
              >
                {isTutor && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isTutor
                      ? 'bg-slate-950 border border-slate-800 text-slate-200 shadow-sm'
                      : 'bg-cyan-600 text-white rounded-br-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[9px] block text-right mt-1 font-mono ${
                      isTutor ? 'text-slate-500' : 'text-cyan-200'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {!isTutor && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs py-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sokratik Tutor düşünüyor...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-950/40 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
        >
          <input
            type="text"
            data-testid="tutor-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tutor'a soru sor (Örn: Hangisi daha güvenli?)..."
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
