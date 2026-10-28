export function PageSkeleton() {
  return (
    <div className="pageSkeleton" role="status" aria-live="polite" aria-label="Loading page">
      <div className="pageSkeletonEyebrow" />
      <div className="pageSkeletonTitle" />
      <div className="pageSkeletonHero" />
      <div className="pageSkeletonCopy" />
      <div className="pageSkeletonCopy pageSkeletonCopyShort" />
      <div className="pageSkeletonCopy pageSkeletonCopyShorter" />
    </div>
  );
}
