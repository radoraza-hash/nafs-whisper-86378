import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtitle?: string;
  color?: 'spiritual' | 'sunset' | 'night';
}

export function StatCard({ icon, label, value, subtitle, color = 'spiritual' }: StatCardProps) {
  const gradients = {
    spiritual: 'bg-gradient-spiritual',
    sunset: 'bg-gradient-sunset',
    night: 'bg-gradient-night'
  };

  return (
    <Card className={cn(
      'p-6 text-center border-0',
      gradients[color]
    )}>
      <div className="text-4xl mb-3">
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1 text-primary-foreground">
        {value}
      </div>
      <div className="text-sm font-medium text-primary-foreground/90 mb-1">
        {label}
      </div>
      {subtitle && (
        <div className="text-xs text-primary-foreground/70">
          {subtitle}
        </div>
      )}
    </Card>
  );
}
