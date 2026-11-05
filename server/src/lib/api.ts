import type {
  ChatResponse,
  EligibilityAnswers,
  EligibilityResult,
  Language,
  Message,
  Scheme,
} from './types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
if (!API_URL) console.warn('EXPO_PUBLIC_API_URL is not set. Set it in .env.');

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}, timeoutMs = 30000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ApiError(text || `Request failed (${res.status})`, res.status);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function sendChat(params: {
  message: string;
  language: Language;
  history: Message[];
  modelId?: string;
}): Promise<ChatResponse & { model?: string }> {
  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      message: params.message,
      language: params.language,
      history: params.history.map((m) => ({ role: m.role, content: m.content })),
      modelId: params.modelId,
    }),
  });
}

export interface ModelInfo { id: string; name: string; provider: string; description: string }

export async function listModels(): Promise<ModelInfo[]> {
  const res = await request<{ models: ModelInfo[] }>('/api/chat/models');
  return res.models;
}

export async function sendConsensus(params: {
  message: string;
  language: Language;
  history: Message[];
  modelIds?: string[];
}): Promise<{
  consensus: string;
  individual: { model: string; reply: string; ok: boolean }[];
  source: 'ai' | 'fallback';
}> {
  return request('/api/chat/consensus', {
    method: 'POST',
    body: JSON.stringify({
      message: params.message,
      language: params.language,
      history: params.history.map((m) => ({ role: m.role, content: m.content })),
      modelIds: params.modelIds,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any, 60000);
}

export async function transcribeAudio(uri: string): Promise<{ text: string }> {
  const form = new FormData();
  const name = uri.split('/').pop() || 'audio.m4a';
  form.append('audio', { uri, name, type: 'audio/m4a' } as any);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(`${API_URL}/api/transcribe`, {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });
    if (!res.ok) throw new ApiError('Transcription failed', res.status);
    return (await res.json()) as { text: string };
  } finally {
    clearTimeout(timer);
  }
}

export async function generateImage(prompt: string): Promise<{ url: string | null; b64: string | null }> {
  return request('/api/image/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  }, 60000);
}

export async function listSchemes(): Promise<Scheme[]> {
  const res = await request<{ schemes: Scheme[] }>('/api/schemes');
  return res.schemes;
}

export async function submitEligibility(answers: EligibilityAnswers): Promise<EligibilityResult> {
  return request<EligibilityResult>('/api/schemes/eligibility', {
    method: 'POST',
    body: JSON.stringify(answers),
  });
}
