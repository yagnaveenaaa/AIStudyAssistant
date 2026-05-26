import { z } from 'zod';

export const explainRequestSchema = z.object({
  topic: z
    .string({ required_error: 'Topic is required' })
    .trim()
    .min(3, 'Topic must be at least 3 characters')
    .max(200, 'Topic must be at most 200 characters'),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional().default('beginner'),
  focus: z
    .enum(['overview', 'exam prep', 'quick recap'])
    .optional()
    .default('overview'),
});

export const historyQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});
