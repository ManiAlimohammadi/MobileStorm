export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        {[80, 60, 100, 160].map((w, i) => (
          <div key={i} className={`h-3 bg-muted rounded-full`} style={{ width: w }} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">
        {/* Image skeleton */}
        <div className="space-y-3">
          <div className="aspect-square rounded-3xl bg-muted" />
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => <div key={i} className="aspect-square rounded-xl bg-muted" />)}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-4 pt-2">
          <div className="h-3 bg-muted rounded-full w-20" />
          <div className="space-y-2">
            <div className="h-7 bg-muted rounded-xl" />
            <div className="h-7 bg-muted rounded-xl w-4/5" />
          </div>
          <div className="h-28 bg-muted/50 rounded-2xl" />
          <div className="h-5 bg-muted rounded-full w-40" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-4 bg-muted rounded-full" />)}
          </div>
          <div className="h-12 bg-muted rounded-2xl" />
          <div className="h-12 bg-muted/60 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
