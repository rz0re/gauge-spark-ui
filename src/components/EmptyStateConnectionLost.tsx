import { WifiOff, RotateCw } from 'lucide-react';

interface EmptyStateConnectionLostProps {
  onRetry?: () => void;
}

const EmptyStateConnectionLost = ({ onRetry }: EmptyStateConnectionLostProps) => {
  return (
    <div className="bg-card rounded-lg p-16 text-center">
      <WifiOff className="w-16 h-16 mx-auto text-destructive/70" strokeWidth={1.5} />
      <h3 className="text-lg font-medium text-foreground mt-4">
        Connection lost
      </h3>
      <p className="text-sm text-muted-foreground mt-2">
        Attempting to reconnect...
      </p>
      <div className="flex items-center justify-center gap-2 mt-3">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground">Reconnecting...</span>
      </div>
      <button 
        onClick={onRetry}
        className="mt-4 px-4 py-2 border border-border bg-background text-foreground rounded-md hover:bg-accent transition-colors text-sm font-medium inline-flex items-center gap-2"
      >
        <RotateCw className="w-4 h-4" />
        Retry Now
      </button>
    </div>
  );
};

export default EmptyStateConnectionLost;
