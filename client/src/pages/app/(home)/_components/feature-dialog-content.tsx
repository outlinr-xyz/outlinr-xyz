import { DialogTitle } from '@radix-ui/react-dialog';
import { memo } from 'react';

import { DialogHeader } from '@/components/ui/dialog';
import type { FeatureDialogContentProps } from '@/types';

import NewPresentationButton from './new-presentation-button';

const FeatureDialogContent = memo(function FeatureDialogContent({
  selectedFeature,
}: FeatureDialogContentProps) {
  if (!selectedFeature) return null;

  const gifSource = selectedFeature.gifSrc;

  return (
    <>
      <DialogHeader className="mb-6 flex flex-row items-center gap-4">
        <img
          src={selectedFeature.imageSrc}
          alt={`${selectedFeature.name} logo`}
          className="size-12 object-contain"
        />
        <DialogTitle className="text-2xl font-bold">
          {selectedFeature.name}
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col-reverse gap-6 md:flex-row md:gap-8">
        <div className="order-2 flex flex-1 flex-col justify-between md:order-1">
          <p className="text-muted-foreground mb-6 text-base">
            {selectedFeature.description}
          </p>
          <div className="hidden md:block">
            <NewPresentationButton />
          </div>
        </div>

        <div className="order-1 min-w-0 flex-1 md:order-2">
          <img
            src={gifSource}
            alt={`${selectedFeature.name} demo GIF`}
            className="h-auto w-full rounded-lg object-contain"
          />
          <div className="block pt-6 md:hidden">
            <NewPresentationButton />
          </div>
        </div>
      </div>
    </>
  );
});

export default FeatureDialogContent;
