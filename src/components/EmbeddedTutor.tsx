import React, { useState, useRef, useEffect } from 'react';
import { TutorMessage, DecisionStepId } from '../types';
import { askSocraticTutor } from '../services/tutorService';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface EmbeddedTutorProps {
  currentStepId: DecisionStepId;
  userLevel: string;
  userRole: string;
}

export const EmbeddedTutor: React.FC<EmbeddedTutorProps> = ({
  currentStepId,
  userLevel,
  userRole,
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'init-1',
      role: 'tutor',
      text: "Merhaba nöbetçi mühendis. Ben SE Primer Sokratik rehberinim. Doğrudan cevabı söylemem; her kararın mimari bir bedeli vardır. Neyi sorguluyorsun?",
      timestamp: '08:02',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Hangi şıkkı seçmeliyim, A mı B mi?",
    "Veritabanı şeması geriye dönük uyumlu mu?",
    "Canlıda yama yaparsam pod restart'ında ne olur?",
    "Logları maskelemek şart mı?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          text: "Geri dönmeden önce dün gece uygulanan veritabanı şema değişikliklerinin geriye dönük uyumlu olup olmadığını nasıl teyit edersin?",
          timestamp: '08:05',
          isGuidingQuestion: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-cyan-800/60 rounded-2xl p-3 sm:p-4 space-y-3 shadow-lg">
      {/* Embedded Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-slate-100 font-serif-primer">
                SE Primer Sokratik Tutor
              </h4>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-semibold">
                Gömülü Rehber
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">
              Cevabı doğrudan söylemez, düşündürücü soru sorar
            </p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div
        data-testid="tutor-message-list"
        className="max-h-48 overflow-y-auto space-y-2 pr-1 font-sans text-xs"
      >
        {messages.map((msg) => {
          const isTutor = msg.role === 'tutor';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${isTutor ? 'justify-start' : 'justify-end'}`}
            >
              {isTutor && (
                <div className="w-5 h-5 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3 h-3" />
                </div>
              )}
              <div
                className={`max-w-[85%] p-2.5 rounded-xl leading-relaxed break-words ${
                  isTutor
                    ? 'bg-slate-950 border border-slate-800 text-slate-200'
                    : 'bg-cyan-600 text-white rounded-br-none'
                }`}
              >
                <p className="text-[11px] sm:text-xs">{msg.text}</p>
                <span
                  className={`text-[8px] block text-right mt-0.5 font-mono ${
                    isTutor ? 'text-slate-500' : 'text-cyan-200'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
              {!isTutor && (
                <div className="w-5 h-5 rounded-md bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] py-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Sokratik Tutor düşünüyor...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="overflow-x-auto flex gap-1 pb-1 no-scrollbar">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-[10px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* In-App Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-1.5 pt-1"
      >
        <input
          type="text"
          data-testid="tutor-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tutor'a sor (Örn: A mı B mi?)..."
          className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition-colors cursor-pointer shrink-0"
          title="Gönder"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
