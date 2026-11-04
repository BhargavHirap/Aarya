import { Router } from 'express';
import { schemes } from '../data/schemes';
import { EligibilityBodySchema, parseBody } from '../lib/validation';
import { eligibilityLimiter } from '../lib/rateLimit';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ schemes });
});

router.get('/:id', (req, res) => {
  const scheme = schemes.find((s) => s.id === req.params.id);
  if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
  res.json(scheme);
});

router.post('/eligibility', eligibilityLimiter, (req, res) => {
  const parsed = parseBody(EligibilityBodySchema, req.body);
  if (!parsed.ok) return res.status(400).json({ error: parsed.error });

  const { helpType, state, status, documents } = parsed.data;
  const relevant = schemes.filter(
    (s) =>
      (helpType === 'Scholarship' && /scholar/i.test(s.category)) ||
      (helpType === 'Education assistance' && /education|scholar/i.test(s.category)) ||
      (helpType === 'Welfare' && /welfare|health/i.test(s.category)) ||
      helpType === 'Other'
  );
  const focused = relevant[0] || schemes[0]!;
  const missingDocs = focused.documents.filter((d) => !documents.includes(d));

  res.json({
    preliminary: true,
    notice: 'Preliminary guidance, not an official government decision.',
    guidance: `Based on your inputs (help type: ${helpType}, state: ${state}, status: ${status}), you may want to look at: ${focused.nameEn}. Confirm eligibility on the official portal.`,
    nextSteps: [
      `Visit ${focused.nameEn} page and read eligibility carefully.`,
      'Keep all required documents ready.',
      'Submit the application on the official portal.',
      'Save the application reference number.',
    ],
    checklist: missingDocs.length ? missingDocs : focused.documents,
    verifyAt: focused.officialUrl,
  });
});

export default router;
