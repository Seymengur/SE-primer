import React from 'react';
import { UserPreferences, ExperienceLevel, UserRole, LearningGoal } from '../types';
import { Shield, Server, Clock, Compass, Terminal, Award, ChevronRight, Check, Zap } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface OnboardingProps {
  preferences: UserPreferences;
  onChangePreferences: (prefs: UserPreferences) => void;
  onStartSimulation: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({
  preferences,
  onChangePreferences,
  onStartSimulation,
}) => {
  const levels: { id: ExperienceLevel; label: string; desc: string; badge: string; icon: any }[] = [
    {
      id: 'beginner',
      label: 'Yeni başladım',
      desc: 'Her kararda otomatik Primer rehber ipucu görürsün. Kavramsal açıklamalar eşlik eder.',
      badge: 'İpucu Desteği',
      icon: Compass,
    },
    {
      id: 'intermediate',
      label: 'Orta düzey',
      desc: 'Standart nöbet akışı. İpuçları isteğe bağlıdır, karar analizi dengelidir.',
      badge: 'Dengeli',
      icon: Terminal,
    },
    {
      id: 'experienced',
      label: 'Deneyimliyim',
      desc: '60 saniyelik gerçek zamanlı süre baskısı! Süre bittiğinde sistem refleks kararı uygular.',
      badge: '60sn Sayaç',
      icon: Clock,
    },
  ];

  const roles: { id: UserRole; label: string; desc: string; icon: any }[] = [
    { id: 'backend', label: 'Backend', desc: 'DB transaction & API', icon: Server },
    { id: 'devops', label: 'DevOps / SRE', desc: 'Kubernetes & SLA', icon: Zap },
    { id: 'frontend', label: 'Frontend', desc: 'UX & Randevu akışı', icon: Compass },
    { id: 'fullstack', label: 'Full-Stack', desc: 'Uçtan uca mimari', icon: Award },
  ];

  const goals: { id: LearningGoal; label: string; desc: string }[] = [
    { id: 'recovery', label: 'Sistem ve Veri Kurtarma', desc: '300 hastanın randevusunu veri kaybı olmadan kurtarmak' },
    { id: 'architecture', label: 'Mimari & Rollback Dinamikleri', desc: 'DB şema uyumsuzluğu ve canlı yama risklerini öğrenmek' },
    { id: 'kvkk', label: 'KVKK & Sağlık Verisi Hassasiyeti', desc: 'Krizde bile veri güvenliği ve hukuki sınırları korumak' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-4 sm:space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-[11px] font-mono">
          <Shield className="w-3 h-3 text-cyan-400" />
          <span>YZM301 · SİMÜLASYON</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold text-slate-100 tracking-tight font-serif-primer">
          SE Primer
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed break-words px-1">
          Kişiye uyum sağlayan interaktif kitap: Sen karar verirsin, sistem o kararın teknik, operasyonel ve hukuki sonucunu yaşatır.
        </p>
      </div>

      {/* Narrative Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 relative overflow-hidden shadow-lg">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-200">Kişiselleştirilmiş Mühendislik Profili</h2>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug break-words">
              Aşağıdaki 3 tercih simülasyonun zorluğunu, zaman kısıtlarını ve Sokratik AI Tutor'un sorularını belirleyecek.
            </p>
          </div>
        </div>
      </div>

      {/* Soru 1: Deneyim Seviyesi */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
          <span>1. Deneyim Seviyeniz</span>
          <span className="text-[10px] text-slate-400 font-normal">Süre ve ipucu modu</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {levels.map((lvl) => {
            const isSelected = preferences.level === lvl.id;
            const Icon = lvl.icon;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  onChangePreferences({ ...preferences, level: lvl.id });
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md shadow-cyan-950/30'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      {lvl.label}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug break-words">{lvl.desc}</p>
                </div>
                <div className="mt-2.5">
                  <span
                    className={`inline-block text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {lvl.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Soru 2: Mühendislik Rolü */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
          <span>2. Mühendislik Rolünüz</span>
          <span className="text-[10px] text-slate-400 font-normal">Odak perspektifi</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {roles.map((r) => {
            const isSelected = preferences.role === r.id;
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  onChangePreferences({ ...preferences, role: r.id });
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md shadow-indigo-950/30'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                    {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 block break-words">{r.label}</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight break-words">{r.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Soru 3: Öğrenme Hedefi */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
          <span>3. Birincil Öğrenme Hedefiniz</span>
          <span className="text-[10px] text-slate-400 font-normal">Kriz refleks alanı</span>
        </label>
        <div className="space-y-1.5">
          {goals.map((g) => {
            const isSelected = preferences.goal === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  onChangePreferences({ ...preferences, goal: g.id });
                }}
                className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500/50'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700/80'
                }`}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <span className="text-xs font-semibold text-slate-200 block break-words">{g.label}</span>
                  <span className="text-[10px] text-slate-400 break-words leading-tight">{g.desc}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-cyan-400 bg-cyan-500' : 'border-slate-600'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onStartSimulation();
          }}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-cyan-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
          data-testid="start-simulation-btn"
        >
          <span>Simülasyona Başla: 08:00 Kriz Sahnesi</span>
          <ChevronRight className="w-4 h-4" />
        </button>
        <p className="text-[10px] text-center text-slate-500 mt-1.5">
          1 kriz senaryosu · 3 mimari karar · 2 farklı son · Sokratik AI Tutor
        </p>
      </div>
    </div>
  );
};
