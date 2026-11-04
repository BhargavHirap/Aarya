import type {
  ChatResponse,
  EligibilityAnswers,
  EligibilityResult,
  Language,
  Message,
  Scheme,
} from './types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
if (!API_URL) {
  // eslint-disable-next-line no-console
  console.warn('EXPO_PUBLIC_API_URL is not set. Set it in .env.');
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = 30000
): Promise<T> {
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
}): Promise<ChatResponse> {
  return request<ChatResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      message: params.message,
      language: params.language,
      history: params.history.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
}

export async function listSchemes(): Promise<Scheme[]> {
  const res = await request<{ schemes: Scheme[] }>('/api/schemes');
  return res.schemes;
}

export async function submitEligibility(
  answers: EligibilityAnswers
): Promise<EligibilityResult> {
  return request<EligibilityResult>('/api/schemes/eligibility', {
    method: 'POST',
    body: JSON.stringify(answers),
  });
}
