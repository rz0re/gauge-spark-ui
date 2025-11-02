const SkeletonMetricCard = () => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        </div>
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
      </div>
      
      <div className="mb-4">
        <div className="h-8 w-16 bg-muted rounded animate-pulse" />
      </div>
      
      <div className="mb-2">
        <div className="h-2 w-full bg-muted rounded-full animate-pulse" />
      </div>
      
      <div className="h-3 w-24 bg-muted rounded animate-pulse" />
    </div>
  );
};

export default SkeletonMetricCard;
