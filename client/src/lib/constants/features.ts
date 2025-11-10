/**
 * Popular features/question types configuration
 */

export const popularFeatures = [
  {
    name: 'Word Cloud',
    imageSrc: '/word-cloud.webp',
    description:
      'Collect and visualize audience responses in a dynamic, growing cloud.',
    gifSrc: '/gif.webp',
  },
  {
    name: 'Poll',
    imageSrc: '/polls.webp',
    description:
      'Ask multiple-choice questions and see results in real-time charts.',
    gifSrc: '/gif.webp',
  },
  {
    name: 'Open Ended',
    imageSrc: '/open-ended.webp',
    description:
      'Let participants submit free-text answers which appear on screen.',
    gifSrc: '/gif.webp',
  },
  {
    name: 'Scales',
    imageSrc: '/scales.webp',
    description:
      'Get clear feedback by having your audience rate statements on a sliding scale.',
    gifSrc: '/gif.webp',
  },
] as const;

export type PopularFeature = (typeof popularFeatures)[number];
export type FeatureName = (typeof popularFeatures)[number]['name'];
