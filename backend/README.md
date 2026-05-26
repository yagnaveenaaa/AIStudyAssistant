# AI Study Assistant — Backend

Node.js + Express API: topics → OpenAI (GPT-4o) → structured study JSON, with SQLite session history.

Also serves the **frontend** static files in production (single deploy).

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Set OPENAI_API_KEY in .env
npm run dev
```

Open `http://localhost:3000`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with file watch |
| `npm start` | Production server (`NODE_ENV=production`) |

## API routes

| Method | Route | Description |
|--------|--------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/config.js` | Runtime config (`apiBase` for frontend) |
| `POST` | `/api/study/explain` | Generate study content |
| `GET` | `/api/study/history` | List sessions (`?limit=20&offset=0`) |
| `GET` | `/api/study/history/:id` | Get session by ID |

## Environment variables

See `.env.example`. Keys are read from `process.env` only — never hardcoded.

| Variable | Required | Notes |
|----------|----------|-------|
| `OPENAI_API_KEY` | Yes | OpenAI secret |
| `PORT` | No | Defaults to 3000; Render sets automatically |
| `NODE_ENV` | No | Use `production` when deployed |
| `CORS_ORIGIN` | No | Comma-separated origins |
| `PUBLIC_API_BASE` | No | Empty for same-origin deploy |
| `DATABASE_PATH` | No | SQLite path |

## Deployment

See [../DEPLOYMENT.md](../DEPLOYMENT.md).
