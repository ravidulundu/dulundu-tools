// Security Configuration - Purpose-driven limits (not a chatbot!)
const BURST_LIMIT = 3; // Max requests per minute
const DAILY_LIMIT = 20; // Max requests per day
const BURST_WINDOW = 60 * 1000; // 1 minute
const STORAGE_KEY = 'ai_security_context';

const checkRateLimit = (): { allowed: boolean; error?: string; remaining?: number } => {
  const now = Date.now();
  const today = new Date().toDateString();

  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    let {
      blockedUntil = 0,
      minuteStart = now,
      minuteCount = 0,
      dailyDate = today,
      dailyCount = 0,
    } = data;

    // 1. Check if currently blocked
    if (blockedUntil && now < blockedUntil) {
      return {
        allowed: false,
        error: `⛔ Abuse detected. AI features blocked until tomorrow.`,
      };
    }

    // 2. Reset daily counter if new day
    if (dailyDate !== today) {
      dailyDate = today;
      dailyCount = 0;
      blockedUntil = 0; // Clear any previous blocks
    }

    // 3. Check daily limit first
    if (dailyCount >= DAILY_LIMIT) {
      return {
        allowed: false,
        error: `📊 Daily limit reached (${DAILY_LIMIT} requests). Try again tomorrow.`,
        remaining: 0,
      };
    }

    // 4. Reset minute window if needed
    if (now - minuteStart > BURST_WINDOW) {
      minuteStart = now;
      minuteCount = 0;
    }

    // 5. Check burst limit
    if (minuteCount >= BURST_LIMIT) {
      return {
        allowed: false,
        error: `⏱️ Too fast! Wait a moment before trying again.`,
        remaining: DAILY_LIMIT - dailyCount,
      };
    }

    // 6. Increment counters
    minuteCount++;
    dailyCount++;

    // 7. Block if burst abuse detected (rapid-fire = chatbot behavior)
    if (minuteCount > BURST_LIMIT) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      blockedUntil = tomorrow.getTime();

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ blockedUntil, minuteStart, minuteCount, dailyDate, dailyCount })
      );

      return {
        allowed: false,
        error: `⛔ Rapid requests detected. This tool is for code help, not chat. Blocked until tomorrow.`,
      };
    }

    // 8. Save state
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ blockedUntil, minuteStart, minuteCount, dailyDate, dailyCount })
    );

    return {
      allowed: true,
      remaining: DAILY_LIMIT - dailyCount,
    };
  } catch (_e) {
    // Fallback if localStorage fails - still allow but with warning
    return { allowed: true };
  }
};

// Helper to handle API calls with rate limiting and error handling
const callAiApi = async (endpoint: string, body: object): Promise<string> => {
  // 1. Rate Limit Check
  const securityCheck = checkRateLimit();
  if (!securityCheck.allowed) {
    throw new Error(securityCheck.error || 'Access denied.');
  }

  try {
    // 2. API Call
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || `Request to ${endpoint} failed with status ${response.status}`;
      } catch {
        errorMessage = `Request to ${endpoint} failed with status ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error(`AI Service Error (${endpoint}):`, error);
    throw error; // Propagate error to UI
  }
};

export const generateCodeHelp = async (
  prompt: string,
  language: string = 'javascript'
): Promise<string> => {
  return callAiApi('/api/ai/generate', { prompt, language });
};

export const paraphraseText = async (
  text: string,
  tone: string = 'professional'
): Promise<string> => {
  return callAiApi('/api/ai/paraphrase', { text, tone });
};

export const generateEmail = async (
  topic: string,
  recipient: string,
  tone: string
): Promise<string> => {
  return callAiApi('/api/ai/email', { topic, recipient, tone });
};

export const summarizeText = async (text: string, length: string): Promise<string> => {
  return callAiApi('/api/ai/summarize', { text, length });
};
