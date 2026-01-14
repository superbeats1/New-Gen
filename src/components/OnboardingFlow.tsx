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
      findElementWithRetry(selector, 20).then((element) => {
        if (element) {
          setHighlightedElement(element);

          // Scroll element into view for better visibility
          setTimeout(() => {
            const isMobile = window.innerWidth < 768;
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

            // Only scroll if element is not fully visible
            if (!isVisible || isMobile) {
              element.scrollIntoView({
                behavior: 'smooth',
                block: isMobile ? 'start' : 'center',
                inline: 'center'
              });
            }
          }, 300);
        } else {
          console.warn(`Onboarding: Could not find element with selector: ${selector}`);
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

    // On mobile, always use fixed positioning centered vertically for better UX
    if (isMobile) {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '400px',
        margin: '0 auto'
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
    if (!highlightedElement) return { display: 'none' };

    const rect = highlightedElement.getBoundingClientRect();

    // Check if element is actually visible on screen
    if (rect.width === 0 || rect.height === 0) {
      return { display: 'none' };
    }

    const isMobile = window.innerWidth < 768;
    const padding = isMobile ? 12 : 8;

    return {
      position: 'fixed' as const,
      top: `${Math.max(0, rect.top - padding)}px`,
      left: `${Math.max(0, rect.left - padding)}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      boxShadow: isMobile
        ? '0 0 0 3px rgba(139, 92, 246, 0.8), 0 0 0 9999px rgba(0, 0, 0, 0.90), 0 0 40px rgba(139, 92, 246, 0.5)'
        : '0 0 0 4px rgba(139, 92, 246, 0.6), 0 0 0 9999px rgba(0, 0, 0, 0.85)',
      borderRadius: isMobile ? '1rem' : '1.5rem',
      zIndex: 201,
      transition: 'all 0.3s ease-out',
      pointerEvents: 'none' as const,
      display: 'block'
    };
  };

  const isMobile = window.innerWidth < 768;

  return (
    <>
      {/* Backdrop with spotlight effect */}
      <div className="fixed inset-0 z-[200]">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-500" />

        {/* Spotlight on highlighted element - Desktop only (mobile elements covered by modal) */}
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
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 rounded-[2rem] opacity-75 blur-sm group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-[#0A0A0C] rounded-[2rem] p-6 sm:p-8 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-300 flex flex-col overflow-hidden" style={{ maxHeight: window.innerWidth < 768 ? '80vh' : 'auto' }}>

              {/* Skip button */}
              <button
                onClick={onSkip}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors rounded-full hover:bg-white/10 z-20 touch-manipulation"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Content */}
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide py-2">
                {/* Header Section */}
                <div className={`flex flex-col mb-4 ${step.position === 'center' ? 'items-center text-center' : 'items-start'}`}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-5 shadow-lg shadow-violet-600/30 ${step.position === 'center' ? 'mx-auto' : ''}`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white mb-3 tracking-tight">
                    {step.title}
                  </h2>

                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center justify-center space-x-2 py-4">
                  {ONBOARDING_STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStep
                          ? 'w-8 bg-violet-500'
                          : 'w-1.5 bg-slate-700'
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col space-y-3">
                <div className="flex items-center gap-3">
                  {!isFirstStep && (
                    <button
                      onClick={handlePrevious}
                      className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all min-w-[44px]"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}

                  <button
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all shadow-lg shadow-violet-600/25 active:scale-[0.98]"
                  >
                    <span>{isLastStep ? 'Get Started' : 'Next Step'}</span>
                    {isLastStep ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>

                {!isLastStep && (
                  <button
                    onClick={onSkip}
                    className="text-xs text-slate-500 hover:text-white transition-colors font-medium py-2"
                  >
                    Skip tutorial
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
