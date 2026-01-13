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

  // Reposition modal on viewport changes
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      // Force re-render by updating state
      setHighlightedElement(prev => prev);
    };

    const handleScroll = () => {
      // Only reposition if we have a highlighted element
      if (highlightedElement) {
        setHighlightedElement(prev => prev);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('scroll', handleScroll, true); // Use capture phase

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, highlightedElement]);

  // Function to find element with retry logic
  const findElementWithRetry = (selector: string, maxRetries = 10): Promise<HTMLElement | null> => {
    return new Promise((resolve) => {
      let retries = 0;

      const findElement = () => {
        const element = document.querySelector(selector) as HTMLElement;
        if (element || retries >= maxRetries) {
          resolve(element || null);
          return;
        }

        retries++;
        // Wait a bit longer between retries on mobile
        const delay = window.innerWidth < 768 ? 200 : 100;
        setTimeout(findElement, delay);
      };

      findElement();
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    const selector = step.highlightSelector;
    if (selector) {
      findElementWithRetry(selector).then((element) => {
        if (element) {
          setHighlightedElement(element);

          // Scroll element into view on mobile if it's not fully visible
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            setTimeout(() => {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
              });
            }, 100);
          }
        } else {
          setHighlightedElement(null);
        }
      });
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
    const isMobile = window.innerWidth < 768;

    // On mobile, always use fixed bottom positioning for better UX
    if (isMobile) {
      return {
        position: 'fixed' as const,
        bottom: '80px', // Higher up to avoid being cut off by browser UI
        left: '12px',
        right: '12px',
        transform: 'none',
        maxWidth: 'none'
      };
    }

    // Desktop positioning logic
    if (!highlightedElement) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const rect = highlightedElement.getBoundingClientRect();
    const modalHeight = 450;
    const modalWidth = 600;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const padding = 20;

    // For center position, always center the modal
    if (step.position === 'center') {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    if (step.position === 'top') {
      // Position below the element
      const top = rect.bottom + padding;
      const left = Math.max(padding, Math.min(rect.left + rect.width / 2 - modalWidth / 2, viewportWidth - modalWidth - padding));

      // If it would go off-screen vertically, position above instead
      if (top + modalHeight > viewportHeight - padding) {
        const topAlt = rect.top - modalHeight - padding;
        if (topAlt >= padding) {
          return {
            top: `${topAlt}px`,
            left: `${left}px`,
            transform: 'none'
          };
        }
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      }

      return {
        top: `${top}px`,
        left: `${left}px`,
        transform: 'none'
      };
    } else if (step.position === 'bottom') {
      // Position above the element
      const top = rect.top - modalHeight - padding;
      const left = Math.max(padding, Math.min(rect.left + rect.width / 2 - modalWidth / 2, viewportWidth - modalWidth - padding));

      // If it would go off-screen vertically, position below instead
      if (top < padding) {
        const topAlt = rect.bottom + padding;
        if (topAlt + modalHeight <= viewportHeight - padding) {
          return {
            top: `${topAlt}px`,
            left: `${left}px`,
            transform: 'none'
          };
        }
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      }

      return {
        top: `${top}px`,
        left: `${left}px`,
        transform: 'none'
      };
    }

    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  };

  const Icon = step.icon;

  // Get spotlight position for highlighted element
  const getSpotlightStyle = () => {
    if (!highlightedElement) return {};

    const rect = highlightedElement.getBoundingClientRect();

    // Check if element is actually visible on screen
    if (rect.width === 0 || rect.height === 0 || rect.top < 0 || rect.left < 0) {
      return { display: 'none' };
    }

    const padding = 8;

    return {
      position: 'fixed' as const,
      top: `${rect.top - padding}px`,
      left: `${rect.left - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.6), 0 0 0 9999px rgba(0, 0, 0, 0.85)',
      borderRadius: '1.5rem',
      zIndex: 201,
      transition: 'all 0.3s ease-out',
      pointerEvents: 'none' as const
    };
  };

  const isMobile = window.innerWidth < 768;

  return (
    <>
      {/* Backdrop with spotlight effect */}
      <div className="fixed inset-0 z-[200]">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300" />

        {/* Spotlight on highlighted element - hide on mobile for cleaner UX */}
        {highlightedElement && !isMobile && (
          <div
            className="absolute"
            style={getSpotlightStyle()}
          />
        )}

        {/* Onboarding Modal */}
        <div
          className="z-[202] w-full max-w-lg"
          style={getModalPosition()}
        >
          <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300 relative overflow-visible flex flex-col" style={{ maxHeight: window.innerWidth < 768 ? 'calc(100vh - 200px)' : '90vh' }}>
            {/* Decorative gradient */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-600/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-600/20 blur-[100px] rounded-full" />

            {/* Skip button */}
            <button
              onClick={onSkip}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-white transition-colors rounded-xl hover:bg-white/5 z-20 touch-manipulation"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent">
              {/* Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0">
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-violet-400" />
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg md:text-xl font-black text-white mb-2 tracking-tight pr-8">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                {step.description}
              </p>

              {/* Progress dots */}
              <div className="flex items-center justify-center space-x-2 mb-1 py-2">
                {ONBOARDING_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-1.5 rounded-full transition-all touch-manipulation ${
                      index === currentStep
                        ? 'w-6 bg-violet-500'
                        : index < currentStep
                        ? 'w-1.5 bg-emerald-500'
                        : 'w-1.5 bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Fixed Navigation Footer */}
            <div className="relative z-10 pt-3 border-t border-white/5 mt-2 flex-shrink-0">
              {/* Navigation */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                  className="flex items-center justify-center space-x-1 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] min-w-[60px] touch-manipulation active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-semibold text-xs">Back</span>
                </button>

                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex-shrink-0">
                  {currentStep + 1} / {ONBOARDING_STEPS.length}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-bold transition-all shadow-lg shadow-violet-600/20 min-h-[44px] min-w-[80px] touch-manipulation flex-shrink-0 active:scale-95"
                >
                  <span className="text-xs font-bold">{isLastStep ? 'Start' : 'Next'}</span>
                  {isLastStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Skip text */}
              {!isLastStep && (
                <div className="text-center mt-2">
                  <button
                    onClick={onSkip}
                    className="text-[10px] text-slate-500 hover:text-slate-400 transition-colors font-medium touch-manipulation py-1.5"
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
