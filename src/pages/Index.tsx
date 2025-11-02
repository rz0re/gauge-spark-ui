import MetricCard from '@/components/MetricCard';
import AlertCard from '@/components/AlertCard';
import ServiceHealthCard from '@/components/ServiceHealthCard';
import AlertModal from '@/components/AlertModal';
import SettingsModal from '@/components/SettingsModal';
import OnboardingTour from '@/components/OnboardingTour';
import SkeletonMetricCard from '@/components/SkeletonMetricCard';
import SkeletonAlertCard from '@/components/SkeletonAlertCard';
import SkeletonServiceCard from '@/components/SkeletonServiceCard';
import EmptyStateNoAlerts from '@/components/EmptyStateNoAlerts';
import EmptyStateNoServices from '@/components/EmptyStateNoServices';
import MetricTrendsSection from '@/components/MetricTrendsSection';
import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Settings, Activity } from 'lucide-react';
import spydLogo from '@/assets/spyd-logo.png';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    if (!hasCompletedOnboarding && !isLoading) {
      // Show tour after data loads
      setTimeout(() => setIsTourOpen(true), 500);
    }
  }, [isLoading]);

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
      {/* Minimalist Header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src={spydLogo} 
                alt="Spyd Logo" 
                className="w-8 h-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-foreground">Spyd</span>
                <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Monitoring</span>
              </div>
            </div>

            {/* Center - Status Badge */}
            <div 
              data-tour="status-badge"
              className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-success/10 rounded-full transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-xs font-medium text-success">All Systems Operational</span>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              {/* Connection Indicator */}
              <div 
                data-tour="connection-indicator"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50"
              >
                <Activity className="w-3.5 h-3.5 text-success" />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-muted-foreground hover:text-foreground transition-all rounded-full hover:bg-muted"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Settings */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-muted-foreground hover:text-foreground transition-all rounded-full hover:bg-muted"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Health Overview Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Health Overview
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Real-time system metrics</p>
            </div>
          </div>
          <div 
            data-tour="health-overview"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {isLoading ? (
              <>
                <SkeletonMetricCard />
                <SkeletonMetricCard />
                <SkeletonMetricCard />
                <SkeletonMetricCard />
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </section>

        {/* Metric Trends Section */}
        <MetricTrendsSection />

        {/* Recent Alerts Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Recent Alerts
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Last 24 hours</p>
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              <SkeletonAlertCard />
              <SkeletonAlertCard />
              <SkeletonAlertCard />
            </div>
          ) : alerts.length > 0 ? (
            <div 
              data-tour="recent-alerts"
              className="space-y-4"
            >
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
            <EmptyStateNoAlerts />
          )}
        </section>

        {/* Services Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Services
              </h2>
              <p className="text-sm text-muted-foreground mt-1">6 services monitored</p>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <SkeletonServiceCard />
              <SkeletonServiceCard />
              <SkeletonServiceCard />
              <SkeletonServiceCard />
              <SkeletonServiceCard />
              <SkeletonServiceCard />
            </div>
          ) : [1, 2, 3, 4, 5, 6].length > 0 ? (
            <div 
              data-tour="services-section"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
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
            <EmptyStateNoServices />
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

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
};

export default Index;
