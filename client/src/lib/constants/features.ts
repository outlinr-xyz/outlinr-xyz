import { Droplet, Shapes, Signal } from 'lucide-react';

/**
 * Popular features/question types configuration
 */

export const popularFeatures = [
  {
    name: 'Word Cloud',
    icon: Shapes,
    color: 'text-red-500',
    imageSrc: '/word-cloud.webp',
  },
  {
    name: 'Poll',
    icon: Signal,
    color: 'text-indigo-500',
    imageSrc: '/polls.webp',
  },
  {
    name: 'Open Ended',
    icon: Droplet,
    color: 'text-rose-400',
    imageSrc: '/open-ended.webp',
  },
  {
    name: 'Scales',
    icon: Droplet,
    color: 'text-rose-400',
    imageSrc: '/scales.webp',
  },
] as const;

export type PopularFeature = (typeof popularFeatures)[number];
export type FeatureName = (typeof popularFeatures)[number]['name'];
