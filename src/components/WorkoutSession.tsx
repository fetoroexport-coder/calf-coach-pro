import { useState } from 'react';
import { DayWorkout } from '@/data/workoutData';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { ProgressRing } from './ProgressRing';
import { RepProgress } from './RepProgress';
import { ExerciseInfo } from './ExerciseInfo';
import { WorkoutControls } from './WorkoutControls';
import { MovementIndicator } from './MovementIndicator';
import { WorkoutComplete } from './WorkoutComplete';
import { ArrowLeft } from 'lucide-react';

interface WorkoutSessionProps {
  day: DayWorkout;
  onBack: () => void;
}

export const WorkoutSession = ({ day, onBack }: WorkoutSessionProps) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  const {
    currentExercise,
    currentExerciseIndex,
    totalExercises,
    currentSet,
    currentRep,
    currentLeg,
    phase,
    phaseTimer,
    isRunning,
    isResting,
    start,
    pause,
    skipRep,
    skipSet,
    skipLeg,
    skipExercise,
    reset,
  } = useWorkoutTimer(day.exercises, soundEnabled, () => setWorkoutComplete(true));

  const handleRestart = () => {
    setWorkoutComplete(false);
    reset();
  };

  const handleHome = () => {
    setWorkoutComplete(false);
    reset();
    onBack();
  };

  if (workoutComplete) {
    return <WorkoutComplete onRestart={handleRestart} onHome={handleHome} />;
  }

  if (!currentExercise) {
    return null;
  }

  // Calculate progress for the ring
  const getPhaseMax = () => {
    if (phase === 'rest') return currentExercise.restDuration;
    if (phase === 'hold' && currentExercise.isHold) return currentExercise.holdDuration || 45;
    return currentExercise.tempo[phase as 'down' | 'stretch' | 'up'] || 1;
  };
  const progress = (getPhaseMax() - phaseTimer) / getPhaseMax();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-border">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gradient">{day.day} Workout</h1>
          {day.isOff && (
            <span className="text-sm text-phase-rest">Recovery Day</span>
          )}
        </div>

        <div className="w-20" /> {/* Spacer for centering */}
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <div className="bg-card rounded-3xl border border-border p-12 shadow-2xl">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-12 items-center">
              {/* Left: Movement indicator */}
              <div className="flex justify-center">
                <MovementIndicator phase={phase} />
              </div>

              {/* Center: Timer ring */}
              <div className="flex flex-col items-center gap-8">
                <ProgressRing
                  progress={progress}
                  phase={phase}
                  timer={phaseTimer}
                  size={300}
                />

                {isResting && (
                  <div className="text-center">
                    <p className="text-lg text-phase-rest font-semibold animate-pulse">
                      Rest Period
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Get ready for the next set
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Exercise info */}
              <div className="flex flex-col items-center">
                <ExerciseInfo
                  exercise={currentExercise}
                  currentSet={currentSet}
                  currentLeg={currentLeg}
                  exerciseIndex={currentExerciseIndex}
                  totalExercises={totalExercises}
                />
              </div>
            </div>

            {/* Rep progress */}
            {!currentExercise.isHold && (
              <div className="mt-10 flex justify-center">
                <RepProgress
                  currentRep={currentRep}
                  totalReps={currentExercise.reps}
                />
              </div>
            )}

            {/* Controls */}
            <div className="mt-10">
              <WorkoutControls
                isRunning={isRunning}
                soundEnabled={soundEnabled}
                exercise={currentExercise}
                currentLeg={currentLeg}
                onStart={start}
                onPause={pause}
                onSkipRep={skipRep}
                onSkipSet={skipSet}
                onSkipLeg={skipLeg}
                onSkipExercise={skipExercise}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Exercise queue */}
      <footer className="p-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground mb-3">Upcoming exercises:</p>
          <div className="flex gap-3">
            {day.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  index === currentExerciseIndex
                    ? 'bg-primary text-primary-foreground'
                    : index < currentExerciseIndex
                    ? 'bg-muted text-muted-foreground line-through'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {exercise.name}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
