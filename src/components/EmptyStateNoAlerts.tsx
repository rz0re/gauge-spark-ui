import { Inbox } from 'lucide-react';

const EmptyStateNoAlerts = () => {
  return (
    <div className="bg-card rounded-lg p-16 text-center">
      <div className="inline-block animate-float">
        <Inbox className="w-16 h-16 mx-auto text-muted-foreground/50" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-medium text-foreground mt-4">
        No alerts in the past 24 hours
      </h3>
      <p className="text-sm text-muted-foreground mt-2">
        Your system is running smoothly!
      </p>
    </div>
  );
};

export default EmptyStateNoAlerts;
