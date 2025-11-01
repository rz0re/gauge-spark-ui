import { useEffect, useRef } from 'react';

interface AlertCardProps {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  acknowledged?: boolean;
  onClick?: () => void;
}

const AlertCard = ({
  severity,
  title,
  message,
  timestamp,
  acknowledged = false,
  onClick
}: AlertCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      // Initialize Alpine.js data
      const alpineData = {
        severity,
        title,
        message,
        timestamp,
        acknowledged,
        openAlertModal() {
          console.log('Alert clicked:', { severity, title });
          onClick?.();
        }
      };
      
      (cardRef.current as any)._x_dataStack = [alpineData];
    }
  }, [severity, title, message, timestamp, acknowledged, onClick]);

  const getSeverityConfig = () => {
    switch (severity) {
      case 'critical':
        return {
          borderColor: 'border-critical',
          iconColor: 'text-critical',
          icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
        };
      case 'warning':
        return {
          borderColor: 'border-warning',
          iconColor: 'text-warning',
          icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
        };
      default: // info
        return {
          borderColor: 'border-primary',
          iconColor: 'text-primary',
          icon: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`
        bg-metric-bg rounded-lg p-4 shadow-sm 
        border-l-4 ${config.borderColor}
        hover:shadow-md hover:scale-[1.01]
        active:scale-[0.99]
        cursor-pointer
        transition-all duration-200 ease-out
        ${acknowledged ? 'opacity-60' : 'opacity-100'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Severity Icon */}
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          <svg
            className="w-5 h-5"
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
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-metric-value mb-1">
            {title}
          </h3>
          <p className="text-xs text-metric-text line-clamp-2 mb-1.5">
            {message}
          </p>
          <p className="text-xs text-muted-foreground">
            {timestamp}
          </p>
        </div>

        {/* Chevron Icon */}
        <div className="flex-shrink-0 text-metric-text">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
