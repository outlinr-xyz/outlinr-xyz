import { type ClassValue, clsx } from 'clsx';
import { Home, Inbox, Trash, User, Users } from 'lucide-react';
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
