import { LineChart, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentPresentations } from '@/hooks/use-presentations';
import { formatTimeAgo } from '@/lib/utils';

const RecentPresentations = () => {
  const { presentations, isLoading, error } = useRecentPresentations();

  return (
    <section>
      <h2 className="mt-2 text-base font-medium md:mt-8">Recently Viewed</h2>

      <div className="w-full max-w-6xl">
        {isLoading ? (
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
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
        ) : error ? (
          <div className="text-muted-foreground mt-4 text-center text-sm">
            {error}
          </div>
        ) : presentations.length === 0 ? (
          <div className="text-muted-foreground mt-4 text-center text-sm">
            No presentations yet. Create your first one!
          </div>
        ) : (
          <ItemGroup className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
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
                        {formatTimeAgo(presentation.last_opened_at)}
                      </ItemDescription>
                    </ItemContent>
                  </div>
                </Link>
              </div>
            ))}
          </ItemGroup>
        )}
      </div>
    </section>
  );
};

export default RecentPresentations;
