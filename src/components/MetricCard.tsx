import { useEffect, useRef } from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  status: 'normal' | 'warning' | 'critical';
  icon?: string;
  statusText?: string;
  variant?: 'default' | 'count';
}

const MetricCard = ({ 
  title, 
  value, 
  unit = '%', 
  status,
  icon = 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21',
  statusText = 'Within normal range',
  variant = 'default'
}: MetricCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      // Initialize Alpine.js data on the card element
      const alpineData = {
        value,
        status,
        title,
        statusText,
        unit,
        get statusColor() {
          switch (this.status) {
            case 'critical':
              return 'bg-critical';
            case 'warning':
              return 'bg-warning';
            default:
              return 'bg-success';
          }
        }
      };
      
      (cardRef.current as any)._x_dataStack = [alpineData];
    }
  }, [value, status, title, statusText, unit]);

  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'bg-critical';
      case 'warning':
        return 'bg-warning';
      default:
        return 'bg-success';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'critical':
        return 'Critical';
      case 'warning':
        return 'Warning';
      default:
        return 'Normal';
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-metric-bg rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {variant === 'count' ? (
        // Count variant - just large number display
        <>
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-metric-text">{title}</p>
            <div className="text-metric-text">
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
                  strokeWidth={1.5}
                  d={icon}
                />
              </svg>
            </div>
          </div>
          <p className="text-5xl font-bold text-metric-value mb-2">
            {value}
          </p>
          <p className="text-xs text-metric-text">{statusText}</p>
        </>
      ) : (
        // Default variant - with progress bar
        <>
          {/* Header with label and icon */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-metric-text mb-1">{title}</p>
              <p className="text-3xl font-bold text-metric-value">
                {value}{unit}
              </p>
            </div>
            <div className="text-metric-text">
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
                  strokeWidth={1.5}
                  d={icon}
                />
              </svg>
            </div>
          </div>

          {/* Status labels */}
          <div className="flex items-center justify-between text-xs text-metric-text mb-1.5">
            <span>{getStatusLabel()}</span>
            <span>Critical</span>
          </div>

          {/* Progress bar */}
          <div className="relative w-full h-0.5 bg-progress-bg rounded-full overflow-hidden mb-3">
            <div
              className={`absolute top-0 left-0 h-full ${getStatusColor()} rounded-full transition-all duration-300 ease-out`}
              style={{ width: `${value}%` }}
            />
          </div>

          {/* Status text */}
          <p className="text-xs text-metric-text">{statusText}</p>
        </>
      )}
    </div>
  );
};

export default MetricCard;
