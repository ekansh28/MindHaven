'use server';

import { generateAffirmation as generateAffirmationFlow, type AffirmationInput } from '@/ai/flows/affirmation-generator';
import { analyzeUserMoodWithOpenAI } from '@/ai/flows/openai-mood-analyst';
import type { MoodAnalysisInput } from '@/lib/types';


export async function generateAffirmation(input: AffirmationInput) {
    // A mapping from mood to a slightly more descriptive phrase for better AI results.
    const moodContext: Record<string, string> = {
        happy: "feeling happy and joyful",
        sad: "feeling sad and a bit down",
        anxious: "feeling anxious and worried",
        calm: "feeling calm and peaceful",
        angry: "feeling angry and frustrated",
        'extremely-low': "feeling extremely low and overwhelmed",
        stressed: "feeling stressed and overwhelmed",
        neutral: "feeling neutral and balanced"
    }
    
    try {
        const result = await generateAffirmationFlow({ mood: moodContext[input.mood] || input.mood });
        return result;
    } catch (error) {
        console.error("Error generating affirmation:", error);
        // Provide a generic, safe fallback affirmation.
        return { affirmation: "You possess a strength that you may not even be aware of. Be gentle with yourself." };
    }
}

export async function analyzeUserMood(input: MoodAnalysisInput) {
    return await analyzeUserMoodWithOpenAI(input);
}
