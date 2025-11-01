import MetricCard from '@/components/MetricCard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            System Monitoring Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time metrics and performance indicators
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="CPU Usage"
            value={45.2}
            status="normal"
            statusText="Within normal range"
            icon="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21"
          />
          
          <MetricCard
            title="Memory Usage"
            value={72.8}
            status="warning"
            statusText="Approaching threshold"
            icon="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
          />
          
          <MetricCard
            title="Disk Usage"
            value={92.1}
            status="critical"
            statusText="Immediate action required"
            icon="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
          />
        </div>

        <div className="mt-12 p-6 bg-card rounded-lg border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">
            About These Metrics
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <span className="font-semibold text-success">Normal (Green):</span> System is operating within expected parameters
            </p>
            <p>
              <span className="font-semibold text-warning">Warning (Yellow):</span> Metrics are approaching threshold limits
            </p>
            <p>
              <span className="font-semibold text-critical">Critical (Red):</span> Immediate attention required to prevent system issues
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
