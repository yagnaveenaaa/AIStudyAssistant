<img width="1920" height="1080" alt="Screenshot 2026-05-26 173925" src="https://github.com/user-attachments/assets/610436b8-93e6-42c9-a475-8925e423529c" />
<img width="1920" height="1080" alt="Screenshot 2026-05-26 173723" src="https://github.com/user-attachments/assets/54421898-102e-43ee-994f-b6bc04fcd85c" />
<img width="1920" height="1080" alt="Screenshot 2026-05-26 173736" src="https://github.com/user-attachments/assets/ac6f8de1-fc54-4f54-aa0e-a510bb3270fb" />
<img width="1920" height="1080" alt="Screenshot 2026-05-26 173749" src="https://github.com/user-attachments/assets/aa5275f0-477a-4506-94c7-004192ddd27a" />
<img width="1920" height="1080" alt="Screenshot 2026-05-26 173805" src="https://github.com/user-attachments/assets/be6589fa-2826-41cb-9d28-1322866d2d60" />
<img width="1920" height="1080" alt="Screenshot 2026-05-26 173815" src="https://github.com/user-attachments/assets/5415aa5e-09e7-44aa-8831-599dc8231a2e" />

# AI Study Assistant

Topic-based study guides with AI, plus session history.

**Default: Google Gemini (free API key, no billing required).** OpenAI and Groq are also supported.

## Quick start

1. **Get a free Gemini API key** (no credit card): [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)

2. **Backend setup**

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

3. **Run**

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## LLM providers

| Provider | Cost | Key URL |
|----------|------|---------|
| **gemini** (default) | Free tier | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **groq** | Free tier | [console.groq.com/keys](https://console.groq.com/keys) |
| **openai** | Paid billing | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |

Set `LLM_PROVIDER` in `backend/.env` to switch.

## Project layout

```
frontend/     HTML, CSS, vanilla JS
backend/      Express API, SQLite history, LLM providers
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md).
