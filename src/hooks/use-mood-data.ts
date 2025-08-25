"use client";

import { useState, useEffect, useCallback } from 'react';
import type { MoodLog, Mood } from '@/lib/types';
import { differenceInCalendarDays, parseISO, startOfToday, startOfYesterday } from 'date-fns';

const STORAGE_KEY = 'mindful-journey-data';

export function useMoodData() {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsedLogs: MoodLog[] = JSON.parse(item);
        // Sort by date descending
        parsedLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setMoodLogs(parsedLogs);
      }
    } catch (error) {
      console.error("Failed to load mood data from localStorage", error);
      setMoodLogs([]);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  const addMoodLog = useCallback((mood: Mood, journal?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const otherLogs = moodLogs.filter(log => log.date.split('T')[0] !== todayStr);

    const newLog: MoodLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood,
      journal: journal || '',
    };
    const updatedLogs = [newLog, ...otherLogs];
    updatedLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setMoodLogs(updatedLogs);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error("Failed to save mood data to localStorage", error);
    }
  }, [moodLogs]);
  
  const getTodayLog = moodLogs.find(log => new Date(log.date).toDateString() === new Date().toDateString());

  const calculateStreak = useCallback(() => {
    if (!moodLogs || moodLogs.length === 0) {
        return 0;
    }

    const uniqueDayLogs = Array.from(new Map(moodLogs.map(log => [log.date.split('T')[0], log])).values())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (uniqueDayLogs.length === 0) {
        return 0;
    }

    const today = startOfToday();
    const firstLogDate = parseISO(uniqueDayLogs[0].date);
    
    if (differenceInCalendarDays(today, firstLogDate) > 1) {
        return 0; // No log for today or yesterday
    }
    
    let streak = 1;
    let lastDate = firstLogDate;

    for (let i = 1; i < uniqueDayLogs.length; i++) {
        const currentDate = parseISO(uniqueDayLogs[i].date);
        if (differenceInCalendarDays(lastDate, currentDate) === 1) {
            streak++;
            lastDate = currentDate;
        } else {
            break; // Gap in days
        }
    }
    
    return streak;
}, [moodLogs]);
  
  const streak = isLoaded ? calculateStreak() : 0;

  return { moodLogs, addMoodLog, getTodayLog, streak, isLoaded };
}
