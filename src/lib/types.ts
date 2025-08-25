export type Mood = 'happy' | 'sad' | 'anxious' | 'calm' | 'angry' | 'extremely-low' | 'stressed' | 'neutral';

export interface MoodLog {
  id: string;
  date: string;
  mood: Mood;
  journal?: string;
}
