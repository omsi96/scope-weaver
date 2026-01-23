import React from 'react';
import { Question } from '@/data/questionnaire-schema';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface QuestionFieldProps {
  question: Question;
  value: string | string[] | boolean | number | undefined;
  onChange: (value: string | string[] | boolean | number) => void;
  error?: string;
}

export function QuestionField({ question, value, onChange, error }: QuestionFieldProps) {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className={cn("input-field", error && "border-destructive")}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className={cn("input-field resize-none", error && "border-destructive")}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={(value as number) || ''}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            placeholder={question.placeholder}
            className={cn("input-field", error && "border-destructive")}
          />
        );

      case 'select':
        return (
          <select
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className={cn("select-field", error && "border-destructive")}
          >
            <option value="">Select an option...</option>
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        const selectedValues = (value as string[]) || [];
        return (
          <div className="flex flex-wrap gap-2">
            {question.options?.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      onChange(selectedValues.filter((v) => v !== option.value));
                    } else {
                      onChange([...selectedValues, option.value]);
                    }
                  }}
                  className={cn("chip", isSelected && "chip-selected")}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        );

      case 'toggle':
        const isOn = value === true;
        return (
          <button
            type="button"
            role="switch"
            aria-checked={isOn}
            onClick={() => onChange(!isOn)}
            className={cn("toggle-switch", isOn && "toggle-switch-on")}
          >
            <span 
              className={cn(
                "toggle-knob",
                isOn ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <label className="block text-sm font-medium text-foreground">
          {question.label}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </label>
        {question.tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="tooltip-trigger">
                <HelpCircle className="w-3 h-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="text-sm">{question.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      
      {question.description && (
        <p className="text-sm text-muted-foreground">{question.description}</p>
      )}
      
      {renderInput()}
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
