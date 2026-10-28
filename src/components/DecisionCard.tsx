import React from 'react';
import { DecisionStep, ChoiceKey, UserPreferences } from '../types';
import { MessageSquare, Info, ArrowRight } from 'lucide-react';
import { EmbeddedTutor } from './EmbeddedTutor';
import { playClickSound } from '../utils/audio';

interface DecisionCardProps {
  step: DecisionStep;
  preferences: UserPreferences;
  onSelectChoice: (key: ChoiceKey) => void;
  onOpenTutor?: () => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  step,
  preferences,
  onSelectChoice,
  onOpenTutor,
}) => {
  const isBeginner = preferences.level === 'beginner';

  const handleScrollToTutor = () => {
    playClickSound();
    const el = document.getElementById('embedded-tutor-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (onOpenTutor) {
      onOpenTutor();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-5 space-y-3 sm:space-y-4">
      {/* Scenario Context Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-5 relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold">
            KARAR {step.id} / 3 · {step.category}
          </span>
          <span className="text-xs text-slate-400 font-mono">{step.timestamp}</span>
        </div>

        <h2 className="text-sm sm:text-lg font-bold text-slate-100 leading-snug break-words">
          {step.title}
        </h2>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 sm:p-3 font-mono break-words">
          {step.context}
        </p>

        {/* Primer Rehber İpucu (Kabul Örneği 1: "Yeni başladım" için otomatik görünür) */}
        {isBeginner && (
          <div
            data-testid="primer-hint-box"
            className="mt-2.5 p-2.5 sm:p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs flex items-start gap-2 animate-fadeIn"
          >
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 flex-1 min-w-0">
              <span className="font-semibold text-cyan-300 block text-[11px] sm:text-xs">SE Primer Rehberi:</span>
              <p className="text-[10px] sm:text-[11px] leading-relaxed text-cyan-100 break-words">{step.beginnerHint}</p>
            </div>
          </div>
        )}
      </div>

      {/* Decision Buttons (A vs B) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
          <span>KRİTİK MÜHENDİSLİK TERCİHİNİZ</span>
          <button
            onClick={handleScrollToTutor}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Tutor'a Danış (Gömülü)</span>
          </button>
        </div>

        {/* Choice A */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onSelectChoice('A');
          }}
          data-testid="choice-A"
          className="w-full text-left p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/70 hover:from-slate-850 hover:to-slate-800/90 border border-slate-700/70 hover:border-cyan-500/60 transition-all cursor-pointer group shadow-md hover:shadow-cyan-950/30 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors text-xs sm:text-sm mt-0.5">
                A
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors break-words leading-tight">
                  {step.choices.A.title}
                </h3>
                <p className="text-[11px] text-slate-400 break-words mt-0.5">{step.choices.A.subtitle}</p>
              </div>
            </div>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md border shrink-0 mt-0.5 ${step.choices.A.badgeColor}`}
            >
              {step.choices.A.badge}
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-300 mt-2 sm:mt-2.5 leading-relaxed break-words">
            {step.choices.A.description}
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-mono gap-2">
            <span className="truncate flex-1 min-w-0">{step.choices.A.technicalDetails}</span>
            <div className="flex items-center gap-1 text-cyan-400 shrink-0 font-sans font-medium group-hover:translate-x-0.5 transition-transform">
              <span>Seç</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </button>

        {/* Choice B */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onSelectChoice('B');
          }}
          data-testid="choice-B"
          className="w-full text-left p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/70 hover:from-slate-850 hover:to-slate-800/90 border border-slate-700/70 hover:border-amber-500/60 transition-all cursor-pointer group shadow-md hover:shadow-amber-950/30 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors text-xs sm:text-sm mt-0.5">
                B
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors break-words leading-tight">
                  {step.choices.B.title}
                </h3>
                <p className="text-[11px] text-slate-400 break-words mt-0.5">{step.choices.B.subtitle}</p>
              </div>
            </div>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md border shrink-0 mt-0.5 ${step.choices.B.badgeColor}`}
            >
              {step.choices.B.badge}
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-300 mt-2 sm:mt-2.5 leading-relaxed break-words">
            {step.choices.B.description}
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-mono gap-2">
            <span className="truncate flex-1 min-w-0">{step.choices.B.technicalDetails}</span>
            <div className="flex items-center gap-1 text-amber-400 shrink-0 font-sans font-medium group-hover:translate-x-0.5 transition-transform">
              <span>Seç</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </button>
      </div>

      {/* Embedded Socratic AI Tutor directly inside the mobile screen */}
      <div id="embedded-tutor-section" className="pt-2 scroll-mt-4">
        <EmbeddedTutor
          currentStepId={step.id}
          userLevel={preferences.level}
          userRole={preferences.role}
        />
      </div>
    </div>
  );
};
