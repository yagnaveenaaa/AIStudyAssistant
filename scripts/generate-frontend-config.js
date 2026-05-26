/**
 * Build-time script for Vercel (or local) static frontend deploy.
 * Writes frontend/config.js from API_BASE_URL env var.
 *
 * Usage: API_BASE_URL=https://your-api.onrender.com node scripts/generate-frontend-config.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const apiBase = (process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || '')
  .trim()
  .replace(/\/$/, '');

const outPath = path.join(root, 'frontend', 'config.js');
const content = `window.__APP_CONFIG__=${JSON.stringify({ apiBase })};\n`;

fs.writeFileSync(outPath, content, 'utf8');
console.log(`Wrote ${outPath} with apiBase: "${apiBase || '(same-origin via rewrite)'}"`);
