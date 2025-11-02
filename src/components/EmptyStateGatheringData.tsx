import { Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const EmptyStateGatheringData = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 60) return 60;
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card rounded-lg p-16 text-center">
      <Clock className="w-16 h-16 mx-auto text-muted-foreground/50 animate-pulse" strokeWidth={1.5} />
      <h3 className="text-lg font-medium text-foreground mt-4">
        Gathering data...
      </h3>
      <p className="text-sm text-muted-foreground mt-2">
        Spyd needs at least 1 minute of data
      </p>
      <div className="mt-3">
        <p className="text-xs text-muted-foreground/70">
          Collecting metrics: {progress}s / 60s
        </p>
        <div className="mt-2 max-w-xs mx-auto h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(progress / 60) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmptyStateGatheringData;
