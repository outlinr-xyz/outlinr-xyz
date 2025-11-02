import { formatTrashItemMetadata } from '@/lib/utils';
import type { Presentation } from '@/types/presentation';

import TrashActions from './trash-actions';

interface TrashListItemProps {
  presentation: Presentation;
  onAction?: () => void;
}

const TrashListItem = ({ presentation, onAction }: TrashListItemProps) => {
  return (
    <div className="flex items-center gap-4 rounded-md bg-white p-4">
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
          {presentation.deleted_at
            ? formatTrashItemMetadata(presentation.deleted_at)
            : 'Recently deleted • 30 days left'}
        </p>
      </div>

      {/* Action Buttons */}
      <TrashActions presentationId={presentation.id} onAction={onAction} />
    </div>
  );
};

export default TrashListItem;
