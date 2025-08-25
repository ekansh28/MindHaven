"use client";

import { Header } from '@/components/Header';
import { useMoodData } from '@/hooks/use-mood-data';
import { MoodChart } from '@/components/MoodChart';
import { JournalHistory } from '@/components/JournalHistory';
import { StreaksTracker } from '@/components/StreaksTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart } from 'lucide-react';

export default function Dashboard() {
  const { moodLogs, streak, isLoaded } = useMoodData();

  const sortedLogs = [...moodLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">Your Journey</h1>
        
        {isLoaded ? (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-3">
              <StreaksTracker streak={streak} />
            </div>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
                  <LineChart className="text-primary-foreground/80"/>
                  Mood Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-0">
                {moodLogs.length > 1 ? (
                  <MoodChart data={sortedLogs} />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground text-center">
                      Log your mood for a couple of days to see your trends here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="md:col-span-1">
              <JournalHistory logs={moodLogs} />
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-3">
                 <Skeleton className="h-24 w-full rounded-lg" />
              </div>
               <Card className="md:col-span-2">
                <CardHeader><Skeleton className="h-8 w-32 rounded-md" /></CardHeader>
                <CardContent className="pl-0"><Skeleton className="h-64 w-full rounded-md" /></CardContent>
              </Card>
              <div className="md:col-span-1">
                 <Skeleton className="h-96 w-full rounded-lg" />
              </div>
          </div>
        )}
      </main>
    </div>
  );
}
