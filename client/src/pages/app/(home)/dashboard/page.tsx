import { Plus } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@/components/ui/button';
import NewPresentationButton from '../../_components/new-presentation-button';

const DashboardPage = memo(function DashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
        My Presentations
      </h1>
      <div className="flex flex-wrap items-center gap-3">
        <NewPresentationButton />
        <Button
          className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 sm:px-6"
          variant="outline"
          disabled
        >
          <Plus className="h-4 w-4" /> New Folder
        </Button>
      </div>
    </>
  );
});

export default DashboardPage;
