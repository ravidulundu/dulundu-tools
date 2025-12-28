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

export const generateCodeHelp = async (
  prompt: string,
  language: string = 'javascript'
): Promise<string> => {
  const securityCheck = checkRateLimit();
  if (!securityCheck.allowed) {
    return securityCheck.error || 'Access denied.';
  }

  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, language }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate code');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('AI Service Error:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const paraphraseText = async (
  text: string,
  tone: string = 'professional'
): Promise<string> => {
  const securityCheck = checkRateLimit();
  if (!securityCheck.allowed) {
    return securityCheck.error || 'Access denied.';
  }

  try {
    const response = await fetch('/api/ai/paraphrase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, tone }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to paraphrase text');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('AI Service Error:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
};
