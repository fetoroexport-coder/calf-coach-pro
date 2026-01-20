interface RepProgressProps {
  currentRep: number;
  totalReps: number;
}

export const RepProgress = ({ currentRep, totalReps }: RepProgressProps) => {
  const progress = (currentRep / totalReps) * 100;

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Rep Progress</span>
        <span className="font-semibold text-foreground">
          {currentRep} / {totalReps}
        </span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-phase-up transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
