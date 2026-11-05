import rateLimit from 'express-rate-limit';

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const max = Number(process.env.RATE_LIMIT_MAX || 20);

const message =
  'खूप जास्त विनंत्या. कृपया थोड्या वेळाने प्रयत्न करा. / Too many requests, please try again shortly.';

export const chatLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: message },
});

export const eligibilityLimiter = rateLimit({
  windowMs,
  max: Math.max(5, Math.floor(max / 2)),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: message },
  import rateLimit from 'express-rate-limit';

// Chat / consensus / STT / image share the same limiter.
// Consensus is 4× the cost of a normal message, so keep this conservative.
export const chatLimiter = rateLimit({
  windowMs: Number(process.env.RATE_WINDOW_MS || 60_000), // 1 min
  max: Number(process.env.RATE_MAX || 20),                 // 20 req / min / IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});
});
