import { Folder, Grid3x3, LineChart, List, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePresentations } from '@/hooks/use-presentations';
import { formatDate } from '@/lib/utils';

import NewPresentationButton from '../../_components/new-presentation-button';

const DashboardPage = () => {
  const { presentations, isLoading, error, page, setPage, hasMore, total } =
    usePresentations({ pageSize: 6 });
  const [view, setView] = useState<'grid' | 'list'>('grid');

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

      <div className="w-full max-w-6xl">
        {isLoading ? (
          view === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="relative aspect-4/3 overflow-hidden rounded-md">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="mt-2 space-y-1 px-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-md border bg-white p-4"
                >
                  <Skeleton className="h-16 w-24 shrink-0 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : error ? (
          <div className="text-muted-foreground mt-4 text-center text-sm">
            {error}
          </div>
        ) : presentations.length === 0 ? (
          <div className="text-muted-foreground mt-4 text-center text-sm">
            No presentations yet. Create your first one!
          </div>
        ) : view === 'grid' ? (
          <ItemGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {presentations.map((presentation) => (
              <div key={presentation.id} className="space-y-2">
                <Link
                  to={`/app/presentation/${presentation.id}/question`}
                  className="block"
                >
                  <Item className="relative aspect-4/3 overflow-hidden rounded-md border bg-cover bg-center">
                    {presentation.thumbnail_url ? (
                      <img
                        src={presentation.thumbnail_url}
                        alt={presentation.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-100">
                        <img
                          src="/outlinr.webp"
                          alt="outlinr logo"
                          className="h-16 w-16 opacity-20 grayscale"
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <Link
                      to={`/app/presentation/${presentation.id}/results`}
                      className="absolute top-2 left-2 rounded-full bg-white p-2 text-gray-700 shadow-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <LineChart className="h-4 w-4" />
                    </Link>

                    <button
                      className="absolute top-2 right-2 rounded-full bg-white p-2 text-gray-700 shadow-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </Item>

                  <div className="mt-2 px-1">
                    <ItemContent className="min-w-0">
                      <ItemTitle className="truncate text-sm font-medium text-gray-900">
                        {presentation.title}
                      </ItemTitle>

                      <ItemDescription className="text-muted-foreground truncate text-xs sm:text-sm">
                        {formatDate(presentation.created_at)}
                      </ItemDescription>
                    </ItemContent>
                  </div>
                </Link>
              </div>
            ))}
          </ItemGroup>
        ) : (
          /* List View */
          <div className="space-y-2">
            {presentations.map((presentation) => (
              <Link
                key={presentation.id}
                to={`/app/presentation/${presentation.id}/question`}
                className="flex items-center gap-4 rounded-md border bg-white p-4"
              >
                {/* Thumbnail */}
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md">
                  {presentation.thumbnail_url ? (
                    <img
                      src={presentation.thumbnail_url}
                      alt={presentation.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <img
                        src="/outlinr.webp"
                        alt="outlinr logo"
                        className="h-8 w-8 opacity-20 grayscale"
                      />
                    </div>
                  )}
                </div>

                {/* Title and Date */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    {presentation.title}
                  </h3>
                  <p className="text-muted-foreground truncate text-xs sm:text-sm">
                    {formatDate(presentation.created_at)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/app/presentation/${presentation.id}/results`}
                    className="rounded-md p-2 text-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LineChart className="h-4 w-4" />
                  </Link>

                  <button
                    className="rounded-md p-2 text-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
