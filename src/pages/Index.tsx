import MetricCard from '@/components/MetricCard';
import AlertCard from '@/components/AlertCard';
import ServiceHealthCard from '@/components/ServiceHealthCard';
import AlertModal from '@/components/AlertModal';
import SettingsModal from '@/components/SettingsModal';
import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Settings, Bookmark } from 'lucide-react';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Alpine.js data on root element
    if (rootRef.current) {
      const alpineData = {
        darkMode,
        modalOpen: isModalOpen,
        settingsOpen: isSettingsOpen,
        selectedAlert,
        toggleDarkMode: () => {
          setDarkMode(!darkMode);
        },
        openSettings: () => {
          setIsSettingsOpen(true);
        }
      };
      (rootRef.current as any)._x_dataStack = [alpineData];
    }
  }, [darkMode, isModalOpen, isSettingsOpen, selectedAlert]);

  useEffect(() => {
    // Toggle dark class on html element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
    <div ref={rootRef} className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-card-foreground">Spyd Dashboard</span>
            </div>

            {/* Center - Status Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-sm font-medium text-success">Healthy</span>
            </div>

            {/* Right - Connection, Settings, Bookmark, Dark Mode */}
            <div className="flex items-center gap-4">
              {/* Connection Indicator */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-sm text-muted-foreground">Connected</span>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-muted-foreground hover:text-card-foreground transition-colors rounded-lg hover:bg-muted"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Settings */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-muted-foreground hover:text-card-foreground transition-colors rounded-lg hover:bg-muted"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Bookmark */}
              <button
                className="p-2 text-muted-foreground hover:text-card-foreground transition-colors rounded-lg hover:bg-muted"
                aria-label="Bookmark"
              >
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Health Overview Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Health Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="CPU Usage"
              value={45}
              status="normal"
              statusText="Within normal range"
              icon="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21"
            />
            
            <MetricCard
              title="Memory Usage"
              value={62.5}
              status="warning"
              statusText="Approaching threshold"
              icon="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
            />
            
            <MetricCard
              title="Disk Usage"
              value={78.2}
              status="warning"
              statusText="Monitor closely"
              icon="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />

            <MetricCard
              title="Active Alerts"
              value={3}
              unit=""
              status="critical"
              statusText="Requires attention"
              icon="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              variant="count"
            />
          </div>
        </section>

        {/* Recent Alerts Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Recent Alerts (Past 24 Hours)
          </h2>
          {alerts.length > 0 ? (
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
          ) : (
            <div className="bg-metric-bg rounded-lg p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-muted-foreground text-lg">No alerts in the past 24 hours</p>
            </div>
          )}
        </section>

        {/* Services Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Services (6 monitored)
          </h2>
          {[1, 2, 3, 4, 5, 6].length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ServiceHealthCard
                name="Nginx"
                status="healthy"
                uptime={99.8}
                onClick={() => console.log('Nginx clicked')}
              />
              
              <ServiceHealthCard
                name="PostgreSQL"
                status="down"
                uptime={91.2}
                hasIncident={true}
                incidentDuration="2h 15m"
                onClick={() => console.log('PostgreSQL clicked')}
              />
              
              <ServiceHealthCard
                name="Redis"
                status="healthy"
                uptime={100}
                onClick={() => console.log('Redis clicked')}
              />
              
              <ServiceHealthCard
                name="Docker"
                status="healthy"
                uptime={98.5}
                onClick={() => console.log('Docker clicked')}
              />

              <ServiceHealthCard
                name="MySQL"
                status="healthy"
                uptime={97.2}
                onClick={() => console.log('MySQL clicked')}
              />
              
              <ServiceHealthCard
                name="Nginx Worker"
                status="unknown"
                uptime={0}
                onClick={() => console.log('Nginx Worker clicked')}
              />
            </div>
          ) : (
            <div className="bg-metric-bg rounded-lg p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                />
              </svg>
              <p className="text-muted-foreground text-lg">No services configured</p>
            </div>
          )}
        </section>

      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        alertData={selectedAlert}
        onAcknowledge={handleAcknowledge}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onSave={(settings) => {
          console.log('Settings saved:', settings);
        }}
      />
    </div>
  );
};

export default Index;
