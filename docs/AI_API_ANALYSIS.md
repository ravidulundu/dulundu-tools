# AI API Analiz ve Geçiş Planı

> Bu belge, mevcut AI API kullanımının analizini ve önerilen değişiklikleri içerir.
> Son güncelleme: 2025-12-26

---

## Mevcut Durum

**Dosya:** `server.js`

```javascript
// Mevcut kullanım
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey });

// Model
model: 'gemini-2.5-flash'
```

**Kullanılan Endpoint'ler:**
- `POST /api/ai/generate` - Kod üretimi (AiAssistant)
- `POST /api/ai/paraphrase` - Metin yeniden yazma (ParaphrasingTool)

**Rate Limit:** 100 req / 15 dk (sunucu tarafı)

### ⚠️ Rate Limit Sorunu

```javascript
// Mevcut (SORUNLU)
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100,  // IP başına 100 istek
});
```

**Problem:**
| Limit | Değer |
|-------|-------|
| Gemini günlük | ~20 istek (TOPLAM) |
| Bizim limit | 100 istek/15dk (IP başına) |

1 kullanıcı 15 dakikada 100 istek atabilir ama Gemini günde toplam 20 kabul ediyor!

**Doğru Yaklaşım:** Rate limit API provider'ın limitine göre ayarlanmalı:

```javascript
// Gemini için (çok kısıtlı)
const aiLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 saat
    max: 5,  // Kullanıcı başına günde 5 istek
});

// Groq için (cömert)
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 saat
    max: 100,  // Kullanıcı başına saatte 100 istek
});
```

---

## ⚠️ KRİTİK SORUN: Gemini Free Limit Düşürüldü

Google, Aralık 2025'te Gemini API free limitlerini ciddi şekilde düşürdü:

| Model | Eski Limit | Yeni Limit |
|-------|------------|------------|
| Gemini 2.5 Flash | ~1500 RPD | **~20 RPD** |
| Gemini 2.5 Pro | ~50 RPD | **~5 RPD** |

**Etki:** Günde sadece ~20 istek yapılabilir = site kullanılamaz hale gelir!

---

## Free API Karşılaştırma (2025)

| Provider | Free Limit | RPD | Hız | OpenAI Uyumlu | Kredi Kartı |
|----------|------------|-----|-----|---------------|-------------|
| **Groq** | 14,400 req/gün | 14,400 | ⚡ 300 tok/sn | ✅ Evet | ❌ Gerekmez |
| **Mistral** | 1B token/ay | ~33M/gün | Orta | ✅ Evet | ❌ Gerekmez |
| **Together.ai** | $25 kredi | - | Orta | ✅ Evet | ❌ Gerekmez |
| **OpenRouter** | Free tier | Değişken | Değişken | ✅ Evet | ❌ Gerekmez |
| Gemini 2.5 Flash | ~20 req/gün | 20 | Orta | ❌ Hayır | ❌ Gerekmez |

---

## Önerilen Strateji: Groq

**Neden Groq?**
1. **14,400 RPD** - Gemini'nin 720 katı
2. **En hızlı** - 300+ token/saniye
3. **OpenAI uyumlu API** - Kolay geçiş
4. **Llama 3.3 70B** - Güçlü model
5. **Kredi kartı gerekmez**

**Groq Modelleri:**
| Model | Kullanım |
|-------|----------|
| `llama-3.3-70b-versatile` | Genel amaçlı, kod |
| `llama-3.1-8b-instant` | Hızlı, basit işler |
| `mixtral-8x7b-32768` | Uzun context |

---

## Geçiş Planı

### Adım 1: Groq SDK Kurulumu
```bash
npm install groq-sdk
```

### Adım 2: Environment Variable
```bash
# .env
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
```

### Adım 3: server.js Güncelleme

```javascript
// ÖNCE (Gemini)
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
});

// SONRA (Groq - OpenAI uyumlu)
import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const response = await groq.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [
    { role: 'system', content: 'You are an expert developer assistant.' },
    { role: 'user', content: prompt }
  ],
  temperature: 0.7,
  max_tokens: 2048,
});

const generatedText = response.choices[0]?.message?.content;
```

### Adım 4: Fallback Stratejisi (Opsiyonel)

```javascript
// Birden fazla provider ile fallback
const providers = [
  { name: 'groq', client: groqClient },
  { name: 'mistral', client: mistralClient },
];

async function generateWithFallback(prompt) {
  for (const provider of providers) {
    try {
      return await provider.client.generate(prompt);
    } catch (error) {
      console.warn(`${provider.name} failed, trying next...`);
    }
  }
  throw new Error('All AI providers failed');
}
```

---

## Endpoint Güncellemeleri

### /api/ai/generate
```javascript
app.post('/api/ai/generate', aiLimiter, asyncHandler(async (req, res) => {
  const { prompt, language } = req.body;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an expert developer assistant specializing in ${language || 'code'}.`
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2048,
  });

  res.json({ text: response.choices[0]?.message?.content });
}));
```

### /api/ai/paraphrase
```javascript
app.post('/api/ai/paraphrase', aiLimiter, asyncHandler(async (req, res) => {
  const { text, tone } = req.body;

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant', // Daha hızlı model yeterli
    messages: [
      {
        role: 'system',
        content: `You are an expert writer. Paraphrase text to be more ${tone || 'professional'}.`
      },
      { role: 'user', content: `Paraphrase this: "${text}"` }
    ],
    temperature: 0.8,
    max_tokens: 1024,
  });

  res.json({ text: response.choices[0]?.message?.content });
}));
```

---

## Rate Limit Güncellemesi

Groq'un limiti yüksek olduğu için sunucu rate limit'i artırılabilir:

```javascript
// ÖNCE
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100,
});

// SONRA (Groq ile)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // Artırılabilir
});
```

---

## Aksiyon Planı

### Faz 1: Hızlı Geçiş
- [ ] Groq hesabı aç (console.groq.com)
- [ ] API key al
- [ ] groq-sdk kur
- [ ] server.js güncelle
- [ ] Test et

### Faz 2: İyileştirmeler
- [ ] Fallback sistemi ekle (Groq → Mistral)
- [ ] Rate limit ayarla
- [ ] Error handling iyileştir
- [ ] Logging ekle

---

## Kaynaklar

- [Groq Console](https://console.groq.com/)
- [Groq Documentation](https://console.groq.com/docs)
- [Gemini Slashed Free Limits](https://www.howtogeek.com/gemini-slashed-free-api-limits-what-to-use-instead/)
- [Free LLM API Resources](https://github.com/cheahjs/free-llm-api-resources)
- [LLM API Pricing Comparison 2025](https://intuitionlabs.ai/articles/llm-api-pricing-comparison-2025)

---

## Özet

| Değişiklik | Önce | Sonra |
|------------|------|-------|
| Provider | Google Gemini | Groq |
| Model | gemini-2.5-flash | llama-3.3-70b-versatile |
| RPD | ~20 | 14,400 |
| Hız | Orta | Çok hızlı (300 tok/sn) |
| SDK | @google/genai | groq-sdk |
| API Format | Google özel | OpenAI uyumlu |
