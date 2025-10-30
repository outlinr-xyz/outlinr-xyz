import { memo } from 'react';

const SharedWithMePage = memo(function SharedWithMePage() {
  return (
    <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
      Shared With Me
    </h1>
  );
});

export default SharedWithMePage;
