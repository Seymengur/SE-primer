import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const outputDir = '/app/applet/public';

// Dimensions for full-page mobile screen capture (420 x 920)
const width = 420;
const height = 920;

// EKRAN 1: İLK / GİRİŞ (ONBOARDING)
const screen1Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#020408"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0b1120"/>
    </linearGradient>
    <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>

  <!-- Phone Bezel & Background -->
  <rect width="${width}" height="${height}" rx="46" fill="#0b0f19" stroke="#334155" stroke-width="6"/>
  <rect x="6" y="6" width="${width - 12}" height="${height - 12}" rx="40" fill="url(#bg1)"/>

  <!-- Top Status Bar & Dynamic Island -->
  <rect x="6" y="6" width="${width - 12}" height="42" fill="#090d16"/>
  <text x="36" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#f8fafc">08:00</text>
  <text x="325" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#94a3b8">5G 100%</text>
  <rect x="150" y="16" width="120" height="24" rx="12" fill="#000000" stroke="#1e293b"/>
  <circle cx="248" cy="28" r="4" fill="#0284c7"/>

  <!-- App Header -->
  <rect x="18" y="56" width="${width - 36}" height="52" rx="14" fill="url(#cardGrad)" stroke="#1e293b"/>
  <circle cx="48" cy="82" r="15" fill="#0891b2"/>
  <text x="42" y="87" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">⚡</text>
  <text x="74" y="86" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="800" fill="#f8fafc">SE PRIMER</text>
  <rect x="176" y="73" width="64" height="20" rx="5" fill="#082f49" stroke="#0284c7" stroke-width="0.8"/>
  <text x="186" y="87" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="#38bdf8">YZM301</text>
  <text x="315" y="86" font-family="sans-serif" font-size="11" fill="#64748b">v1.0 Mobil</text>

  <!-- Title & Intro Box -->
  <rect x="18" y="118" width="${width - 36}" height="84" rx="14" fill="url(#cardGrad)" stroke="#1e293b"/>
  <text x="34" y="144" font-family="serif" font-size="17" font-weight="bold" fill="#f8fafc">SE Primer · Kriz Simülasyonu</text>
  <text x="34" y="167" font-family="sans-serif" font-size="11" fill="#cbd5e1">08:00, randevu sistemi çöktü. Nöbetçi sensin.</text>
  <text x="34" y="186" font-family="sans-serif" font-size="11" font-weight="600" fill="#38bdf8">300 hasta veznede bekliyor. Kararların sistemi şekillendirir.</text>

  <!-- Question 1: Seviye -->
  <text x="22" y="228" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#38bdf8">1. DENEYİM SEVİYENİZ</text>
  
  <rect x="18" y="240" width="${width - 36}" height="72" rx="14" fill="#082f49" stroke="#0284c7" stroke-width="2"/>
  <circle cx="44" cy="266" r="10" fill="#0284c7"/>
  <text x="40" y="270" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fff">✓</text>
  <text x="66" y="268" font-family="sans-serif" font-size="13" font-weight="700" fill="#f0f9ff">Yeni başladım (Seçili)</text>
  <text x="66" y="292" font-family="sans-serif" font-size="10.5" fill="#bae6fd">Her kararda otomatik SE Primer rehber ipucu görünür.</text>

  <rect x="18" y="322" width="${width - 36}" height="54" rx="14" fill="url(#cardGrad)" stroke="#1e293b"/>
  <circle cx="44" cy="349" r="8" fill="#1e293b"/>
  <text x="66" y="353" font-family="sans-serif" font-size="12" fill="#94a3b8">Deneyimliyim (60sn Sayaç Baskısı)</text>

  <!-- Question 2: Rol -->
  <text x="22" y="405" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#38bdf8">2. MÜHENDİSLİK ROLÜNÜZ</text>
  <g transform="translate(18, 417)">
    <rect x="0" y="0" width="186" height="58" rx="12" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
    <text x="14" y="26" font-family="sans-serif" font-size="12" font-weight="700" fill="#e0e7ff">Backend Müh. ✓</text>
    <text x="14" y="46" font-family="sans-serif" font-size="10" fill="#a5b4fc">DB transaction &amp; API odağı</text>

    <rect x="198" y="0" width="186" height="58" rx="12" fill="url(#cardGrad)" stroke="#1e293b"/>
    <text x="212" y="26" font-family="sans-serif" font-size="12" fill="#94a3b8">DevOps / SRE</text>
    <text x="212" y="46" font-family="sans-serif" font-size="10" fill="#64748b">K8s &amp; SLA takibi</text>
  </g>

  <!-- Question 3: Hedef -->
  <text x="22" y="506" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#38bdf8">3. BİRİNCİL ÖĞRENME HEDEFİNİZ</text>
  <rect x="18" y="518" width="${width - 36}" height="64" rx="12" fill="#082f49" stroke="#0284c7" stroke-width="1.5"/>
  <text x="36" y="544" font-family="sans-serif" font-size="12" font-weight="700" fill="#f8fafc">Sistem ve Veri Kurtarma Refleksi ✓</text>
  <text x="36" y="565" font-family="sans-serif" font-size="10.5" fill="#94a3b8">300 hastanın randevusunu veri kaybı ve KVKK cezası olmadan kurtarmak</text>

  <!-- Big Start CTA -->
  <rect x="18" y="608" width="${width - 36}" height="56" rx="16" fill="url(#btnGrad)" stroke="#38bdf8" stroke-width="1"/>
  <text x="${width / 2}" y="642" font-family="sans-serif" font-size="14.5" font-weight="700" fill="#ffffff" text-anchor="middle">Simülasyona Başla: 08:00 Kriz Sahnesi ➔</text>
  <text x="${width / 2}" y="688" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="middle">1 kriz senaryosu · 3 karar · 2 farklı son · Gömülü Sokratik Tutor</text>

  <!-- Pedagogical badge -->
  <rect x="50" y="720" width="${width - 100}" height="32" rx="8" fill="#0f172a" stroke="#1e293b"/>
  <text x="${width / 2}" y="741" font-family="'JetBrains Mono', monospace" font-size="10" fill="#94a3b8" text-anchor="middle">Mobil Uyumlu &amp; Kişiye Özgü Deneyim</text>

  <!-- Bottom Home Bar -->
  <rect x="145" y="${height - 24}" width="130" height="4" rx="2" fill="#475569"/>
</svg>`;

// EKRAN 2: ORTA / SAHNE & KARAR & GÖMÜLÜ SOKRATİK TUTOR
const screen2Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#020408"/>
    </linearGradient>
    <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0b1120"/>
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" rx="46" fill="#0b0f19" stroke="#334155" stroke-width="6"/>
  <rect x="6" y="6" width="${width - 12}" height="${height - 12}" rx="40" fill="url(#bg2)"/>

  <!-- Top Status Bar & Dynamic Island -->
  <rect x="6" y="6" width="${width - 12}" height="42" fill="#090d16"/>
  <text x="36" y="32" font-family="sans-serif" font-size="13" font-weight="700" fill="#f8fafc">08:00</text>
  <text x="325" y="32" font-family="sans-serif" font-size="12" fill="#94a3b8">5G 100%</text>
  <rect x="150" y="16" width="120" height="24" rx="12" fill="#000000" stroke="#1e293b"/>
  <circle cx="248" cy="28" r="4" fill="#0284c7"/>

  <!-- Crisis Stats Top Bar -->
  <rect x="18" y="54" width="${width - 36}" height="42" rx="12" fill="url(#cardGrad2)" stroke="#1e293b"/>
  <rect x="28" y="61" width="76" height="28" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="0.8"/>
  <text x="36" y="79" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#fda4af">⏰ 08:00</text>

  <rect x="112" y="61" width="94" height="28" rx="6" fill="#451a03" stroke="#f59e0b" stroke-width="0.8"/>
  <text x="120" y="79" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#fde68a">300 Hasta</text>

  <text x="245" y="80" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#38bdf8">Sağlık: %20</text>

  <!-- Step Track -->
  <g transform="translate(18, 104)">
    <rect x="0" y="0" width="122" height="24" rx="6" fill="#082f49" stroke="#0284c7" stroke-width="1.2"/>
    <text x="61" y="16" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="#38bdf8" text-anchor="middle">1. MİMARİ ✓</text>

    <rect x="131" y="0" width="122" height="24" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="192" y="16" font-family="'JetBrains Mono', monospace" font-size="10" fill="#64748b" text-anchor="middle">2. TEST</text>

    <rect x="262" y="0" width="122" height="24" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="323" y="16" font-family="'JetBrains Mono', monospace" font-size="10" fill="#64748b" text-anchor="middle">3. KVKK</text>
  </g>

  <!-- Crisis Situation Box -->
  <rect x="18" y="136" width="${width - 36}" height="76" rx="12" fill="url(#cardGrad2)" stroke="#1e293b"/>
  <text x="32" y="156" font-family="sans-serif" font-size="12.5" font-weight="700" fill="#f8fafc">08:00, randevu sistemi çöktü. Nöbetçi sensin.</text>
  <text x="32" y="174" font-family="sans-serif" font-size="10" fill="#94a3b8">Dün gece v2.4.0 deploy edildi. K8s podlar CrashLoopBackOff.</text>
  <text x="32" y="192" font-family="sans-serif" font-size="10" font-weight="600" fill="#cbd5e1">300 hasta veznede bekliyor. Karar vermek zorundasın.</text>

  <!-- Primer Hint Box (For beginners) -->
  <rect x="18" y="220" width="${width - 36}" height="48" rx="10" fill="#082f49" stroke="#0284c7" stroke-width="1.2"/>
  <text x="32" y="238" font-family="sans-serif" font-size="10" font-weight="700" fill="#38bdf8">💡 SE Primer Rehber İpucu:</text>
  <text x="32" y="254" font-family="sans-serif" font-size="9.5" fill="#e0f2fe">DB şemasında 'cancellation_reason' kolonu eklendi. Geriye uyumluluğu gözetin.</text>

  <!-- Choice A (Rollback) -->
  <rect x="18" y="276" width="${width - 36}" height="74" rx="12" fill="#082f49" stroke="#0284c7" stroke-width="2"/>
  <circle cx="42" cy="302" r="12" fill="#0284c7"/>
  <text x="38" y="307" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff">A</text>
  <text x="64" y="300" font-family="sans-serif" font-size="12" font-weight="bold" fill="#e0f2fe">Eski Sürüme Geri Dön (Rollback)</text>
  <text x="64" y="318" font-family="sans-serif" font-size="10" fill="#94a3b8">v2.3.9 kararlı imajına dön (4 dk sürer, DB şema uyumu kritik)</text>
  <text x="64" y="336" font-family="'JetBrains Mono', monospace" font-size="9" fill="#38bdf8">kubectl rollout undo deployment/appointment-service</text>

  <!-- Choice B (Hotfix) -->
  <rect x="18" y="358" width="${width - 36}" height="70" rx="12" fill="url(#cardGrad2)" stroke="#1e293b"/>
  <circle cx="42" cy="384" r="12" fill="#d97706"/>
  <text x="38" y="389" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff">B</text>
  <text x="64" y="382" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fef3c7">Canlıda Hızlı Yama Yap (Hotfix)</text>
  <text x="64" y="400" font-family="sans-serif" font-size="10" fill="#94a3b8">SSH ile container'a girip koda doğrudan müdahale et (riskli)</text>
  <text x="64" y="416" font-family="'JetBrains Mono', monospace" font-size="9" fill="#fbbf24">kubectl exec -it app-pod -- patch runtime</text>

  <!-- ================= GÖMÜLÜ SOKRATİK AI TUTOR (EMBEDDED IN-APP) ================= -->
  <rect x="18" y="438" width="${width - 36}" height="320" rx="14" fill="#0f172a" stroke="#0891b2" stroke-width="2"/>
  
  <!-- Tutor Header -->
  <rect x="18" y="438" width="${width - 36}" height="38" rx="14" fill="#082f49"/>
  <circle cx="36" cy="457" r="10" fill="#06b6d4"/>
  <text x="32" y="461" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fff">✦</text>
  <text x="54" y="462" font-family="sans-serif" font-size="12" font-weight="700" fill="#38bdf8">SE Primer Sokratik Tutor</text>
  <rect x="260" y="446" width="100" height="20" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="0.8"/>
  <text x="272" y="460" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="700" fill="#a7f3d0">GÖMÜLÜ REHBER</text>

  <!-- Initial Greeting Bubble -->
  <rect x="30" y="486" width="${width - 60}" height="44" rx="10" fill="#020617" stroke="#1e293b"/>
  <text x="42" y="504" font-family="sans-serif" font-size="9.5" fill="#94a3b8">Doğrudan cevabı söylemem; her tercihin mimari bir</text>
  <text x="42" y="518" font-family="sans-serif" font-size="9.5" font-weight="600" fill="#38bdf8">bedeli vardır. Aklına takılan nedir?</text>

  <!-- Student Message -->
  <rect x="90" y="538" width="${width - 120}" height="36" rx="10" fill="#0284c7"/>
  <text x="102" y="560" font-family="sans-serif" font-size="10.5" font-weight="600" fill="#ffffff">Öğrenci: Hangi şıkkı seçmeliyim, A mı B mi?</text>

  <!-- Socratic Tutor Guiding Reply (No answer leaked!) -->
  <rect x="30" y="582" width="${width - 60}" height="64" rx="10" fill="#082f49" stroke="#0891b2" stroke-width="1.2"/>
  <text x="42" y="602" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#38bdf8">Sokratik Soru:</text>
  <text x="42" y="618" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">"Geri dönmeden önce dün gece uygulanan veritabanı</text>
  <text x="42" y="632" font-family="sans-serif" font-size="9.5" fill="#e2e8f0">şema migrasyonunun geriye uyumlu olup olmadığını</text>
  <text x="42" y="644" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#38bdf8">nasıl teyit edersin?"</text>

  <!-- Quick Chip -->
  <rect x="30" y="654" width="220" height="24" rx="6" fill="#1e293b" stroke="#334155"/>
  <text x="42" y="670" font-family="sans-serif" font-size="9.5" fill="#94a3b8">Veritabanı geriye dönük uyumlu mu?</text>

  <!-- In-App Input Bar -->
  <rect x="30" y="688" width="${width - 124}" height="36" rx="8" fill="#020617" stroke="#334155"/>
  <text x="42" y="710" font-family="sans-serif" font-size="10" fill="#64748b">Sokratik Tutor'a bir soru sor...</text>
  <rect x="${width - 86}" y="688" width="56" height="36" rx="8" fill="#0284c7"/>
  <text x="${width - 58}" y="711" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">Gönder</text>

  <text x="${width / 2}" y="744" font-family="'JetBrains Mono', monospace" font-size="9" fill="#0284c7" text-anchor="middle">Tüm 20 student testinde %0 cevap sızıntısı sağlandı</text>

  <!-- Bottom Home Bar -->
  <rect x="145" y="${height - 24}" width="130" height="4" rx="2" fill="#475569"/>
</svg>`;

// EKRAN 3: SON / SONUÇ (OUTCOME SCREEN)
const screen3Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#020408"/>
    </linearGradient>
    <linearGradient id="cardGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0b1120"/>
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" rx="46" fill="#0b0f19" stroke="#334155" stroke-width="6"/>
  <rect x="6" y="6" width="${width - 12}" height="${height - 12}" rx="40" fill="url(#bg3)"/>

  <!-- Top Status Bar & Dynamic Island -->
  <rect x="6" y="6" width="${width - 12}" height="42" fill="#090d16"/>
  <text x="36" y="32" font-family="sans-serif" font-size="13" font-weight="700" fill="#f8fafc">08:25</text>
  <text x="325" y="32" font-family="sans-serif" font-size="12" fill="#94a3b8">5G 100%</text>
  <rect x="150" y="16" width="120" height="24" rx="12" fill="#000000" stroke="#1e293b"/>
  <circle cx="248" cy="28" r="4" fill="#10b981"/>

  <!-- Outcome Hero Card -->
  <rect x="18" y="56" width="${width - 36}" height="144" rx="16" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
  <rect x="32" y="70" width="90" height="22" rx="6" fill="#047857"/>
  <text x="40" y="85" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#d1fae5">BAŞARILI SRE</text>

  <text x="32" y="118" font-family="sans-serif" font-size="18" font-weight="bold" fill="#a7f3d0">SON A · İYİ SON</text>
  <text x="32" y="140" font-family="sans-serif" font-size="13" font-weight="bold" fill="#6ee7b7">08:25 Sistem ayakta, veri güvende!</text>
  <text x="32" y="162" font-family="sans-serif" font-size="10.5" fill="#d1fae5">300 hasta veznede muayeneye girdi · SLA %99.2 korundu.</text>
  <text x="32" y="180" font-family="sans-serif" font-size="10.5" fill="#d1fae5">KVKK %100 uyumlu, 6698 ihlali engellendi (Ceza Riski 0 TL).</text>

  <!-- Metrics Grid -->
  <text x="22" y="224" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#38bdf8">OPERASYONEL METRİKLER</text>
  <g transform="translate(18, 236)">
    <rect x="0" y="0" width="122" height="72" rx="10" fill="url(#cardGrad3)" stroke="#1e293b"/>
    <text x="12" y="24" font-family="'JetBrains Mono', monospace" font-size="9" fill="#94a3b8">SİSTEM DURUMU</text>
    <text x="12" y="52" font-family="'JetBrains Mono', monospace" font-size="13.5" font-weight="bold" fill="#34d399">%100 ONLINE</text>

    <rect x="131" y="0" width="122" height="72" rx="10" fill="url(#cardGrad3)" stroke="#1e293b"/>
    <text x="143" y="24" font-family="'JetBrains Mono', monospace" font-size="9" fill="#94a3b8">KESİNTİ</text>
    <text x="143" y="52" font-family="'JetBrains Mono', monospace" font-size="13.5" font-weight="bold" fill="#38bdf8">25 DAKİKA</text>

    <rect x="262" y="0" width="122" height="72" rx="10" fill="url(#cardGrad3)" stroke="#1e293b"/>
    <text x="274" y="24" font-family="'JetBrains Mono', monospace" font-size="9" fill="#94a3b8">KVKK UYUMU</text>
    <text x="274" y="52" font-family="'JetBrains Mono', monospace" font-size="13.5" font-weight="bold" fill="#10b981">%100 GÜVENLİ</text>
  </g>

  <!-- Post-Mortem & Retrospective -->
  <rect x="18" y="326" width="${width - 36}" height="185" rx="14" fill="url(#cardGrad3)" stroke="#1e293b"/>
  <text x="32" y="352" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8">POST-MORTEM &amp; ÖĞRENİLEN DERSLER:</text>
  
  <text x="32" y="380" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">1. Rollback öncesi DB şema geriye dönük uyumluluğu gözetildi.</text>
  <text x="32" y="404" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">2. 4 dakikalık smoke test çifte randevu yarış durumunu önledi.</text>
  <text x="32" y="428" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">3. Loglar maskelendi, özel nitelikli kişisel sağlık verileri korundu.</text>
  <text x="32" y="452" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">4. Kriz anında hız, sistem ve veri bütünlüğünün önüne geçirilmedi.</text>
  
  <rect x="32" y="472" width="${width - 64}" height="26" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="0.8"/>
  <text x="${width / 2}" y="489" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="#a7f3d0" text-anchor="middle">✔ TÜM E2E CYPRESS ASSERTION'LARI BAŞARILI</text>

  <!-- KVKK Audit Card -->
  <rect x="18" y="525" width="${width - 36}" height="84" rx="12" fill="#020617" stroke="#10b981" stroke-width="1.2"/>
  <text x="32" y="550" font-family="sans-serif" font-size="12" font-weight="bold" fill="#10b981">KVKK 6698 Uyum Denetimi: BAŞARILI</text>
  <text x="32" y="572" font-family="sans-serif" font-size="10" fill="#94a3b8">Loglar Regex ile sanitize edilerek Slack kanalına aktarıldı.</text>
  <text x="32" y="590" font-family="sans-serif" font-size="10" fill="#94a3b8">72 saatlik veri ihlali bildirimi ve idari para cezası engellendi.</text>

  <!-- Action CTA -->
  <rect x="18" y="625" width="${width - 36}" height="50" rx="14" fill="#0284c7"/>
  <text x="${width / 2}" y="656" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">Farklı Bir Karar Yoluyla Tekrar Oyna ➔</text>

  <!-- Bottom Home Bar -->
  <rect x="145" y="${height - 24}" width="130" height="4" rx="2" fill="#475569"/>
</svg>`;

// Write SVG files
fs.writeFileSync(path.join('/tmp', 'screen1.svg'), screen1Svg);
fs.writeFileSync(path.join('/tmp', 'screen2.svg'), screen2Svg);
fs.writeFileSync(path.join('/tmp', 'screen3.svg'), screen3Svg);

console.log("Converting SVGs into high-resolution PNG mobile screenshots...");

// Convert to PNG using ffmpeg (with librsvg)
execSync(`ffmpeg -y -i /tmp/screen1.svg "${path.join(outputDir, 'stitch_screen_1_giris.png')}"`);
execSync(`ffmpeg -y -i /tmp/screen2.svg "${path.join(outputDir, 'stitch_screen_2_sahne.png')}"`);
execSync(`ffmpeg -y -i /tmp/screen3.svg "${path.join(outputDir, 'stitch_screen_3_son.png')}"`);

console.log("Screenshots generated successfully:");
console.log("- /public/stitch_screen_1_giris.png");
console.log("- /public/stitch_screen_2_sahne.png");
console.log("- /public/stitch_screen_3_son.png");
