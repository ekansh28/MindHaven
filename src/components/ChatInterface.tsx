"use client";

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { analyzeUserMood } from '@/app/actions';
import { useMoodData } from '@/hooks/use-mood-data';
import { Loader, Send, Sparkles, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Mood } from '@/lib/types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  quote?: string;
}

const moodMapping: { [key: string]: Mood } = {
    'Happy': 'happy',
    'Sad': 'sad',
    'Angry': 'angry',
    'Anxious': 'anxious',
    'Stressed': 'stressed',
    'Calm': 'calm',
    'Neutral': 'neutral',
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addMoodLog, getTodayLog } = useMoodData();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: crypto.randomUUID(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await analyzeUserMood({ text: input });
      
      const aiMessage: Message = { 
        id: crypto.randomUUID(), 
        text: result.reply, 
        sender: 'ai',
        quote: result.suggested_quote
      };
      setMessages(prev => [...prev, aiMessage]);

      const mood = moodMapping[result.mood];
      if (mood && !getTodayLog) { // Only log if no log for today exists
        addMoodLog(mood, input);
      }
      
    } catch (error) {
      console.error("Error analyzing mood:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: "I'm having a little trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-lg border-border/60">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground pt-16">
                <Sparkles className="mx-auto h-12 w-12 text-primary/30" />
                <p className="mt-4">Your conversation will appear here.</p>
                <p>Start by telling me how you feel.</p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3",
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender === 'ai' && (
                <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                  <AvatarFallback><Sparkles size={18} /></AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                  "p-3 rounded-lg max-w-sm", 
                   message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              )}>
                <p className="text-sm">{message.text}</p>
                {message.quote && (
                    <div className="mt-3 pt-2 border-t border-secondary-foreground/20">
                        <p className="text-xs italic text-secondary-foreground/80">
                            "{message.quote}"
                        </p>
                    </div>
                )}
              </div>
              {message.sender === 'user' && (
                 <Avatar className="w-8 h-8 bg-muted text-muted-foreground">
                   <AvatarFallback><User size={18}/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-3 justify-start">
                 <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                    <AvatarFallback><Loader className="animate-spin" size={18} /></AvatarFallback>
                 </Avatar>
                 <div className="p-3 rounded-lg max-w-sm bg-secondary">
                    <p className="text-sm italic text-muted-foreground">Thinking...</p>
                 </div>
             </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send size={16} />
          </Button>
        </form>
         {getTodayLog && (
            <p className="text-xs text-center text-muted-foreground mt-2">
                Your mood has been logged for today. Further chats here won't create new logs.
            </p>
        )}
      </div>
    </Card>
  );
}
