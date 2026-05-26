# AI Study Assistant

Topic-based study guides powered by OpenAI (GPT-4o), with session history.

**Production-ready:** environment variables only (no hardcoded API keys), `process.env.PORT`, CORS, rate limiting, and deployment guides.

## Quick start (local)

```bash
cd backend
npm install
cp .env.example .env
# Set OPENAI_API_KEY in .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — Express serves the frontend and API on the same origin.

The frontend loads `/config.js` for the API base URL (empty = same origin).

## Project layout

```
frontend/          HTML, CSS, vanilla JS UI
backend/           Express API, OpenAI, SQLite history
scripts/           Build helpers (Vercel config generation)
render.yaml        Render Blueprint (single full-stack deploy)
vercel.json        Optional Vercel frontend + API proxy
DEPLOYMENT.md      Render & Vercel deployment steps
```

## How frontend connects to backend

| Deploy mode | API URL |
|-------------|---------|
| Express serves both (default) | `apiBase: ""` → calls `/api/...` on same host |
| Vercel + Render | Set `API_BASE_URL` or use `vercel.json` rewrites |

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions.

## API

See [backend/README.md](backend/README.md).

## Environment variables

Copy `backend/.env.example` to `backend/.env`. Never commit `.env`.

Required: `OPENAI_API_KEY`  
Port: `PORT` (auto-set on Render)
