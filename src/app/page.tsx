"use client"

import { Header } from '@/components/Header';
import { ChatInterface } from '@/components/ChatInterface';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-down">How are you feeling today?</h1>
          <p className="text-lg text-muted-foreground animate-fade-in-down delay-200">Chat with your AI assistant to reflect on your mood.</p>
        </div>
        <ChatInterface />
      </main>
    </div>
  );
}
