import { LineChart } from 'lucide-react';
import { Link } from 'react-router';

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
  return (
    <div className="space-y-2">
      <Link to={href} className="block">
        <Item className="relative aspect-4/3 overflow-hidden rounded-md border bg-cover bg-center">
          <PresentationThumbnail
            thumbnailUrl={presentation.thumbnail_url}
            title={presentation.title}
          />

          {/* Analytics button - top left */}
          <Link
            to={`/app/presentation/${presentation.id}/results`}
            className="absolute top-2 right-2 rounded-full bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={(e) => e.stopPropagation()}
          >
            <LineChart className="h-4 w-4" />
          </Link>
        </Item>

        <div className="mt-2 flex items-start justify-between gap-2 px-1">
          <ItemContent className="min-w-0 flex-1">
            <ItemTitle className="truncate text-sm font-medium text-gray-900">
              {presentation.title}
            </ItemTitle>

            <ItemDescription className="text-muted-foreground truncate text-xs sm:text-sm">
              {metadata}
            </ItemDescription>
          </ItemContent>

          {/* Three dots menu - bottom right aligned with text */}
          <div onClick={(e) => e.stopPropagation()}>
            <PresentationCardActions
              presentationId={presentation.id}
              variant="grid"
              onDelete={onDelete}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PresentationCard;
