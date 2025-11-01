import MetricCard from '@/components/MetricCard';
import AlertCard from '@/components/AlertCard';
import ServiceHealthCard from '@/components/ServiceHealthCard';
import AlertModal from '@/components/AlertModal';
import { useState } from 'react';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  const alerts = [
    {
      severity: 'critical' as const,
      title: 'CPU usage exceeded baseline by 45%',
      message: 'Detected during metric collection. Current value: 92%, baseline: 47%. This may indicate a resource-intensive process or potential performance bottleneck.',
      timestamp: '5 minutes ago',
      metric: 'CPU Usage',
      currentValue: '92%',
      baselineValue: '47%',
      aiAnalysis: 'Detected spike correlates with deployment event at 14:32 UTC. CPU usage increased immediately following container restart. Pattern matches previous deployment on Jan 5, suggesting a recurring issue with the deployment process.',
      recommendations: [
        'Review deployment logs from 14:32 UTC',
        'Check container resource limits and adjust if necessary',
        'Consider implementing horizontal pod autoscaling',
        'Analyze application startup procedures for optimization opportunities'
      ]
    },
    {
      severity: 'warning' as const,
      title: 'Memory utilization approaching threshold',
      message: 'System memory usage has reached 72.8% which is approaching the warning threshold of 75%. Consider freeing up resources or increasing available memory.',
      timestamp: '12 minutes ago',
      metric: 'Memory Usage',
      currentValue: '72.8%',
      baselineValue: '55%',
      aiAnalysis: 'Memory usage has been gradually increasing over the past 3 hours. Analysis shows no memory leaks but indicates growing cache size and active connections.',
      recommendations: [
        'Review active database connections',
        'Clear application caches if appropriate',
        'Monitor for memory leaks in recent deployments'
      ]
    },
    {
      severity: 'info' as const,
      title: 'Scheduled maintenance window upcoming',
      message: 'A scheduled maintenance window is planned for 2:00 AM UTC. Expected downtime: 30 minutes. All services will be temporarily unavailable.',
      timestamp: '1 hour ago',
      metric: 'System Maintenance',
      aiAnalysis: 'Routine maintenance scheduled. Database migration and security patches will be applied. No action required.',
      recommendations: [
        'Notify users of upcoming maintenance',
        'Verify backup completion before maintenance window',
        'Prepare rollback plan if needed'
      ]
    }
  ];

  const handleAlertClick = (alert: any) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAcknowledge = () => {
    console.log('Alert acknowledged:', selectedAlert?.title);
    // Here you would typically update the alert status in your backend
  };

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

        {/* Metrics Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            System Metrics
          </h2>
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
        </section>

        {/* Alerts Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Active Alerts
          </h2>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <AlertCard
                key={index}
                severity={alert.severity}
                title={alert.title}
                message={alert.message}
                timestamp={alert.timestamp}
                acknowledged={alert.severity === 'info'}
                onClick={() => handleAlertClick(alert)}
              />
            ))}
          </div>
        </section>

        {/* Service Health Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Service Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ServiceHealthCard
              name="PostgreSQL"
              status="healthy"
              uptime={99.8}
              onClick={() => console.log('PostgreSQL clicked')}
            />
            
            <ServiceHealthCard
              name="Redis Cache"
              status="down"
              uptime={87.3}
              hasIncident={true}
              incidentDuration="2h 15m"
              onClick={() => console.log('Redis clicked')}
            />
            
            <ServiceHealthCard
              name="API Gateway"
              status="healthy"
              uptime={91.2}
              onClick={() => console.log('API Gateway clicked')}
            />
            
            <ServiceHealthCard
              name="Message Queue"
              status="unknown"
              uptime={0}
              onClick={() => console.log('Message Queue clicked')}
            />
          </div>
        </section>

        {/* About Section */}
        <div className="p-6 bg-card rounded-lg border border-border">
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

      {/* Alert Modal */}
      <AlertModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        alertData={selectedAlert}
        onAcknowledge={handleAcknowledge}
      />
    </div>
  );
};

export default Index;
