import { useEffect, useRef } from 'react';

interface AlertData {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  metric?: string;
  currentValue?: string;
  baselineValue?: string;
  aiAnalysis?: string;
  recommendations?: string[];
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertData: AlertData | null;
  onAcknowledge?: () => void;
}

const AlertModal = ({ isOpen, onClose, alertData, onAcknowledge }: AlertModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (modalRef.current && isOpen) {
      // Initialize Alpine.js data
      const alpineData = {
        isOpen,
        closeModal: onClose
      };
      
      (modalRef.current as any)._x_dataStack = [alpineData];
    }
  }, [isOpen, onClose]);

  if (!isOpen || !alertData) return null;

  const getSeverityConfig = () => {
    switch (alertData.severity) {
      case 'critical':
        return {
          bgColor: 'bg-critical/10',
          textColor: 'text-critical',
          borderColor: 'border-critical',
          icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
          label: 'Critical Alert'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning/10',
          textColor: 'text-warning',
          borderColor: 'border-warning',
          icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
          label: 'Warning Alert'
        };
      default:
        return {
          bgColor: 'bg-primary/10',
          textColor: 'text-primary',
          borderColor: 'border-primary',
          icon: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
          label: 'Info Alert'
        };
    }
  };

  const config = getSeverityConfig();

  const handleAcknowledge = () => {
    onAcknowledge?.();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-metric-bg max-w-2xl w-full max-h-[90vh] rounded-lg shadow-xl overflow-y-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-metric-value">
              Alert Details
            </h2>
            <button
              onClick={onClose}
              className="text-metric-text hover:text-metric-value transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Severity Badge */}
            <div className={`inline-flex items-center gap-3 ${config.bgColor} ${config.textColor} px-4 py-3 rounded-lg border ${config.borderColor}`}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={config.icon}
                />
              </svg>
              <span className="text-base font-medium">{config.label}</span>
            </div>

            {/* Alert Title */}
            <h3 className="text-xl font-bold text-metric-value">
              {alertData.title}
            </h3>

            {/* Metadata Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-metric-text">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Detected: {alertData.timestamp}</span>
              </div>

              {alertData.metric && (
                <div className="flex items-center gap-3 text-sm text-metric-text">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Metric: {alertData.metric}</span>
                </div>
              )}

              {alertData.currentValue && (
                <div className="flex items-center gap-3 text-sm text-metric-text">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Current: {alertData.currentValue}</span>
                </div>
              )}

              {alertData.baselineValue && (
                <div className="flex items-center gap-3 text-sm text-metric-text">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                  <span>Baseline: {alertData.baselineValue}</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* AI Analysis Section */}
            {alertData.aiAnalysis && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h4 className="text-sm font-semibold text-metric-value">AI Analysis:</h4>
                </div>
                <p className="text-sm text-metric-text leading-relaxed">
                  {alertData.aiAnalysis}
                </p>
              </div>
            )}

            {/* Recommendations */}
            {alertData.recommendations && alertData.recommendations.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-metric-value">Recommended Actions:</h5>
                <ul className="space-y-1.5 text-sm text-metric-text">
                  {alertData.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-metric-value border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAcknowledge}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:opacity-90 transition-opacity"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertModal;
