# DESIGN.md · SE Primer Mobil Tasarım Sistemi & Stitch Ekranları
**Proje:** SE Primer (YZM301)  
**Tasarım Yaklaşımı:** Google Stitch & Mobile-First Responsive Architecture  
**Görsel Konsept:** Neal Stephenson'ın *The Diamond Age: Illustrated Primer* mistisizmi ile modern Datadog/SRE operasyon odası estetiğinin hibrit birleşimi.

---

## 1. 3 Mobil Ekran Spesifikasyonu & Görsel Varlıklar
Bu projede 3 adet tam boy, sayfa başından sonuna kadar mobil ekran tasarımı üretilmiş ve `/public` dizinine aktarılmıştır:

1. **Ekran 1: Giriş ve Kişiselleştirme (Onboarding Screen)**
   - **Görsel Dosyası:** `/public/stitch_screen_1_giris.png` (420 x 920 px)
   - Başlık, YZM301 rozeti, kriz özeti ("08:00, randevu sistemi çöktü. Nöbetçi sensin. 300 hasta bekliyor.")
   - 3 soru: 
     - 1. Seviye: *Yeni başladım (Rehber İpucu desteği)* vs *Deneyimliyim (60sn Sayaç)*
     - 2. Rol: *Backend Müh.* vs *DevOps / SRE*
     - 3. Hedef: *Sistem ve Veri Kurtarma Refleksi*
   - "Simülasyona Başla" ana eylem butonu
   - Dinamik Ada, durum çubuğu ve Home Indicator

2. **Ekran 2: Sahne, Karar & Gömülü Sokratik AI Tutor**
   - **Görsel Dosyası:** `/public/stitch_screen_2_sahne.png` (420 x 920 px)
   - Üst kriz çubuğu: Saat 08:00, 300 Hasta, %20 Sağlık
   - Adım izleyici: 1. Mimari (Aktif) -> 2. Test -> 3. KVKK
   - Kriz senaryosu metni & SE Primer Rehber İpucu kutusu
   - İki kritik mühendislik tercihi:
     - **Karar A:** Eski Sürüme Geri Dön (Rollback) — `v2.3.9` kararlı imajına dön (4 dk)
     - **Karar B:** Canlıda Hızlı Yama Yap (Hotfix) — SSH ile container'a girip koda doğrudan müdahale et
   - **Gömülü Sokratik AI Tutor (Mobil Uygulama İçi):**
     - Harici pencere veya popup olmadan doğrudan mobil kart akışının içinde yer alır.
     - Karşılama mesajı: *"Doğrudan cevabı söylemem; her tercihin mimari bir bedeli vardır. Neyi sorguluyorsun?"*
     - Öğrenci sorusu: *"Hangi şıkkı seçmeliyim, A mı B mi?"*
     - Sokratik soru (Cevap sızdırmadan): *"Geri dönmeden önce dün gece uygulanan veritabanı şema migrasyonunun geriye uyumlu olup olmadığını nasıl teyit edersin?"*
     - Hızlı soru çipleri ve mobil mesajlaşma girdi alanı

3. **Ekran 3: Sonuç ve Karne Ekranı (Outcomes & Post-Mortem)**
   - **Görsel Dosyası:** `/public/stitch_screen_3_son.png` (420 x 920 px)
   - **Son A (İyi Son):** 08:25 Sistem ayakta, veri güvende! 300 hasta veznede muayeneye girdi, SLA %99.2 korundu.
   - **Operasyonel Metrikler:**
     - Sistem Durumu: `%100 ONLINE`
     - Kesinti Süresi: `25 Dakika`
     - KVKK Durumu: `%100 GÜVENLİ`
   - **Mühendislik Post-Mortem & Öğrenilen Dersler:**
     1. Rollback öncesi DB şema geriye dönük uyumluluğu gözetildi.
     2. 4 dakikalık smoke test çifte randevu yarış durumunu önledi.
     3. Loglar maskelendi, özel nitelikli kişisel sağlık verileri korundu.
     4. Kriz anında hız, sistem ve veri bütünlüğünün önüne geçirilmedi.
   - KVKK 6698 Uyum Denetimi kartı ve E2E Cypress assertion onayları
   - "Farklı Bir Karar Yoluyla Tekrar Oyna" aksiyon butonu

---

## 2. Renk Paleti ve Tipografi

### Renkler (CSS / Tailwind Değerleri):
* **Background Deep Navy:** `#090d16` (Kriz gecesi ve konsol derinliği)
* **Surface Slate:** `#0f172a` (Kart arka planları ve paneller)
* **Surface Highlight:** `#1e293b` (Seçili kartlar ve inputlar)
* **Accent Cyan / Teal:** `#06b6d4` & `#14b8a6` (Sokratik Tutor & Primer zekâsı)
* **Warning Amber:** `#f59e0b` (60 saniye süre baskısı & risk uyarıları)
* **Alert Crimson / Rose:** `#f43f5e` (Sistem çökmesi, KVKK ihlali & kriz)
* **Success Emerald:** `#10b981` (Son A, sistem kurtarma & veri güvenliği)
* **Text Primary:** `#f8fafc` (Yüksek kontrastlı okunabilirlik)
* **Text Muted:** `#94a3b8` (Teknik alt bilgiler & log metinleri)

### Tipografi:
* **Gövde Metinleri & UI:** `Plus Jakarta Sans` (Modern, nötr ve yüksek okunabilirlik)
* **Loglar, Metrikler & Kod:** `JetBrains Mono` (Terminal hissi ve monospaced hizalama)
* **Primer Başlıkları:** `Cinzel` (The Diamond Age romanındaki mistik Primer kitabına saygı duruşu)

---

## 3. Mobil Tipografi ve Taşma Önleme (Responsive Constraints)
- Tüm metin ve flex bileşenlerinde `min-w-0` ve `break-words` kuralları uygulanarak küçük mobil ekranlarda yatay taşma (`overflow-x`) tamamen engellenmiştir.
- Başparmak erişim bölgesi (thumb-zone) ve minimum 48px dokunma alanları korunmuştur.
