import { useState, useEffect, useRef } from 'react';
import { X, BarChart3, CheckCircle, Bell, Server, Wifi } from 'lucide-react';

interface TourStep {
  id: number;
  target: string;
  icon: any;
  heading: string;
  description: string;
  position: 'below' | 'above' | 'right' | 'left';
  align: 'center' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    target: '[data-tour="health-overview"]',
    icon: BarChart3,
    heading: 'Real-time Metrics',
    description: 'These cards show live system metrics updated every 2 seconds via WebSocket.',
    position: 'below',
    align: 'center'
  },
  {
    id: 2,
    target: '[data-tour="status-badge"]',
    icon: CheckCircle,
    heading: 'System Health',
    description: 'This badge shows overall system health status at a glance.',
    position: 'below',
    align: 'right'
  },
  {
    id: 3,
    target: '[data-tour="recent-alerts"]',
    icon: Bell,
    heading: 'Alert Details',
    description: 'Click any alert to see AI-powered analysis and recommendations.',
    position: 'right',
    align: 'center'
  },
  {
    id: 4,
    target: '[data-tour="services-section"]',
    icon: Server,
    heading: 'Service Monitoring',
    description: 'Monitor uptime and health of all your services in real-time.',
    position: 'above',
    align: 'center'
  },
  {
    id: 5,
    target: '[data-tour="connection-indicator"]',
    icon: Wifi,
    heading: 'Live Updates',
    description: 'Green dot means you\'re receiving live updates from your systems.',
    position: 'below',
    align: 'right'
  }
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingTour = ({ isOpen, onClose }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStepData = tourSteps.find(step => step.id === currentStep);

  useEffect(() => {
    if (!isOpen || !currentStepData) return;

    const updatePositions = () => {
      const targetElement = document.querySelector(currentStepData.target);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      setHighlightRect(rect);

      // Calculate tooltip position
      const tooltipWidth = 320;
      const tooltipHeight = tooltipRef.current?.offsetHeight || 200;
      const gap = 16;

      let top = 0;
      let left = 0;

      switch (currentStepData.position) {
        case 'below':
          top = rect.bottom + gap;
          left = currentStepData.align === 'center' 
            ? rect.left + rect.width / 2 - tooltipWidth / 2
            : currentStepData.align === 'right'
            ? rect.right - tooltipWidth
            : rect.left;
          break;
        case 'above':
          top = rect.top - tooltipHeight - gap;
          left = currentStepData.align === 'center'
            ? rect.left + rect.width / 2 - tooltipWidth / 2
            : currentStepData.align === 'right'
            ? rect.right - tooltipWidth
            : rect.left;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + gap;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - gap;
          break;
      }

      // Keep tooltip within viewport bounds
      const padding = 16;
      left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));
      top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding));

      setTooltipPosition({ top, left });
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);

    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
    };
  }, [currentStep, currentStepData, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentStep > 1) {
        setCurrentStep(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  if (!isOpen || !currentStepData) return null;

  const Icon = currentStepData.icon;
  const isLastStep = currentStep === tourSteps.length;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Dark Backdrop with Spotlight */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-all duration-300" />
      
      {/* Spotlight Highlight */}
      {highlightRect && (
        <div
          className="absolute pointer-events-none transition-all duration-150"
          style={{
            top: highlightRect.top - 4,
            left: highlightRect.left - 4,
            width: highlightRect.width + 8,
            height: highlightRect.height + 8,
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.7)',
            borderRadius: '0.5rem'
          }}
        />
      )}

      {/* Tooltip Card */}
      <div
        ref={tooltipRef}
        className="absolute bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-80 p-5 animate-scale-in transition-all duration-150"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`
        }}
      >
        {/* Step Counter */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground">
            Step {currentStep} of {tourSteps.length}
          </span>
          <button
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Icon */}
        <div className="mb-3">
          <Icon className="w-6 h-6 text-primary" />
        </div>

        {/* Heading */}
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {currentStepData.heading}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {currentStepData.description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip Tour
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            {isLastStep ? 'Done' : 'Next'}
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {tourSteps.map((step) => (
            <div
              key={step.id}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                step.id === currentStep
                  ? 'w-6 bg-primary'
                  : step.id < currentStep
                  ? 'w-1.5 bg-primary/50'
                  : 'w-1.5 bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
