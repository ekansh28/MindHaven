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
        <CardTitle className="flex items-center gap-2">
            <BookText className="text-primary"/>
            Journal History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {journalEntries.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="pr-4">
              {journalEntries.map((log, index) => (
                <div key={log.id}>
                  <div className="mb-4">
                    <p className="font-semibold">{format(new Date(log.date), 'MMMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground capitalize">Mood: {log.mood.replace('-',' ')}</p>
                    <p className="text-sm mt-1">{log.journal}</p>
                  </div>
                  {index < journalEntries.length - 1 && <Separator className="my-4" />}
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
