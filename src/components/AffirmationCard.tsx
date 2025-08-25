"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Quote } from 'lucide-react';

interface AffirmationCardProps {
  affirmation: string | null;
  isLoading: boolean;
}

export function AffirmationCard({ affirmation, isLoading }: AffirmationCardProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mt-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!affirmation) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mt-8 bg-accent/30 border-accent shadow-md animate-in fade-in zoom-in-95">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Quote className="text-accent-foreground" />
          A Thought for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-accent-foreground/80 italic">
          "{affirmation}"
        </p>
      </CardContent>
    </Card>
  );
}
