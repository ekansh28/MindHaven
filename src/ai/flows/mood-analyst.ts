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
import type { MoodAnalysisInput, MoodAnalysisOutput } from '@/lib/types';
import { MoodAnalysisInputSchema, MoodAnalysisOutputSchema } from '@/lib/types';


export async function analyzeMood(input: MoodAnalysisInput): Promise<MoodAnalysisOutput> {
  return moodAnalystFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moodAnalystPrompt',
  input: {schema: MoodAnalysisInputSchema},
  output: {schema: MoodAnalysisOutputSchema},
  prompt: `You are a friendly and supportive mental health chatbot. Your job is to chat with the user in a warm and empathetic way, like a caring companion.

You will analyze the user's emotional state (mood) from their message. Here is the user's message:
"{{{text}}}"

Important:
- Keep your chatbot replies short, kind, and conversational.
- If the user's mood seems very negative (extremely sad, hopeless, or suicidal), gently encourage them in your reply to seek professional help and provide these helpline numbers: Crisis Text Line (text HOME to 741741) or the National Suicide Prevention Lifeline (call or text 988).
- Never give medical or diagnostic advice. Focus only on providing support and encouragement.

Please provide your response in the requested JSON format.`,
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
