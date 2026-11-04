import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import chatRouter from './routes/chat';
import schemesRouter from './routes/schemes';

const app = express();
const PORT = Number(process.env.PORT || 8787);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '64kb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, name: 'aarya', version: '1.0.0' });
});

app.use('/api/chat', chatRouter);
app.use('/api/schemes', schemesRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled error:', err?.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Aarya server listening on http://localhost:${PORT}`);
});
