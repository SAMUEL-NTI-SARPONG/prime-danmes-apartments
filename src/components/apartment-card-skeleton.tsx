export default function ApartmentCardSkeleton() {
  return (
    <div className="group block animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-4/3 w-full rounded-xl bg-muted" />

      {/* Text content */}
      <div className="pt-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="h-4 w-40 rounded-md bg-muted" />
          <div className="h-4 w-10 rounded-md bg-muted" />
        </div>
        <div className="h-3.5 w-32 rounded-md bg-muted" />
        <div className="flex gap-3">
          <div className="h-3.5 w-16 rounded-md bg-muted" />
          <div className="h-3.5 w-16 rounded-md bg-muted" />
          <div className="h-3.5 w-16 rounded-md bg-muted" />
        </div>
        <div className="h-4 w-24 rounded-md bg-muted" />
      </div>
    </div>
  );
}
