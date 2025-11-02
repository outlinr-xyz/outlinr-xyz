import { useState } from 'react';

import PresentationSearch from '@/features/presentations/components/presentation-search';

const SharedWithMePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
          Shared With Me
        </h1>
        <p className="text-muted-foreground text-sm">
          Presentations others have shared with you
        </p>
      </div>

      {/* Search */}
      <PresentationSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search shared..."
      />

      <div className="w-full max-w-6xl">
        <div className="text-muted-foreground mt-4 text-center text-sm">
          No shared presentations yet. When someone shares a presentation with
          you, it will appear here.
        </div>
      </div>
    </>
  );
};

export default SharedWithMePage;
