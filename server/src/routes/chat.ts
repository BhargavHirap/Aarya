import { Router } from 'express';
import { z } from 'zod';
import { ChatBodySchema, parseBody } from '../lib/validation';
import { callAI, callConsensus } from '../lib/ai';
import { chatLimiter } from '../lib/rateLimit';
import { MODELS } from '../lib/models';

const router = Router();

router.get('/models', (_req, res) => {
  res.json({ models: MODELS });
});

router.post('/', chatLimiter, async (req, res) => {
  const parsed = parseBody(ChatBodySchema, req.body);
  if (!parsed.ok) return res.status(400).json({ error: parsed.error });

  const { message, language, history, modelId } = parsed.data;
  try {
    const out = await callAI({ message, language, history: history ?? [], modelId });
    return res.json({ ...out, language });
  } catch {
    return res.status(500).json({ error: 'Aarya could not respond. Please try again.' });
  }
});

const ConsensusSchema = z.object({
  message: z.string().trim().min(1).max(Number(process.env.MAX_INPUT_CHARS || 2000)),
  language: z.enum(['mr', 'en']).default('mr'),
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().min(1).max(4000) }))
    .max(Number(process.env.MAX_HISTORY_MESSAGES || 12))
    .optional(),
  modelIds: z.array(z.string()).max(6).optional(),
});

router.post('/consensus', chatLimiter, async (req, res) => {
  const parsed = ConsensusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid request' });
  try {
    const out = await callConsensus({
      message: parsed.data.message,
      language: parsed.data.language,
      history: parsed.data.history ?? [],
      modelIds: parsed.data.modelIds,
    });
    return res.json(out);
  } catch {
    return res.status(500).json({ error: 'Consensus failed. Try again.' });
  }
});

export default router;
