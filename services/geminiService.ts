import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Rate Limiting Configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute

const checkRateLimit = (): boolean => {
  const now = Date.now();
  const storageKey = 'ai_rate_limit';

  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const { count = 0, startTime = now } = data;

    if (now - startTime > RATE_LIMIT_WINDOW) {
      // Reset window
      localStorage.setItem(storageKey, JSON.stringify({ count: 1, startTime: now }));
      return true;
    }

    if (count >= MAX_REQUESTS_PER_WINDOW) {
      return false;
    }

    localStorage.setItem(storageKey, JSON.stringify({ count: count + 1, startTime }));
    return true;
  } catch (e) {
    // Fallback if localStorage fails
    return true;
  }
};

export const generateCodeHelp = async (prompt: string, language: string = 'javascript'): Promise<string> => {
  if (!checkRateLimit()) {
    return "⚠️ Rate limit exceeded. You can make 5 requests per minute. Please wait a moment.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are an expert developer assistant. The user needs help with ${language}. 
      
      Task: ${prompt}
      
      Provide a clean, well-commented code solution or explanation. If generating code, wrap it in markdown code blocks. Keep the text concise.`,
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your API key or try again later.";
  }
};

export const paraphraseText = async (text: string, tone: string = 'professional'): Promise<string> => {
  if (!checkRateLimit()) {
    return "⚠️ Rate limit exceeded. You can make 5 requests per minute. Please wait a moment.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are an expert writer. Paraphrase the following text to be more ${tone}. Keep the meaning the same but improve clarity and flow.
      
      Text: "${text}"
      
      Output only the paraphrased text.`,
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your API key or try again later.";
  }
};