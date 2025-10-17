import { Droplet, Shapes, Signal } from "lucide-react";

const features = [
  { name: "Word cloud", icon: Shapes, color: "text-red-500" },
  { name: "Poll", icon: Signal, color: "text-indigo-500" },
  { name: "Quiz", icon: Droplet, color: "text-rose-400" },
  { name: "Scales", icon: Droplet, color: "text-rose-400" },
];

export default function PopularFeatures() {
  return (
    <section>
      <h2 className="font-medium text-base mt-2 md:mt-8">Features</h2>
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 justify-items-center py-6">
          {features.map((feature) => (
            <button
              key={feature.name}
              className="flex flex-col items-center justify-center p-4 gap-3 rounded-xl h-36
                         hover:outline-2 hover:outline-[#254bf5] transition-colors duration-100 cursor-pointer
                          w-full max-w-[9rem]"
            >
              <img src="/outlinr.webp" className="w-12 sm:w-14" />
              <span className="text-xs sm:text-sm font-medium text-center text-gray-700">
                {feature.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
