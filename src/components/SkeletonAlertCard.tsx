const SkeletonAlertCard = () => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm border-l-4 border-l-muted">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="w-5 h-5 bg-muted rounded-full animate-pulse" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse mb-2" />
          <div className="h-3 w-full bg-muted rounded animate-pulse mb-1" />
          <div className="h-3 w-full bg-muted rounded animate-pulse mb-2" />
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonAlertCard;
