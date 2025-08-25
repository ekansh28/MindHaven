import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { MoodLog } from '@/lib/types';
import { format } from 'date-fns';
import { BookText } from 'lucide-react';

interface JournalHistoryProps {
  logs: MoodLog[];
}

export function JournalHistory({ logs }: JournalHistoryProps) {
    const journalEntries = logs.filter(log => log.journal && log.journal.trim() !== '');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
            <BookText className="text-primary-foreground/80"/>
            Journal History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {journalEntries.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="pr-4 space-y-6">
              {journalEntries.map((log, index) => (
                <div key={log.id}>
                  <div className="mb-2">
                    <p className="font-semibold text-base">{format(new Date(log.date), 'MMMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground capitalize">Mood: {log.mood.replace('-',' ')}</p>
                  </div>
                  <p className="text-base text-foreground/80 leading-relaxed">{log.journal}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground text-center">Your journal entries will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
