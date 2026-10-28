import React, { useEffect } from 'react';
import { SimulationState } from '../types';
import { OUTCOME_A, OUTCOME_B, OUTCOME_CHAOS } from '../data/scenarioData';
import { RotateCcw, Award, ShieldCheck, ShieldAlert } from 'lucide-react';
import { playSuccessChime, playAlertSound, playClickSound } from '../utils/audio';

interface OutcomeScreenProps {
  state: SimulationState;
  onReset: () => void;
}

export const OutcomeScreen: React.FC<OutcomeScreenProps> = ({
  state,
  onReset,
}) => {
  const choice1 = state.choicesMade[1];
  const choice2 = state.choicesMade[2];
  const choice3 = state.choicesMade[3];

  let outcome = OUTCOME_A;
  if (choice3 === 'B') {
    outcome = OUTCOME_B;
  } else if (choice1 === 'B' && choice2 === 'B') {
    outcome = OUTCOME_CHAOS;
  }

  const isGood = outcome.id === 'outcome_good';

  useEffect(() => {
    if (isGood) {
      playSuccessChime();
    } else {
      playAlertSound();
    }
  }, [isGood]);

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-5 space-y-3 sm:space-y-4 animate-fadeIn">
      {/* Banner Card */}
      <div
        className={`p-3.5 sm:p-5 rounded-2xl border relative overflow-hidden shadow-xl ${
          isGood
            ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-500/40'
            : outcome.id === 'outcome_bad_kvkk'
            ? 'bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-950 border-rose-500/40'
            : 'bg-gradient-to-br from-red-950/80 via-slate-900 to-slate-950 border-red-500/50'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${outcome.badgeColor}`}
              >
                {outcome.badge}
              </span>
              <span className="text-[10px] font-mono text-slate-400">SRE RAPORU</span>
            </div>
            <h1 className="text-base sm:text-xl font-bold text-slate-100 font-serif-primer mt-1 break-words leading-tight">
              {outcome.title}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-cyan-300 break-words">{outcome.subtitle}</p>
          </div>

          <div
            className={`px-2.5 py-1.5 rounded-xl border flex flex-col items-center justify-center font-mono font-bold shrink-0 mt-0.5 ${
              isGood
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            <span className="text-sm sm:text-base leading-none font-black">{outcome.grade}</span>
            <span className="text-[9px] font-normal text-slate-300">{(outcome as any).statusTitle || 'Durum'}</span>
          </div>
        </div>

        <p className="text-[11px] sm:text-xs text-slate-300 mt-2.5 leading-relaxed bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 sm:p-3 break-words">
          {outcome.summary}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {outcome.metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
          >
            <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">
              {m.label}
            </span>
            <span
              className={`text-[11px] sm:text-xs font-mono font-bold mt-1 break-words ${
                m.status === 'success'
                  ? 'text-emerald-400'
                  : m.status === 'warning'
                  ? 'text-amber-400'
                  : 'text-rose-400 font-extrabold'
              }`}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* Post-Mortem & Retrospective */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-cyan-400" />
          <span>Post-Mortem &amp; Öğrenilen Dersler</span>
        </div>
        <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-300 font-sans">
          {outcome.retrospective.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[9px] shrink-0 mt-0.5 font-mono">
                {idx + 1}
              </span>
              <span className="leading-snug break-words flex-1 min-w-0">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* KVKK 6698 Audit Notice */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex items-start gap-2.5">
        {isGood ? (
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-0.5 flex-1 min-w-0">
          <h4 className="text-[11px] font-bold text-slate-200">
            {isGood ? 'KVKK Uyum Denetimi: BAŞARILI' : 'KVKK Uyum Denetimi: KRİTİK İHLAL'}
          </h4>
          <p className="text-[10px] text-slate-400 leading-snug break-words">
            {isGood
              ? '6698 sayılı KVKK md. 12 gereği tüm loglar maskelenmiş ve sağlık verisi gizliliği korunmuştur.'
              : '6698 sayılı Kanun md. 6 ve md. 12 ihlal edilmiştir. Özel nitelikli hasta verileri üçüncü taraf mesajlaşma platformuna aktarıldığı için resmi ihlal bildirimi zorunludur.'}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-1">
        <button
          onClick={() => {
            playClickSound();
            onReset();
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" />
          <span>Farklı Bir Yolla Tekrar Oyna</span>
        </button>
      </div>
    </div>
  );
};
