import React from 'react';

interface ProgressBarProps {
  progress: number;
  currentStepLabel: string;
}

export function ProgressBar({ progress, currentStepLabel }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{currentStepLabel}</span>
        <span className="text-sm text-muted-foreground">{progress}% complete</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
