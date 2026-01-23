import { useState, useCallback, useEffect, useMemo } from 'react';
import { questionnaireSchema, Step, Question, VisibilityCondition, HIGH_RISK_FEATURES, FEATURE_MAPPING } from '@/data/questionnaire-schema';

export interface Answers {
  [key: string]: string | string[] | boolean | number | undefined;
}

const STORAGE_KEY = 'requirements-collector-draft';

export function useQuestionnaire() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        setCurrentStepIndex(parsed.currentStepIndex || 0);
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        answers,
        currentStepIndex,
        lastUpdated: new Date().toISOString()
      }));
    }
  }, [answers, currentStepIndex, isLoaded]);

  const checkVisibility = useCallback((condition?: VisibilityCondition): boolean => {
    if (!condition) return true;
    
    const value = answers[condition.questionId];
    
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'notEquals':
        return value !== condition.value;
      case 'includes':
        if (Array.isArray(value) && Array.isArray(condition.value)) {
          return condition.value.some(v => value.includes(v));
        }
        if (Array.isArray(value)) {
          return value.includes(condition.value as string);
        }
        return false;
      case 'hasValue':
        if (Array.isArray(value)) return value.length > 0;
        return value !== undefined && value !== '' && value !== false;
      default:
        return true;
    }
  }, [answers]);

  const visibleSteps = useMemo(() => {
    return questionnaireSchema.filter(step => checkVisibility(step.visibleIf));
  }, [checkVisibility]);

  const getVisibleQuestions = useCallback((step: Step): Question[] => {
    return step.questions.filter(q => checkVisibility(q.visibleIf));
  }, [checkVisibility]);

  const currentStep = visibleSteps[currentStepIndex];

  const visibleQuestions = useMemo(() => {
    if (!currentStep) return [];
    return getVisibleQuestions(currentStep);
  }, [currentStep, getVisibleQuestions]);

  const progress = useMemo(() => {
    let totalRequired = 0;
    let completedRequired = 0;

    visibleSteps.forEach(step => {
      const questions = getVisibleQuestions(step);
      questions.forEach(q => {
        if (q.required) {
          totalRequired++;
          const answer = answers[q.id];
          if (answer !== undefined && answer !== '' && (Array.isArray(answer) ? answer.length > 0 : true)) {
            completedRequired++;
          }
        }
      });
    });

    return totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;
  }, [visibleSteps, getVisibleQuestions, answers]);

  const stepProgress = useMemo(() => {
    return visibleSteps.map(step => {
      const questions = getVisibleQuestions(step);
      const requiredQuestions = questions.filter(q => q.required);
      if (requiredQuestions.length === 0) return 'complete';
      
      const answered = requiredQuestions.filter(q => {
        const answer = answers[q.id];
        return answer !== undefined && answer !== '' && (Array.isArray(answer) ? answer.length > 0 : true);
      });
      
      if (answered.length === 0) return 'pending';
      if (answered.length === requiredQuestions.length) return 'complete';
      return 'partial';
    });
  }, [visibleSteps, getVisibleQuestions, answers]);

  const canGoNext = useMemo(() => {
    const requiredQuestions = visibleQuestions.filter(q => q.required);
    return requiredQuestions.every(q => {
      const answer = answers[q.id];
      return answer !== undefined && answer !== '' && (Array.isArray(answer) ? answer.length > 0 : true);
    });
  }, [visibleQuestions, answers]);

  const setAnswer = useCallback((questionId: string, value: string | string[] | boolean | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < visibleSteps.length) {
      setCurrentStepIndex(index);
    }
  }, [visibleSteps.length]);

  const goNext = useCallback(() => {
    if (canGoNext && currentStepIndex < visibleSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [canGoNext, currentStepIndex, visibleSteps.length]);

  const goBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const reset = useCallback(() => {
    setAnswers({});
    setCurrentStepIndex(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const riskItems = useMemo(() => {
    const risks: { feature: string; level: 'medium' | 'high' }[] = [];
    
    HIGH_RISK_FEATURES.forEach(feature => {
      const answer = answers[feature];
      if (answer === true || (Array.isArray(answer) && answer.length > 0)) {
        risks.push({ feature, level: 'high' });
      }
    });

    // Check specific questions with riskLevel
    visibleSteps.forEach(step => {
      getVisibleQuestions(step).forEach(q => {
        if (q.riskLevel && answers[q.id]) {
          const existingRisk = risks.find(r => r.feature === q.id);
          if (!existingRisk) {
            risks.push({ feature: q.id, level: q.riskLevel as 'medium' | 'high' });
          }
        }
      });
    });

    return risks;
  }, [answers, visibleSteps, getVisibleQuestions]);

  const derivedFeatures = useMemo(() => {
    const features: { mvp: string[]; v1: string[]; later: string[] } = {
      mvp: [],
      v1: [],
      later: []
    };

    Object.entries(FEATURE_MAPPING).forEach(([key, mapping]) => {
      const answer = answers[key];
      if (answer === true || (Array.isArray(answer) && answer.length > 0)) {
        features.mvp.push(...mapping.mvp);
        features.v1.push(...mapping.v1);
        features.later.push(...mapping.later);
      }
    });

    return features;
  }, [answers]);

  const generateExport = useCallback(() => {
    return {
      answers,
      derivedFeatures,
      riskItems,
      steps: visibleSteps.map(step => ({
        id: step.id,
        title: step.title,
        questions: getVisibleQuestions(step).map(q => ({
          id: q.id,
          label: q.label,
          answer: answers[q.id]
        }))
      })),
      metadata: {
        createdAt: new Date().toISOString(),
        completionPercentage: progress
      }
    };
  }, [answers, derivedFeatures, riskItems, visibleSteps, getVisibleQuestions, progress]);

  const generateMarkdown = useCallback(() => {
    let md = `# Requirements Specification\n\n`;
    md += `_Generated on ${new Date().toLocaleDateString()}_\n\n`;
    md += `**Completion:** ${progress}%\n\n---\n\n`;

    visibleSteps.forEach(step => {
      md += `## ${step.icon} ${step.title}\n\n`;
      md += `${step.description}\n\n`;

      getVisibleQuestions(step).forEach(q => {
        const answer = answers[q.id];
        if (answer !== undefined && answer !== '') {
          md += `### ${q.label}\n\n`;
          if (Array.isArray(answer)) {
            answer.forEach(a => {
              const option = q.options?.find(o => o.value === a);
              md += `- ${option?.label || a}\n`;
            });
          } else if (typeof answer === 'boolean') {
            md += `${answer ? 'Yes' : 'No'}\n`;
          } else {
            md += `${answer}\n`;
          }
          md += '\n';
        }
      });
    });

    if (derivedFeatures.mvp.length > 0 || derivedFeatures.v1.length > 0) {
      md += `---\n\n## 📋 Derived Features\n\n`;
      
      if (derivedFeatures.mvp.length > 0) {
        md += `### MVP\n\n`;
        derivedFeatures.mvp.forEach(f => md += `- ${f}\n`);
        md += '\n';
      }
      
      if (derivedFeatures.v1.length > 0) {
        md += `### V1\n\n`;
        derivedFeatures.v1.forEach(f => md += `- ${f}\n`);
        md += '\n';
      }
      
      if (derivedFeatures.later.length > 0) {
        md += `### Later\n\n`;
        derivedFeatures.later.forEach(f => md += `- ${f}\n`);
        md += '\n';
      }
    }

    if (riskItems.length > 0) {
      md += `---\n\n## ⚠️ High Complexity Items\n\n`;
      riskItems.forEach(r => {
        md += `- ${r.feature} (${r.level})\n`;
      });
    }

    return md;
  }, [answers, visibleSteps, getVisibleQuestions, progress, derivedFeatures, riskItems]);

  return {
    currentStep,
    currentStepIndex,
    visibleSteps,
    visibleQuestions,
    answers,
    progress,
    stepProgress,
    canGoNext,
    isLastStep: currentStepIndex === visibleSteps.length - 1,
    isFirstStep: currentStepIndex === 0,
    setAnswer,
    goToStep,
    goNext,
    goBack,
    reset,
    riskItems,
    derivedFeatures,
    generateExport,
    generateMarkdown,
    isLoaded
  };
}
