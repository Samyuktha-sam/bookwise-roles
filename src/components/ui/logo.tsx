import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-bold',
    lg: 'text-3xl font-bold',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="rounded-lg bg-primary p-2 shadow-card">
        <BookOpen className={cn(sizeClasses[size], 'text-primary-foreground')} />
      </div>
      {showText && (
        <span className={cn(textSizeClasses[size], 'text-foreground')}>
          BookMS
        </span>
      )}
    </div>
  );
}