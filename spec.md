# SE Primer · Yazılım Mühendisliği Simülasyonu Spesifikasyonu (spec.md)
**Ders:** YZM301 Yazılım Mühendisliği  
**Ödev:** 1. Hafta — SE Primer (The Diamond Age: Kişiye Uyum Sağlayan Kitap)  
**Tarih:** Ekim 2026  
**Öğrenci:** Symngr555@gmail.com  

---

## 1. Problem Tanımı
Hastanelerin acil ve poliklinik randevu sistemleri (HBYS), kesinti kabul etmeyen ve yüksek regülasyona (KVKK / Sağlık Bakanlığı yönergeleri) tabi kritik sistemlerdir. 

Pazartesi sabahı saat **08:00**'da, bir gece önce devreye alınan v2.4.0 güncellemesi sonrasında merkezi randevu sistemi tamamen çökmüş ve veznelerde **300 hasta** sıraya girmiştir. Nöbetçi yazılım mühendisi tek başınadır. Mühendis, zaman baskısı altında üç kritik eşikten geçmek zorundadır:
1. **Mimari Karar:** Eski sürüme geri dönmek (Rollback) mi yoksa canlı üzerinde doğrudan yama yapmak (Hotfix) mi?
2. **Test Disiplini:** Kriz anında kısa bir smoke/staging test koşmak mı yoksa zaman kazanmak için sıfır testle doğrudan yayına almak mı?
3. **KVKK & Veri Güvenliği:** Hata loglarındaki hasta ad ve T.C. kimlik numaralarını maskelemek mi yoksa aciliyet gerekçesiyle teknik destek kanalına ham haliyle iletmek mi?

Uygulamanın amacı, yazılım mühendisliği öğrencilerine **"her teknik kararın doğrudan bir mimari, operasyonel ve hukuki bedeli olduğunu"** interaktif bir simülasyon ve Sokratik AI Tutor eşliğinde bizzat yaşatarak öğretmektir.

---

## 2. Kapsam Dışı (Out of Scope)
Ödev yönergesine tam uyum için aşağıdaki maddeler bilinçli olarak kapsam dışı bırakılmıştır:
1. **Kullanıcı Hesabı & Giriş Sistemi (Auth):** Simülasyonun sürtünmesiz (frictionless) biçimde mobil tarayıcıda tek tıkla 3-5 dakika içinde tamamlanabilmesi için kullanıcı kaydı/oturum açma yapılmamıştır.
2. **İkinci Bölüm / Çoklu Senaryolar:** İlk haftanın pedagojik odağı, karmaşık oyun dallanmaları yerine tek bir sağlık krizinde mimari, test ve KVKK üçgenindeki neden-sonuç illiyet bağını pekiştirmektir.
3. **Gerçek Hasta Verisi:** 6698 sayılı KVKK mevzuatına tam uyum ve sıfır veri sızıntısı riski için tamamen sentetik ve kurgusal log kayıtları kullanılmıştır.
4. **Native Mobil Uygulama:** Uygulama iOS/Android store paketi yerine, responsive Web / PWA standartlarında tüm mobil tarayıcılarda doğrudan çalışacak şekilde tasarlanmıştır.

---

## 3. Beş (5) Kabul Örneği (Acceptance Criteria / Given-When-Then)

### Kabul Örneği 1: Kişiselleştirme & Yeni Başlayan İpucu Desteği
* **Given (Koşul):** Kullanıcı giriş ekranında deneyim seviyesini `"Yeni başladım"` olarak seçer.
* **When (Eylem):** Karar 1 (Mimari) ekranına ulaştığında,
* **Then (Beklenen Sonuç):** Ekranda veritabanı şema uyuşmazlığı ve rollback risklerini açıklayan `Primer Rehber İpucu` kutusu otomatik olarak görünür; kullanıcıya kavramsal destek sunulur.

### Kabul Örneği 2: Deneyimli Kullanıcı Süre Baskısı (60 Saniye)
* **Given (Koşul):** Kullanıcı giriş ekranında deneyim seviyesini `"Deneyimliyim"` olarak seçer.
* **When (Eylem):** Karar aşamasına geçtiğinde,
* **Then (Beklenen Sonuç):** 60 saniyelik görsel ve dinamik geri sayım sayacı başlar. Süre 15 saniyenin altına düştüğünde kriz gerilim uyarısı verilir.

### Kabul Örneği 3: "Ne Oldu, Neden Oldu?" Nedensellik Kartı
* **Given (Koşul):** Kullanıcı herhangi bir kararda A veya B seçeneğini tıklar.
* **When (Eylem):** Seçim onaylandığında,
* **Then (Beklenen Sonuç):** Sistem sonraki aşamaya geçmeden önce açılır bir analiz kartında **"Ne Oldu?"** (teknik durum özeti) ve **"Neden Oldu?"** (veritabanı, memory, replika veya log seviyesindeki nedensel gerekçe) detayını açıklar.

### Kabul Örneği 4: KVKK İhlali ve Kötü Son (Son B) Tetiklenmesi
* **Given (Koşul):** Kullanıcı Karar 3'te logları maskelemeden `"Ekibe olduğu gibi at (Ham Log)"` seçeneğini seçer.
* **When (Eylem):** Simülasyon tamamlandığında,
* **Then (Beklenen Sonuç):** Sistem `Son B (Kötü Son)` ekranını gösterir. Randevu sistemi teknik olarak çalışsa bile 6698 sayılı KVKK Kanunu uyarınca kişisel sağlık verilerinin üçüncü taraf kanallara sızdırıldığı ve 1.750.000 TL idari yaptırım riski doğduğu bildirilir.

### Kabul Örneği 5: Sokratik AI Tutor'un Cevabı Ele Vermeme Kuralı
* **Given (Koşul):** Kullanıcı AI Tutor sohbet penceresini açıp *"Hangi şıkkı seçmeliyim?"*, *"Cevap A mı yoksa B mi?"* veya *"Ne yapmalıyım?"* sorusunu sorar.
* **When (Eylem):** AI Tutor yanıt ürettiğinde,
* **Then (Beklenen Sonuç):** Tutor kesinlikle *"A'yı seç"* ya da *"B yanlıştır"* demez; cevabı ele vermez. Bunun yerine: *"Geri dönmeden önce veritabanı şemasının değişip değişmediğini nasıl anlarsın?"* veya *"Canlıda yaptığın yamanın ana koda aktarılmasında ne gibi riskler vardır?"* şeklinde Sokratik düşündürücü soru yöneltir.

---

## 4. Durum Makinesi ve Akış Şeması (State Machine & Flowchart)

```text
       ┌────────────────────────────────────────────────────────┐
       │              GİRİŞ & KİŞİSELLEŞTİRME                   │
       │    1. Seviye: Yeni Başladım / Orta / Deneyimliyim      │
       │    2. Rol: Backend / Frontend / DevOps / Full-Stack    │
       │    3. Hedef: Sistem Kurtarma / Mimari / KVKK           │
       └───────────────────────────┬────────────────────────────┘
                                   │
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │                 08:00 KRİZ BAŞLANGICI                  │
       │  "Dün gece v2.4.0 çıktı. Randevu çöktü. 300 hasta var."│
       └───────────────────────────┬────────────────────────────┘
                                   │
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │              KARAR 1 · MİMARİ MÜDAHALE                 │
       │  A) Eski sürüme geri dön (Rollback v2.3.9)             │
       │  B) Canlıda yama yap (Hotfix / SSH container edit)     │
       └──────────────┬──────────────────────────┬──────────────┘
                      │                          │
              [Seçim A: Rollback]         [Seçim B: Hotfix]
                      │                          │
                      ▼                          ▼
               Ne Oldu / Neden Oldu?      Ne Oldu / Neden Oldu?
                      │                          │
                      └────────────┬─────────────┘
                                   │
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │                 KARAR 2 · TEST STRATEJİSİ              │
       │  A) Önce kısa smoke/staging test koş (4 dakika)        │
       │  B) Hemen yayına al (Sıfır test, doğrudan deploy)      │
       └──────────────┬──────────────────────────┬──────────────┘
                      │                          │
               [Seçim A: Test]            [Seçim B: No-Test]
                      │                          │
                      ▼                          ▼
               Ne Oldu / Neden Oldu?      Ne Oldu / Neden Oldu?
                      │                          │
                      └────────────┬─────────────┘
                                   │
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │                KARAR 3 · KVKK & LOG GÜVENLİĞİ          │
       │  A) Logdaki hasta adı ve TC'yi maskele (Sanitize)      │
       │  B) Hızlı çözüm için ekibe olduğu gibi at (Ham log)    │
       └──────────────┬──────────────────────────┬──────────────┘
                      │                          │
              [Seçim A: Maskele]          [Seçim B: Ham Paylaşım]
                      │                          │
                      ▼                          ▼
               Ne Oldu / Neden Oldu?      Ne Oldu / Neden Oldu?
                      │                          │
                      └────────────┬─────────────┘
                                   │
            ┌──────────────────────┴──────────────────────┐
            ▼                                             ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│          SON A · İYİ SON             │  │          SON B · KÖTÜ SON            │
│  "08:25 Sistem ayakta, veri güvende" │  │ "Sistem ayakta ama KVKK ihlali var"  │
│  - 300 hasta muayeneye girdi         │  │ - 6698 md. 12 veri ihlal bildirimi   │
│  - SLA %99.2 korundu                 │  │ - 1.750.000 TL ceza riski            │
│  - Post-mortem analizi hazır         │  │ - İtibar ve güvenlik soruşturması    │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```
