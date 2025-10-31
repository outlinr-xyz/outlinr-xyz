import { type ClassValue, clsx } from 'clsx';
import {
  Droplet,
  Home,
  Inbox,
  Shapes,
  Signal,
  Trash,
  User,
  Users,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sidebarItems = {
  top: [
    {
      title: 'home',
      url: '/app/home',
      icon: Home,
    },
    {
      title: 'my presentations',
      url: '/app/dashboard',
      icon: User,
    },
    {
      title: 'shared with me',
      url: '/app/shared-with-me',
      icon: Inbox,
    },
    {
      title: 'workspace',
      url: '/app/workspace',
      icon: Users,
    },
    {
      title: 'trash',
      url: '/app/trash',
      icon: Trash,
    },
  ],
  bottom: [
    {
      title: 'templates',
      url: '/app/templates',
    },
    {
      title: 'account',
      url: '/app/account',
    },
    {
      title: 'billing',
      url: '/app/billing',
    },
    {
      title: 'support',
      url: 'mailto:admin@outlinr.xyz',
    },
  ],
} as const;

export const oauthProviders = [
  {
    provider: 'google',
    name: 'Google',
    icon: 'https://www.svgrepo.com/show/475656/google-color.svg',
  },
  {
    provider: 'azure',
    name: 'Microsoft',
    icon: 'https://www.svgrepo.com/show/448239/microsoft.svg',
  },
  {
    provider: 'discord',
    name: 'Discord',
    icon: 'https://www.svgrepo.com/show/353655/discord-icon.svg',
  },
  {
    provider: 'linkedin_oidc',
    name: 'LinkedIn',
    icon: 'https://www.svgrepo.com/show/448234/linkedin.svg',
  },
] as const;

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
/**
 * Format a date as relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  if (seconds < 60) {
    return 'just now';
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'just now';
}

/**
 * Format a date as absolute date (e.g., "Jan 15, 2024")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date as short date (e.g., "01/15/24")
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  });
}
