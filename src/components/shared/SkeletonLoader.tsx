export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton rounded-2xl ${className}`} style={{ minHeight: "280px" }} />
  );
}

export function SkeletonText({ width = "100%", height = "16px", className = "" }: {
  width?: string;
  height?: string;
  className?: string;
}) {
  return (
    <div
      className={`skeleton rounded-md ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonAvatar({ size = "48px" }: { size?: string }) {
  return (
    <div
      className="skeleton rounded-full flex-shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonSection() {
  return (
    <div className="section-padding">
      <div className="container-max space-y-8">
        <div className="text-center space-y-3">
          <SkeletonText width="120px" height="24px" className="mx-auto" />
          <SkeletonText width="60%" height="48px" className="mx-auto" />
          <SkeletonText width="40%" height="20px" className="mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
