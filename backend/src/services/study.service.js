import { generateStudyContent } from './openai.service.js';
import { saveStudySession, listStudySessions, getStudySessionById } from './storage.service.js';
import { AppError } from '../utils/AppError.js';

export async function explainTopic({ topic, level, focus }) {
  const { content, model, usage } = await generateStudyContent({ topic, level, focus });

  const session = saveStudySession({
    topic,
    level,
    focus,
    content,
    model,
  });

  return {
    sessionId: session.id,
    content,
    meta: {
      model,
      generatedAt: session.createdAt,
      usage,
    },
  };
}

export function getHistory({ limit, offset }) {
  return listStudySessions({ limit, offset });
}

export function getSessionById(id) {
  if (!id || typeof id !== 'string') {
    throw new AppError('Session ID is required', 400, 'VALIDATION_ERROR');
  }

  const session = getStudySessionById(id);

  if (!session) {
    throw new AppError('Study session not found', 404, 'NOT_FOUND');
  }

  return session;
}
