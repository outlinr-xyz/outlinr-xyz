/**
 * Main library barrel export
 * Re-exports commonly used utilities, constants, and APIs
 */

// API exports
export * from './api';

// Configuration exports
export { appConfig } from '@/config/app';
export { env } from '@/config/env';

// Constants exports
export * from './constants';

// Error handling exports
export * from './errors';

// Utility exports
export * from './utils';

// Supabase client export
export { isSupabaseConfigured, supabase } from './supabase';
