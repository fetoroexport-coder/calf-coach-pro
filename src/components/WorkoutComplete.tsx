import { Trophy, RotateCcw, Home } from 'lucide-react';

interface WorkoutCompleteProps {
  onRestart: () => void;
  onHome: () => void;
}

export const WorkoutComplete = ({ onRestart, onHome }: WorkoutCompleteProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 animate-slide-up">
      <div className="text-center space-y-8">
        <div className="animate-celebration">
          <Trophy className="w-32 h-32 mx-auto text-primary" />
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-black text-gradient">
            WORKOUT COMPLETE!
          </h1>
          <p className="text-2xl text-muted-foreground">
            Amazing work! Your calves are going to thank you.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pt-8">
          <button
            onClick={onRestart}
            className="flex items-center gap-3 px-8 py-4 rounded-xl bg-secondary hover:bg-accent transition-all text-lg font-semibold"
          >
            <RotateCcw className="w-6 h-6" />
            Restart Workout
          </button>

          <button
            onClick={onHome}
            className="flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all text-lg font-semibold glow-primary"
          >
            <Home className="w-6 h-6" />
            Choose Another Day
          </button>
        </div>
      </div>
    </div>
  );
};
