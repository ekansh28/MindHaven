'use server';

/**
 * @fileOverview A mental health assistant that analyzes the user's mood from a text input.
 *
 * - analyzeMood - A function that takes a user's text and returns a mood analysis.
 * - MoodAnalysisInput - The input type for the analyzeMood function.
 * - MoodAnalysisOutput - The return type for the analyzeMood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { MoodAnalysisInput, MoodAnalysisOutput } from '@/app/mood-analysis/page';

const MoodAnalysisInputSchema = z.object({
  text: z.string().describe('The journal entry or text from the user.'),
});

const MoodAnalysisOutputSchema = z.object({
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

export async function analyzeMood(input: MoodAnalysisInput): Promise<MoodAnalysisOutput> {
  return moodAnalystFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moodAnalystPrompt',
  input: {schema: MoodAnalysisInputSchema},
  output: {schema: MoodAnalysisOutputSchema},
  prompt: `You are a supportive mental health assistant. Your job is to talk to the user in a kind, empathetic, and encouraging way.

You will analyze the user's emotional state (mood) from their message.

Here is the user's message:
"{{{text}}}"

Important:
- Keep your reply short, warm, and supportive.
- If the mood seems very negative (like extremely sad or suicidal), include a gentle suggestion in your reply to reach out to professional help and provide these helpline numbers: Crisis Text Line (text HOME to 741741) or the National Suicide Prevention Lifeline (call or text 988).

Please provide your response in the requested format.`,
});

const moodAnalystFlow = ai.defineFlow(
  {
    name: 'moodAnalystFlow',
    inputSchema: MoodAnalysisInputSchema,
    outputSchema: MoodAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
