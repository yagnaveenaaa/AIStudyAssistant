# Deployment Guide

This app has **no hardcoded API keys**. Secrets live only in environment variables (`OPENAI_API_KEY`).

The backend listens on **`process.env.PORT`** (required by Render, Heroku, etc.).

---

## Option A — Single deploy on Render (recommended)

Express serves the **frontend** and **API** on one URL. No CORS issues; `API_BASE` stays empty.

### Steps

1. Push the repo to GitHub.

2. In [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** (or **Web Service**).

3. Connect the repo. Use these settings if not using `render.yaml`:

   | Setting | Value |
   |---------|--------|
   | Root Directory | `backend` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Health Check Path | `/api/health` |

4. Add **Environment Variables**:

   | Variable | Value |
   |----------|--------|
   | `NODE_ENV` | `production` |
   | `OPENAI_API_KEY` | Your OpenAI key |
   | `OPENAI_MODEL` | `gpt-4o` |
   | `CORS_ORIGIN` | `https://YOUR-SERVICE.onrender.com` |
   | `PUBLIC_API_BASE` | *(leave empty)* |
   | `DATABASE_PATH` | `/var/data/study.db` |

   Render sets **`PORT`** automatically — do not override it.

5. Add a **Persistent Disk** (optional but recommended for history):

   - Mount path: `/var/data`
   - Size: 1 GB

6. Deploy. Open `https://YOUR-SERVICE.onrender.com`.

### Using render.yaml

Click **New Blueprint** and select the repo. Render reads `render.yaml` at the repo root. Set `OPENAI_API_KEY` and `CORS_ORIGIN` in the dashboard after deploy.

---

## Option B — Backend on Render, frontend on Vercel

### Backend (Render)

Same as Option A steps 1–6. Set:

- `CORS_ORIGIN` = `https://your-app.vercel.app` (your Vercel URL)
- `PUBLIC_API_BASE` = `https://your-api.onrender.com` (your Render URL, no trailing slash)

### Frontend (Vercel)

1. Import the GitHub repo in [Vercel](https://vercel.com).

2. **Project Settings**:

   | Setting | Value |
   |---------|--------|
   | Framework Preset | Other |
   | Root Directory | `.` (repo root) |
   | Build Command | `node scripts/generate-frontend-config.js` |
   | Output Directory | `frontend` |

3. **Environment Variables** (Vercel):

   | Variable | Value |
   |----------|--------|
   | `API_BASE_URL` | `https://your-api.onrender.com` |

4. Edit `vercel.json` — replace `REPLACE_WITH_YOUR_RENDER_URL` in the rewrite with your real Render hostname.

5. Deploy.

**Alternative without `API_BASE_URL`:** leave `API_BASE_URL` empty and rely only on `vercel.json` rewrites so `/api/*` proxies to Render (same-origin from the browser’s view).

---

## Option C — Express only (local / VPS)

```bash
cd backend
cp .env.example .env
# Edit .env — set OPENAI_API_KEY
npm install
npm start
```

Open `http://localhost:3000` (or your `PORT`).

---

## Environment variables reference

### Backend (required)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI secret key |
| `PORT` | Set by host (Render). Default `3000` locally. |
| `NODE_ENV` | `production` in deploy |

### Backend (optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_MODEL` | `gpt-4o` | Model name |
| `CORS_ORIGIN` | `http://localhost:3000` | Comma-separated allowed origins |
| `PUBLIC_API_BASE` | `""` | Injected into `/config.js` for split deploys |
| `DATABASE_PATH` | `./data/study.db` | SQLite file path |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window |
| `RATE_LIMIT_MAX` | `30` | Max requests per window per IP |

### Frontend (Vercel only)

| Variable | Description |
|----------|-------------|
| `API_BASE_URL` | Render API URL (used by `scripts/generate-frontend-config.js`) |

---

## Security checklist

- [ ] Never commit `.env` or API keys
- [ ] Use Render/Vercel secret env UI for `OPENAI_API_KEY`
- [ ] Set `CORS_ORIGIN` to your real frontend URL in production
- [ ] Avoid `CORS_ORIGIN=*` in production

---

## Verify deployment

```bash
curl https://YOUR-SERVICE.onrender.com/api/health
```

Expected: `{"success":true,"data":{"status":"ok",...}}`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error in browser | Add your frontend URL to `CORS_ORIGIN` on Render |
| `OPENAI_API_KEY is required` | Set the variable in Render env and redeploy |
| History lost after redeploy | Add Render persistent disk; set `DATABASE_PATH=/var/data/study.db` |
| Vercel API 404 | Fix `vercel.json` rewrite URL or set `API_BASE_URL` |
| Blank page on Render | Check logs; confirm `backend` is root dir and `npm start` runs |
