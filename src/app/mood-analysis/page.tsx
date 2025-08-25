'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeUserMood } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuit, Loader, Quote } from 'lucide-react';
import type { MoodAnalysisOutput } from '@/lib/types';


export default function MoodAnalysisPage() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<MoodAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeUserMood({ text });
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to analyze mood:', error);
      // You could show a toast or an error message here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="w-full max-w-3xl mx-auto">
          <Card className="shadow-lg border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-semibold">
                <BrainCircuit className="text-primary-foreground/80" />
                AI Mood Journal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This is a dedicated space to write longer journal entries. The AI will analyze your entry and provide a reflection. Your entry here will not be automatically saved to your log.
              </p>
              <Textarea
                placeholder="Write whatever is on your mind..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[150px] bg-background focus:bg-white text-base"
                rows={6}
              />
              <Button onClick={handleSubmit} disabled={isLoading || !text.trim()} className="w-full mt-4" size="lg">
                {isLoading ? (
                  <>
                    <Loader className="mr-2 animate-spin" /> Analyzing...
                  </>
                ) : (
                  'Analyze My Entry'
                )}
              </Button>
            </CardContent>
          </Card>

          {isLoading && (
            <Card className="w-full mt-8 animate-pulse">
                <CardHeader><Skeleton className="h-8 w-48 rounded-md" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full rounded-md" />
                    <Skeleton className="h-6 w-32 rounded-md" />
                    <Skeleton className="h-16 w-full rounded-md" />
                </CardContent>
            </Card>
          )}

          {analysis && !isLoading && (
            <Card className="w-full mt-8 bg-accent/50 border-accent animate-in fade-in zoom-in-95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-semibold">
                  A Gentle Reflection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                    <p className="text-lg text-accent-foreground/90 italic">
                        "{analysis.reply}"
                    </p>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <h3 className="text-base font-semibold">Detected Mood:</h3>
                    <Badge variant="outline" className="text-base capitalize">
                        {analysis.mood}
                    </Badge>
                 </div>

                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                        <Quote className="text-accent-foreground/80" />
                        Suggested Quote:
                    </h3>
                    <p className="text-base text-accent-foreground/90 italic pl-6 border-l-2 border-accent-foreground/30">
                        "{analysis.suggested_quote}"
                    </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}