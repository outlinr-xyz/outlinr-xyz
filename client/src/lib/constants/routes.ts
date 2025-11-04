/**
 * Application route constants
 * Centralized route definitions for type-safe navigation
 */

export const ROUTES = {
  // Public routes
  PUBLIC: {
    HOME: '/',
    PRICING: '/pricing',
    COMPARISON: '/comparison',
  },

  // Auth routes
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    SIGNUP: '/auth/sign-up',
  },

  // App routes
  APP: {
    BASE: '/app',
    HOME: '/app/home',
    DASHBOARD: '/app/dashboard',
    WORKSPACE: '/app/workspace',
    TEMPLATES: '/app/templates',
    SHARED_WITH_ME: '/app/shared-with-me',
    TRASH: '/app/trash',
    ACCOUNT: '/app/account',
    BILLING: '/app/billing',
  },

  // Presentation routes
  PRESENTATION: {
    BASE: '/app/presentation',
    DETAIL: (id: string) => `/app/presentation/${id}`,
    QUESTION: (id: string) => `/app/presentation/${id}/question`,
    RESULTS: (id: string) => `/app/presentation/${id}/results`,
    PREVIEW: (id: string) => `/app/presentation/${id}/preview`,
    PRESENT: (id: string) => `/app/presentation/${id}/present`,
    JOIN: (id: string) => `/app/presentation/${id}/join`,
  },
} as const;

/**
 * Helper to build auth login URL with redirect
 */
export function getLoginUrl(redirectTo?: string): string {
  if (!redirectTo) return ROUTES.AUTH.LOGIN;
  return `${ROUTES.AUTH.LOGIN}?redirectTo=${encodeURIComponent(redirectTo)}`;
}

/**
 * Check if a path matches a route pattern
 */
export function isRoute(path: string, route: string): boolean {
  return path === route || path.startsWith(`${route}/`);
}

/**
 * Check if path is a public route
 */
export function isPublicRoute(path: string): boolean {
  return Object.values(ROUTES.PUBLIC).some((route) => isRoute(path, route));
}

/**
 * Check if path is an auth route
 */
export function isAuthRoute(path: string): boolean {
  return path.startsWith(ROUTES.AUTH.BASE);
}

/**
 * Check if path is an app route
 */
export function isAppRoute(path: string): boolean {
  return path.startsWith(ROUTES.APP.BASE);
}
