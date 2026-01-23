import React, { useState, useCallback } from 'react';
import { useQuestionnaire } from '@/hooks/useQuestionnaire';
import { ProgressBar } from '@/components/ProgressBar';
import { Stepper } from '@/components/Stepper';
import { QuestionField } from '@/components/QuestionField';
import { OutlinePanel } from '@/components/OutlinePanel';
import { RiskMeter } from '@/components/RiskMeter';
import { ExportModal } from '@/components/ExportModal';
import { ReviewSummary } from '@/components/ReviewSummary';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  RotateCcw, 
  Download, 
  Menu, 
  X,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Step } from '@/data/questionnaire-schema';

export default function Index() {
  const {
    currentStep,
    currentStepIndex,
    visibleSteps,
    visibleQuestions,
    answers,
    progress,
    stepProgress,
    canGoNext,
    isLastStep,
    isFirstStep,
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
  } = useQuestionnaire();

  const [showExportModal, setShowExportModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showOutline, setShowOutline] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const getVisibleQuestions = useCallback((step: Step) => {
    return step.questions.filter(q => {
      if (!q.visibleIf) return true;
      const value = answers[q.visibleIf.questionId];
      switch (q.visibleIf.operator) {
        case 'equals':
          return value === q.visibleIf.value;
        case 'includes':
          if (Array.isArray(value) && Array.isArray(q.visibleIf.value)) {
            return q.visibleIf.value.some(v => value.includes(v));
          }
          if (Array.isArray(value)) {
            return value.includes(q.visibleIf.value as string);
          }
          return false;
        case 'hasValue':
          if (Array.isArray(value)) return value.length > 0;
          return value !== undefined && value !== '' && value !== false;
        default:
          return true;
      }
    });
  }, [answers]);

  const handleReset = () => {
    reset();
    setShowResetConfirm(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const isReviewStep = currentStep?.id === 'review_export';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="lg:hidden btn-ghost p-2"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Requirements Collector</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Define your app scope step by step
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="btn-ghost text-sm flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
          <ProgressBar 
            progress={progress} 
            currentStepLabel={currentStep?.title || ''} 
          />
        </div>
      </header>

      <div className="flex-1 flex max-w-screen-2xl mx-auto w-full">
        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div 
            className="lg:hidden fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowMobileSidebar(false)}
          >
            <div 
              className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar p-4 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-sidebar-foreground">Steps</h2>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
                >
                  <X className="w-5 h-5 text-sidebar-foreground" />
                </button>
              </div>
              <Stepper
                steps={visibleSteps}
                currentIndex={currentStepIndex}
                stepProgress={stepProgress}
                onStepClick={(index) => {
                  goToStep(index);
                  setShowMobileSidebar(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0 bg-sidebar border-r border-sidebar-border overflow-y-auto sticky top-[105px] h-[calc(100vh-105px)]">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-4">
              Steps
            </h2>
            <Stepper
              steps={visibleSteps}
              currentIndex={currentStepIndex}
              stepProgress={stepProgress}
              onStepClick={goToStep}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 lg:p-8">
          <div className={cn(
            "grid gap-8",
            showOutline && !isReviewStep ? "lg:grid-cols-[1fr,280px]" : "lg:grid-cols-1 max-w-3xl mx-auto"
          )}>
            {/* Questions Area */}
            <div>
              <div className="card-section mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{currentStep?.icon}</span>
                  <h2 className="text-xl font-semibold text-foreground">
                    {currentStep?.title}
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  {currentStep?.description}
                </p>
              </div>

              {isReviewStep ? (
                <ReviewSummary
                  steps={visibleSteps}
                  answers={answers}
                  getVisibleQuestions={getVisibleQuestions}
                  derivedFeatures={derivedFeatures}
                />
              ) : (
                <div className="space-y-6">
                  {visibleQuestions.map((question) => (
                    <div key={question.id} className="card-section">
                      <QuestionField
                        question={question}
                        value={answers[question.id]}
                        onChange={(value) => setAnswer(question.id, value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <button
                  onClick={goBack}
                  disabled={isFirstStep}
                  className={cn(
                    "btn-secondary flex items-center gap-2",
                    isFirstStep && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="flex items-center gap-3">
                  {isLastStep ? (
                    <button
                      onClick={() => setShowExportModal(true)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  ) : (
                    <button
                      onClick={goNext}
                      disabled={!canGoNext}
                      className={cn(
                        "btn-primary flex items-center gap-2",
                        !canGoNext && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Outline & Risk */}
            {showOutline && !isReviewStep && (
              <div className="hidden lg:block space-y-6">
                <div className="sticky top-4">
                  <button
                    onClick={() => setShowOutline(false)}
                    className="btn-ghost text-sm mb-4 flex items-center gap-1"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                    Hide outline
                  </button>
                  
                  <div className="card-section mb-6">
                    <OutlinePanel
                      steps={visibleSteps}
                      currentStepIndex={currentStepIndex}
                      answers={answers}
                      getVisibleQuestions={getVisibleQuestions}
                      onStepClick={goToStep}
                    />
                  </div>

                  <RiskMeter riskItems={riskItems} />
                </div>
              </div>
            )}

            {!showOutline && !isReviewStep && (
              <button
                onClick={() => setShowOutline(true)}
                className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 btn-secondary p-2 shadow-lg"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </main>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        exportData={generateExport()}
        markdownData={generateMarkdown()}
      />

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
            onClick={() => setShowResetConfirm(false)} 
          />
          <div className="relative bg-card rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-foreground mb-2">Reset All Progress?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              This will clear all your answers and start fresh. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="btn-primary flex-1 bg-destructive hover:bg-destructive/90"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
