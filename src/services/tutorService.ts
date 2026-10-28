import { GoogleGenAI } from '@google/genai';
import { DecisionStepId } from '../types';

// Pre-defined Socratic prompt bank for instantaneous, reliable offline & online tutoring
const SOCRATIC_KNOWLEDGE_BASE: Record<DecisionStepId, { keywords: string[]; question: string }[]> = {
  1: [
    {
      keywords: ["hangisi", "a mı", "b mi", "seçim", "ne yapayım", "doğru", "cevap"],
      question: "Geri dönmeden önce dün geceki sürümün veritabanı şemasını (tabloları, kolonları) değiştirip değiştirmediğini nasıl anlarsın?",
    },
    {
      keywords: ["rollback", "eski sürüm", "geri dön"],
      question: "Eski sürüme dönersen, dünden bu yana yeni şemaya yazılmış olabilecek hasta randevu kayıtları eski kod tarafından nasıl okunacak?",
    },
    {
      keywords: ["hotfix", "yama", "canlı", "ssh"],
      question: "Canlı pod içinde doğrudan yaptığın bir yama, Kubernetes pod'u bellek aşımıyla yeniden başlattığında (restart) kalıcı kalır mı?",
    },
    {
      keywords: ["panik", "hasta", "bekliyor", "300"],
      question: "300 hastanın beklemesi seni aceleye itiyor; peki plansız bir müdahaleyle tüm veritabanını bozarsan onları kaç saat bekletirsin?",
    },
  ],
  2: [
    {
      keywords: ["hangisi", "a mı", "b mi", "seçim", "ne yapayım", "doğru", "cevap"],
      question: "4 dakikalık kısa bir test koşmak mı daha büyük bir gecikme yaratır, yoksa test edilmeden açılan sistemde aynı doktora 2 hastanın çifte randevu alması mı?",
    },
    {
      keywords: ["test", "smoke", "staging", "duman"],
      question: "Kısa bir duman testinde ilk kontrol etmen gereken kritik sağlık senaryosu ne olmalıdır: Randevu kilitleme mi, arayüz renkleri mi?",
    },
    {
      keywords: ["hemen", "yayına", "zaman", "atla", "geç"],
      question: "Sıfır testle doğrudan yayına alırsan, PostgreSQL'in 'READ COMMITTED' izolasyon seviyesinde yarış durumunu (race condition) nasıl önleyeceksin?",
    },
  ],
  3: [
    {
      keywords: ["hangisi", "a mı", "b mi", "seçim", "ne yapayım", "doğru", "cevap"],
      question: "Slack veya Teams kanalındaki yazılımcıların sorunu çözmesi için hastanın ad-soyadına ve T.C. kimlik numarasına mı ihtiyacı var, yoksa hata fırlatan kod satırına mı?",
    },
    {
      keywords: ["kvkk", "ceza", "yasa", "kanun"],
      question: "6698 sayılı KVKK md. 12 uyarınca sağlık verilerinin 'özel nitelikli' olduğunu biliyorsun; genel bir kanala ham log yapıştırmak hastane için ne tür bir hukuki risk doğurur?",
    },
    {
      keywords: ["maskele", "regex", "sanitize"],
      question: "Logları maskelemek için regex çalıştırdığında teknik hata stack trace'ini bozmadan sadece kimlik alanlarını nasıl gizlersin?",
    },
    {
      keywords: ["slack", "ekip", "at gitsin", "ham"],
      question: "Genel destek kanalında stajyerler veya 3. parti bot entegrasyonları varsa, hastanın teşhis bilgisini onların görmesi etik ve yasal mıdır?",
    },
  ],
};

const GENERAL_SOCRATIC_FALLBACKS = [
  "Bir karar vermeden önce sormalısın: Bu tercihin en kötü senaryosu (worst-case scenario) nedir ve bunu telafi etmek ne kadar sürer?",
  "Mühendislik kararları mutlak doğrulardan değil, bilinçli ödünleşimlerden (trade-offs) oluşur. Şu an hangi riski göze almaya hazırsın?",
  "Düşün: Sistem kesinti süresi (downtime) mi daha kolay telafi edilir, yoksa geri dönüşü olmayan veri bozulması veya sızıntısı mı?",
  "Sokratik kural gereği cevabı söyleyemem; ama sorabilirim: Seçtiğin yöntemin mimari ve yasal sonuçlarını başhekime nasıl savunursun?",
];

// Guardrail check to sanitize any forbidden directive leaks
export function sanitizeSocraticResponse(rawResponse: string): string {
  let cleaned = rawResponse;

  // Pattern checks for forbidden leaks like "A şıkkını seç", "B'yi seç"
  const forbiddenPatterns = [
    /\b(A şıkkını seç|B şıkkını seç|A'yı seç|B'yi seç|Cevap A|Cevap B|Doğru cevap A|Doğru cevap B|A seçeneğini|B seçeneğini)\b/gi,
    /\b(Rollback yapmalısın|Hotfix yapmalısın|Testi atla|Kesinlikle A|Kesinlikle B)\b/gi,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(cleaned)) {
      cleaned = cleaned.replace(pattern, "iki seçenek arasındaki risk dengesini tartmalısın");
    }
  }

  // Ensure it finishes with a thought-provoking question
  if (!cleaned.includes("?")) {
    cleaned += " Peki bu adımı atmadan önce sistemin geriye dönük uyumluluğunu nasıl teyit edersin?";
  }

  return cleaned;
}

export async function askSocraticTutor(
  userQuery: string,
  currentStepId: DecisionStepId,
  userLevel: string,
  userRole: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `
Sen "SE Primer" adlı sistemin Sokratik AI Tutor'usun (Neal Stephenson'ın The Diamond Age romanındaki gibi kişiye uyarlanan rehber).
Kullanıcı bir yazılım mühendisliği öğrencisi. Şu an 08:00 hastane randevu çöküşü krizinde.
Aktif Karar Aşaması: ${currentStepId}.
Öğrencinin Seviyesi: ${userLevel}, Rolü: ${userRole}.

KRİTİK SOKRATİK KURAL:
1. Asla ve kesinlikle cevabı doğrudan söyleme! (Örn: "A'yı seç", "B doğrudur", "Rollback yap", "Yama yapma" DEMEK KESİNLİKLE YASAKTIR).
2. Öğrencinin sorusunu al, onu mimari, test veya KVKK açısından düşündürecek derin, kışkırtıcı bir soruyla yanıtla.
3. Yanıtın en fazla 2-3 cümle olsun ve mutlaka soru işareti (?) ile bitsin.
4. Örnek rehberlik: "Geri dönmeden önce veritabanı şemasının değişip değişmediğini nasıl anlarsın?"
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: userQuery }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.3,
          maxOutputTokens: 200,
        }
      });

      const responseText = response.text || '';
      if (responseText.trim().length > 0) {
        return sanitizeSocraticResponse(responseText.trim());
      }
    } catch (err) {
      console.warn("Gemini call failed or rate-limited, switching to deterministic Socratic knowledge engine:", err);
    }
  }

  // Offline / deterministic intelligent Socratic engine
  const stepBank = SOCRATIC_KNOWLEDGE_BASE[currentStepId] || [];
  const queryLower = userQuery.toLowerCase();

  for (const item of stepBank) {
    const hasMatch = item.keywords.some((kw) => queryLower.includes(kw));
    if (hasMatch) {
      return sanitizeSocraticResponse(item.question);
    }
  }

  // Fallback to contextual question based on step
  if (currentStepId === 1) {
    return sanitizeSocraticResponse(
      "Geri dönmeden önce dün gece uygulanan veritabanı şema değişikliklerinin (migration) geriye dönük uyumlu (backward compatible) olup olmadığını nasıl test edersin?"
    );
  } else if (currentStepId === 2) {
    return sanitizeSocraticResponse(
      "Canlıya almadan önce koşulacak 4 dakikalık bir duman testinin (smoke test) yakalayabileceği en büyük felaket nedir?"
    );
  } else {
    return sanitizeSocraticResponse(
      "Ekibin loglarda hatayı görebilmesi için hastanın T.C. kimlik numarasına ve teşhis koduna gerçekten ihtiyacı var mı, yoksa sadece metod çağrısı yeterli midir?"
    );
  }
}
