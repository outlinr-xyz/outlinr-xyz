import { ItemGroup } from '@/components/ui/item';
import type { Presentation } from '@/types/presentation';

import PresentationCard from './presentation-card';
import PresentationCardSkeleton from './presentation-card-skeleton';
import PresentationListItem from './presentation-list-item';

interface PresentationListProps {
  presentations: Presentation[];
  isLoading?: boolean;
  view?: 'grid' | 'list';
  getHref: (presentation: Presentation) => string;
  getMetadata: (presentation: Presentation) => string;
  skeletonCount?: number;
}

const PresentationList = ({
  presentations,
  isLoading = false,
  view = 'grid',
  getHref,
  getMetadata,
  skeletonCount = 6,
}: PresentationListProps) => {
  if (isLoading) {
    return view === 'grid' ? (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <PresentationCardSkeleton key={index} variant="grid" />
        ))}
      </div>
    ) : (
      <div className="space-y-2">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <PresentationCardSkeleton key={index} variant="list" />
        ))}
      </div>
    );
  }

  if (view === 'grid') {
    return (
      <ItemGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {presentations.map((presentation) => (
          <PresentationCard
            key={presentation.id}
            presentation={presentation}
            href={getHref(presentation)}
            metadata={getMetadata(presentation)}
          />
        ))}
      </ItemGroup>
    );
  }

  return (
    <div className="space-y-2">
      {presentations.map((presentation) => (
        <PresentationListItem
          key={presentation.id}
          presentation={presentation}
          href={getHref(presentation)}
          metadata={getMetadata(presentation)}
        />
      ))}
    </div>
  );
};

export default PresentationList;
