import { LineChart } from 'lucide-react';
import { Link } from 'react-router';

import type { Presentation } from '@/types/presentation';

import PresentationCardActions from './presentation-card-actions';

interface PresentationListItemProps {
  presentation: Presentation;
  href: string;
  metadata: string;
  onDelete?: () => void;
}

const PresentationListItem = ({
  presentation,
  href,
  metadata,
  onDelete,
}: PresentationListItemProps) => {
  return (
    <Link
      to={href}
      className="group flex items-center gap-4 rounded-md bg-white p-4 hover:bg-gray-50"
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
          {metadata}
        </p>
      </div>

      {/* Action Buttons - only visible on hover */}
      <div
        className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <Link
          to={`/app/presentation/${presentation.id}/results`}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          onClick={(e) => e.stopPropagation()}
        >
          <LineChart className="h-4 w-4" />
        </Link>

        <PresentationCardActions
          presentationId={presentation.id}
          variant="list"
          onDelete={onDelete}
        />
      </div>
    </Link>
  );
};

export default PresentationListItem;
