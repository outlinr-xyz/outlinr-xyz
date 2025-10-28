import { Droplet, Shapes, Signal } from 'lucide-react';

const features = [
  { name: 'Word cloud', icon: Shapes, color: 'text-red-500' },
  { name: 'Poll', icon: Signal, color: 'text-indigo-500' },
  { name: 'Quiz', icon: Droplet, color: 'text-rose-400' },
  { name: 'Scales', icon: Droplet, color: 'text-rose-400' },
];

export default function PopularFeatures() {
  return (
    <section>
      <h2 className="mt-2 text-base font-medium md:mt-8">Features</h2>
      <div className="w-full max-w-6xl">
        <div className="mt-6 grid grid-cols-2 justify-items-center gap-4 py-6 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {features.map((feature) => (
            <button
              key={feature.name}
              className="hover:bg-muted flex h-36 w-full max-w-[9rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-md p-4 transition-colors duration-100"
            >
              {/*<feature.icon
                className={feature.color + " " + "size-12 sm:size-14"}
              />*/}
              <img src="/outlinr.webp" className="size-12" />
              <span className="text-center text-xs font-medium text-gray-700 sm:text-sm">
                {feature.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
