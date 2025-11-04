import { useState } from 'react';

import { useRecentPresentations } from '@/hooks/use-presentations';
import { formatTimeAgo } from '@/lib/utils';
import type { Presentation } from '@/types';

import EmptyState from '../../_components/empty-state';
import PresentationList from '../../_components/presentation-list';
import PresentationSearch from '../../_components/presentation-search';

const SharedWithMePage = () => {
  const { presentations, isLoading, error, refetch } = useRecentPresentations();
  const [searchQuery, setSearchQuery] = useState('');

  const getHref = (presentation: Presentation) =>
    `/app/presentation/${presentation.id}/shared-with-me`;

  const getMetadata = (presentation: Presentation) =>
    formatTimeAgo(presentation.last_opened_at);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
          Shared With Me
        </h1>
        <p className="text-muted-foreground text-sm">
          Presentations others have shared with you
        </p>
      </div>

      <PresentationSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search shared..."
      />

      <div className="w-full max-w-6xl">
        {error ? (
          <EmptyState message={error} />
        ) : presentations.length === 0 && !isLoading ? (
          <EmptyState message="No shared presentations yet." />
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
    </>
  );
};

export default SharedWithMePage;
