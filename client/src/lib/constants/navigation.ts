import { Home, Trash, User, Users } from 'lucide-react';

/**
 * Navigation constants for sidebar and app navigation
 */

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
      title: 'pricing',
      url: '/pricing',
    },
    {
      title: 'support',
      url: 'mailto:admin@outlinr.xyz',
    },
  ],
} as const;

export type SidebarItem =
  | (typeof sidebarItems.top)[number]
  | (typeof sidebarItems.bottom)[number];
