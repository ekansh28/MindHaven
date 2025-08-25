export type Mood = 'happy' | 'sad' | 'anxious' | 'calm' | 'angry' | 'extremely-low';

export interface MoodLog {
  id: string;
  date: string;
  mood: Mood;
  journal?: string;
}
