import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TimeRange = '1h' | '6h' | '24h' | '7d';

interface DataPoint {
  time: string;
  value: number;
  baseline: number;
  isAnomaly?: boolean;
}

const generateData = (range: TimeRange, baseValue: number, variation: number): DataPoint[] => {
  const points = range === '1h' ? 12 : range === '6h' ? 18 : range === '24h' ? 24 : 28;
  const data: DataPoint[] = [];
  
  for (let i = 0; i < points; i++) {
    const value = baseValue + (Math.sin(i / 3) * variation) + (Math.random() * 5 - 2.5);
    const isAnomaly = range === '1h' && i === 8;
    
    data.push({
      time: `${4 + i}:${(i * 5) % 60}`,
      value: isAnomaly ? baseValue + 35 : value,
      baseline: baseValue - 10,
      isAnomaly,
    });
  }
  
  return data;
};

const MetricTrendsSection = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');

  const cpuData = generateData(timeRange, 25, 8);
  const memoryData = generateData(timeRange, 18, 5);
  const diskData = generateData(timeRange, 22, 3);

  const timeRanges: TimeRange[] = ['1h', '6h', '24h', '7d'];

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.isAnomaly) {
      return (
        <circle cx={cx} cy={cy} r={5} fill="hsl(var(--critical))" stroke="#fff" strokeWidth={2} />
      );
    }
    return null;
  };

  return (
    <section className="mb-8">
      {/* Header with Title and Time Range Selector */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Metric Trends
        </h2>
        
        <div className="inline-flex rounded-lg border border-border bg-card overflow-hidden shadow-sm">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              } ${range !== '1h' ? 'border-l border-border' : ''}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
        {/* CPU Usage Chart */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-base font-semibold text-foreground mb-4">CPU Usage (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cpuData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={<CustomDot />}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Memory Usage Chart */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-base font-semibold text-foreground mb-4">Memory Usage (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={memoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Disk Usage Chart */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-base font-semibold text-foreground mb-4">Disk Usage (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={diskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 py-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-primary rounded" />
          <span className="text-sm text-foreground">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 border-t-2 border-dashed border-success rounded" />
          <span className="text-sm text-foreground">Baseline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-critical" />
          <span className="text-sm text-foreground">Anomaly</span>
        </div>
      </div>
    </section>
  );
};

export default MetricTrendsSection;
