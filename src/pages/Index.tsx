import { useState } from 'react';
import { DayWorkout } from '@/data/workoutData';
import { DaySelector } from '@/components/DaySelector';
import { WorkoutSession } from '@/components/WorkoutSession';

const Index = () => {
  const [selectedDay, setSelectedDay] = useState<DayWorkout | null>(null);

  if (selectedDay) {
    return (
      <WorkoutSession
        day={selectedDay}
        onBack={() => setSelectedDay(null)}
      />
    );
  }

  return <DaySelector onSelectDay={setSelectedDay} />;
};

export default Index;
