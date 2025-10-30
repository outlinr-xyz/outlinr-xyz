import { Sparkle } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@/components/ui/button';
import { useUserDisplayName } from '@/store/auth.store';

import NewPresentationButton from '../../_components/new-presentation-button';
import PopularFeatures from '../../_components/popular-features';
import RecentPresentations from '../../_components/recent-presentations';

const HomePage = memo(function HomePage() {
  const displayName = useUserDisplayName();

  return (
    <>
      <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
        Welcome {displayName.split(' ')[0]}
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        <NewPresentationButton />
        <Button
          className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 sm:px-6"
          variant="outline"
          disabled
        >
          <Sparkle className="h-4 w-4" /> Start with AI
        </Button>
      </div>
      <PopularFeatures />
      <RecentPresentations />
    </>
  );
});

export default HomePage;
