import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { createPresentation } from '@/lib/api/presentations';

const NewPresentationButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreatePresentation = async () => {
    setIsLoading(true);

    try {
      const presentation = await createPresentation({
        title: 'Untitled Presentation',
      });

      toast.success('Presentation created successfully');

      // Navigate to the question page
      navigate(`/app/presentation/${presentation.id}/question`);
    } catch (error) {
      console.error('Failed to create presentation:', error);
      toast.error('Failed to create presentation. Please try again.');
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
};

export default NewPresentationButton;
