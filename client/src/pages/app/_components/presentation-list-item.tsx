import { LineChart } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

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
  const navigate = useNavigate();

  const handleResultsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/app/presentation/${presentation.id}/results`);
  };

  return (
    <Link
      to={href}
      className="flex items-center gap-4 rounded-md bg-white py-4"
    >
      <div className="relative h-22 w-22 shrink-0 overflow-hidden rounded-md">
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

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate text-sm font-medium text-gray-900">
          {presentation.title}
        </h3>
        <p className="text-muted-foreground truncate text-xs sm:text-sm">
          {metadata}
        </p>
      </div>

      {/* FIX: Removed onClick={(e) => e.stopPropagation()} from this div.
        The buttons inside already handle their own click events.
      */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleResultsClick}
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          <LineChart className="h-4 w-4" />
        </button>

        <PresentationCardActions
          presentationId={presentation.id}
          presentationTitle={presentation.title}
          variant="list"
          onDelete={onDelete}
        />
      </div>
    </Link>
  );
};

export default PresentationListItem;
