import { Exercise } from '@/data/workoutData';
import { Leg } from '@/hooks/useWorkoutTimer';
import { User } from 'lucide-react';

interface ExerciseInfoProps {
  exercise: Exercise;
  currentSet: number;
  currentLeg: Leg;
  exerciseIndex: number;
  totalExercises: number;
}

export const ExerciseInfo = ({
  exercise,
  currentSet,
  currentLeg,
  exerciseIndex,
  totalExercises,
}: ExerciseInfoProps) => {
  return (
    <div className="text-center space-y-4">
      {/* Exercise counter */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm">
        <span className="text-muted-foreground">Exercise</span>
        <span className="font-bold text-primary">
          {exerciseIndex + 1} / {totalExercises}
        </span>
      </div>

      {/* Exercise name */}
      <h2 className="text-4xl font-black tracking-tight">
        {exercise.name}
      </h2>

      {/* Description */}
      <p className="text-muted-foreground text-lg max-w-md mx-auto">
        {exercise.description}
      </p>

      {/* Set and leg info */}
      <div className="flex items-center justify-center gap-6 text-lg">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Set:</span>
          <span className="font-bold text-2xl">
            {currentSet} / {exercise.sets}
          </span>
        </div>

        {exercise.isSingleLeg && currentLeg && (
          <div className="flex items-center gap-2">
            <User className={`w-6 h-6 ${
              currentLeg === 'right' ? 'text-primary' : 'text-phase-stretch'
            }`} />
            <span className={`font-bold text-2xl uppercase ${
              currentLeg === 'right' ? 'text-primary' : 'text-phase-stretch'
            }`}>
              {currentLeg}
            </span>
          </div>
        )}
      </div>

      {/* Tempo info */}
      {!exercise.isHold && (
        <div className="flex justify-center gap-4 text-sm">
          <span className="text-phase-down">
            ↓ {exercise.tempo.down}s
          </span>
          <span className="text-phase-stretch">
            ⏸ {exercise.tempo.stretch}s
          </span>
          <span className="text-phase-up">
            ↑ {exercise.tempo.up}s
          </span>
        </div>
      )}
    </div>
  );
};
