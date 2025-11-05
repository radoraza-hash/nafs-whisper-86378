import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={cn('animate-spin', sizeClasses[size])}>
        🌙
      </div>
      {text && (
        <p className="text-muted-foreground text-sm">{text}</p>
      )}
    </div>
  );
}
