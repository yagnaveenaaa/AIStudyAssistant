import OpenAI from 'openai';
import { env } from '../config/env.js';
import { SYSTEM_PROMPT, buildUserPrompt } from '../prompts/study.prompts.js';
import { validateStudyContent } from '../schemas/study.response.schema.js';
import { AppError } from '../utils/AppError.js';

const openai = new OpenAI({ apiKey: env.openaiApiKey });

export async function generateStudyContent({ topic, level, focus }) {
  let completion;

  try {
    completion = await openai.chat.completions.create({
      model: env.openaiModel,
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt({ topic, level, focus }) },
      ],
    });
  } catch (err) {
    const status = err?.status ?? err?.response?.status;
    const message = err?.message ?? 'OpenAI request failed';

    if (status === 401) {
      throw new AppError('Invalid OpenAI API key', 502, 'OPENAI_AUTH_ERROR');
    }
    if (status === 429) {
      throw new AppError('OpenAI rate limit exceeded. Try again shortly.', 429, 'OPENAI_RATE_LIMIT');
    }
    if (status === 400) {
      throw new AppError(`OpenAI request error: ${message}`, 502, 'OPENAI_BAD_REQUEST');
    }

    throw new AppError('Failed to generate study content', 502, 'OPENAI_ERROR');
  }

  const raw = completion.choices[0]?.message?.content;

  if (!raw) {
    throw new AppError('Empty response from OpenAI', 502, 'OPENAI_EMPTY_RESPONSE');
  }

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new AppError('OpenAI returned invalid JSON', 502, 'OPENAI_INVALID_JSON');
  }

  const validated = validateStudyContent(parsed);

  if (!validated.success) {
    const details = validated.error.issues.map((i) => i.message).join('; ');
    throw new AppError(`Study content failed validation: ${details}`, 502, 'OPENAI_SCHEMA_MISMATCH');
  }

  return {
    content: validated.data,
    model: completion.model ?? env.openaiModel,
    usage: completion.usage ?? null,
  };
}
