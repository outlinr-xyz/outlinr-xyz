import { EmptyState, PresentationList } from '@/features/presentations';
import { useRecentPresentations } from '@/hooks/use-presentations';
import { formatTimeAgo } from '@/lib/utils';
import type { Presentation } from '@/types/presentation';

const RecentPresentations = () => {
  const { presentations, isLoading, error, refetch } = useRecentPresentations();

  const getHref = (presentation: Presentation) =>
    `/app/presentation/${presentation.id}/question`;

  const getMetadata = (presentation: Presentation) =>
    formatTimeAgo(presentation.last_opened_at);

  return (
    <section>
      <h2 className="mt-2 text-base font-medium md:mt-8">Recently Viewed</h2>

      <div className="w-full max-w-6xl">
        {error ? (
          <EmptyState message={error} />
        ) : presentations.length === 0 && !isLoading ? (
          <EmptyState message="No presentations yet. Create your first one!" />
        ) : (
          <div className="mt-4">
            <PresentationList
              presentations={presentations}
              isLoading={isLoading}
              view="grid"
              getHref={getHref}
              getMetadata={getMetadata}
              skeletonCount={3}
              onDelete={refetch}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentPresentations;
