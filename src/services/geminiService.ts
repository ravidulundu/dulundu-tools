// Security Configuration
const BURST_LIMIT = 5; // Max requests allowed in the window
const BURST_WINDOW = 60 * 1000; // 1 minute window
const STORAGE_KEY = 'ai_security_context';

const checkRateLimit = (): { allowed: boolean; error?: string } => {
  const now = Date.now();

  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    let { blockedUntil = 0, minuteStart = now, minuteCount = 0 } = data;

    // 1. Check if currently blocked
    if (blockedUntil && now < blockedUntil) {
      return {
        allowed: false,
        error: `⛔ Abuse detected. You are blocked from using AI features until tomorrow.`,
      };
    }

    // 2. Reset window if 1 minute has passed
    if (now - minuteStart > BURST_WINDOW) {
      minuteStart = now;
      minuteCount = 0;
    }

    // 3. Increment count
    minuteCount++;

    // 4. Check for abuse (Exceeded limit within window)
    if (minuteCount > BURST_LIMIT) {
      // Block until midnight (next day)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      blockedUntil = tomorrow.getTime();

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ blockedUntil, minuteStart, minuteCount }));

      return {
        allowed: false,
        error: `⛔ Abuse detected. You sent too many requests too quickly. Access revoked until ${tomorrow.toLocaleDateString()}.`,
      };
    }

    // 5. Save state
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ blockedUntil, minuteStart, minuteCount }));
    return { allowed: true };
  } catch (_e) {
    // Fallback if localStorage fails (e.g. private mode restrictions)
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
