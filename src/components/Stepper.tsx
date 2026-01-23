import React from 'react';
import { Step } from '@/data/questionnaire-schema';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  steps: Step[];
  currentIndex: number;
  stepProgress: ('pending' | 'partial' | 'complete')[];
  onStepClick: (index: number) => void;
  collapsed?: boolean;
}

export function Stepper({ steps, currentIndex, stepProgress, onStepClick, collapsed }: StepperProps) {
  return (
    <nav className={cn("flex flex-col gap-1", collapsed && "items-center")}>
      {steps.map((step, index) => {
        const status = stepProgress[index];
        const isCurrent = index === currentIndex;
        const isClickable = index <= currentIndex || status === 'complete' || status === 'partial';
        
        return (
          <button
            key={step.id}
            onClick={() => isClickable && onStepClick(index)}
            disabled={!isClickable}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left w-full",
              isCurrent && "bg-sidebar-accent",
              !isCurrent && isClickable && "hover:bg-sidebar-accent/50",
              !isClickable && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className={cn(
              "step-indicator flex-shrink-0",
              status === 'complete' && "step-indicator-complete",
              isCurrent && status !== 'complete' && "step-indicator-active",
              !isCurrent && status !== 'complete' && "step-indicator-inactive"
            )}>
              {status === 'complete' ? (
                <Check className="w-4 h-4" />
              ) : (
                <span>{step.icon}</span>
              )}
            </div>
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm font-medium truncate",
                  isCurrent ? "text-sidebar-foreground" : "text-sidebar-foreground/70"
                )}>
                  {step.title}
                </div>
                {status === 'partial' && (
                  <div className="text-xs text-warning mt-0.5">In progress</div>
                )}
              </div>
            )}
          </button>
        );
      })}
    </nav>
  );
}
