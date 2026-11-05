import { Router } from 'express';
import multer from 'multer';
import { chatLimiter } from '../lib/rateLimit';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(process.env.STT_MAX_BYTES || 10_000_000) },
});

router.post('/', chatLimiter, upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio file' });

  const apiKey = process.env.STT_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = process.env.STT_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.STT_MODEL || 'whisper-1';

  if (!apiKey) return res.status(503).json({ error: 'Speech-to-text is not configured.' });

  const form = new FormData();
  const blob = new Blob([new Uint8Array(req.file.buffer)], {
    type: req.file.mimetype || 'audio/m4a',
  });
  form.append('file', blob, req.file.originalname || 'audio.m4a');
  form.append('model', model);
  form.append('language', 'mr');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const r = await fetch(`${baseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      signal: controller.signal,
    });
    if (!r.ok) return res.status(502).json({ error: 'Transcription provider failed.' });
    const data: any = await r.json();
    return res.json({ text: (data?.text || '').trim() });
  } catch {
    return res.status(504).json({ error: 'Transcription timed out.' });
  } finally {
    clearTimeout(timer);
  }
});

export default router;
