"use client"

import type { MoodLog } from '@/lib/types';
import { format } from 'date-fns';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface MoodChartProps {
  data: MoodLog[];
}

const moodToValue: Record<string, number> = {
  'extremely-low': 0,
  'sad': 1,
  'angry': 2,
  'anxious': 3,
  'stressed': 3.5,
  'neutral': 3,
  'calm': 4,
  'happy': 5,
};

const valueToMood = ['Ext. Low', 'Sad', 'Angry', 'Anxious', 'Calm', 'Happy'];

const chartConfig = {
  mood: {
    label: "Mood",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function MoodChart({ data }: MoodChartProps) {
  const chartData = data.map(log => ({
    date: log.date,
    mood: moodToValue[log.mood],
  })).slice(-30); // Show last 30 entries

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), 'MMM d')}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tickFormatter={(value) => valueToMood[value]}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<ChartTooltipContent
                formatter={(value) => valueToMood[value as number]}
                labelFormatter={(label) => format(new Date(label), 'eeee, MMM d')}
             />}
          />
          <Area type="monotone" dataKey="mood" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorMood)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
