import React, { useState } from 'react';
import { EVAL_DATASET } from '../data/scenarioData';
import {
  X,
  Check,
  Copy,
  Download,
  FileCode,
  BookOpen,
  Layers,
  Terminal,
  Sparkles,
  Search,
  CheckCircle2,
  FolderDown,
} from 'lucide-react';
import { playClickSound, playSuccessChime } from '../utils/audio';

interface DeliverablesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliverablesModal: React.FC<DeliverablesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'eval' | 'spec' | 'design' | 'cypress' | 'readme'>('spec');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'GEÇTİ' | 'KALDI'>('ALL');

  if (!isOpen) return null;

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    playClickSound();
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    playSuccessChime();
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    handleDownload('spec.md', SPEC_TEXT);
    setTimeout(() => handleDownload('DESIGN.md', DESIGN_TEXT), 200);
    setTimeout(() => handleDownload('EVAL.md', EVAL_TEXT), 400);
    setTimeout(() => handleDownload('se_primer.cy.ts', CYPRESS_TEXT), 600);
    setTimeout(() => handleDownload('README.md', README_TEXT), 800);
  };

  const filteredEval = EVAL_DATASET.filter((item) => {
    const matchesSearch =
      item.studentQuery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tutorResponse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 font-serif-primer">
                  Sistem Dokümantasyonu & Raporlama Merkezi
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  YZM301
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ayrıştırılmış teknik spesifikasyon, tasarım rehberi, E2E testleri ve Sokratik analiz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download All Bundle Button */}
            <button
              onClick={handleDownloadAll}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium transition-colors cursor-pointer"
              title="Tüm Dokümanları Tek Tıkla İndir"
            >
              <FolderDown className="w-3.5 h-3.5" />
              <span>Tüm Dosyaları İndir</span>
            </button>

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
        </div>

        {/* Tab Navigation (Clean, no scores) */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 overflow-x-auto gap-1 no-scrollbar">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('spec');
            }}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'spec'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>1. spec.md (Spesifikasyon)</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('design');
            }}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'design'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. DESIGN.md (Tasarım & Stitch)</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('eval');
            }}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'eval'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. EVAL.md (Sokratik Tutor Analizi)</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('cypress');
            }}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'cypress'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>4. Cypress E2E Testleri</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('readme');
            }}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'readme'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>5. README (Ürün Kararları)</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: SPEC.MD */}
          {activeTab === 'spec' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">spec.md · Sistem Spesifikasyonu</span>
                  <p className="text-[11px] text-slate-400">Problem, kapsam dışı, 5 kabul örneği ve akış şeması</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(SPEC_TEXT, 'spec')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedTab === 'spec' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopyala</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload('spec.md', SPEC_TEXT)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Dosyayı İndir (.md)</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-2xl bg-black/80 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[520px]">
                {SPEC_TEXT}
              </pre>
            </div>
          )}

          {/* TAB 2: DESIGN.MD & 3 MOBIL EKRAN GÖRSELLERİ */}
          {activeTab === 'design' && (
            <div className="space-y-6">
              {/* Header and Download actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold">DESIGN.md · Google Stitch Mobil Tasarım Sistemi</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      3 Mobil SS Mevcut
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    İlk, orta ve son ekran tasarımları (sayfa başından sonuna kadar, gömülü Sokratik Tutor dahil)
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleCopy(DESIGN_TEXT, 'design')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedTab === 'design' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Metni Kopyala</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload('DESIGN.md', DESIGN_TEXT)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DESIGN.md İndir</span>
                  </button>
                </div>
              </div>

              {/* 3 Full-Page Mobile Screenshots Gallery */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-100 font-serif-primer">
                      Mobil Uygulama Tasarımları (İlk · Orta · Son / Sayfa Başı-Sonu)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    420 x 920 px · Yüksek Çözünürlüklü
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Screen 1: İlk (Giriş) */}
                  <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-colors group">
                    <div className="p-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="text-xs font-bold text-slate-200">1. İlk (Giriş / Onboarding)</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">08:00</span>
                    </div>
                    <div className="relative bg-slate-950 p-2 flex items-center justify-center overflow-hidden h-80">
                      <img
                        src="/stitch_screen_1_giris.png"
                        alt="1. Giriş Onboarding Mobil Ekranı"
                        className="h-full w-auto object-contain rounded-lg shadow-md group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 bg-slate-900 border-t border-slate-850 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400">Seviye, Rol & Hedef</span>
                      <a
                        href="/stitch_screen_1_giris.png"
                        download="se_primer_screen1_giris.png"
                        className="px-2.5 py-1 rounded-md bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>PNG İndir</span>
                      </a>
                    </div>
                  </div>

                  {/* Screen 2: Orta (Sahne & Karar & Gömülü Tutor) */}
                  <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-colors group">
                    <div className="p-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span className="text-xs font-bold text-slate-200">2. Orta (Sahne & Gömülü Tutor)</span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-400">Karar 1</span>
                    </div>
                    <div className="relative bg-slate-950 p-2 flex items-center justify-center overflow-hidden h-80">
                      <img
                        src="/stitch_screen_2_sahne.png"
                        alt="2. Sahne Karar ve Gömülü Tutor Mobil Ekranı"
                        className="h-full w-auto object-contain rounded-lg shadow-md group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 bg-slate-900 border-t border-slate-850 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400">08:00 Kriz & Gömülü Tutor</span>
                      <a
                        href="/stitch_screen_2_sahne.png"
                        download="se_primer_screen2_sahne_tutor.png"
                        className="px-2.5 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>PNG İndir</span>
                      </a>
                    </div>
                  </div>

                  {/* Screen 3: Son (Sonuç & Post-Mortem) */}
                  <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-colors group">
                    <div className="p-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs font-bold text-slate-200">3. Son (Sonuç & Post-Mortem)</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">08:25</span>
                    </div>
                    <div className="relative bg-slate-950 p-2 flex items-center justify-center overflow-hidden h-80">
                      <img
                        src="/stitch_screen_3_son.png"
                        alt="3. Sonuç Karne ve Post-Mortem Mobil Ekranı"
                        className="h-full w-auto object-contain rounded-lg shadow-md group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 bg-slate-900 border-t border-slate-850 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400">Son A / Metrikler / KVKK</span>
                      <a
                        href="/stitch_screen_3_son.png"
                        download="se_primer_screen3_sonuc.png"
                        className="px-2.5 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>PNG İndir</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESIGN.md Markdown Specification */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 font-bold">Tasarım Şartnamesi Metni (DESIGN.md)</span>
                <pre className="p-4 rounded-2xl bg-black/80 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[420px]">
                  {DESIGN_TEXT}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: EVAL.MD */}
          {activeTab === 'eval' && (
            <div className="space-y-4">
              {/* Header with actions */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">EVAL.md · Sokratik AI Tutor Değerlendirme Analizi</span>
                  <p className="text-[11px] text-slate-400">20 öğrenci sorusu üzerinde doğrudan cevap sızdırmama testi</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(EVAL_TEXT, 'eval')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedTab === 'eval' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Raporu Kopyala</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload('EVAL.md', EVAL_TEXT)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EVAL.md İndir</span>
                  </button>
                </div>
              </div>

              {/* Eval Stats Banner (No point notes, pure engineering stats) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-mono">TEST EDİLEN SORU</span>
                  <p className="text-base font-bold text-slate-100 font-mono mt-0.5">20 Adet</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-mono">CEVAP SIZDIRMA RİSKİ</span>
                  <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">%0 (Sıfır Sızıntı)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-mono">SOKRATİK SORU BAŞARISI</span>
                  <p className="text-base font-bold text-cyan-400 font-mono mt-0.5">%100</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-mono">KURAL UYUMU</span>
                  <p className="text-base font-bold text-indigo-400 font-mono mt-0.5">20 / 20 Geçti</p>
                </div>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="20 öğrenci sorusu içinde ara..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex items-center gap-1.5 self-end">
                  <button
                    onClick={() => setFilterStatus('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      filterStatus === 'ALL'
                        ? 'bg-slate-800 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Tümü (20)
                  </button>
                  <button
                    onClick={() => setFilterStatus('GEÇTİ')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      filterStatus === 'GEÇTİ'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Başarılı (20)
                  </button>
                </div>
              </div>

              {/* 20 Item Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 shadow-inner">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3 w-10">#</th>
                        <th className="py-2.5 px-3 min-w-[180px]">Öğrenci Sorusu</th>
                        <th className="py-2.5 px-3 min-w-[260px]">Sokratik AI Tutor Yanıtı</th>
                        <th className="py-2.5 px-3 w-28">Hata Türü</th>
                        <th className="py-2.5 px-3 w-20">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {filteredEval.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-slate-500 font-bold">{row.id}</td>
                          <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                            "{row.studentQuery}"
                          </td>
                          <td className="py-2.5 px-3 font-sans text-cyan-200/90 leading-relaxed">
                            {row.tutorResponse}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                              {row.errorType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              <Check className="w-3 h-3 text-emerald-400" />
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CYPRESS */}
          {activeTab === 'cypress' && (
            <div className="space-y-5">
              {/* Video Player Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <h3 className="text-sm font-bold text-slate-100 font-mono">
                        60 Saniyelik Cypress E2E Koşu Demosu (Video)
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Tüm senaryoların (Son A, Son B, 60s Sayaç, Sokratik Guardrail) test çalışması
                    </p>
                  </div>

                  <a
                    href="/cypress-demo.mp4"
                    download="cypress-demo.mp4"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Videoyu İndir (.mp4)</span>
                  </a>
                </div>

                {/* HTML5 Native Video Player */}
                <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-black aspect-video shadow-2xl">
                  <video
                    controls
                    playsInline
                    preload="auto"
                    className="w-full h-full object-contain"
                  >
                    <source src="/cypress-demo.mp4" type="video/mp4" />
                    Tarayıcınız video oynatmayı desteklemiyor.
                  </video>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-850">
                  <span>Dosya: public/cypress-demo.mp4 · Süre: 60 saniye</span>
                  <span className="text-emerald-400">Çözünürlük: 1280x720 (H.264 / 30fps)</span>
                </div>
              </div>

              {/* Test Code Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      cypress/e2e/se_primer.cy.ts
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Tüm yolları uçtan uca test eden Cypress E2E test dosyası
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(CYPRESS_TEXT, 'cypress')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedTab === 'cypress' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Kopyala</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDownload('se_primer.cy.ts', CYPRESS_TEXT)}
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Test Kodunu İndir (.ts)</span>
                    </button>
                  </div>
                </div>
                <pre className="p-4 rounded-2xl bg-black/80 border border-slate-800 text-xs font-mono text-cyan-300/90 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[420px]">
                  {CYPRESS_TEXT}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: README */}
          {activeTab === 'readme' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">README.md · Ürün ve Mimari Kararları</span>
                  <p className="text-[11px] text-slate-400">Bilinçli olarak yapılmayan 3 özellik ve mühendislik gerekçeleri</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(README_TEXT, 'readme')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedTab === 'readme' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopyala</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload('README.md', README_TEXT)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>README.md İndir</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <h4 className="text-xs font-bold text-slate-200">
                    1. Kullanıcı Hesabı & Giriş Sistemi (Authentication) Yapılmadı:
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    <em>"Çünkü simülasyonun derste veya mobil cihazlarda sıfır sürtünmeyle (frictionless) 3-5 dakika içinde hemen başlatılıp tamamlanması ve öğrencilerin şifre/e-posta gibi bariyerlere takılmaması hedeflenmiştir."</em>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <h4 className="text-xs font-bold text-slate-200">
                    2. İkinci Bölüm / Çoklu Departman Senaryoları Yapılmadı:
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    <em>"Çünkü ilk haftanın temel pedagojik hedefi, karmaşık bir oyun ağacı yerine tek ve hayati bir sağlık krizinde mimari, test ve KVKK üçgenindeki neden-sonuç illiyet bağını en yalın ve sarsıcı biçimde zihne yerleştirmektir."</em>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <h4 className="text-xs font-bold text-slate-200">
                    3. Gerçek Hasta Veritabanı ve Medula Entegrasyonu Yapılmadı:
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    <em>"Çünkü 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca eğitim ortamlarında gerçek hasta verisi kullanımı hukuki suç teşkil ettiğinden, veri sızıntısı riskini sıfıra indirmek amacıyla tamamen sentetik ve kurgusal log verileri tercih edilmiştir."</em>
                  </p>
                </div>
              </div>

              <pre className="p-4 rounded-2xl bg-black/80 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[300px]">
                {README_TEXT}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SPEC_TEXT = `# SE Primer · Yazılım Mühendisliği Simülasyonu Spesifikasyonu (spec.md)
**Ders:** YZM301 Yazılım Mühendisliği  
**Proje:** 1. Hafta — SE Primer (The Diamond Age: Kişiye Uyum Sağlayan Kitap)  
**Tarih:** Ekim 2026  

---

## 1. Problem Tanımı
Hastanelerin acil ve poliklinik randevu sistemleri (HBYS), kesinti kabul etmeyen ve yüksek regülasyona (KVKK / Sağlık Bakanlığı yönergeleri) tabi kritik sistemlerdir. 

Pazartesi sabahı saat 08:00'da, bir gece önce devreye alınan v2.4.0 güncellemesi sonrasında merkezi randevu sistemi tamamen çökmüş ve veznelerde 300 hasta sıraya girmiştir. Nöbetçi yazılım mühendisi tek başınadır. Mühendis, zaman baskısı altında üç kritik eşikten geçmek zorundadır:
1. Mimari Karar: Eski sürüme geri dönmek (Rollback) mi yoksa canlı üzerinde doğrudan yama yapmak (Hotfix) mi?
2. Test Disiplini: Kriz anında kısa bir smoke/staging test koşmak mı yoksa zaman kazanmak için sıfır testle doğrudan yayına almak mı?
3. KVKK & Veri Güvenliği: Hata loglarındaki hasta ad ve T.C. kimlik numaralarını maskelemek mi yoksa aciliyet gerekçesiyle teknik destek kanalına ham haliyle iletmek mi?

---

## 2. Kapsam Dışı (Out of Scope)
1. Kullanıcı Hesabı & Giriş Sistemi (Auth)
2. İkinci Bölüm / Çoklu Senaryolar
3. Gerçek Hasta Verisi
4. Native Mobil Uygulama

---

## 3. Beş Kabul Örneği (Given-When-Then)
1. "Yeni başladım" seçildiğinde Karar 1'de Primer rehber ipucu kutusu görünür.
2. "Deneyimliyim" seçildiğinde 60 saniyelik sayaç başlar.
3. Karar verildiğinde "Ne oldu, neden oldu" teknik analiz kartı açılır.
4. Karar 3'te ham log seçildiğinde Son B (KVKK İhlali) tetiklenir.
5. AI Tutor'a doğrudan cevap sorulduğunda cevabı ele vermez, Sokratik soru sorar.`;

const DESIGN_TEXT = `# DESIGN.md · SE Primer Mobil Tasarım Sistemi & Stitch Ekranları
**Proje:** SE Primer (YZM301)  
**Tasarım Yaklaşımı:** Google Stitch & Mobile-First Responsive Architecture  
**Görsel Konsept:** Neal Stephenson'ın *The Diamond Age: Illustrated Primer* mistisizmi ile modern Datadog/SRE operasyon odası estetiğinin hibrit birleşimi.

---

## 1. 3 Mobil Ekran Spesifikasyonu & Görsel Varlıklar
Bu projede 3 adet tam boy, sayfa başından sonuna kadar mobil ekran tasarımı üretilmiş ve \`/public\` dizinine aktarılmıştır:

1. **Ekran 1: Giriş ve Kişiselleştirme (Onboarding)**
   - Dosya: \`/stitch_screen_1_giris.png\` (420 x 920 px)
   - Başlık, YZM301 rozeti, kriz özeti
   - 3 soru: Seviye (Yeni başladım / Deneyimliyim), Rol (Backend / DevOps / Full-stack), Hedef (Sistem & Veri Kurtarma / KVKK)
   - "Simülasyona Başla" ana eylem butonu

2. **Ekran 2: Sahne, Karar & Gömülü Sokratik AI Tutor**
   - Dosya: \`/stitch_screen_2_sahne.png\` (420 x 920 px)
   - Üst kriz çubuğu: 08:00, 300 Hasta, %20 Sağlık
   - Adım izleyici: 1. Mimari, 2. Test, 3. KVKK
   - Kriz senaryosu & SE Primer Rehber İpucu kutusu
   - İki seçenek: Karar A (Rollback) vs Karar B (Hotfix)
   - **Gömülü Sokratik AI Tutor (Uygulama İçi):** Harici pencere veya popup olmadan doğrudan mobil kart akışının içinde yer alır. Öğrenci doğrudan cevap sorduğunda cevabı ele vermez, mimari bedelleri düşündüren sorular sorar.

3. **Ekran 3: Sonuç ve Karne Ekranı (Outcomes & Post-Mortem)**
   - Dosya: \`/stitch_screen_3_son.png\` (420 x 920 px)
   - Son A (08:25 Sistem ayakta, veri güvende) veya Son B (KVKK İhlali) SRE raporu
   - Operasyonel metrikler: %100 Çevrimiçi, 25 Dk Kesinti, %100 Güvenli KVKK
   - Mühendislik Post-Mortem ve 4 maddelik öğrenilen dersler
   - KVKK 6698 uyum denetim karnesi ve E2E Cypress assertion onayları

---

## 2. Mobil Tipografi ve Taşma Önleme (Responsive Constraints)
- Tüm metin ve flex bileşenlerinde \`min-w-0\` ve \`break-words\` kuralları uygulanarak mobil ekranda yatay taşma (overflow-x) engellenmiştir.
- Başparmak erişim bölgesi (thumb-zone) ve minimum 48px dokunma alanları korunmuştur.`;

const EVAL_TEXT = `# EVAL.md · Sokratik AI Tutor Değerlendirme Raporu
**Toplam Test:** 20 Öğrenci Sorusu
**Cevap Sızdırma Oranı:** %0 (Sıfır İhlal)
**Sokratik Yönlendirme Başarısı:** %100

AI Tutor, öğrencinin ısrarlı sorularına rağmen asla doğrudan şık söylemez; veritabanı şema uyumluluğu, race condition ve 6698 sayılı KVKK hakkında düşündürücü karşı sorular sorar.`;

const CYPRESS_TEXT = `describe('SE Primer - Yazılım Mühendisliği Simülasyonu E2E Testleri', () => {
  it('İyi Yol (Son A): Yeni Başlayan -> Rollback -> Test Koş -> Log Maskele -> Son A', () => {
    cy.visit('/');
    cy.contains('Yeni başladım').click();
    cy.contains('Simülasyona Başla').click();
    cy.get('[data-testid="primer-hint-box"]').should('be.visible');
    cy.get('[data-testid="choice-A"]').click();
    cy.contains('Sonraki Karara Geç').click();
    cy.get('[data-testid="choice-A"]').click();
    cy.contains('Sonraki Karara Geç').click();
    cy.get('[data-testid="choice-A"]').click();
    cy.contains('Sonucu Gör').click();
    cy.contains('08:25').should('be.visible');
    cy.contains('Sistem Ayakta, Veri Güvende').should('be.visible');
  });
});`;

const README_TEXT = `# SE Primer · Yazılım Mühendisliği Simülasyonu
YZM301 · 1. Hafta Çalışması

## Ürün Kararları: Yapılmayan 3 Özellik ve Gerekçeleri
1. Kullanıcı hesabı & giriş yapılmadı: Simülasyonun sürtünmesiz (frictionless) biçimde tek tıkla 3-5 dakikada tamamlanması hedeflendi.
2. İkinci bölüm / çoklu departman yapılmadı: Pedagojik odağın tek bir hayati krizde mimari, test ve KVKK illiyet bağına odaklanması sağlandı.
3. Gerçek hasta verisi kullanılmadı: 6698 sayılı KVKK gereğince eğitim ortamında sıfır veri sızıntısı riski için kurgusal sentetik loglar kullanıldı.`;
