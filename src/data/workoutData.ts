export type Phase = 'down' | 'stretch' | 'up' | 'hold' | 'rest';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  isSingleLeg: boolean;
  isHold: boolean;
  tempo: {
    down: number;
    stretch: number;
    up: number;
  };
  holdDuration?: number;
  restDuration: number;
  description: string;
}

export interface DayWorkout {
  day: string;
  isOff: boolean;
  exercises: Exercise[];
}

export const exercises: Record<string, Exercise> = {
  singleLegCalfRaise: {
    id: 'singleLegCalfRaise',
    name: 'Single Leg Calf Raise',
    sets: 7,
    reps: 12,
    isSingleLeg: true,
    isHold: false,
    tempo: { down: 3, stretch: 3, up: 1 },
    restDuration: 60,
    description: 'Slow eccentric with full stretch at bottom',
  },
  bentKneeCalfRaise: {
    id: 'bentKneeCalfRaise',
    name: 'Bent Knee Calf Raise',
    sets: 6,
    reps: 25,
    isSingleLeg: false,
    isHold: false,
    tempo: { down: 2, stretch: 2, up: 2 },
    restDuration: 37,
    description: 'Keep knees bent throughout, focus on soleus',
  },
  singleLegLongLengthPartial: {
    id: 'singleLegLongLengthPartial',
    name: 'Single Leg Long-Length Partial',
    sets: 3,
    reps: 15,
    isSingleLeg: true,
    isHold: false,
    tempo: { down: 1, stretch: 3, up: 1 },
    restDuration: 45,
    description: 'Partial reps focusing on stretched position',
  },
  loadedStretchHold: {
    id: 'loadedStretchHold',
    name: 'Loaded Stretch Hold',
    sets: 2,
    reps: 1,
    isSingleLeg: false,
    isHold: true,
    tempo: { down: 0, stretch: 0, up: 0 },
    holdDuration: 45,
    restDuration: 45,
    description: 'Hold at full stretch with weight',
  },
  normalCalfRaise: {
    id: 'normalCalfRaise',
    name: 'Normal Calf Raise',
    sets: 2,
    reps: 40,
    isSingleLeg: false,
    isHold: false,
    tempo: { down: 1, stretch: 1, up: 1 },
    restDuration: 60,
    description: 'Light recovery work, focus on blood flow',
  },
};

export const workoutDays: DayWorkout[] = [
  {
    day: 'Monday',
    isOff: false,
    exercises: [
      exercises.singleLegCalfRaise,
      exercises.bentKneeCalfRaise,
      exercises.singleLegLongLengthPartial,
      exercises.loadedStretchHold,
    ],
  },
  {
    day: 'Tuesday',
    isOff: false,
    exercises: [
      exercises.singleLegCalfRaise,
      exercises.bentKneeCalfRaise,
      exercises.singleLegLongLengthPartial,
      exercises.loadedStretchHold,
    ],
  },
  {
    day: 'Thursday',
    isOff: false,
    exercises: [
      exercises.singleLegCalfRaise,
      exercises.bentKneeCalfRaise,
      exercises.singleLegLongLengthPartial,
      exercises.loadedStretchHold,
    ],
  },
  {
    day: 'Saturday',
    isOff: false,
    exercises: [
      exercises.singleLegCalfRaise,
      exercises.bentKneeCalfRaise,
      exercises.singleLegLongLengthPartial,
      exercises.loadedStretchHold,
    ],
  },
  {
    day: 'Off',
    isOff: true,
    exercises: [exercises.normalCalfRaise],
  },
];
