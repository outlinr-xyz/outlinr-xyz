import { Folder, Grid3x3, List } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePresentations } from '@/hooks/use-presentations';
import { filterPresentations, formatDate } from '@/lib/utils';
import {
  usePresentationView,
  useSetPresentationView,
} from '@/store/preferences.store';
import type { Presentation } from '@/types/presentation';

import EmptyState from '../../_components/empty-state';
import NewPresentationButton from '../../_components/new-presentation-button';
import PresentationList from '../../_components/presentation-list';
import PresentationSearch from '../../_components/presentation-search';

const DashboardPage = () => {
  const {
    presentations,
    isLoading,
    error,
    page,
    setPage,
    hasMore,
    total,
    refetch,
  } = usePresentations({ pageSize: 6 });

  // Use persisted view preference
  const view = usePresentationView();
  const setView = useSetPresentationView();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Filter presentations based on search
  const filteredPresentations = filterPresentations(presentations, searchQuery);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const getHref = (presentation: Presentation) =>
    `/app/presentation/${presentation.id}/question`;

  const getMetadata = (presentation: Presentation) =>
    formatDate(presentation.created_at);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
          My Presentations
        </h1>
        {isLoading ? (
          <Skeleton className="h-5 w-32" />
        ) : total > 0 ? (
          <p className="text-muted-foreground text-sm">
            {total} {total === 1 ? 'presentation' : 'presentations'}
          </p>
        ) : (
          <div className="h-5" />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <NewPresentationButton />
          <Button
            className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 sm:px-6"
            variant="outline"
            disabled
          >
            <Folder className="h-4 w-4" /> New Folder
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => {
              if (value) setView(value as 'grid' | 'list');
            }}
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid3x3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-muted-foreground text-sm">Page {page}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!hasMore}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <PresentationSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by title..."
      />

      <div className="w-full max-w-6xl">
        {error ? (
          <EmptyState message={error} />
        ) : searchQuery && filteredPresentations.length === 0 ? (
          <EmptyState
            message={`No presentations found matching "${searchQuery}"`}
          />
        ) : presentations.length === 0 && !isLoading ? (
          <EmptyState message="No presentations yet. Create your first one!" />
        ) : (
          <PresentationList
            presentations={filteredPresentations}
            isLoading={isLoading}
            view={view}
            getHref={getHref}
            getMetadata={getMetadata}
            skeletonCount={6}
            onDelete={refetch}
          />
        )}
      </div>
    </>
  );
};

export default DashboardPage;
