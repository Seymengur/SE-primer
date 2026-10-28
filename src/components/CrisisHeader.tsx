import React from 'react';
import { Clock, AlertTriangle, Users, Activity } from 'lucide-react';
import { UserPreferences, DecisionStepId } from '../types';

interface CrisisHeaderProps {
  currentStepId: DecisionStepId;
  timestamp: string;
  patientsWaiting: number;
  timeRemainingSeconds: number;
  preferences: UserPreferences;
  systemHealth: number;
}

export const CrisisHeader: React.FC<CrisisHeaderProps> = ({
  currentStepId,
  timestamp,
  patientsWaiting,
  timeRemainingSeconds,
  preferences,
  systemHealth,
}) => {
  const steps = [
    { id: 1, label: 'MİMARİ', desc: 'Rollback vs Hotfix' },
    { id: 2, label: 'TEST', desc: 'Smoke vs Direct Deploy' },
    { id: 3, label: 'KVKK', desc: 'Maskele vs Ham Log' },
  ];

  const isCriticalTime = preferences.level === 'experienced' && timeRemainingSeconds <= 15;

  return (
    <div className="bg-slate-950/90 border-b border-slate-800/80 px-3 py-2.5 sm:px-4 sm:py-3 z-20">
      <div className="w-full max-w-2xl mx-auto space-y-2">
        {/* Top metrics bar */}
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          {/* Timestamp & Alert */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[11px] font-bold animate-pulse-subtle">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>{timestamp}</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-300 hidden sm:inline">
              Şehir Hastanesi HBYS Çöküşü
            </span>
          </div>

          {/* Real-time stats */}
          <div className="flex items-center gap-1.5">
            {/* Patients Waiting */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
              <Users className="w-3 h-3 text-amber-400" />
              <span>{patientsWaiting} Hasta</span>
            </div>

            {/* Health Meter */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>Sağlık: %{systemHealth}</span>
            </div>

            {/* Experienced 60s Countdown Timer */}
            {preferences.level === 'experienced' && (
              <div
                data-testid="countdown-timer"
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold border transition-all ${
                  isCriticalTime
                    ? 'bg-rose-950 text-rose-300 border-rose-500 animate-bounce'
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>{timeRemainingSeconds}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Step progress track */}
        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
          {steps.map((st) => {
            const isActive = st.id === currentStepId;
            const isCompleted = st.id < currentStepId;
            return (
              <div
                key={st.id}
                className={`py-1 px-1.5 rounded-lg border text-center transition-all ${
                  isActive
                    ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-950/50'
                    : isCompleted
                    ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                    : 'bg-slate-950/40 border-slate-850 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[9px] font-mono font-bold">{st.id}.</span>
                  <span className="text-[10px] font-bold tracking-wider">{st.label}</span>
                </div>
                <p className="text-[9px] text-slate-400 truncate hidden sm:block">{st.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
