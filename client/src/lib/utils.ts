/**
 * Utility functions
 *
 * This file re-exports utilities from their new organized locations
 * for backward compatibility with existing code.
 *
 * @deprecated Import directly from specific modules instead:
 * - @/lib/utils/cn
 * - @/lib/utils/date
 * - @/lib/utils/presentation
 * - @/lib/constants/navigation
 * - @/lib/constants/auth
 * - @/lib/constants/features
 */

// Re-export all utilities from organized modules
export * from './utils/cn';
export * from './utils/date';
export * from './utils/presentation';

// Re-export constants for backward compatibility
export { oauthProviders } from './constants/auth';
export { popularFeatures } from './constants/features';
export { sidebarItems } from './constants/navigation';
