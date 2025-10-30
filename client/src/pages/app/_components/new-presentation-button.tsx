import { Loader2, Plus } from 'lucide-react';
import { memo, useState } from 'react';

import { Button } from '@/components/ui/button';

const NewPresentationButton = memo(function AppSidebar() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePresentation = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Presentation created successfully (mock)');
    } catch (error) {
      console.error('Failed to create presentation (mock):', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 sm:px-6"
      onClick={handleCreatePresentation}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      New Outline
    </Button>
  );
});

export default NewPresentationButton;
