import { Play, Pause, SkipForward, Volume2, VolumeX, ChevronRight } from 'lucide-react';
import { Exercise } from '@/data/workoutData';
import { Leg } from '@/hooks/useWorkoutTimer';

interface WorkoutControlsProps {
  isRunning: boolean;
  soundEnabled: boolean;
  exercise: Exercise;
  currentLeg: Leg;
  onStart: () => void;
  onPause: () => void;
  onSkipRep: () => void;
  onSkipSet: () => void;
  onSkipLeg: () => void;
  onSkipExercise: () => void;
  onToggleSound: () => void;
}

export const WorkoutControls = ({
  isRunning,
  soundEnabled,
  exercise,
  currentLeg,
  onStart,
  onPause,
  onSkipSet,
  onSkipLeg,
  onSkipExercise,
  onToggleSound,
}: WorkoutControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Main controls */}
      <div className="flex items-center gap-4">
        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className="p-4 rounded-full bg-secondary hover:bg-accent transition-colors"
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? (
            <Volume2 className="w-6 h-6" />
          ) : (
            <VolumeX className="w-6 h-6 text-muted-foreground" />
          )}
        </button>

        {/* Play/Pause */}
        <button
          onClick={isRunning ? onPause : onStart}
          className="p-6 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all glow-primary animate-pulse-glow"
        >
          {isRunning ? (
            <Pause className="w-10 h-10" />
          ) : (
            <Play className="w-10 h-10 ml-1" />
          )}
        </button>

        {/* Skip Exercise */}
        <button
          onClick={onSkipExercise}
          className="p-4 rounded-full bg-secondary hover:bg-accent transition-colors"
          title="Skip exercise"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Skip buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSkipSet}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-accent transition-colors text-sm font-medium"
        >
          Skip Set
          <ChevronRight className="w-4 h-4" />
        </button>

        {exercise.isSingleLeg && currentLeg === 'right' && (
          <button
            onClick={onSkipLeg}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-accent transition-colors text-sm font-medium"
          >
            Skip to Left Leg
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
