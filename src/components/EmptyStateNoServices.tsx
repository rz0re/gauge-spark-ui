import { Server } from 'lucide-react';

const EmptyStateNoServices = () => {
  return (
    <div className="bg-card rounded-lg p-16 text-center">
      <Server className="w-16 h-16 mx-auto text-muted-foreground/50" strokeWidth={1.5} />
      <h3 className="text-lg font-medium text-foreground mt-4">
        No services configured
      </h3>
      <p className="text-sm text-muted-foreground mt-2">
        Add services in your Spyd configuration
      </p>
      <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
        View Documentation
      </button>
    </div>
  );
};

export default EmptyStateNoServices;
