import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, Search, BarChart2, Download, Bell, Check } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  highlightSelector?: string;
  position: 'center' | 'top' | 'bottom';
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'Welcome to Scopa AI',
    description: 'Your intelligent market discovery platform. Let us show you around in 60 seconds.',
    icon: Sparkles,
    position: 'center'
  },
  {
    title: 'Enter Your Market Interest',
    description: 'Start by describing what you want to discover. Try "AI productivity tools for remote teams" or "sustainable fashion opportunities".',
    icon: Search,
    highlightSelector: '[data-onboarding="search-input"]',
    position: 'top'
  },
  {
    title: 'Review Opportunities',
    description: 'Our AI analyzes millions of signals to surface high-quality opportunities. Each result includes readiness scores, difficulty ratings, and actionable insights.',
    icon: BarChart2,
    position: 'center'
  },
  {
    title: 'Export Your Insights',
    description: 'Download opportunities as CSV or JSON for deeper analysis. Share findings with your team or integrate with your workflow.',
    icon: Download,
    position: 'center'
  },
  {
    title: 'Set Up Smart Alerts',
    description: 'Never miss an opportunity! Create automated alerts to monitor markets 24/7. Get notified when new opportunities match your interests.',
    icon: Bell,
    highlightSelector: '[data-onboarding="alerts-button"]',
    position: 'center'
  }
];

interface Props {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingFlow: React.FC<Props> = ({ isOpen, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (!isOpen) return;

    const selector = step.highlightSelector;
    if (selector) {
      const element = document.querySelector(selector) as HTMLElement;
      setHighlightedElement(element);
    } else {
      setHighlightedElement(null);
    }
  }, [currentStep, isOpen, step]);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedElement(null);
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  // Calculate position for modal based on highlighted element
  const getModalPosition = () => {
    if (!highlightedElement) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const rect = highlightedElement.getBoundingClientRect();
    const modalHeight = 400; // Approximate modal height

    if (step.position === 'top') {
      return {
        top: `${rect.bottom + 20}px`,
        left: '50%',
        transform: 'translateX(-50%)'
      };
    } else if (step.position === 'bottom') {
      return {
        top: `${rect.top - modalHeight - 20}px`,
        left: '50%',
        transform: 'translateX(-50%)'
      };
    }

    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  };

  const Icon = step.icon;

  return (
    <>
      {/* Backdrop with spotlight effect */}
      <div className="fixed inset-0 z-[200]">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" />

        {/* Spotlight on highlighted element */}
        {highlightedElement && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: highlightedElement.offsetTop - 8,
              left: highlightedElement.offsetLeft - 8,
              width: highlightedElement.offsetWidth + 16,
              height: highlightedElement.offsetHeight + 16,
              boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.8)',
              borderRadius: '1.5rem',
              zIndex: 201,
              transition: 'all 0.3s ease-out'
            }}
          />
        )}

        {/* Onboarding Modal */}
        <div
          className="fixed z-[202] w-full max-w-lg px-4"
          style={getModalPosition()}
        >
          <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-600/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-600/20 blur-[100px] rounded-full" />

            {/* Skip button */}
            <button
              onClick={onSkip}
              className="absolute top-4 right-4 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-white transition-colors rounded-xl hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-violet-400" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-black text-white mb-3 tracking-tight">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                {step.description}
              </p>

              {/* Progress dots */}
              <div className="flex items-center justify-center space-x-2 mb-8">
                {ONBOARDING_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-8 bg-violet-500'
                        : index < currentStep
                        ? 'w-2 bg-emerald-500'
                        : 'w-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-medium">Back</span>
                </button>

                <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  {currentStep + 1} / {ONBOARDING_STEPS.length}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all shadow-lg shadow-violet-600/20 min-h-[44px]"
                >
                  <span>{isLastStep ? 'Get Started' : 'Next'}</span>
                  {isLastStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Skip text */}
              {!isLastStep && (
                <div className="text-center mt-6">
                  <button
                    onClick={onSkip}
                    className="text-xs text-slate-500 hover:text-slate-400 transition-colors font-medium"
                  >
                    Skip tutorial
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
