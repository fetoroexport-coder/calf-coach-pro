import { Phase } from '@/data/workoutData';

interface MovementIndicatorProps {
  phase: Phase;
}

export const MovementIndicator = ({ phase }: MovementIndicatorProps) => {
  const getPosition = () => {
    switch (phase) {
      case 'down':
        return 'translate-y-8 scale-95';
      case 'stretch':
      case 'hold':
        return 'translate-y-12 scale-90';
      case 'up':
        return 'translate-y-0 scale-100';
      case 'rest':
        return 'translate-y-4 scale-100';
      default:
        return 'translate-y-0';
    }
  };

  const getColor = () => {
    switch (phase) {
      case 'down':
        return 'from-phase-down to-phase-down/50';
      case 'stretch':
      case 'hold':
        return 'from-phase-stretch to-phase-stretch/50';
      case 'up':
        return 'from-phase-up to-phase-up/50';
      case 'rest':
        return 'from-phase-rest to-phase-rest/50';
      default:
        return 'from-primary to-primary/50';
    }
  };

  return (
    <div className="relative w-24 h-32 flex items-center justify-center">
      {/* Track */}
      <div className="absolute inset-x-4 top-2 bottom-2 rounded-full bg-muted/50" />
      
      {/* Moving indicator */}
      <div
        className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${getColor()} 
          shadow-lg transition-all duration-300 ease-out ${getPosition()}`}
      >
        <div className="absolute inset-2 rounded-full bg-card/30" />
      </div>

      {/* Labels */}
      <div className="absolute -right-12 top-1 text-xs text-muted-foreground">UP</div>
      <div className="absolute -right-16 bottom-1 text-xs text-muted-foreground">DOWN</div>
    </div>
  );
};
