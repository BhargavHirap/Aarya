(
echo import { Router } from 'express';
echo import { z } from 'zod';
echo import { ChatBodySchema, parseBody } from '../lib/validation';
echo import { callAI, callConsensus } from '../lib/ai';
echo import { chatLimiter } from '../lib/rateLimit';
echo import { MODELS } from '../lib/models';
echo.
echo const router = Router^(^);
echo.
echo router.get^('/models', ^(_req, res^) =^> ^{
echo   res.json^({ models: MODELS }^);
echo }^);
echo.
echo router.post^('/', chatLimiter, async ^(req, res^) =^> ^{
echo   const parsed = parseBody^(ChatBodySchema, req.body^);
echo   if ^(!parsed.ok^) return res.status^(400^).json^({ error: parsed.error }^);
echo.
echo   const { message, language, history, modelId } = parsed.data;
echo   try ^{
echo     const out = await callAI^({
echo       message,
echo       language: language ?^? 'mr',
echo       history: history ?^? [],
echo       modelId,
echo     }^);
echo     return res.json^({ ...out, language }^);
echo   } catch ^{
echo     return res.status^(500^).json^({ error: 'Aarya could not respond. Please try again.' }^);
echo   }
echo }^);
echo.
echo const ConsensusSchema = z.object^({
echo   message: z.string^(^).trim^(^).min^(1^).max^(Number^(process.env.MAX_INPUT_CHARS ^|^| 2000^)^),
echo   language: z.enum^(['mr', 'en']^).default^('mr'^),
echo   history: z
echo     .array^(z.object^({ role: z.enum^(['user', 'assistant']^), content: z.string^(^).min^(1^).max^(4000^) }^)^)
echo     .max^(Number^(process.env.MAX_HISTORY_MESSAGES ^|^| 12^)^)
echo     .optional^(^),
echo   modelIds: z.array^(z.string^(^)^).max^(6^).optional^(^),
echo }^);
echo.
echo router.post^('/consensus', chatLimiter, async ^(req, res^) =^> ^{
echo   const parsed = ConsensusSchema.safeParse^(req.body^);
echo   if ^(!parsed.success^) return res.status^(400^).json^({ error: 'Invalid request' }^);
echo   try ^{
echo     const out = await callConsensus^({
echo       message: parsed.data.message,
echo       language: parsed.data.language,
echo       history: parsed.data.history ?^? [],
echo       modelIds: parsed.data.modelIds,
echo     }^);
echo     return res.json^(out^);
echo   } catch ^{
echo     return res.status^(500^).json^({ error: 'Consensus failed. Try again.' }^);
echo   }
echo }^);
echo.
echo export default router;
) > src\routes\chat.ts
