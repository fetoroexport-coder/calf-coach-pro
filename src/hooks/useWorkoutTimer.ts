import { useState, useCallback, useRef, useEffect } from 'react';
import { Exercise, Phase } from '@/data/workoutData';
import { useAudio } from './useAudio';

export type Leg = 'right' | 'left' | null;

interface WorkoutState {
  currentExerciseIndex: number;
  currentSet: number;
  currentRep: number;
  currentLeg: Leg;
  phase: Phase;
  phaseTimer: number;
  isRunning: boolean;
  isComplete: boolean;
  isResting: boolean;
}

export const useWorkoutTimer = (
  exercises: Exercise[],
  soundEnabled: boolean,
  onComplete: () => void
) => {
  const [state, setState] = useState<WorkoutState>({
    currentExerciseIndex: 0,
    currentSet: 1,
    currentRep: 1,
    currentLeg: null,
    phase: 'down',
    phaseTimer: 0,
    isRunning: false,
    isComplete: false,
    isResting: false,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const advancingRef = useRef(false);
  const { playDownSound, playStretchSound, playUpSound, playRestSound, playCompleteSound } = useAudio();

  const currentExercise = exercises[state.currentExerciseIndex];

  const playPhaseSound = useCallback((phase: Phase) => {
    if (!soundEnabled) return;
    switch (phase) {
      case 'down':
        playDownSound();
        break;
      case 'stretch':
      case 'hold':
        playStretchSound();
        break;
      case 'up':
        playUpSound();
        break;
      case 'rest':
        playRestSound();
        break;
    }
  }, [soundEnabled, playDownSound, playStretchSound, playUpSound, playRestSound]);

  const getPhaseSeconds = useCallback((phase: Phase, exercise: Exercise): number => {
    if (phase === 'rest') return exercise.restDuration;
    if (phase === 'hold' && exercise.isHold) return exercise.holdDuration || 45;
    return exercise.tempo[phase as 'down' | 'stretch' | 'up'] || 1;
  }, []);

  const getNextPhase = useCallback((currentPhase: Phase, exercise: Exercise): Phase | null => {
    if (exercise.isHold) {
      return currentPhase === 'hold' ? null : 'hold';
    }
    switch (currentPhase) {
      case 'down':
        return 'stretch';
      case 'stretch':
        return 'up';
      case 'up':
        return null; // Rep complete
      default:
        return null;
    }
  }, []);

  const advanceToNextState = useCallback(() => {
    setState(prev => {
      const exercise = exercises[prev.currentExerciseIndex];
      if (!exercise) {
        return { ...prev, isComplete: true, isRunning: false };
      }

      // If resting, start next set/leg/exercise
      if (prev.isResting) {
        const nextPhase = exercise.isHold ? 'hold' : 'down';
        playPhaseSound(nextPhase);
        return {
          ...prev,
          isResting: false,
          phase: nextPhase,
          phaseTimer: getPhaseSeconds(nextPhase, exercise),
        };
      }

      const nextPhase = getNextPhase(prev.phase, exercise);
      
      // If there's a next phase in the rep
      if (nextPhase) {
        playPhaseSound(nextPhase);
        return {
          ...prev,
          phase: nextPhase,
          phaseTimer: getPhaseSeconds(nextPhase, exercise),
        };
      }

      // Rep complete - check if more reps in this set
      if (prev.currentRep < exercise.reps) {
        const startPhase = exercise.isHold ? 'hold' : 'down';
        playPhaseSound(startPhase);
        return {
          ...prev,
          currentRep: prev.currentRep + 1,
          phase: startPhase,
          phaseTimer: getPhaseSeconds(startPhase, exercise),
        };
      }

      // Set complete for single-leg: alternate legs
      if (exercise.isSingleLeg && prev.currentLeg) {
        if (prev.currentLeg === 'right') {
          // Switch to left leg with short 3s transition rest
          playPhaseSound('rest');
          return {
            ...prev,
            currentLeg: 'left',
            currentRep: 1,
            phase: 'rest',
            phaseTimer: 3,
            isResting: true,
          };
        } else {
          // Left leg done - both legs completed this set
          if (prev.currentSet < exercise.sets) {
            // More sets remain, 3s transition rest then back to right
            playPhaseSound('rest');
            return {
              ...prev,
              currentSet: prev.currentSet + 1,
              currentLeg: 'right',
              currentRep: 1,
              phase: 'rest',
              phaseTimer: 3,
              isResting: true,
            };
          }
          // All sets done for this exercise - fall through to next exercise
        }
      } else if (!exercise.isSingleLeg && prev.currentSet < exercise.sets) {
        // Non-single-leg: full rest between sets
        playPhaseSound('rest');
        return {
          ...prev,
          currentSet: prev.currentSet + 1,
          currentRep: 1,
          phase: 'rest',
          phaseTimer: exercise.restDuration,
          isResting: true,
        };
      }

      // Move to next exercise (with rest period first)
      const nextExerciseIndex = prev.currentExerciseIndex + 1;
      if (nextExerciseIndex >= exercises.length) {
        if (soundEnabled) playCompleteSound();
        onComplete();
        return { ...prev, isComplete: true, isRunning: false };
      }

      // Add a rest period before next exercise
      playPhaseSound('rest');
      return {
        ...prev,
        currentExerciseIndex: nextExerciseIndex,
        currentSet: 1,
        currentRep: 1,
        currentLeg: exercises[nextExerciseIndex].isSingleLeg ? 'right' : null,
        phase: 'rest',
        phaseTimer: exercise.restDuration,
        isResting: true,
      };
    });
  }, [exercises, getNextPhase, getPhaseSeconds, playPhaseSound, soundEnabled, playCompleteSound, onComplete]);

  useEffect(() => {
    if (state.isRunning && !state.isComplete) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          if (prev.phaseTimer > 0) {
            const newTimer = prev.phaseTimer - 1;
            if (newTimer === 0) {
              // Timer reached 0, will trigger advance in next tick
              return { ...prev, phaseTimer: 0 };
            }
            return { ...prev, phaseTimer: newTimer };
          }
          return prev;
        });
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [state.isRunning, state.isComplete]);

  useEffect(() => {
    if (state.isRunning && state.phaseTimer === 0 && !state.isComplete && !advancingRef.current) {
      advancingRef.current = true;
      advanceToNextState();
      // Reset the flag after a short delay to prevent double-triggers
      setTimeout(() => {
        advancingRef.current = false;
      }, 50);
    }
  }, [state.phaseTimer, state.isRunning, state.isComplete, advanceToNextState]);

  const start = useCallback(() => {
    if (state.isComplete) return;
    
    const exercise = exercises[state.currentExerciseIndex];
    const initialLeg = exercise.isSingleLeg ? 'right' : null;
    const initialPhase = exercise.isHold ? 'hold' : 'down';
    
    playPhaseSound(initialPhase);
    
    setState(prev => ({
      ...prev,
      isRunning: true,
      currentLeg: initialLeg,
      phase: initialPhase,
      phaseTimer: getPhaseSeconds(initialPhase, exercise),
    }));
  }, [exercises, state.currentExerciseIndex, state.isComplete, getPhaseSeconds, playPhaseSound]);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const skipRep = useCallback(() => {
    setState(prev => {
      const exercise = exercises[prev.currentExerciseIndex];
      if (prev.isResting) return prev;

      // If more reps remain, advance to next rep
      if (prev.currentRep < exercise.reps) {
        const startPhase = exercise.isHold ? 'hold' : 'down';
        return {
          ...prev,
          currentRep: prev.currentRep + 1,
          phase: startPhase,
          phaseTimer: getPhaseSeconds(startPhase, exercise),
        };
      }
      // Last rep - trigger set completion by setting timer to 0
      return { ...prev, phaseTimer: 0 };
    });
  }, [exercises, getPhaseSeconds]);

  const skipSet = useCallback(() => {
    setState(prev => {
      const exercise = exercises[prev.currentExerciseIndex];
      
      if (prev.currentSet < exercise.sets) {
        const startPhase = exercise.isHold ? 'hold' : 'down';
        return {
          ...prev,
          currentSet: prev.currentSet + 1,
          currentRep: 1,
          phase: startPhase,
          phaseTimer: getPhaseSeconds(startPhase, exercise),
          isResting: false,
        };
      }
      
      // Skip to next leg or exercise
      if (exercise.isSingleLeg && prev.currentLeg === 'right') {
        const startPhase = exercise.isHold ? 'hold' : 'down';
        return {
          ...prev,
          currentLeg: 'left',
          currentSet: 1,
          currentRep: 1,
          phase: startPhase,
          phaseTimer: getPhaseSeconds(startPhase, exercise),
          isResting: false,
        };
      }
      
      return prev;
    });
  }, [exercises, getPhaseSeconds]);

  const skipLeg = useCallback(() => {
    setState(prev => {
      const exercise = exercises[prev.currentExerciseIndex];
      
      if (exercise.isSingleLeg && prev.currentLeg === 'right') {
        const startPhase = exercise.isHold ? 'hold' : 'down';
        return {
          ...prev,
          currentLeg: 'left',
          currentSet: 1,
          currentRep: 1,
          phase: startPhase,
          phaseTimer: getPhaseSeconds(startPhase, exercise),
          isResting: false,
        };
      }
      
      return prev;
    });
  }, [exercises, getPhaseSeconds]);

  const skipExercise = useCallback(() => {
    setState(prev => {
      const nextExerciseIndex = prev.currentExerciseIndex + 1;
      
      if (nextExerciseIndex >= exercises.length) {
        if (soundEnabled) playCompleteSound();
        onComplete();
        return { ...prev, isComplete: true, isRunning: false };
      }
      
      const nextExercise = exercises[nextExerciseIndex];
      const nextLeg = nextExercise.isSingleLeg ? 'right' : null;
      const startPhase = nextExercise.isHold ? 'hold' : 'down';
      
      return {
        ...prev,
        currentExerciseIndex: nextExerciseIndex,
        currentSet: 1,
        currentRep: 1,
        currentLeg: nextLeg,
        phase: startPhase,
        phaseTimer: getPhaseSeconds(startPhase, nextExercise),
        isResting: false,
      };
    });
  }, [exercises, getPhaseSeconds, soundEnabled, playCompleteSound, onComplete]);

  const reset = useCallback(() => {
    setState({
      currentExerciseIndex: 0,
      currentSet: 1,
      currentRep: 1,
      currentLeg: null,
      phase: 'down',
      phaseTimer: 0,
      isRunning: false,
      isComplete: false,
      isResting: false,
    });
  }, []);

  return {
    ...state,
    currentExercise,
    totalExercises: exercises.length,
    start,
    pause,
    skipRep,
    skipSet,
    skipLeg,
    skipExercise,
    reset,
  };
};
