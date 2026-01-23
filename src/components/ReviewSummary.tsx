import React from 'react';
import { Step, Question } from '@/data/questionnaire-schema';
import { Answers } from '@/hooks/useQuestionnaire';
import { Check, Layers, Users, Globe, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewSummaryProps {
  steps: Step[];
  answers: Answers;
  getVisibleQuestions: (step: Step) => Question[];
  derivedFeatures: { mvp: string[]; v1: string[]; later: string[] };
}

export function ReviewSummary({ steps, answers, getVisibleQuestions, derivedFeatures }: ReviewSummaryProps) {
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

  // Extract key information for summary cards
  const appName = answers['app_name'] as string || 'Your App';
  const platforms = (answers['platforms'] as string[]) || [];
  const userTypes = (answers['user_types'] as string[]) || [];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-section">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Project</h3>
          </div>
          <p className="text-lg font-medium text-foreground">{appName}</p>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {answers['one_sentence'] as string || 'No description provided'}
          </p>
        </div>

        <div className="card-section">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Globe className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold">Platforms</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {platforms.length > 0 ? platforms.map(p => (
              <span key={p} className="chip text-xs">
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </span>
            )) : <span className="text-muted-foreground">Not specified</span>}
          </div>
        </div>

        <div className="card-section">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Users className="w-5 h-5 text-warning" />
            </div>
            <h3 className="font-semibold">User Types</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {userTypes.length > 0 ? userTypes.map(u => (
              <span key={u} className="chip text-xs">
                {u.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            )) : <span className="text-muted-foreground">Not specified</span>}
          </div>
        </div>
      </div>

      {/* Derived Features */}
      {(derivedFeatures.mvp.length > 0 || derivedFeatures.v1.length > 0 || derivedFeatures.later.length > 0) && (
        <div className="card-section">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-lg">Derived Features</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {derivedFeatures.mvp.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-accent mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs">1</span>
                  MVP
                </h4>
                <ul className="space-y-2">
                  {[...new Set(derivedFeatures.mvp)].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {derivedFeatures.v1.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">2</span>
                  V1
                </h4>
                <ul className="space-y-2">
                  {[...new Set(derivedFeatures.v1)].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {derivedFeatures.later.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">3</span>
                  Later
                </h4>
                <ul className="space-y-2">
                  {[...new Set(derivedFeatures.later)].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Answers by Step */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Complete Responses</h3>
        
        {steps.filter(step => step.id !== 'review_export').map(step => {
          const questions = getVisibleQuestions(step);
          const answeredQuestions = questions.filter(q => {
            const a = answers[q.id];
            return a !== undefined && a !== '' && (Array.isArray(a) ? a.length > 0 : true);
          });

          if (answeredQuestions.length === 0) return null;

          return (
            <div key={step.id} className="card-section">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-lg">{step.icon}</span>
                {step.title}
              </h4>
              <div className="space-y-4">
                {answeredQuestions.map(question => (
                  <div key={question.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <p className="text-sm text-muted-foreground mb-1">{question.label}</p>
                    <p className="text-foreground">{formatAnswer(answers[question.id], question)}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
