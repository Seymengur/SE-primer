import React from 'react';
import { Volume2, VolumeX, Smartphone, Monitor, BookOpen, Sparkles, RotateCcw } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface NavbarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isMobileView: boolean;
  onToggleMobileView: () => void;
  onOpenDeliverables: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMuted,
  onToggleMute,
  isMobileView,
  onToggleMobileView,
  onOpenDeliverables,
  onReset,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              playClickSound();
              onReset();
            }}
            className="flex items-center gap-2 group text-left cursor-pointer"
            title="Simülasyonu Başa Al"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-primer font-bold text-slate-100 tracking-wide text-sm sm:text-base">
                  SE PRIMER
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                  YZM301
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                Yazılım Mühendisliği İnteraktif Kriz Simülasyonu
              </p>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Documentation & Files Button (No score text) */}
          <button
            onClick={() => {
              playClickSound();
              onOpenDeliverables();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 text-xs font-medium transition-all shadow-sm shadow-indigo-950/40 cursor-pointer"
            data-testid="deliverables-btn"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Teknik Raporlar & Belgeler</span>
            <span className="md:hidden">Belgeler</span>
          </button>

          {/* Reset button */}
          <button
            onClick={() => {
              playClickSound();
              onReset();
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700/60 text-xs transition-colors cursor-pointer"
            title="Yeniden Başlat"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">Sıfırla</span>
          </button>

          {/* Device simulator toggle (desktop only) */}
          <button
            onClick={() => {
              playClickSound();
              onToggleMobileView();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-xs transition-colors cursor-pointer"
            title={isMobileView ? "Masaüstü Görünümüne Geç" : "Mobil Telefon Görünümüne Geç"}
          >
            {isMobileView ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px]">Geniş Ekran</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px]">Mobil Görünüm</span>
              </>
            )}
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => {
              onToggleMute();
              playClickSound();
            }}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors cursor-pointer"
            title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
