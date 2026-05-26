import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  OPENAI_MODEL: z.string().default('gpt-4o'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  PUBLIC_API_BASE: z.string().optional().default(''),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(30),
  DATABASE_PATH: z.string().default('./data/study.db'),
});

function parseEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    console.error(`Environment validation failed:\n${formatted}`);
    process.exit(1);
  }

  const data = parsed.data;
  const corsOrigins = data.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
  const publicApiBase = data.PUBLIC_API_BASE.replace(/\/$/, '');

  if (data.NODE_ENV === 'production' && corsOrigins.includes('*')) {
    console.warn('Warning: CORS_ORIGIN=* is not recommended in production.');
  }

  return {
    port: Number(process.env.PORT) || data.PORT,
    nodeEnv: data.NODE_ENV,
    isProduction: data.NODE_ENV === 'production',
    openaiApiKey: data.OPENAI_API_KEY,
    openaiModel: data.OPENAI_MODEL,
    corsOrigins,
    publicApiBase,
    rateLimitWindowMs: data.RATE_LIMIT_WINDOW_MS,
    rateLimitMax: data.RATE_LIMIT_MAX,
    databasePath: path.isAbsolute(data.DATABASE_PATH)
      ? data.DATABASE_PATH
      : path.resolve(__dirname, '../..', data.DATABASE_PATH),
  };
}

export const env = parseEnv();
