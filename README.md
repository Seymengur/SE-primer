# SE Primer · Yazılım Mühendisliği İnteraktif Kriz Simülasyonu
**Ders:** YZM301 Yazılım Mühendisliği  
**Proje:** 1. Hafta — SE Primer  
**Canlı Uygulama:**https://ai.studio/apps/93f2bbb4-a9b3-4c1b-bcf7-0d268622c331  
**Kaynak:** Neal Stephenson, *The Diamond Age: Or, A Young Lady's Illustrated Primer* & Google Stitch

---

## 🚀 Proje Hakkında
SE Primer, yazılım mühendisliği öğrencilerine kritik üretim krizlerinde karar alma ve teknik sonuçlarını deneyimleme fırsatı sunan mobil öncelikli bir simülasyon ve Sokratik AI rehberidir.

Pazartesi sabahı 08:00'da randevu sistemi çökmüş, veznelerde 300 hasta beklerken nöbetçi mühendis 3 aşamalı karar döngüsüne girer:
1. **Mimari:** Eski sürüme geri dön (Rollback) vs. Canlıda yama yap (Hotfix)
2. **Test:** Kısa duman testi koş (4 dk) vs. Doğrudan yayına al
3. **KVKK:** Logları maskele/sanitize et vs. Ekibe olduğu gibi at

Her kararın ardından **"Ne oldu? Neden oldu?"** derinlemesine teknik analizi sunulur.

---

## 🎯 Ürün Kararları: Bilinçli Olarak Yapılmayan 3 Özellik ve Nedenleri

1. **Kullanıcı Hesabı ve Oturum Açma (Authentication) Özelliği Yapılmadı:**  
   *Çünkü simülasyonun derste veya mobil cihazlarda sıfır sürtünmeyle (frictionless) 3-5 dakika içinde hemen başlatılıp tamamlanması ve öğrencilerin şifre/e-posta gibi bariyerlere takılmaması hedeflenmiştir.*

2. **İkinci Bölüm / Çoklu Departman ve Dallanma Senaryoları Yapılmadı:**  
   *Çünkü ilk haftanın temel pedagojik hedefi, karmaşık bir oyun ağacı yerine tek ve hayati bir sağlık krizinde mimari, test ve KVKK üçgenindeki neden-sonuç illiyet bağını en yalın ve sarsıcı biçimde zihne yerleştirmektir.*

3. **Gerçek Hasta Veritabanı ve Medula Entegrasyonu Yapılmadı:**  
   *Çünkü 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca eğitim ortamlarında gerçek hasta verisi kullanımı hukuki suç teşkil ettiğinden, veri sızıntısı riskini sıfıra indirmek amacıyla tamamen sentetik ve kurgusal log verileri tercih edilmiştir.*

---

## 📁 Teknik Dokümantasyon Dosyaları
Bu depoda proje mimarisi için hazırlanan tüm teknik belgeler eksiksiz yer almaktadır:
* **[spec.md](./spec.md)**: Problem tanımı, kapsam dışı listesi, 5 kabul örneği (Given-When-Then), durum makinesi ve akış şeması.
* **[DESIGN.md](./DESIGN.md)**: Google Stitch tasarım ilkeleri, 3 mobil ekran spesifikasyonu, renk ve tipografi rehberi.
* **Çalışan Uygulama (AI Studio)**: Telefonda ve tarayıcıda baştan sona oynanabilen, kişiselleştirilebilir, sesli ve zaman baskılı kriz simülasyonu.
* **[EVAL.md](./EVAL.md)**: Sokratik Tutor için 20 öğrenci sorusu değerlendirme analizi, hata türü taksonomisi ve %0 cevap sızdırma doğrulaması.
* **[cypress/e2e/se_primer.cy.ts](./cypress/e2e/se_primer.cy.ts)**: Tüm yolları uçtan uca doğrulayan Cypress E2E test paketi.
* **[README.md](./README.md)**: Yapılmayan 3 özellik ve tek cümlelik ürün gerekçeleri.

---

## 🛠️ Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (Port 3000)
npm run dev

# E2E Cypress testlerini çalıştır
npx cypress run
```
