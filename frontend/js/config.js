/**
 * API base URL for fetch calls.
 * - Empty string "" = same origin (Express serves UI + API together — recommended)
 * - Set via window.__APP_CONFIG__ from /config.js (backend) or build-time config.js (Vercel)
 */
export function getApiBase() {
  const base = window.__APP_CONFIG__?.apiBase ?? '';
  return String(base).replace(/\/$/, '');
}
