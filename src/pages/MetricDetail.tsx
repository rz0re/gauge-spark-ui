import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DataPoint {
  timestamp: string;
  value: number;
  baseline: number;
  isAnomaly: boolean;
}

interface Anomaly {
  timestamp: string;
  value: number;
  baseline: number;
  delta: number;
  severity: 'critical' | 'warning';
}

const MetricDetail = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setDarkMode(isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Generate realistic CPU usage data with anomalies
  const generateData = (range: string): DataPoint[] => {
    const points: DataPoint[] = [];
    let numPoints = 24;
    let interval = '1h';

    switch (range) {
      case '1h':
        numPoints = 60;
        interval = '1m';
        break;
      case '6h':
        numPoints = 72;
        interval = '5m';
        break;
      case '24h':
        numPoints = 96;
        interval = '15m';
        break;
      case '7d':
        numPoints = 168;
        interval = '1h';
        break;
      case '30d':
        numPoints = 120;
        interval = '6h';
        break;
    }

    const baseline = 47;
    const now = Date.now();

    for (let i = 0; i < numPoints; i++) {
      const timeOffset = (numPoints - i) * getTimeOffset(range);
      const timestamp = new Date(now - timeOffset);
      
      // Create realistic CPU usage pattern with some variation
      const variation = Math.sin(i / 10) * 8 + Math.random() * 10 - 5;
      let value = baseline + variation;
      
      // Add anomalies at specific points
      const isAnomaly = i === Math.floor(numPoints * 0.3) || 
                        i === Math.floor(numPoints * 0.6) || 
                        i === Math.floor(numPoints * 0.85);
      
      if (isAnomaly) {
        value = baseline + 30 + Math.random() * 15;
      }

      points.push({
        timestamp: formatTimestamp(timestamp, range),
        value: Math.max(0, Math.min(100, value)),
        baseline,
        isAnomaly,
      });
    }

    return points;
  };

  const getTimeOffset = (range: string): number => {
    switch (range) {
      case '1h': return 60 * 1000;
      case '6h': return 5 * 60 * 1000;
      case '24h': return 15 * 60 * 1000;
      case '7d': return 60 * 60 * 1000;
      case '30d': return 6 * 60 * 60 * 1000;
      default: return 15 * 60 * 1000;
    }
  };

  const formatTimestamp = (date: Date, range: string): string => {
    if (range === '7d' || range === '30d') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const data = generateData(timeRange);
  const anomalies: Anomaly[] = data
    .filter(d => d.isAnomaly)
    .map(d => ({
      timestamp: d.timestamp,
      value: d.value,
      baseline: d.baseline,
      delta: d.value - d.baseline,
      severity: d.value - d.baseline > 40 ? 'critical' : 'warning',
    }));

  const currentValue = data[data.length - 1]?.value || 45.2;
  const status = currentValue < 60 ? 'normal' : currentValue < 80 ? 'warning' : 'critical';

  const chartData = {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        label: 'Current',
        data: data.map(d => d.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: data.map(d => d.isAnomaly ? 6 : 0),
        pointBackgroundColor: data.map(d => d.isAnomaly ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'),
        pointBorderColor: data.map(d => d.isAnomaly ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'),
        pointBorderWidth: 2,
      },
      {
        label: 'Baseline',
        data: data.map(d => d.baseline),
        borderColor: darkMode ? 'rgb(148, 163, 184)' : 'rgb(156, 163, 175)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0,
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgb(30, 41, 59)' : 'rgb(255, 255, 255)',
        titleColor: darkMode ? 'rgb(226, 232, 240)' : 'rgb(17, 24, 39)',
        bodyColor: darkMode ? 'rgb(203, 213, 225)' : 'rgb(55, 65, 81)',
        borderColor: darkMode ? 'rgb(51, 65, 85)' : 'rgb(229, 231, 235)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const dataPoint = data[context.dataIndex];
            if (context.datasetIndex === 0) {
              const delta = dataPoint.value - dataPoint.baseline;
              return [
                `Current: ${dataPoint.value.toFixed(1)}%`,
                `Baseline: ${dataPoint.baseline.toFixed(1)}%`,
                `Delta: ${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`,
              ];
            }
            return `Baseline: ${context.parsed.y.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.8)',
        },
        ticks: {
          color: darkMode ? 'rgb(148, 163, 184)' : 'rgb(107, 114, 128)',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.8)',
        },
        ticks: {
          color: darkMode ? 'rgb(148, 163, 184)' : 'rgb(107, 114, 128)',
          callback: function(value) {
            return value + '%';
          },
        },
      },
    },
  };

  const timeRanges = ['1h', '6h', '24h', '7d', '30d'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">CPU Usage</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  {currentValue.toFixed(1)}%
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    status === 'normal'
                      ? 'bg-success/10 text-success border border-success/20'
                      : status === 'warning'
                      ? 'bg-warning/10 text-warning border border-warning/20'
                      : 'bg-critical/10 text-critical border border-critical/20'
                  }`}
                >
                  {status === 'normal' ? 'Normal' : status === 'warning' ? 'Warning' : 'Critical'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="inline-flex rounded-lg border border-border bg-card overflow-hidden shadow-sm">
            {timeRanges.map((range, index) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                } ${index > 0 ? 'border-l border-border' : ''}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
          <div className="h-[400px]">
            <Line data={chartData} options={options} />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-primary rounded" />
              <span className="text-sm text-foreground">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 border-t-2 border-dashed border-muted-foreground rounded" />
              <span className="text-sm text-foreground">Baseline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-sm text-foreground">Anomalies</span>
            </div>
          </div>
        </div>

        {/* Anomalies List */}
        {anomalies.length > 0 && (
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Detected Anomalies ({anomalies.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Timestamp
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Value
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Baseline
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Delta
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Severity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {anomalies.map((anomaly, index) => (
                    <tr
                      key={index}
                      className="border-b border-border hover:bg-accent transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 text-sm text-foreground">
                        {anomaly.timestamp}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        {anomaly.value.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {anomaly.baseline.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-destructive">
                        +{anomaly.delta.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            anomaly.severity === 'critical'
                              ? 'bg-critical/10 text-critical'
                              : 'bg-warning/10 text-warning'
                          }`}
                        >
                          {anomaly.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricDetail;
