/**
 * Application configuration
 * Non-environment specific app settings and defaults
 */

export const appConfig = {
  /**
   * Pagination settings
   */
  pagination: {
    defaultPageSize: 9,
    presentationsPerPage: 9,
    recentPresentationsLimit: 3,
  },

  /**
   * Trash/deletion settings
   */
  trash: {
    daysUntilPermanentDeletion: 30,
  },

  /**
   * Date formatting preferences
   */
  dateFormat: {
    locale: 'en-US',
    shortFormat: {
      month: '2-digit' as const,
      day: '2-digit' as const,
      year: '2-digit' as const,
    },
    longFormat: {
      month: 'short' as const,
      day: 'numeric' as const,
      year: 'numeric' as const,
    },
  },

  /**
   * Default presentation settings
   */
  presentation: {
    defaultTitle: 'Untitled Presentation',
    defaultDescription: null,
  },

  /**
   * Storage keys for persisted data
   */
  storage: {
    preferencesKey: 'outlinr-preferences',
    authKey: 'outlinr-auth',
  },

  /**
   * Feature flags
   */
  features: {
    enableCollaboration: false,
    enableTemplates: true,
    enableTrash: true,
    enableWorkspace: true,
  },

  /**
   * UI settings
   */
  ui: {
    defaultViewMode: 'grid' as const,
    sidebarDefaultOpen: true,
  },
} as const;

export type AppConfig = typeof appConfig;
