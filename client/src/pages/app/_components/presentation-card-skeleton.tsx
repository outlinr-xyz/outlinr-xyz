interface PresentationCardSkeletonProps {
  variant?: 'grid' | 'list';
}

const PresentationCardSkeleton = ({
  variant = 'grid',
}: PresentationCardSkeletonProps) => {
  if (variant === 'list') {
    return (
      <div className="flex items-center gap-4 rounded-md bg-white py-4">
        <div className="h-22 w-22 shrink-0 animate-pulse rounded-md bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
          <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative aspect-4/3 overflow-hidden rounded-md">
        <div className="h-full w-full animate-pulse bg-gray-200" />
      </div>
      <div className="mt-2 space-y-1 px-1">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
};

export default PresentationCardSkeleton;
