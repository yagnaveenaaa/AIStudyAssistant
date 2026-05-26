import { z } from 'zod';

const exampleSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const sectionSchema = z.object({
  title: z.string(),
  content: z.string(),
  highlights: z.array(z.string()).optional().default([]),
});

const sampleQuestionSchema = z.object({
  question: z.string(),
  hint: z.string().optional(),
  answer: z.string(),
});

const quizPrepSchema = z.object({
  focusAreas: z.array(z.string()),
  sampleQuestions: z.array(sampleQuestionSchema),
});

const glossaryEntrySchema = z.object({
  term: z.string(),
  definition: z.string(),
});

export const studyContentSchema = z.object({
  topic: z.string(),
  summary: z.string(),
  keyPoints: z.array(z.string()).min(1),
  sections: z.array(sectionSchema).min(1),
  examples: z.array(exampleSchema).min(1),
  quizPrep: quizPrepSchema,
  glossary: z.array(glossaryEntrySchema).optional().default([]),
});

export function validateStudyContent(data) {
  return studyContentSchema.safeParse(data);
}
