import { Phase } from '@/data/workoutData';

interface ProgressRingProps {
  progress: number;
  phase: Phase;
  timer: number;
  size?: number;
}

const phaseColors: Record<Phase, string> = {
  down: 'stroke-phase-down',
  stretch: 'stroke-phase-stretch',
  up: 'stroke-phase-up',
  hold: 'stroke-phase-stretch',
  rest: 'stroke-phase-rest',
};

export const ProgressRing = ({ progress, phase, timer, size = 280 }: ProgressRingProps) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={`${phaseColors[phase]} transition-all duration-300`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>

      {/* Timer display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-7xl font-black tabular-nums">
          {timer}
        </span>
        <span className={`text-xl font-semibold uppercase tracking-widest mt-2 ${
          phase === 'down' ? 'text-phase-down' :
          phase === 'stretch' || phase === 'hold' ? 'text-phase-stretch' :
          phase === 'up' ? 'text-phase-up' :
          'text-phase-rest'
        }`}>
          {phase === 'hold' ? 'hold' : phase}
        </span>
      </div>
    </div>
  );
};
