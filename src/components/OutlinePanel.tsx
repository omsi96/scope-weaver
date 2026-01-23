import React from 'react';
import { Step, Question } from '@/data/questionnaire-schema';
import { Answers } from '@/hooks/useQuestionnaire';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface OutlinePanelProps {
  steps: Step[];
  currentStepIndex: number;
  answers: Answers;
  getVisibleQuestions: (step: Step) => Question[];
  onStepClick: (index: number) => void;
}

export function OutlinePanel({ 
  steps, 
  currentStepIndex, 
  answers, 
  getVisibleQuestions,
  onStepClick 
}: OutlinePanelProps) {
  const [expandedSteps, setExpandedSteps] = React.useState<Set<string>>(new Set([steps[currentStepIndex]?.id]));

  React.useEffect(() => {
    setExpandedSteps(prev => new Set([...prev, steps[currentStepIndex]?.id]));
  }, [currentStepIndex, steps]);

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const formatAnswer = (answer: Answers[string], question: Question): string => {
    if (answer === undefined || answer === '') return '—';
    if (typeof answer === 'boolean') return answer ? 'Yes' : 'No';
    if (Array.isArray(answer)) {
      if (answer.length === 0) return '—';
      return answer.map(v => {
        const opt = question.options?.find(o => o.value === v);
        return opt?.label || v;
      }).join(', ');
    }
    if (question.options) {
      const opt = question.options.find(o => o.value === answer);
      return opt?.label || String(answer);
    }
    return String(answer);
  };

  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
        Outline
      </h3>
      {steps.map((step, stepIndex) => {
        const isExpanded = expandedSteps.has(step.id);
        const isCurrent = stepIndex === currentStepIndex;
        const visibleQuestions = getVisibleQuestions(step);
        const hasAnswers = visibleQuestions.some(q => {
          const a = answers[q.id];
          return a !== undefined && a !== '' && (Array.isArray(a) ? a.length > 0 : true);
        });

        return (
          <div key={step.id} className="rounded-lg overflow-hidden">
            <button
              onClick={() => toggleStep(step.id)}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-2 text-left transition-colors",
                isCurrent ? "bg-primary/10" : "hover:bg-muted"
              )}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-lg">{step.icon}</span>
              <span className={cn(
                "text-sm font-medium flex-1 truncate",
                isCurrent && "text-primary"
              )}>
                {step.title}
              </span>
              {hasAnswers && (
                <span className="w-2 h-2 rounded-full bg-accent" />
              )}
            </button>
            
            {isExpanded && (
              <div className="pl-8 pr-2 pb-2 space-y-1">
                {visibleQuestions.slice(0, 5).map(question => {
                  const answer = answers[question.id];
                  const hasAnswer = answer !== undefined && answer !== '' && (Array.isArray(answer) ? answer.length > 0 : true);
                  
                  return (
                    <div 
                      key={question.id}
                      className="text-xs py-1 flex items-start gap-2"
                    >
                      <span className={cn(
                        "truncate flex-1",
                        hasAnswer ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {question.label.replace(/\?$/, '')}
                      </span>
                      {hasAnswer && (
                        <span className="text-accent font-medium truncate max-w-[100px]">
                          {formatAnswer(answer, question)}
                        </span>
                      )}
                    </div>
                  );
                })}
                {visibleQuestions.length > 5 && (
                  <button
                    onClick={() => onStepClick(stepIndex)}
                    className="text-xs text-primary hover:underline"
                  >
                    +{visibleQuestions.length - 5} more
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
