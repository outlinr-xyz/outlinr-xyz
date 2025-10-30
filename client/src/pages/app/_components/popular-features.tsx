import { memo } from 'react';

import { popularFeatures } from '@/lib/utils';

const PopularFeatures = memo(function PopularFeatures() {
  return (
    <section>
      <h2 className="mt-2 text-base font-medium md:mt-8">Features</h2>
      <div className="w-full max-w-6xl">
        <div className="mt-6 grid grid-cols-2 justify-items-center gap-4 py-6 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {popularFeatures.map((feature) => (
            <button
              key={feature.name}
              className="group relative flex h-36 w-full max-w-36 cursor-pointer flex-col items-center justify-center gap-3 p-4"
            >
              <div className="relative flex size-28 items-center justify-center transition-transform duration-200 group-hover:scale-110 sm:size-32">
                {' '}
                {/* Changed sizes here */}
                <img
                  src={feature.imageSrc}
                  alt={feature.name}
                  className="relative z-10 size-full object-contain"
                />
              </div>
              <span className="text-center text-xs font-medium text-gray-700 sm:text-sm">
                {feature.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
});

export default PopularFeatures;
