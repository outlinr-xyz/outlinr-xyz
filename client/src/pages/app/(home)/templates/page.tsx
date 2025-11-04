import { useState } from 'react';

import PresentationSearch from '../../_components/presentation-search';

const TemplatesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
          Templates
        </h1>
        <p className="text-muted-foreground text-sm">
          Browse and use professionally designed presentation templates
        </p>
      </div>

      {/* Search */}
      <PresentationSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search templates..."
      />

      <div className="w-full max-w-6xl">
        <div className="text-muted-foreground mt-4 text-center text-sm">
          No templates available yet. Check back soon for professional
          presentation templates to get started quickly.
        </div>
      </div>
    </>
  );
};

export default TemplatesPage;
