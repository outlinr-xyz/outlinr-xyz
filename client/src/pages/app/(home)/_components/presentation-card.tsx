import { LineChart } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import type { Presentation } from '@/types/presentation';

import PresentationCardActions from './presentation-card-actions';
import PresentationThumbnail from './presentation-thumbnail';

interface PresentationCardProps {
  presentation: Presentation;
  href: string;
  metadata: string;
  onDelete?: () => void;
}

const PresentationCard = ({
  presentation,
  href,
  metadata,
  onDelete,
}: PresentationCardProps) => {
  const navigate = useNavigate();

  const handleResultsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/app/presentation/${presentation.id}/results`);
  };

  return (
    <div className="space-y-2">
      <Item className="relative aspect-4/3 overflow-hidden rounded-md bg-cover bg-center">
        <Link
          to={href}
          className="absolute inset-0 z-10 block"
          aria-label={presentation.title}
        >
          <PresentationThumbnail
            thumbnailUrl={presentation.thumbnail_url}
            title={presentation.title}
          />
        </Link>
        <button
          onClick={handleResultsClick}
          className="absolute top-2 right-2 z-20 cursor-pointer rounded-full bg-white p-2 text-gray-700 transition-colors hover:bg-gray-100"
        >
          <LineChart className="h-4 w-4" />
        </button>
      </Item>

      <div className="mt-2 flex items-center justify-between gap-2 px-1">
        <Link to={href} className="block min-w-0 flex-1">
          <ItemContent className="min-w-0 flex-1">
            <ItemTitle className="truncate text-sm font-medium text-gray-900">
              {presentation.title}
            </ItemTitle>
            <ItemDescription className="text-muted-foreground truncate text-xs sm:text-sm">
              {metadata}
            </ItemDescription>
          </ItemContent>
        </Link>

        {/* FIX: Removed the wrapper div with stopPropagation here.
          The PresentationCardActions component handles its own events.
        */}
        <PresentationCardActions
          presentationId={presentation.id}
          variant="grid"
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default PresentationCard;
