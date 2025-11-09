import { memo } from 'react';

import type { FeatureButtonProps } from '@/types/features';

const FeatureButton = memo(function FeatureButton({
  feature,
  onClick,
}: FeatureButtonProps) {
  return (
    <button
      key={feature.name}
      onClick={() => onClick(feature)}
      className="group relative flex h-48 w-full max-w-36 cursor-pointer flex-col items-center justify-start gap-2 p-3 transition-transform duration-200 hover:scale-[1.03]"
    >
      <div className="relative flex size-28 items-center justify-center transition-transform duration-200 group-hover:scale-110 sm:size-32">
        <img
          src={feature.imageSrc}
          alt={feature.name}
          className="relative z-10 size-full object-contain"
          loading="lazy"
        />
      </div>
      <span className="w-full truncate pt-1 text-center text-xs font-medium text-gray-700 sm:text-sm">
        {feature.name}
      </span>
    </button>
  );
});

export default FeatureButton;
