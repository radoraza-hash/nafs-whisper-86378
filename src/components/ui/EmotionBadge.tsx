import { cn } from "@/lib/utils";

interface EmotionBadgeProps {
  emotion: 'joy' | 'sadness' | 'anxiety' | 'serenity' | 'gratitude' | 'anger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const emotionLabels = {
  joy: 'Joie',
  sadness: 'Tristesse',
  anxiety: 'Anxiété',
  serenity: 'Sérénité',
  gratitude: 'Gratitude',
  anger: 'Colère',
  neutral: 'Neutre'
};

const emotionEmojis = {
  joy: '😊',
  sadness: '😢',
  anxiety: '😰',
  serenity: '😌',
  gratitude: '🙏',
  anger: '😠',
  neutral: '😐'
};

export function EmotionBadge({ emotion, size = 'md', showLabel = true }: EmotionBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        `emotion-${emotion}`,
        sizeClasses[size]
      )}
    >
      <span>{emotionEmojis[emotion]}</span>
      {showLabel && <span>{emotionLabels[emotion]}</span>}
    </span>
  );
}
