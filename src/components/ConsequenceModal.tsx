import React from 'react';
import { DecisionStep, ChoiceKey } from '../types';
import { CheckCircle2, AlertOctagon, Terminal, ArrowRight, Users, Clock, ShieldAlert } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface ConsequenceModalProps {
  step: DecisionStep;
  choiceKey: ChoiceKey;
  onProceed: () => void;
  isLastStep: boolean;
}

export const ConsequenceModal: React.FC<ConsequenceModalProps> = ({
  step,
  choiceKey,
  onProceed,
  isLastStep,
}) => {
  const choice = step.choices[choiceKey];
  const consequence = step.consequences[choiceKey];
  const isDangerous = consequence.kvkkRiskLevel === 'critical' || consequence.systemHealthDelta < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs sm:text-sm shrink-0 ${
                isDangerous
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                  : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
              }`}
            >
              {choiceKey}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase block">
                TEKNİK NEDENSELLİK ANALİZİ
              </span>
              <h2 className="text-xs sm:text-base font-bold text-slate-100 truncate">
                {choice.title}
              </h2>
            </div>
          </div>
          <span
            className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-md border shrink-0 ${
              isDangerous
                ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
            }`}
          >
            {isDangerous ? 'Kritik Etki' : 'Kontrollü Etki'}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto">
          {/* Ne Oldu? Section */}
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 sm:p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-cyan-400 uppercase tracking-wider">
              {isDangerous ? (
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
              <span>Ne Oldu? (Gözlemlenen Durum)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans break-words">
              {consequence.whatHappened}
            </p>
          </div>

          {/* Neden Oldu? Section */}
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 sm:p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Neden Oldu? (Mühendislik Kök Nedeni)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans break-words">
              {consequence.whyItHappened}
            </p>
          </div>

          {/* Technical Terminal Log */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Canlı Küme &amp; Sunucu Logları
            </span>
            <div className="bg-black/80 border border-slate-800 rounded-xl p-2.5 sm:p-3 font-mono text-[10px] sm:text-[11px] text-emerald-400/90 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner break-all">
              {consequence.technicalLog}
            </div>
          </div>

          {/* Metrics Impact Grid */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-0.5">
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400">
                <Clock className="w-2.5 h-2.5" />
                <span>Kesinti</span>
              </div>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-200 mt-0.5 block">
                +{consequence.downtimeDeltaMinutes} dk
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400">
                <Users className="w-2.5 h-2.5" />
                <span>Hasta</span>
              </div>
              <span
                className={`text-xs sm:text-sm font-mono font-bold mt-0.5 block ${
                  consequence.patientsWaitingDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {consequence.patientsWaitingDelta > 0 ? `+${consequence.patientsWaitingDelta}` : consequence.patientsWaitingDelta}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400">
                <ShieldAlert className="w-2.5 h-2.5" />
                <span>KVKK</span>
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-mono font-bold uppercase mt-0.5 block ${
                  consequence.kvkkRiskLevel === 'critical'
                    ? 'text-rose-400 font-extrabold animate-pulse'
                    : consequence.kvkkRiskLevel === 'medium'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {consequence.kvkkRiskLevel === 'critical' ? 'İHLAL' : consequence.kvkkRiskLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onProceed();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <span>{isLastStep ? 'Simülasyon Sonucunu Gör' : 'Sonraki Karara Geç'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
