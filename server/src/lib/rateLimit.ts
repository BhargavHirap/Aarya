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
});
