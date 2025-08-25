import { z } from 'zod';

export type Mood = 'happy' | 'sad' | 'anxious' | 'calm' | 'angry' | 'extremely-low' | 'stressed' | 'neutral';

export interface MoodLog {
  id: string;
  date: string;
  mood: Mood;
  journal?: string;
}

export const MoodAnalysisInputSchema = z.object({
  text: z.string().describe('The journal entry or text from the user.'),
});
export type MoodAnalysisInput = z.infer<typeof MoodAnalysisInputSchema>;

export const MoodAnalysisOutputSchema = z.object({
  reply: z.string().describe('A short, kind, empathetic, and encouraging reply to the user.'),
  mood: z
    .enum(['Happy', 'Sad', 'Angry', 'Anxious', 'Stressed', 'Calm', 'Neutral'])
    .describe('The detected emotional state of the user.'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('A 0-1 number representing the confidence in the mood detection.'),
  suggested_quote: z
    .string()
    .describe('An uplifting quote or affirmation that fits the detected mood.'),
});
export type MoodAnalysisOutput = z.infer<typeof MoodAnalysisOutputSchema>;
