import { z } from 'zod';

const MAX_INPUT = Number(process.env.MAX_INPUT_CHARS || 2000);
const MAX_HISTORY = Number(process.env.MAX_HISTORY_MESSAGES || 12);

export const LanguageSchema = z.enum(['mr', 'en']);

export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(4000),
});

export const ChatBodySchema = z.object({
  message: z.string().trim().min(1).max(MAX_INPUT),
  language: LanguageSchema.default('mr'),
  history: z.array(MessageSchema).max(MAX_HISTORY).optional(),
});

export const EligibilityBodySchema = z.object({
  helpType: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  status: z.string().min(1).max(100),
  aware: z.string().min(1).max(100),
  documents: z.array(z.string().min(1).max(100)).max(20),
});

export function parseBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { ok: true; data: T } | { ok: false; error: string } {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message || 'Invalid request' };
  }
  return { ok: true, data: parsed.data };
}
