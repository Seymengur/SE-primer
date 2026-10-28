/**
 * YZM301 - SE Primer E2E Test Suite (Cypress)
 * Kapsam: Giriş, 3 Karar, Neden-Sonuç Panelleri, Son A (İyi) ve Son B (Kötü), Sokratik Tutor Testi
 */

declare const cy: any;
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void) => void;
declare const beforeEach: (fn: () => void) => void;

describe('SE Primer - Yazılım Mühendisliği Simülasyonu E2E Testleri', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Senaryo 1 (İyi Yol - Son A): Yeni Başlayan -> Rollback -> Test Koş -> Log Maskele -> Son A', () => {
    // 1. Giriş & Kişiselleştirme Ekranı
    cy.contains('SE Primer').should('be.visible');
    cy.contains('Yeni başladım').click();
    cy.contains('Backend Mühendisi').click();
    cy.contains('Sistem ve Veri Kurtarma').click();
    cy.contains('Simülasyona Başla').click();

    // 2. Kriz Başlangıcı & Karar 1 (Mimari)
    cy.contains('08:00').should('be.visible');
    cy.contains('300').should('be.visible'); // 300 hasta
    cy.contains('KARAR 1').should('be.visible');
    // "Yeni başladım" seçildiği için rehber ipucunun ekranda görünür olduğunu doğrula
    cy.get('[data-testid="primer-hint-box"]').should('be.visible');

    // Rollback (A) seç
    cy.get('[data-testid="choice-A"]').click();

    // "Ne Oldu / Neden Oldu" kartının açıldığını doğrula
    cy.contains('Ne Oldu?').should('be.visible');
    cy.contains('Neden Oldu?').should('be.visible');
    cy.contains('Sonraki Karara Geç').click();

    // 3. Karar 2 (Test Stratejisi)
    cy.contains('KARAR 2').should('be.visible');
    // Kısa test koş (A) seç
    cy.get('[data-testid="choice-A"]').click();
    cy.contains('Sonraki Karara Geç').click();

    // 4. Karar 3 (KVKK & Log Güvenliği)
    cy.contains('KARAR 3').should('be.visible');
    // Maskele (A) seç
    cy.get('[data-testid="choice-A"]').click();
    cy.contains('Sonucu Gör').click();

    // 5. Son A (İyi Son) Doğrulaması
    cy.contains('08:25').should('be.visible');
    cy.contains('Sistem Ayakta, Veri Güvende').should('be.visible');
    cy.contains('KVKK: %100 Uyumlu').should('be.visible');
    cy.contains('Post-Mortem').should('be.visible');
  });

  it('Senaryo 2 (Kötü Yol - Son B): Deneyimli -> Hotfix -> Test Atlama -> Ham Log -> Son B (KVKK İhlali)', () => {
    // 1. Giriş Ekranı: Deneyimli seçimi
    cy.contains('Deneyimliyim').click();
    cy.contains('Simülasyona Başla').click();

    // 2. 60 saniyelik sayaç doğrulaması
    cy.get('[data-testid="countdown-timer"]').should('be.visible');

    // Karar 1: Canlıda Yama Yap (B)
    cy.get('[data-testid="choice-B"]').click();
    cy.contains('Sonraki Karara Geç').click();

    // Karar 2: Hemen Yayına Al (B)
    cy.get('[data-testid="choice-B"]').click();
    cy.contains('Sonraki Karara Geç').click();

    // Karar 3: Ekibe Olduğu Gibi At (B)
    cy.get('[data-testid="choice-B"]').click();
    cy.contains('Sonucu Gör').click();

    // 3. Son B (KVKK İhlali) Doğrulaması
    cy.contains('KVKK İhlali').should('be.visible');
    cy.contains('6698').should('be.visible');
  });

  it('Senaryo 3 (Sokratik Tutor): Doğrudan cevabı sızdırmadığının ve soru sorduğunun doğrulanması', () => {
    cy.contains('Simülasyona Başla').click();

    // Tutor sohbet panelini aç
    cy.get('[data-testid="open-tutor-btn"]').click();
    cy.get('[data-testid="tutor-drawer"]').should('be.visible');

    // Israrcı soru gönder
    cy.get('[data-testid="tutor-input"]').type('Hangi şıkkı seçmeliyim, A mı B mi?{enter}');

    // Yanıtın geldiğini ve cevabı ele vermediğini doğrula
    cy.get('[data-testid="tutor-message-list"]').last().within(() => {
      cy.should('not.contain', 'A şıkkını seç');
      cy.should('not.contain', 'B şıkkını seç');
      cy.contains('?').should('exist'); // Sokratik soru işareti içermeli
    });
  });
});
