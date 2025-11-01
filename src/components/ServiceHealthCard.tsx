import { useEffect, useRef } from 'react';

interface ServiceHealthCardProps {
  name: string;
  status: 'healthy' | 'down' | 'unknown';
  uptime: number;
  hasIncident?: boolean;
  incidentDuration?: string;
  onClick?: () => void;
}

const ServiceHealthCard = ({
  name,
  status,
  uptime,
  hasIncident = false,
  incidentDuration = '',
  onClick
}: ServiceHealthCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      // Initialize Alpine.js data
      const alpineData = {
        name,
        status,
        uptime,
        hasIncident,
        incidentDuration
      };
      
      (cardRef.current as any)._x_dataStack = [alpineData];
    }
  }, [name, status, uptime, hasIncident, incidentDuration]);

  const getStatusConfig = () => {
    switch (status) {
      case 'healthy':
        return {
          icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
          iconColor: 'text-success',
          bgColor: 'bg-success/10',
          barColor: 'bg-success'
        };
      case 'down':
        return {
          icon: 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
          iconColor: 'text-critical',
          bgColor: 'bg-critical/10',
          barColor: 'bg-critical'
        };
      default: // unknown
        return {
          icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z',
          iconColor: 'text-muted-foreground',
          bgColor: 'bg-muted',
          barColor: 'bg-muted-foreground'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className="bg-metric-bg rounded-lg p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200 ease-out"
    >
      {/* Top row: Service name and status */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-metric-value">
          {name}
        </h3>
        <div className={`${config.bgColor} rounded-full p-1.5`}>
          <svg
            className={`w-4 h-4 ${config.iconColor}`}
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
      </div>

      {/* Middle section: Uptime */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-metric-text">24h Uptime</span>
          <span className="text-xs font-medium text-metric-value">
            {uptime}%
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="relative w-full h-[1.5px] bg-progress-bg rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full ${config.barColor} rounded-full transition-all duration-300 ease-out`}
            style={{ width: `${uptime}%` }}
          />
        </div>
      </div>

      {/* Bottom section: Incident (conditional) */}
      {hasIncident && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <div className="relative">
            <div className="w-1.5 h-1.5 bg-critical rounded-full animate-pulse" />
            <div className="absolute inset-0 w-1.5 h-1.5 bg-critical rounded-full animate-ping opacity-75" />
          </div>
          <span className="text-xs font-medium text-critical">
            Incident: {incidentDuration}
          </span>
        </div>
      )}
    </div>
  );
};

export default ServiceHealthCard;
