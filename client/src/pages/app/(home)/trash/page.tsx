import { useEffect, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useDeletedPresentations } from '@/hooks/use-presentations';
import { cleanupOldDeletedPresentations } from '@/lib/api/presentations';
import { filterPresentations } from '@/lib/utils';

import EmptyState from '../../_components/empty-state';
import PresentationSearch from '../../_components/presentation-search';
import TrashListItem from '../../_components/trash-list-item';

const TrashPage = () => {
  const { presentations, isLoading, error, refetch } =
    useDeletedPresentations();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const cleanup = async () => {
      try {
        const deletedCount = await cleanupOldDeletedPresentations();
        if (deletedCount > 0) {
          refetch();
        }
      } catch (err) {
        console.error('Failed to cleanup old presentations:', err);
      }
    };

    cleanup();
  }, [refetch]);

  const filteredPresentations = filterPresentations(presentations, searchQuery);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
          Trash
        </h1>
        {isLoading ? (
          <Skeleton className="h-5 w-48" />
        ) : (
          <p className="text-muted-foreground text-sm">
            {presentations.length > 0
              ? `${presentations.length} ${presentations.length === 1 ? 'presentation' : 'presentations'} in trash • Items deleted after 30 days`
              : 'Your trash is empty'}
          </p>
        )}
      </div>
      <PresentationSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search trash..."
      />
      <div className="w-full max-w-6xl">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-md bg-white p-4"
              >
                <div className="h-22 w-22 shrink-0 animate-pulse rounded-md bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-9 md:w-24 animate-pulse rounded-md bg-gray-200" />
                  <div className="h-9 w-9 md:w-32 animate-pulse rounded-md bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <EmptyState message={error} />
        ) : searchQuery && filteredPresentations.length === 0 ? (
          <EmptyState
            message={`No presentations found matching "${searchQuery}"`}
          />
        ) : presentations.length === 0 ? (
          <EmptyState message="No deleted presentations. Items will be automatically deleted 30 days after being moved to trash." />
        ) : (
          <div className="space-y-2">
            {filteredPresentations.map((presentation) => (
              <TrashListItem
                key={presentation.id}
                presentation={presentation}
                onAction={refetch}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TrashPage;
