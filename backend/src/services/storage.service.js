import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

let db;

function ensureDataDir() {
  const dir = path.dirname(env.databasePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function initDb() {
  ensureDataDir();
  db = new Database(env.databasePath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS study_sessions (
      id TEXT PRIMARY KEY,
      topic TEXT NOT NULL,
      level TEXT NOT NULL,
      focus TEXT NOT NULL,
      response_json TEXT NOT NULL,
      model TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_study_sessions_created_at
      ON study_sessions (created_at DESC);
  `);
}

export function getDatabase() {
  if (!db) {
    initDb();
  }
  return db;
}

export function saveStudySession({ topic, level, focus, content, model }) {
  const database = getDatabase();
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  const stmt = database.prepare(`
    INSERT INTO study_sessions (id, topic, level, focus, response_json, model, created_at)
    VALUES (@id, @topic, @level, @focus, @responseJson, @model, @createdAt)
  `);

  try {
    stmt.run({
      id,
      topic,
      level,
      focus,
      responseJson: JSON.stringify(content),
      model: model ?? null,
      createdAt,
    });
  } catch {
    throw new AppError('Failed to save study session', 500, 'STORAGE_ERROR');
  }

  return { id, createdAt };
}

export function listStudySessions({ limit, offset }) {
  const database = getDatabase();

  const rows = database
    .prepare(
      `
    SELECT id, topic, level, focus, model, created_at AS createdAt
    FROM study_sessions
    ORDER BY created_at DESC
    LIMIT @limit OFFSET @offset
  `
    )
    .all({ limit, offset });

  const { total } = database
    .prepare('SELECT COUNT(*) AS total FROM study_sessions')
    .get();

  return { sessions: rows, total, limit, offset };
}

export function getStudySessionById(id) {
  const database = getDatabase();

  const row = database
    .prepare(
      `
    SELECT id, topic, level, focus, response_json AS responseJson, model, created_at AS createdAt
    FROM study_sessions
    WHERE id = @id
  `
    )
    .get({ id });

  if (!row) {
    return null;
  }

  let content;

  try {
    content = JSON.parse(row.responseJson);
  } catch {
    throw new AppError('Corrupted session data', 500, 'STORAGE_CORRUPT');
  }

  return {
    id: row.id,
    topic: row.topic,
    level: row.level,
    focus: row.focus,
    content,
    model: row.model,
    createdAt: row.createdAt,
  };
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
