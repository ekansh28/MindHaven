"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export function Header() {
  const pathname = usePathname();

  const navLinkClasses = (path: string) =>
    cn(
      "transition-colors hover:text-primary-foreground",
      pathname === path ? "text-primary-foreground font-semibold" : "text-muted-foreground"
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary-foreground/80" />
            <span className="font-bold text-lg">Mindful Journey</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-base font-medium">
          <Link href="/" className={navLinkClasses('/')}>
            Home
          </Link>
          <Link href="/dashboard" className={navLinkClasses('/dashboard')}>
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
