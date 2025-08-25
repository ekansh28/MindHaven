import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Medal, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreaksTrackerProps {
  streak: number;
}

export function StreaksTracker({ streak }: StreaksTrackerProps) {
  const achievements = [
    { name: 'First Step', goal: 1, icon: <Medal /> },
    { name: '7-Day Mindfulness', goal: 7, icon: <ShieldCheck /> },
    { name: '30-Day Consistency', goal: 30, icon: <Flame /> },
  ];

  return (
    <Card className="bg-card border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-semibold">
          <Flame className="text-primary-foreground/80" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex items-center gap-4 text-center md:text-left">
          <Flame className="w-16 h-16 text-orange-500" />
          <div>
            <p className="text-5xl font-bold">{streak}</p>
            <p className="text-muted-foreground">Day Streak</p>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-4">
            {achievements.map(ach => (
                <div key={ach.name} className={cn("flex flex-col items-center p-4 rounded-lg transition-all", streak >= ach.goal ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground")}>
                    <div className="mb-2">{ach.icon}</div>
                    <p className="text-xs text-center font-semibold">{ach.name}</p>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
