'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized affirmations based on the user's mood.
 *
 * - generateAffirmation - A function that takes a mood as input and returns a personalized affirmation.
 * - AffirmationInput - The input type for the generateAffirmation function.
 * - AffirmationOutput - The return type for the generateAffirmation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AffirmationInputSchema = z.object({
  mood: z
    .string()
    .describe("The user's current mood (e.g., happy, sad, anxious, calm, angry)."),
});
export type AffirmationInput = z.infer<typeof AffirmationInputSchema>;

const AffirmationOutputSchema = z.object({
  affirmation: z.string().describe('A personalized affirmation to uplift the user.'),
});
export type AffirmationOutput = z.infer<typeof AffirmationOutputSchema>;

export async function generateAffirmation(input: AffirmationInput): Promise<AffirmationOutput> {
  return generateAffirmationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'affirmationPrompt',
  input: {schema: AffirmationInputSchema},
  output: {schema: AffirmationOutputSchema},
  prompt: `You are an affirmation expert. Generate a personalized affirmation to uplift and encourage the user based on their current mood.

Mood: {{{mood}}}

Affirmation:`,
});

const generateAffirmationFlow = ai.defineFlow(
  {
    name: 'generateAffirmationFlow',
    inputSchema: AffirmationInputSchema,
    outputSchema: AffirmationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
