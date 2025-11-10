import { memo, useCallback, useEffect, useState } from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { popularFeatures } from '@/lib/utils';
import type { Feature } from '@/types';

import FeatureButton from './feature-button';
import FeatureDialogContent from './feature-dialog-content';

const POPULAR_FEATURES = popularFeatures;

const getAllGifSources = (features: readonly Feature[]) => {
  const sources = features.map((f) => f.gifSrc).filter(Boolean);
  return Array.from(new Set(sources));
};

const PopularFeatures = memo(function PopularFeatures() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  useEffect(() => {
    const gifSources = getAllGifSources(POPULAR_FEATURES);

    gifSources.forEach((src) => {
      const img = new Image();
      img.src = src || '/gif.webp';
    });
  }, []);

  const handleFeatureClick = useCallback((feature: Feature) => {
    setSelectedFeature(feature);
    setIsDialogOpen(true);
  }, []);

  return (
    <section>
      <h2 className="mt-2 text-base font-medium md:mt-8">Features</h2>
      <div className="w-full max-w-6xl">
        <div className="mt-6 grid grid-cols-2 justify-items-center gap-4 py-6 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {POPULAR_FEATURES.map((feature) => (
            <FeatureButton
              key={feature.name}
              feature={feature}
              onClick={handleFeatureClick}
            />
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-6 sm:max-w-3xl md:p-8">
          {selectedFeature && (
            <FeatureDialogContent selectedFeature={selectedFeature} />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
});

export default PopularFeatures;
