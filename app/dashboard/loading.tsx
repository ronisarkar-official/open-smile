export default function DashboardLoading() {
  return (
    <div className="flex h-full min-h-[100dvh] w-full flex-col space-y-6 bg-background p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 rounded-md bg-muted" />
        <div className="h-9 w-28 rounded-md bg-muted" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl border border-border bg-card p-6 space-y-3">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-8 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="h-96 rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="h-6 w-1/4 rounded bg-muted" />
        <div className="space-y-3 pt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 rounded-md bg-muted/60" />
          ))}
        </div>
      </div>
    </div>
  );
}
