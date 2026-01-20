import { workoutDays, DayWorkout } from '@/data/workoutData';
import { Calendar, Dumbbell, Coffee } from 'lucide-react';

interface DaySelectorProps {
  onSelectDay: (day: DayWorkout) => void;
}

export const DaySelector = ({ onSelectDay }: DaySelectorProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12 animate-slide-up">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Dumbbell className="w-12 h-12 text-primary" />
          <h1 className="text-5xl font-black tracking-tight text-gradient">
            CALF CRUSHER
          </h1>
        </div>
        <p className="text-muted-foreground text-xl">
          Select your training day to begin
        </p>
      </div>

      <div className="grid grid-cols-5 gap-4 max-w-5xl w-full">
        {workoutDays.map((day, index) => (
          <button
            key={day.day}
            onClick={() => onSelectDay(day)}
            className="group relative bg-card hover:bg-secondary border border-border rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:glow-primary animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col items-center gap-4">
              {day.isOff ? (
                <Coffee className="w-10 h-10 text-phase-rest group-hover:scale-110 transition-transform" />
              ) : (
                <Calendar className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
              )}
              
              <h2 className="text-2xl font-bold">{day.day}</h2>
              
              <div className="text-sm text-muted-foreground">
                {day.isOff ? (
                  <span className="text-phase-rest">Recovery Day</span>
                ) : (
                  <span>{day.exercises.length} exercises</span>
                )}
              </div>

              <div className="mt-4 space-y-1 text-xs text-muted-foreground w-full">
                {day.exercises.slice(0, 3).map((exercise) => (
                  <div key={exercise.id} className="truncate">
                    • {exercise.name}
                  </div>
                ))}
                {day.exercises.length > 3 && (
                  <div className="text-primary">
                    +{day.exercises.length - 3} more
                  </div>
                )}
              </div>
            </div>

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        ))}
      </div>
    </div>
  );
};
