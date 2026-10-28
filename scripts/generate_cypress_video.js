import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const outputDir = '/tmp/cypress_mobile_frames';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 60-Second Detailed Step Timeline
const stepsTimeline = [
  // ADIM 1: 0 - 12s -> Onboarding & Kişiselleştirme
  {
    secStart: 0,
    secEnd: 12,
    stepNum: "1 / 5",
    stepTitle: "GİRİŞ & KİŞİSELLEŞTİRME",
    stepDesc: "Öğrenci profili seçimi: 'Yeni başladım' (İpucu desteği), Backend Mühendisi, Sistem Kurtarma.",
    cypressCmd: "cy.visit('/')\ncy.contains('Yeni başladım').click()\ncy.contains('Simülasyona Başla').click()",
    assertion: "assert: expected level === 'beginner' & hint-box enabled",
    activeScreen: "mobile_onboarding",
    tapTarget: { x: 830, y: 310, label: "👆 'Yeni başladım' Seçildi" },
  },
  // ADIM 2: 12 - 24s -> 08:00 Kriz & Karar 1 (Mimari Rollback)
  {
    secStart: 12,
    secEnd: 24,
    stepNum: "2 / 5",
    stepTitle: "08:00 KRİZİ & KARAR 1 (MİMARİ)",
    stepDesc: "Randevu sistemi çöktü, 300 hasta veznede. Primer İpucu: DB şema uyumsuzluğuna dikkat!",
    cypressCmd: "cy.get('[data-testid=\"primer-hint-box\"]').should('be.visible')\ncy.get('[data-testid=\"choice-A\"]').click()",
    assertion: "assert: expected <div#primer-hint-box> to be visible\nassert: Rollback v2.3.9 triggered",
    activeScreen: "mobile_crisis_decision1",
    tapTarget: { x: 830, y: 405, label: "👆 Seçim A: Rollback v2.3.9" },
  },
  // ADIM 3: 24 - 36s -> Ne Oldu, Neden Oldu?
  {
    secStart: 24,
    secEnd: 36,
    stepNum: "3 / 5",
    stepTitle: "NEDENSELLİK (NE OLDU? NEDEN OLDU?)",
    stepDesc: "Teknik analiz: Nullable kolon sayesinde eski podlar 4 dakikada %85 kapasiteye ulaştı.",
    cypressCmd: "cy.contains('Ne Oldu?').should('be.visible')\ncy.contains('Neden Oldu?').should('be.visible')\ncy.contains('Sonraki Karara Geç').click()",
    assertion: "assert: expected consequence modal to show technical log",
    activeScreen: "mobile_consequence",
    tapTarget: { x: 830, y: 620, label: "👆 'Sonraki Karara Geç'" },
  },
  // ADIM 4: 36 - 48s -> Sokratik AI Tutor İncelemesi
  {
    secStart: 36,
    secEnd: 48,
    stepNum: "4 / 5",
    stepTitle: "SOKRATİK AI TUTOR DANIŞMANLIĞI",
    stepDesc: "Öğrenci doğrudan cevap sorar; Tutor cevabı asla söylemez, düşündürücü soru sorar.",
    cypressCmd: "cy.get('[data-testid=\"open-tutor-btn\"]').click()\ncy.get('[data-testid=\"tutor-input\"]').type('A mı B mi?')\ncy.should('not.contain', 'A şıkkını seç')",
    assertion: "assert: Tutor response does NOT leak direct choice\nassert: contains('?') === true (%0 Sızıntı)",
    activeScreen: "mobile_tutor",
    tapTarget: { x: 970, y: 615, label: "👆 Tutor FAB Butonu" },
  },
  // ADIM 5: 48 - 60s -> Karar 2, Karar 3 & Son A
  {
    secStart: 48,
    secEnd: 60,
    stepNum: "5 / 5",
    stepTitle: "SON A · SİSTEM VE VERİ GÜVENDE",
    stepDesc: "4 dk Smoke test + KVKK Maskeleme = 08:25 Sistem ayakta, 300 hasta muayenede, 0 TL ceza!",
    cypressCmd: "cy.get('[data-testid=\"choice-A\"]').click()\ncy.contains('08:25').should('be.visible')\ncy.contains('Sistem Ayakta, Veri Güvende').should('be.visible')",
    assertion: "assert: ALL 3 SPECS PASSED (100% SUCCESS)",
    activeScreen: "mobile_outcome_a",
    tapTarget: { x: 830, y: 640, label: "👆 Simülasyon Başarıyla Tamamlandı" },
  },
];

function getCurrentStep(sec) {
  for (const s of stepsTimeline) {
    if (sec >= s.secStart && sec < s.secEnd) {
      return s;
    }
  }
  return stepsTimeline[stepsTimeline.length - 1];
}

function generateSvgFrame(sec) {
  const step = getCurrentStep(sec);
  const progressPercent = Math.min(100, Math.round((sec / 60) * 100));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <defs>
      <linearGradient id="mainBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#050811"/>
        <stop offset="50%" stop-color="#0a1020"/>
        <stop offset="100%" stop-color="#03050a"/>
      </linearGradient>
      <linearGradient id="phoneBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#090d16"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    <!-- Canvas Background -->
    <rect width="1280" height="720" fill="url(#mainBg)"/>

    <!-- TOP HEADER BAR: Cypress & Assignment Info -->
    <rect x="0" y="0" width="1280" height="52" fill="#0b1120" stroke="#1e293b"/>
    <circle cx="28" cy="26" r="6" fill="#ef4444"/>
    <circle cx="48" cy="26" r="6" fill="#f59e0b"/>
    <circle cx="68" cy="26" r="6" fill="#10b981"/>

    <text x="96" y="32" font-family="monospace" font-size="14" font-weight="bold" fill="#00bf88">cypress</text>
    <text x="165" y="32" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f1f5f9">E2E MOBİL TEST KOŞUSU</text>
    <text x="360" y="32" font-family="monospace" font-size="12" fill="#38bdf8">YZM301 · SE Primer Mobil Simülasyon</text>

    <!-- Top Time Badge & Progress -->
    <rect x="980" y="14" width="270" height="24" rx="6" fill="#020617" stroke="#334155"/>
    <rect x="982" y="16" width="${(progressPercent / 100) * 266}" height="20" rx="4" fill="#06b6d4"/>
    <text x="880" y="31" font-family="monospace" font-size="13" font-weight="bold" fill="#38bdf8">00:${sec < 10 ? '0' + sec : sec} / 01:00</text>

    <!-- ================= LEFT PANEL: STEPS & CYPRESS CONSOLE (Width: 540) ================= -->
    <g transform="translate(32, 70)">
      <!-- Step Banner Card -->
      <rect x="0" y="0" width="540" height="110" rx="14" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
      <rect x="16" y="14" width="90" height="22" rx="6" fill="#0369a1"/>
      <text x="24" y="29" font-family="monospace" font-size="11" font-weight="bold" fill="#ffffff">ADIM ${step.stepNum}</text>
      <text x="120" y="30" font-family="sans-serif" font-size="15" font-weight="bold" fill="#f8fafc">${escapeXml(step.stepTitle)}</text>
      <text x="16" y="60" font-family="sans-serif" font-size="12" fill="#94a3b8">${escapeXml(step.stepDesc)}</text>
      <text x="16" y="85" font-family="monospace" font-size="11" fill="#38bdf8">📱 Mobil Görünüm Testi: iPhone 15 Pro Standart Viewport (390x844)</text>

      <!-- Step Timeline Dots (1 to 5) -->
      <g transform="translate(16, 125)">
        ${renderStepDots(step.stepNum)}
      </g>

      <!-- Cypress Execution Command Log -->
      <rect x="0" y="160" width="540" height="290" rx="12" fill="#030712" stroke="#1e293b"/>
      <rect x="0" y="160" width="540" height="34" rx="12" fill="#0f172a"/>
      <text x="16" y="182" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">CYPRESS TEST RUNNER · COMMAND LOG</text>
      <text x="460" y="182" font-family="monospace" font-size="11" fill="#10b981">PASSED</text>

      <g transform="translate(16, 210)">
        <text x="0" y="0" font-family="monospace" font-size="12" fill="#e2e8f0">&gt; ${escapeXml(step.cypressCmd.split('\n')[0] || '')}</text>
        ${step.cypressCmd.split('\n')[1] ? `<text x="0" y="24" font-family="monospace" font-size="12" fill="#e2e8f0">&gt; ${escapeXml(step.cypressCmd.split('\n')[1])}</text>` : ''}
        ${step.cypressCmd.split('\n')[2] ? `<text x="0" y="48" font-family="monospace" font-size="12" fill="#e2e8f0">&gt; ${escapeXml(step.cypressCmd.split('\n')[2])}</text>` : ''}

        <rect x="0" y="68" width="508" height="52" rx="6" fill="#0f172a" stroke="#059669"/>
        <text x="12" y="90" font-family="monospace" font-size="11" font-weight="bold" fill="#10b981">ASSERTION VERIFIED:</text>
        <text x="12" y="108" font-family="monospace" font-size="11" fill="#a7f3d0">${escapeXml(step.assertion.split('\n')[0] || '')}</text>

        <rect x="0" y="132" width="508" height="96" rx="6" fill="#020617" stroke="#1e293b"/>
        <text x="12" y="152" font-family="monospace" font-size="11" fill="#22c55e">✓ viewport(390, 844) [Mobile Preset Loaded]</text>
        <text x="12" y="172" font-family="monospace" font-size="11" fill="#22c55e">✓ touch start &amp; tap registered</text>
        <text x="12" y="192" font-family="monospace" font-size="11" fill="#38bdf8">ℹ State transition completed: ${escapeXml(step.activeScreen)}</text>
        <text x="12" y="212" font-family="monospace" font-size="11" fill="#facc15">★ 6698 KVKK &amp; SRE Refleksleri: UYUMLU</text>
      </g>

      <!-- Live SRE Health & KVKK Status Box -->
      <rect x="0" y="465" width="540" height="155" rx="12" fill="#0f172a" stroke="#1e293b"/>
      <text x="16" y="490" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">CANLI SRE &amp; HASTANE GÖZLEMLEBİLİRLİK (OBSERVABILITY)</text>
      
      <g transform="translate(16, 505)">
        <rect x="0" y="0" width="160" height="60" rx="8" fill="#020617" stroke="#334155"/>
        <text x="12" y="20" font-family="monospace" font-size="10" fill="#94a3b8">HASTANE SAATİ</text>
        <text x="12" y="46" font-family="monospace" font-size="16" font-weight="bold" fill="#fbbf24">${sec < 48 ? '08:00 - 08:15' : '08:25 (ÇÖZÜLDÜ)'}</text>

        <rect x="174" y="0" width="160" height="60" rx="8" fill="#020617" stroke="#334155"/>
        <text x="12" y="20" font-family="monospace" font-size="10" fill="#94a3b8">BEKLEYEN HASTA</text>
        <text x="12" y="46" font-family="monospace" font-size="16" font-weight="bold" fill="${sec < 48 ? '#f43f5e' : '#10b981'}">${sec < 48 ? '300 Hasta' : '0 (Tamamı Muayenede)'}</text>

        <rect x="348" y="0" width="160" height="60" rx="8" fill="#020617" stroke="#334155"/>
        <text x="12" y="20" font-family="monospace" font-size="10" fill="#94a3b8">KVKK UYUM DURUMU</text>
        <text x="12" y="46" font-family="monospace" font-size="15" font-weight="bold" fill="#10b981">%100 GÜVENLİ</text>

        <text x="0" y="90" font-family="sans-serif" font-size="11" fill="#64748b">Test Koşusu: cypress/e2e/se_primer.cy.ts · Headless Browser: Electron 118</text>
      </g>
    </g>

    <!-- ================= RIGHT PANEL: REALISTIC MOBILE PHONE VIEWPORT ================= -->
    <g transform="translate(670, 48)">
      <!-- Outer Phone Chassis with Curved Corners -->
      <rect x="0" y="0" width="370" height="655" rx="46" fill="#0b0f19" stroke="#334155" stroke-width="6"/>
      <rect x="4" y="4" width="362" height="647" rx="42" fill="#000000"/>

      <!-- Inner Mobile Screen (Width: 350, Height: 635) -->
      <g clip-path="url(#phoneScreenClip)">
        <clipPath id="phoneScreenClip">
          <rect x="10" y="10" width="350" height="635" rx="36"/>
        </clipPath>

        <rect x="10" y="10" width="350" height="635" rx="36" fill="#090d16"/>

        <!-- Top Mobile Status Bar -->
        <rect x="10" y="10" width="350" height="36" fill="#090d16"/>
        <text x="32" y="32" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">08:00</text>
        <text x="290" y="32" font-family="sans-serif" font-size="11" fill="#94a3b8">5G 100%</text>

        <!-- Dynamic Island Notch -->
        <rect x="135" y="16" width="100" height="22" rx="11" fill="#000000" stroke="#1e293b"/>
        <circle cx="218" cy="27" r="4" fill="#0284c7"/>

        <!-- Mobile App Content Area -->
        <g transform="translate(10, 44)">
          ${renderMobileScreen(step.activeScreen, sec)}
        </g>

        <!-- Mobile Bottom Home Bar -->
        <rect x="125" y="632" width="120" height="4" rx="2" fill="#475569"/>
      </g>

      <!-- Simulated Touch Ripple Effect at tapTarget -->
      <g transform="translate(${step.tapTarget.x - 670}, ${step.tapTarget.y - 48})">
        <circle cx="0" cy="0" r="18" fill="#06b6d4" opacity="0.35" filter="url(#glow)"/>
        <circle cx="0" cy="0" r="8" fill="#38bdf8"/>
        <!-- Touch Tooltip -->
        <rect x="-80" y="-36" width="160" height="24" rx="6" fill="#020617" stroke="#06b6d4"/>
        <text x="0" y="-20" font-family="sans-serif" font-size="10" font-weight="bold" fill="#38bdf8" text-anchor="middle">${escapeXml(step.tapTarget.label)}</text>
      </g>
    </g>
  </svg>`;
}

function renderStepDots(currentStepNum) {
  const activeIdx = parseInt(currentStepNum.split('/')[0]) - 1;
  const labels = ["Giriş", "Kriz 08:00", "Neden-Sonuç", "AI Tutor", "Son A"];

  return labels.map((lbl, idx) => {
    const isPast = idx < activeIdx;
    const isCurrent = idx === activeIdx;
    const color = isCurrent ? "#06b6d4" : isPast ? "#10b981" : "#334155";
    const x = idx * 105;

    return `
      <g transform="translate(${x}, 0)">
        <circle cx="10" cy="8" r="8" fill="${color}"/>
        <text x="7" y="12" font-family="sans-serif" font-size="10" font-weight="bold" fill="#000">${isPast ? '✓' : (idx + 1)}</text>
        <text x="24" y="12" font-family="sans-serif" font-size="11" font-weight="${isCurrent ? 'bold' : 'normal'}" fill="${isCurrent ? '#38bdf8' : '#94a3b8'}">${lbl}</text>
      </g>
    `;
  }).join('');
}

function renderMobileScreen(screenType, sec) {
  if (screenType === 'mobile_onboarding') {
    return `
      <!-- Mobile Header -->
      <rect x="0" y="0" width="350" height="46" fill="#0f172a" stroke="#1e293b"/>
      <text x="16" y="28" font-family="serif" font-size="14" font-weight="bold" fill="#f8fafc">SE PRIMER</text>
      <text x="100" y="28" font-family="monospace" font-size="10" fill="#38bdf8">YZM301</text>
      <text x="270" y="28" font-family="sans-serif" font-size="10" fill="#94a3b8">1. Hafta</text>

      <!-- Question 1: Seviye -->
      <text x="16" y="70" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">1. DENEYİM SEVİYENİZ</text>
      
      <!-- Selected Card: Yeni Başladım -->
      <rect x="16" y="85" width="318" height="62" rx="10" fill="#082f49" stroke="#0284c7" stroke-width="2"/>
      <circle cx="36" cy="116" r="9" fill="#0284c7"/>
      <text x="33" y="120" font-family="sans-serif" font-size="10" font-weight="bold" fill="#fff">✓</text>
      <text x="56" y="108" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f0f9ff">Yeni başladım</text>
      <text x="56" y="128" font-family="sans-serif" font-size="10" fill="#bae6fd">Her kararda otomatik Primer rehber ipucu görürsün.</text>

      <!-- Option 2: Deneyimliyim -->
      <rect x="16" y="155" width="318" height="45" rx="10" fill="#0f172a" stroke="#1e293b"/>
      <circle cx="36" cy="177" r="8" fill="#1e293b"/>
      <text x="56" y="181" font-family="sans-serif" font-size="11" fill="#94a3b8">Deneyimliyim (60sn Süre Baskısı)</text>

      <!-- Question 2: Rol -->
      <text x="16" y="225" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">2. MÜHENDİSLİK ROLÜNÜZ</text>
      <rect x="16" y="240" width="154" height="44" rx="8" fill="#1e1b4b" stroke="#6366f1"/>
      <text x="28" y="266" font-family="sans-serif" font-size="11" font-weight="bold" fill="#e0e7ff">Backend Müh. ✓</text>

      <rect x="180" y="240" width="154" height="44" rx="8" fill="#0f172a" stroke="#1e293b"/>
      <text x="195" y="266" font-family="sans-serif" font-size="11" fill="#94a3b8">DevOps / SRE</text>

      <!-- Question 3: Hedef -->
      <text x="16" y="310" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">3. ÖĞRENME HEDEFİNİZ</text>
      <rect x="16" y="325" width="318" height="45" rx="8" fill="#0f172a" stroke="#1e293b"/>
      <text x="28" y="352" font-family="sans-serif" font-size="11" fill="#e2e8f0">Sistem ve Veri Kurtarma Refleksi ✓</text>

      <!-- Big CTA Button -->
      <rect x="16" y="395" width="318" height="50" rx="12" fill="#0284c7"/>
      <text x="175" y="426" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">Simülasyona Başla: 08:00 Kriz Sahnesi ➔</text>
    `;
  } else if (screenType === 'mobile_crisis_decision1') {
    return `
      <!-- Mobile Crisis Top Bar -->
      <rect x="0" y="0" width="350" height="50" fill="#0f172a" stroke="#1e293b"/>
      <rect x="12" y="12" width="70" height="24" rx="6" fill="#4c0519" stroke="#f43f5e"/>
      <text x="20" y="28" font-family="monospace" font-size="11" font-weight="bold" fill="#fda4af">⏰ 08:00</text>
      <rect x="90" y="12" width="90" height="24" rx="6" fill="#451a03" stroke="#f59e0b"/>
      <text x="98" y="28" font-family="monospace" font-size="11" font-weight="bold" fill="#fde68a">300 Hasta</text>
      <text x="245" y="28" font-family="monospace" font-size="11" fill="#38bdf8">KARAR 1 / 3</text>

      <!-- Scenario Box -->
      <rect x="16" y="60" width="318" height="95" rx="10" fill="#0f172a" stroke="#1e293b"/>
      <text x="28" y="82" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">Randevu Sistemi Çöktü!</text>
      <text x="28" y="104" font-family="sans-serif" font-size="10" fill="#cbd5e1">Dün gece yeni sürüm v2.4.0 deploy edildi.</text>
      <text x="28" y="124" font-family="sans-serif" font-size="10" fill="#cbd5e1">300 hasta veznede ve poliklinik önünde bekliyor.</text>

      <!-- Primer Guidance Box (Kabul Kriteri 1 - Otomatik İpucu) -->
      <rect x="16" y="165" width="318" height="60" rx="8" fill="#082f49" stroke="#0284c7"/>
      <text x="28" y="185" font-family="sans-serif" font-size="10" font-weight="bold" fill="#38bdf8">💡 SE Primer Rehber İpucu:</text>
      <text x="28" y="205" font-family="sans-serif" font-size="9" fill="#e0f2fe">DB şemasında 'cancellation_reason' kolonu var.</text>
      <text x="28" y="218" font-family="sans-serif" font-size="9" fill="#e0f2fe">Geri dönmeden önce geriye dönük uyumluluğu gözetin.</text>

      <!-- Choice A: Rollback -->
      <rect x="16" y="235" width="318" height="90" rx="12" fill="#082f49" stroke="#0284c7" stroke-width="2"/>
      <circle cx="36" cy="265" r="12" fill="#0284c7"/>
      <text x="32" y="270" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff">A</text>
      <text x="58" y="260" font-family="sans-serif" font-size="12" font-weight="bold" fill="#e0f2fe">Eski Sürüme Geri Dön (Rollback)</text>
      <text x="58" y="280" font-family="sans-serif" font-size="10" fill="#94a3b8">v2.3.9 kararlı imajına dön (4 dk sürer).</text>
      <text x="58" y="300" font-family="monospace" font-size="9" fill="#38bdf8">kubectl rollout undo deployment/appointment-svc</text>

      <!-- Choice B: Hotfix -->
      <rect x="16" y="335" width="318" height="85" rx="12" fill="#0f172a" stroke="#1e293b"/>
      <circle cx="36" cy="365" r="12" fill="#d97706"/>
      <text x="32" y="370" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff">B</text>
      <text x="58" y="360" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fef3c7">Canlıda Yama Yap (Hotfix)</text>
      <text x="58" y="380" font-family="sans-serif" font-size="10" fill="#94a3b8">SSH ile container içine girip kodu doğrudan düzelt.</text>

      <!-- Floating Socratic Tutor Button -->
      <circle cx="300" cy="510" r="22" fill="#0284c7"/>
      <text x="300" y="515" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#fff">💬</text>
    `;
  } else if (screenType === 'mobile_consequence') {
    return `
      <!-- Consequence Bottom Drawer -->
      <rect x="0" y="0" width="350" height="40" fill="#0f172a"/>
      <text x="16" y="26" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">TEKNİK NEDENSELLİK ANALİZİ</text>

      <!-- Ne Oldu? -->
      <rect x="16" y="50" width="318" height="90" rx="10" fill="#020617" stroke="#059669"/>
      <text x="28" y="74" font-family="sans-serif" font-size="11" font-weight="bold" fill="#34d399">✓ Ne Oldu? (Gözlemlenen Durum)</text>
      <text x="28" y="96" font-family="sans-serif" font-size="10" fill="#e2e8f0">Eski sürüm v2.3.9 podları ayağa kalktı.</text>
      <text x="28" y="114" font-family="sans-serif" font-size="10" fill="#e2e8f0">Randevu servisi 4 dakikada %85 kapasiteye ulaştı.</text>

      <!-- Neden Oldu? -->
      <rect x="16" y="150" width="318" height="95" rx="10" fill="#020617" stroke="#3b82f6"/>
      <text x="28" y="174" font-family="sans-serif" font-size="11" font-weight="bold" fill="#60a5fa">ℹ Neden Oldu? (Mühendislik Kök Nedeni)</text>
      <text x="28" y="196" font-family="sans-serif" font-size="10" fill="#e2e8f0">Dün geceki migration nullable kolon eklemişti.</text>
      <text x="28" y="214" font-family="sans-serif" font-size="10" fill="#e2e8f0">Nullable olduğu için eski kod çökmedi, sistem kurtuldu.</text>

      <!-- Live Terminal Output -->
      <rect x="16" y="255" width="318" height="90" rx="8" fill="#000000" stroke="#1e293b"/>
      <text x="24" y="278" font-family="monospace" font-size="9" fill="#10b981">[08:06] INFO k8s: Rollback completed (4 pods up)</text>
      <text x="24" y="296" font-family="monospace" font-size="9" fill="#f59e0b">[08:06] WARN db: 'cancellation_reason' ignored</text>
      <text x="24" y="314" font-family="monospace" font-size="9" fill="#10b981">[08:07] INFO http: 200 OK rate 86.4%</text>

      <!-- Next Step Button -->
      <rect x="16" y="360" width="318" height="46" rx="10" fill="#0284c7"/>
      <text x="175" y="388" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">Sonraki Karara Geç: Karar 2 (Test) ➔</text>
    `;
  } else if (screenType === 'mobile_tutor') {
    return `
      <!-- Mobile Socratic Tutor Drawer -->
      <rect x="0" y="0" width="350" height="50" fill="#0f172a" stroke="#1e293b"/>
      <text x="16" y="28" font-family="sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">SE PRIMER SOKRATİK AI TUTOR</text>
      <text x="16" y="42" font-family="sans-serif" font-size="9" fill="#94a3b8">Cevabı söylemez, düşündürücü soru sorar</text>

      <!-- User Chat Bubble -->
      <rect x="70" y="65" width="264" height="48" rx="12" fill="#0284c7"/>
      <text x="85" y="92" font-family="sans-serif" font-size="11" fill="#ffffff">Öğrenci: Hangi şıkkı seçmeliyim, A mı B mi?</text>

      <!-- Tutor Response Bubble -->
      <rect x="16" y="125" width="290" height="85" rx="12" fill="#0f172a" stroke="#06b6d4"/>
      <text x="28" y="148" font-family="sans-serif" font-size="10" font-weight="bold" fill="#38bdf8">Tutor (Sokratik Rehber):</text>
      <text x="28" y="168" font-family="sans-serif" font-size="10" fill="#e2e8f0">"Geri dönmeden önce veritabanı şemasının</text>
      <text x="28" y="184" font-family="sans-serif" font-size="10" fill="#e2e8f0">değişip değişmediğini nasıl anlarsın?"</text>

      <!-- Socratic Guardrail Banner -->
      <rect x="16" y="225" width="318" height="95" rx="10" fill="#064e3b" stroke="#10b981"/>
      <text x="28" y="248" font-family="sans-serif" font-size="11" font-weight="bold" fill="#a7f3d0">GUARDRAIL DENETİM RAPORU:</text>
      <text x="28" y="270" font-family="monospace" font-size="10" fill="#6ee7b7">✓ Doğrudan Cevap Sızdırma: %0 (İHLAL YOK)</text>
      <text x="28" y="290" font-family="monospace" font-size="10" fill="#6ee7b7">✓ Sokratik Soru Üretme: %100 GEÇTİ</text>
      <text x="28" y="308" font-family="monospace" font-size="10" fill="#6ee7b7">✓ 20 Test Senaryosu: 20 / 20 Başarılı</text>

      <!-- Quick Action Input -->
      <rect x="16" y="335" width="318" height="40" rx="10" fill="#000" stroke="#334155"/>
      <text x="28" y="360" font-family="sans-serif" font-size="10" fill="#64748b">Tutor'a soru sor...</text>
    `;
  } else {
    // Son A (Outcome Good)
    return `
      <!-- Mobile Outcome Screen -->
      <rect x="16" y="15" width="318" height="95" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
      <text x="28" y="42" font-family="sans-serif" font-size="15" font-weight="bold" fill="#a7f3d0">SON A · İYİ SON</text>
      <text x="28" y="66" font-family="sans-serif" font-size="12" font-weight="bold" fill="#6ee7b7">08:25 Sistem ayakta, veri güvende!</text>
      <text x="28" y="88" font-family="sans-serif" font-size="9" fill="#d1fae5">Tüm 300 hasta muayeneye alındı · KVKK %100 Uyumlu</text>

      <!-- Metrics Grid -->
      <rect x="16" y="125" width="150" height="55" rx="8" fill="#0f172a" stroke="#1e293b"/>
      <text x="24" y="145" font-family="monospace" font-size="9" fill="#94a3b8">SİSTEM DURUMU</text>
      <text x="24" y="168" font-family="monospace" font-size="13" font-weight="bold" fill="#34d399">%100 ÇEVRİMİÇİ</text>

      <rect x="184" y="125" width="150" height="55" rx="8" fill="#0f172a" stroke="#1e293b"/>
      <text x="192" y="145" font-family="monospace" font-size="9" fill="#94a3b8">KVKK DURUMU</text>
      <text x="192" y="168" font-family="monospace" font-size="13" font-weight="bold" fill="#10b981">%100 GÜVENLİ</text>

      <!-- Post-Mortem Card -->
      <rect x="16" y="195" width="318" height="150" rx="10" fill="#0f172a" stroke="#1e293b"/>
      <text x="28" y="220" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">POST-MORTEM &amp; ÖĞRENİLEN DERSLER:</text>
      <text x="28" y="244" font-family="sans-serif" font-size="9" fill="#cbd5e1">1. Rollback öncesi DB nullable şeması gözetildi.</text>
      <text x="28" y="268" font-family="sans-serif" font-size="9" fill="#cbd5e1">2. 4 dk smoke test çifte randevu yarışını engelledi.</text>
      <text x="28" y="292" font-family="sans-serif" font-size="9" fill="#cbd5e1">3. Loglar maskelendi, hastaların mahremiyeti korundu.</text>
      <text x="28" y="320" font-family="monospace" font-size="9" font-weight="bold" fill="#10b981">✔ TÜM E2E CYPRESS TESTLERİ GEÇTİ</text>
    `;
  }
}

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

console.log("Generating 60 Mobile View frames with step indicators...");

for (let sec = 0; sec < 60; sec++) {
  const svg = generateSvgFrame(sec);
  const svgPath = path.join(outputDir, `frame_${String(sec).padStart(3, '0')}.svg`);
  fs.writeFileSync(svgPath, svg);
}

console.log("Encoding 60-second Mobile View video into /public/cypress-demo.mp4...");

const mp4Output = '/app/applet/public/cypress-demo.mp4';
execSync(
  `ffmpeg -y -framerate 1 -i "${outputDir}/frame_%03d.svg" -c:v libx264 -r 30 -pix_fmt yuv420p "${mp4Output}"`,
  { stdio: 'inherit' }
);

console.log(`Mobile Cypress video created successfully at ${mp4Output}!`);
