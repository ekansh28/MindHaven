'use server';

import { generateAffirmation as generateAffirmationFlow, type AffirmationInput } from '@/ai/flows/affirmation-generator';
import { analyzeMood as analyzeMoodFlow } from '@/ai/flows/mood-analyst';
import type { MoodAnalysisInput } from '@/lib/types';


export async function generateAffirmation(input: AffirmationInput) {
    // A mapping from mood to a slightly more descriptive phrase for better AI results.
    const moodContext = {
        happy: "feeling happy and joyful",
        sad: "feeling sad and a bit down",
        anxious: "feeling anxious and worried",
        calm: "feeling calm and peaceful",
        angry: "feeling angry and frustrated",
        'extremely-low': "feeling extremely low and overwhelmed"
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
    try {
        const result = await analyzeMoodFlow(input);
        return result;
    } catch (error) {
        console.error("Error analyzing mood:", error);
        return {
            reply: "I'm having a little trouble understanding right now, but please know that your feelings are valid. It's okay to not be okay.",
            mood: "Neutral",
            confidence: 0.1,
            suggested_quote: "Be gentle with yourself, you're doing the best you can."
        };
    }
}