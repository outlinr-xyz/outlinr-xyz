import { useState } from 'react';

import PresentationSearch from '@/features/presentations/components/presentation-search';

const WorkSpacePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
          Workspace
        </h1>
        <p className="text-muted-foreground text-sm">
          Collaborate with your team on presentations
        </p>
      </div>

      {/* Search */}
      <PresentationSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search workspace..."
      />

      <div className="w-full max-w-6xl">
        <div className="text-muted-foreground mt-4 text-center text-sm">
          No workspace presentations yet. Create or join a workspace to
          collaborate with your team.
        </div>
      </div>
    </>
  );
};

export default WorkSpacePage;
