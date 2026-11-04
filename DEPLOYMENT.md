# Deployment

## 1. Backend (server)
Works on Render, Railway, Fly.io, or Vercel (serverless).

### Render / Railway
1. Push the repo to GitHub.
2. New Web Service → point to `server/` subfolder.
3. Build command: `npm ci && npm run build`
4. Start command: `npm start`
5. Environment variables to set:
   - `OPENAI_API_KEY=sk-…`
   - `OPENAI_BASE_URL=https://api.openai.com/v1`
   - `OPENAI_MODEL=gpt-4o-mini`
   - `CORS_ORIGIN=https://your-app-origin`
   - `PORT=8787`
6. Health check: `GET /health`

### Docker
```bash
cd server
docker build -t aarya-server .
docker run -p 8787:8787 --env-file .env aarya-server
