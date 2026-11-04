import {
  buildSystemPrompt,
  OFFLINE_FALLBACK_EN,
  OFFLINE_FALLBACK_MR,
  type Lang,
} from './prompts';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function callAI(params: {
  message: string;
  history: ChatMessage[];
  language: Lang;
}): Promise<{ reply: string; source: 'ai' | 'fallback' }> {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const timeoutMs = Number(process.env.REQUEST_TIMEOUT_MS || 20000);

  const fallback = params.language === 'mr' ? OFFLINE_FALLBACK_MR : OFFLINE_FALLBACK_EN;

  if (!apiKey) {
    return { reply: fallback, source: 'fallback' };
  }

  const messages = [
    { role: 'system', content: buildSystemPrompt(params.language) },
    ...params.history,
    { role: 'user', content: params.message },
  ];

  const doRequest = async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, messages, temperature: 0.6, max_tokens: 800 }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Provider ${res.status}`);
      const data: any = await res.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error('Empty reply');
      return reply as string;
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    const reply = await doRequest();
    return { reply: sanitize(reply), source: 'ai' };
  } catch {
    try {
      const reply = await doRequest();
      return { reply: sanitize(reply), source: 'ai' };
    } catch {
      return { reply: fallback, source: 'fallback' };
    }
  }
}

function sanitize(text: string): string {
  return text.replace(/<\/?script[^>]*>/gi, '').trim();
}
