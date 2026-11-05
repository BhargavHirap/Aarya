import { Router } from 'express';
import { z } from 'zod';
import { chatLimiter } from '../lib/rateLimit';

const router = Router();

const Body = z.object({
  prompt: z.string().trim().min(1).max(1000),
  size: z.enum(['1024x1024', '1024x1792', '1792x1024']).default('1024x1024'),
});

router.post('/generate', chatLimiter, async (req, res) => {
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid request' });

  const apiKey = process.env.IMAGE_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = process.env.IMAGE_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.IMAGE_MODEL || 'dall-e-3';

  if (!apiKey) return res.status(503).json({ error: 'Image generation is not configured.' });

  try {
    const r = await fetch(`${baseUrl}/images/generations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, prompt: parsed.data.prompt, n: 1, size: parsed.data.size }),
    });
    if (!r.ok) {
      const t = await r.text().catch(() => '');
      return res.status(502).json({ error: 'Image provider failed.', detail: t.slice(0, 200) });
    }
    const data: any = await r.json();
    const item = data?.data?.[0];
    return res.json({ url: item?.url || null, b64: item?.b64_json || null });
  } catch {
    return res.status(504).json({ error: 'Image generation timed out.' });
  }
});

export default router;
