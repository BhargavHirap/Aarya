import { Router } from 'express';
import { ChatBodySchema, parseBody } from '../lib/validation';
import { callAI } from '../lib/ai';
import { chatLimiter } from '../lib/rateLimit';

const router = Router();

router.post('/', chatLimiter, async (req, res) => {
  const parsed = parseBody(ChatBodySchema, req.body);
  if (!parsed.ok) return res.status(400).json({ error: parsed.error });

  const { message, language, history } = parsed.data;
  try {
    const { reply, source } = await callAI({
      message,
      language,
      history: history ?? [],
    });
    return res.json({ reply, language, source });
  } catch {
    return res.status(500).json({ error: 'Aarya could not respond. Please try again.' });
  }
});

export default router;
