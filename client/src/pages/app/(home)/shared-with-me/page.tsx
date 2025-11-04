import { useMemo, useState } from 'react';

import { useSharedPresentations } from '@/hooks/use-shared-presentations';
import { formatTimeAgo } from '@/lib/utils';
import type { Presentation } from '@/types';
import type { ShareWithDetails } from '@/types/share';

import EmptyState from '../../_components/empty-state';
import PresentationList from '../../_components/presentation-list';
import PresentationSearch from '../../_components/presentation-search';

const SharedWithMePage = () => {
  const { shares, isLoading, error, refetch } = useSharedPresentations();
  const [searchQuery, setSearchQuery] = useState('');

  // Convert shares to presentation format for the list
  const presentations = useMemo(() => {
    return shares.map((share: ShareWithDetails) => ({
      id: share.presentation.id,
      user_id: share.shared_by,
      title: share.presentation.title,
      description: share.presentation.description,
      thumbnail_url: share.presentation.thumbnail_url,
      last_opened_at: share.created_at,
      created_at: share.created_at,
      updated_at: share.presentation.updated_at,
      deleted_at: null,
    }));
  }, [shares]);

  // Filter presentations based on search query
  const filteredPresentations = useMemo(() => {
    if (!searchQuery.trim()) return presentations;

    const query = searchQuery.toLowerCase();
    return presentations.filter(
      (p: Presentation) =>
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query),
    );
  }, [presentations, searchQuery]);

  const getHref = (presentation: Presentation) => {
    const share = shares.find(
      (s: ShareWithDetails) => s.presentation.id === presentation.id,
    );
    // Route based on permission
    if (share?.permission === 'edit') {
      return `/app/presentation/${presentation.id}/question`;
    }
    return `/app/presentation/${presentation.id}/preview`;
  };

  const getMetadata = (presentation: Presentation) => {
    const share = shares.find(
      (s: ShareWithDetails) => s.presentation.id === presentation.id,
    );
    const timeAgo = formatTimeAgo(presentation.last_opened_at);

    // Only show "Shared by" if we have user info, otherwise just show time
    if (
      share?.shared_by_user?.full_name &&
      share.shared_by_user.full_name !== 'Shared User'
    ) {
      return `Shared by ${share.shared_by_user.full_name} • ${timeAgo}`;
    }

    return timeAgo;
  };

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
        ) : filteredPresentations.length === 0 && !isLoading && !searchQuery ? (
          <EmptyState message="No shared presentations yet. When someone shares a presentation with you, it will appear here." />
        ) : filteredPresentations.length === 0 && searchQuery ? (
          <EmptyState
            message={`No presentations found matching "${searchQuery}"`}
          />
        ) : (
          <div className="mt-4">
            <PresentationList
              presentations={filteredPresentations}
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
