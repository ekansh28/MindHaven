"use client"

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MoodSelector } from '@/components/MoodSelector';
import { AffirmationCard } from '@/components/AffirmationCard';
import type { Mood, MoodLog } from '@/lib/types';
import { generateAffirmation } from '@/app/actions';
import { useMoodData } from '@/hooks/use-mood-data';

export default function Home() {
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const [isLoadingAffirmation, setIsLoadingAffirmation] = useState(false);
  const { addMoodLog, getTodayLog, isLoaded } = useMoodData();

  const handleFetchAffirmation = useCallback(async (mood: Mood) => {
    if (mood !== 'extremely-low') {
      setIsLoadingAffirmation(true);
      setAffirmation(null);
      try {
        const result = await generateAffirmation({ mood });
        setAffirmation(result.affirmation);
      } catch (error) {
        console.error(error);
        setAffirmation("Remember to be kind to yourself today.");
      } finally {
        setIsLoadingAffirmation(false);
      }
    } else {
      setAffirmation(null);
    }
  }, []);

  const handleMoodLogged = (mood: Mood, journal: string) => {
    addMoodLog(mood, journal);
    handleFetchAffirmation(mood);
  };
  
  useEffect(() => {
    if (isLoaded && getTodayLog) {
        handleFetchAffirmation(getTodayLog.mood);
    }
  }, [isLoaded, getTodayLog, handleFetchAffirmation]);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-down">How are you feeling today?</h1>
          <p className="text-lg text-muted-foreground animate-fade-in-down delay-200">Log your mood to see trends and get a personalized affirmation.</p>
        </div>
        <MoodSelector onMoodLogged={handleMoodLogged} todayLog={getTodayLog as MoodLog | undefined} isLoaded={isLoaded} />
        <AffirmationCard affirmation={affirmation} isLoading={isLoadingAffirmation} />
      </main>
    </div>
  );
}
