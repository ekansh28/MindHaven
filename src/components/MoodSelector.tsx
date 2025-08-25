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

const moodOptions: { mood: Mood; icon: React.ReactNode; label: string; color: string, selectedColor: string }[] = [
  { mood: 'happy', icon: <Smile />, label: 'Happy', color: 'border-yellow-300', selectedColor: 'bg-yellow-300/30 text-yellow-800' },
  { mood: 'calm', icon: <Wind />, label: 'Calm', color: 'border-blue-300', selectedColor: 'bg-blue-300/30 text-blue-800' },
  { mood: 'anxious', icon: <Annoyed />, label: 'Anxious', color: 'border-purple-300', selectedColor: 'bg-purple-300/30 text-purple-800' },
  { mood: 'sad', icon: <Frown />, label: 'Sad', color: 'border-gray-400', selectedColor: 'bg-gray-400/30 text-gray-800' },
  { mood: 'angry', icon: <Angry />, label: 'Angry', color: 'border-red-400', selectedColor: 'bg-red-400/30 text-red-800' },
  { mood: 'extremely-low', icon: <Frown />, label: 'Extremely Low', color: 'border-slate-600', selectedColor: 'bg-slate-600/30 text-slate-100' },
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
      <Card className="w-full max-w-2xl shadow-lg transition-all duration-300 border-border/60">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-foreground/90">{todayLog ? "Today's Log" : "Select Your Mood"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
            {moodOptions.map(({ mood, icon, label, color, selectedColor }) => (
              <Button
                key={mood}
                variant="outline"
                className={cn(
                  "flex flex-col h-24 gap-2 transition-all duration-200 ease-in-out transform hover:scale-105 border-2 rounded-lg",
                  color,
                  selectedMood === mood ? selectedColor : 'bg-background hover:bg-secondary'
                )}
                onClick={() => handleMoodSelect(mood)}
                disabled={!!todayLog}
              >
                {icon}
                <span className="text-sm font-medium">{label}</span>
              </Button>
            ))}
          </div>
          <Textarea
            placeholder="Add a private journal entry... (optional)"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="min-h-[100px] bg-background focus:bg-white"
            disabled={!!todayLog}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full" size="lg" disabled={!selectedMood || !!todayLog}>
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
