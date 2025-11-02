import { Link } from 'react-router';

import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import type { Presentation } from '@/types/presentation';

import PresentationCardActions from './presentation-card-actions';
import PresentationThumbnail from './presentation-thumbnail';

interface PresentationCardProps {
  presentation: Presentation;
  href: string;
  metadata: string;
}

const PresentationCard = ({
  presentation,
  href,
  metadata,
}: PresentationCardProps) => {
  return (
    <div className="space-y-2">
      <Link to={href} className="block">
        <Item className="relative aspect-4/3 overflow-hidden rounded-md border bg-cover bg-center">
          <PresentationThumbnail
            thumbnailUrl={presentation.thumbnail_url}
            title={presentation.title}
          />

          <PresentationCardActions
            presentationId={presentation.id}
            variant="grid"
          />
        </Item>

        <div className="mt-2 px-1">
          <ItemContent className="min-w-0">
            <ItemTitle className="truncate text-sm font-medium text-gray-900">
              {presentation.title}
            </ItemTitle>

            <ItemDescription className="text-muted-foreground truncate text-xs sm:text-sm">
              {metadata}
            </ItemDescription>
          </ItemContent>
        </div>
      </Link>
    </div>
  );
};

export default PresentationCard;
