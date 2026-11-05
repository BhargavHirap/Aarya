import {
  buildSystemPrompt,
  OFFLINE_FALLBACK_EN,
  OFFLINE_FALLBACK_MR,
  type Lang,
} from './prompts';
import { DEFAULT_MODEL_ID, getConsensusModels } from './models';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ProviderConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

function resolveProvider(modelId: string): ProviderConfig | null {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (openrouterKey) {
    return {
      apiKey: openrouterKey,
      baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      model: modelId || DEFAULT_MODEL_ID,
    };
  }
  if (openaiKey) {
    return {
      apiKey: openaiKey,
      baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    };
  }
  return null;
}

async function callProvider(
  cfg: ProviderConfig,
  messages: { role: string; content: string }[]
): Promise<string> {
  const timeoutMs = Number(process.env.REQUEST_TIMEOUT_MS || 20000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({ model: cfg.model, messages, temperature: 0.6, max_tokens: 800 }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Provider ${res.status}`);
    const data: any = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('Empty reply');
    return reply;
  } finally {
    clearTimeout(timer);
  }
}

export async function callAI(params: {
  message: string;
  history: ChatMessage[];
  language: Lang;
  modelId?: string;
}): Promise<{ reply: string; source: 'ai' | 'fallback'; model: string }> {
  const fallback = params.language === 'mr' ? OFFLINE_FALLBACK_MR : OFFLINE_FALLBACK_EN;
  const cfg = resolveProvider(params.modelId || DEFAULT_MODEL_ID);
  if (!cfg) return { reply: fallback, source: 'fallback', model: 'none' };

  const messages = [
    { role: 'system', content: buildSystemPrompt(params.language) },
    ...params.history,
    { role: 'user', content: params.message },
  ];

  try {
    const reply = await callProvider(cfg, messages);
    return { reply: sanitize(reply), source: 'ai', model: cfg.model };
  } catch {
    try {
      const reply = await callProvider(cfg, messages);
      return { reply: sanitize(reply), source: 'ai', model: cfg.model };
    } catch {
      return { reply: fallback, source: 'fallback', model: cfg.model };
    }
  }
}

export async function callConsensus(params: {
  message: string;
  history: ChatMessage[];
  language: Lang;
  modelIds?: string[];
}): Promise<{
  consensus: string;
  individual: { model: string; reply: string; ok: boolean }[];
  source: 'ai' | 'fallback';
}> {
  const modelIds =
    params.modelIds && params.modelIds.length > 0 ? params.modelIds : getConsensusModels();

  const system = { role: 'system', content: buildSystemPrompt(params.language) };
  const user = { role: 'user', content: params.message };

  const results = await Promise.all(
    modelIds.map(async (id) => {
      const cfg = resolveProvider(id);
      if (!cfg) return { model: id, reply: '', ok: false };
      try {
        const reply = await callProvider(cfg, [system, ...params.history, user]);
        return { model: id, reply: sanitize(reply), ok: true };
      } catch {
        return { model: id, reply: '', ok: false };
      }
    })
  );

  const usable = results.filter((r) => r.ok && r.reply);
  if (usable.length === 0) {
    const fallback = params.language === 'mr' ? OFFLINE_FALLBACK_MR : OFFLINE_FALLBACK_EN;
    return { consensus: fallback, individual: results, source: 'fallback' };
  }

  const synthCfg = resolveProvider(DEFAULT_MODEL_ID);
  const synthPrompt =
    `You are synthesizing multiple AI replies into one best answer. Combine the strongest points, ` +
    `remove contradictions, keep it concise, and respond in ${params.language === 'mr' ? 'Marathi (Devanagari)' : 'English'}. ` +
    `End with "Consensus of ${usable.length} models."\n\n` +
    `User question:\n${params.message}\n\n` +
    `Model replies:\n${usable.map((r, i) => `#${i + 1} (${r.model}):\n${r.reply}`).join('\n\n')}`;

  let consensus = usable[0]!.reply;
  if (synthCfg) {
    try {
      consensus = sanitize(
        await callProvider(synthCfg, [
          { role: 'system', content: 'You are a careful synthesizer.' },
          { role: 'user', content: synthPrompt },
        ])
      );
    } catch {
      /* keep first reply */
    }
  }

  return { consensus, individual: results, source: 'ai' };
}

function sanitize(text: string): string {
  return text.replace(/<\/?script[^>]*>/gi, '').trim();
}
