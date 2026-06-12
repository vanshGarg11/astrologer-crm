export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-md bg-slate-200/80 dark:bg-slate-800 ${className}`} style={{ animation: 'pulse 2s ease-in-out infinite' }} />;
}

export function TableSkeleton() {
  return (
    <div className="glass-panel space-y-4 rounded-md p-5">
      <div className="space-y-3">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-3 w-32 rounded-sm" />
      </div>
      <div className="space-y-3 pt-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
