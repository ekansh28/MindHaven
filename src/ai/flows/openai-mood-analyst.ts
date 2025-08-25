'use server';

import OpenAI from 'openai';
import type { MoodAnalysisInput, MoodAnalysisOutput } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeUserMoodWithOpenAI(input: MoodAnalysisInput): Promise<MoodAnalysisOutput> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a friendly and supportive mental health chatbot. Your job is to chat with the user in a warm and empathetic way, like a caring companion.

You will analyze the user's emotional state (mood) from their message and respond with a JSON object containing:
- reply: A short, kind, and conversational response (2-3 sentences max)
- mood: One of these exact values: "Happy", "Sad", "Angry", "Anxious", "Stressed", "Calm", "Neutral"
- confidence: A number between 0 and 1 indicating how confident you are in the mood assessment
- suggested_quote: An inspiring or comforting quote relevant to their mood

Important:
- Keep your chatbot replies short, kind, and conversational
- If the user's mood seems very negative (extremely sad, hopeless, or suicidal), gently encourage them in your reply to seek professional help and provide these helpline numbers: Crisis Text Line (text HOME to 741741) or the National Suicide Prevention Lifeline (call or text 988)
- Never give medical or diagnostic advice. Focus only on providing support and encouragement
- Always respond with valid JSON only`
        },
        {
          role: "user",
          content: input.text
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(response) as MoodAnalysisOutput;
    
    // Validate the response has required fields
    if (!parsed.reply || !parsed.mood || typeof parsed.confidence !== 'number') {
      throw new Error('Invalid response format from OpenAI');
    }

    return parsed;
  } catch (error) {
    console.error("Error analyzing mood with OpenAI:", error);
    return {
      reply: "I'm having a little trouble understanding right now, but please know that your feelings are valid. It's okay to not be okay.",
      mood: "Neutral",
      confidence: 0.1,
      suggested_quote: "Be gentle with yourself, you're doing the best you can."
    };
  }
}