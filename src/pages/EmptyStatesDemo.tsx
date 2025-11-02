import EmptyStateNoAlerts from '@/components/EmptyStateNoAlerts';
import EmptyStateNoServices from '@/components/EmptyStateNoServices';
import EmptyStateConnectionLost from '@/components/EmptyStateConnectionLost';
import EmptyStateGatheringData from '@/components/EmptyStateGatheringData';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyStatesDemo = () => {
  const handleRetry = () => {
    console.log('Retrying connection...');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">Empty States</h1>
        <p className="text-muted-foreground mb-8">
          Visual components displayed when there's no data to show
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              No Alerts
            </h2>
            <EmptyStateNoAlerts />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              No Services
            </h2>
            <EmptyStateNoServices />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              Connection Lost
            </h2>
            <EmptyStateConnectionLost onRetry={handleRetry} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              Gathering Data
            </h2>
            <EmptyStateGatheringData />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyStatesDemo;
