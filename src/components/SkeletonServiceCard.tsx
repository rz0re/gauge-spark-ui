const SkeletonServiceCard = () => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
      </div>
      
      <div className="flex items-center gap-4 mb-3">
        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        <div className="h-3 w-12 bg-muted rounded animate-pulse" />
      </div>
      
      <div className="h-1.5 w-full bg-muted rounded-full animate-pulse" />
    </div>
  );
};

export default SkeletonServiceCard;
