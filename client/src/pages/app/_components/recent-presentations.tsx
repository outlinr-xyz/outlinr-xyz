import { LineChart, MoreHorizontal } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';

const presentations = [
  {
    id: '3',
    name: 'Brand Strategy Q4',
    image:
      'https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop',
    updated_at: '25-10-24',
  },
  {
    id: '1',
    name: 'New Product Launch',
    image:
      'https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop',
    updated_at: '25-10-26',
  },
  {
    id: '5',
    name: 'UX/UI Re-design',
    image:
      'https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop',
    updated_at: '25-10-22',
  },
];

const RecentPresentations = memo(function RecentPresentations() {
  return (
    <section>
      <h2 className="mt-2 text-base font-medium md:mt-8">Recently Viewed</h2>

      <div className="w-full max-w-6xl">
        <ItemGroup className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          {presentations.map((presentation) => (
            <Item
              key={presentation.id}
              className="relative aspect-4/3 overflow-hidden rounded-md bg-cover bg-center"
            >
              <img
                src={presentation.image}
                alt={presentation.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <Link
                to={`/app/presentation/${presentation.id}/results`}
                className="absolute top-2 left-2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
              >
                <LineChart className="h-4 w-4" />
              </Link>

              <button className="absolute top-2 right-2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60">
                <MoreHorizontal className="h-4 w-4" />
              </button>

              <Link
                to={`/app/presentation/${presentation.id}`}
                className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 to-transparent p-3 text-white sm:p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-hidden sm:gap-3">
                    <ItemContent className="min-w-0">
                      <ItemTitle className="truncate text-sm capitalize">
                        {presentation.name}
                      </ItemTitle>

                      <ItemDescription className="truncate text-xs text-gray-300 sm:text-sm">
                        <span className="hidden lg:inline">Edited: </span>

                        {presentation.updated_at}
                      </ItemDescription>
                    </ItemContent>
                  </div>
                </div>
              </Link>
            </Item>
          ))}
        </ItemGroup>
      </div>
    </section>
  );
});

export default RecentPresentations;
