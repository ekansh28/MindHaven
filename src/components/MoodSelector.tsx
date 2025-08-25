"use client"

import { useState, useEffect } from 'react';
import type { Mood, MoodLog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Smile, Frown, Annoyed, Wind, Angry, PhoneOutgoing } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

interface MoodSelectorProps {
  onMoodLogged: (mood: Mood, journal: string) => void;
  todayLog?: MoodLog;
  isLoaded: boolean;
}

const moodOptions: { mood: Mood; icon: React.ReactNode; label: string; color: string }[] = [
  { mood: 'happy', icon: <Smile />, label: 'Happy', color: 'hover:bg-yellow-200/50 border-yellow-300' },
  { mood: 'calm', icon: <Wind />, label: 'Calm', color: 'hover:bg-blue-200/50 border-blue-300' },
  { mood: 'anxious', icon: <Annoyed />, label: 'Anxious', color: 'hover:bg-purple-200/50 border-purple-300' },
  { mood: 'sad', icon: <Frown />, label: 'Sad', color: 'hover:bg-gray-300/50 border-gray-400' },
  { mood: 'angry', icon: <Angry />, label: 'Angry', color: 'hover:bg-red-300/50 border-red-400' },
  { mood: 'extremely-low', icon: <Frown />, label: 'Extremely Low', color: 'hover:bg-black/20 border-black' },
];

export function MoodSelector({ onMoodLogged, todayLog, isLoaded }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [journal, setJournal] = useState('');
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);

  useEffect(() => {
    if (todayLog) {
      setSelectedMood(todayLog.mood);
      setJournal(todayLog.journal || '');
    }
  }, [todayLog]);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    if (mood === 'extremely-low') {
      setShowEmergencyDialog(true);
    }
  };

  const handleSubmit = () => {
    if (selectedMood) {
      onMoodLogged(selectedMood, journal);
    }
  };
  
  if (!isLoaded) {
    return <Skeleton className="w-full max-w-2xl h-[400px] rounded-lg" />
  }

  if (todayLog && !selectedMood) {
    setSelectedMood(todayLog.mood)
  }

  return (
    <>
      <Card className="w-full max-w-2xl shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-center font-headline">{todayLog ? "Today's Log" : "Select Your Mood"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
            {moodOptions.map(({ mood, icon, label, color }) => (
              <Button
                key={mood}
                variant="outline"
                className={cn(
                  "flex flex-col h-20 gap-2 transition-all duration-200 ease-in-out transform hover:scale-105 border-2",
                  color,
                  selectedMood === mood ? 'bg-primary/50 border-primary' : 'bg-transparent'
                )}
                onClick={() => handleMoodSelect(mood)}
                disabled={!!todayLog}
              >
                {icon}
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
          <Textarea
            placeholder="Add a private journal entry... (optional)"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="min-h-[100px] bg-background"
            disabled={!!todayLog}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full" disabled={!selectedMood || !!todayLog}>
            {todayLog ? 'Mood Logged for Today' : 'Log Mood'}
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You're Not Alone</AlertDialogTitle>
            <AlertDialogDescription>
              It's brave of you to acknowledge these feelings. Please know that help is available and you are not alone. Here are some resources that can provide immediate support.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
            <AlertDialogAction asChild>
                <a href="tel:988" className="flex items-center justify-center gap-2 w-full">
                    <PhoneOutgoing size={16} /> Call 988 (US)
                </a>
            </AlertDialogAction>
            <AlertDialogAction asChild>
                 <a href="tel:9152987821" className="flex items-center justify-center gap-2 w-full">
                    <PhoneOutgoing size={16} /> Call 9152987821 (India)
                </a>
            </AlertDialogAction>
            <AlertDialogCancel onClick={() => setSelectedMood(null)}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
